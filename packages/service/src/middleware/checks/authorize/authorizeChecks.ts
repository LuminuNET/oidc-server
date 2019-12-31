import { Request, Response, NextFunction } from 'express';
import {
	getUserGrantsFromUser,
	getGroupInformationFromUser
} from '../../configuration';
import { HTTP400Error } from '../../../utils/httpErrors';
import LooseObject from '../../../types/LooseObject';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { forumPool } from '../../database';

dotenv.config();

export const checkExistsOidcQueries = (
	{ query }: Request,
	res: Response,
	next: NextFunction
) => {
	if (
		!query.response_type ||
		!query.client_id ||
		!query.redirect_uri ||
		!query.scope ||
		!query.nonce ||
		!query.state
	) {
		throw new HTTP400Error('missingOidcAuthorizeParameters');
	} else {
		next();
	}
};

export const verifyOidcQueries = (
	{ query }: Request,
	res: Response,
	next: NextFunction
) => {
	// Check if valid implicit response types are set in response_type query
	const responseTypes: Array<String> = query.response_type.split(' ');

	switch (responseTypes.length) {
		case 1:
			if (responseTypes[0] !== 'id_token')
				throw new HTTP400Error('missingIdTokenRequest');
			break;
		case 2:
			if (responseTypes.indexOf('id_token') === -1) {
				throw new HTTP400Error('missingIdTokenRequest');
			} else if (responseTypes.indexOf('token') === -1) {
				throw new HTTP400Error('missingTokenRequest');
			}
			break;
		default:
			throw new HTTP400Error('tooManyResponseTypesSet');
	}

	// End validation by calling next function
	next();
};

export const verifyPrompt = async (
	{ query }: Request,
	res: Response,
	next: NextFunction
) => {
	const userId = res.locals.user.userId;

	const userGrants: LooseObject = await getUserGrantsFromUser(userId);

	if (query.prompt === 'none') {
		if (!userGrants[res.locals.clientId]) {
			throw new HTTP400Error('promptCannotBeNoneIfNoConsentGiven');
		} else if (
			JSON.stringify(userGrants[res.locals.clientId].scopes) !==
			JSON.stringify(res.locals.scopes)
		) {
			throw new HTTP400Error('requestingUnallowedScopes');
		}
	}

	next();
};

export const verifyAccessToken = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const accessToken = req.headers.authorization?.split(' ')[1];
	let response: any;

	try {
		response = jwt.verify(
			accessToken as string,
			process.env.PRIVATE_KEY as string,
			{
				algorithms: ['HS256']
			}
		);
	} catch (e) {
		response = e;
	}

	// Only exists on type JsonWebTokenError
	if (response.stack) {
		throw new HTTP400Error('invalidBearerToken');
	}

	res.locals.user = {
		userId: response.userId
	};

	next();
};

export const getProfileInformation = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const userInformation: any = await forumPool.query(
		`SELECT * FROM xf_user WHERE \`user_id\`=${forumPool.escape(
			res.locals.user.userId
		)}`
	);

	const group = getGroupInformationFromUser(userInformation[0].user_group_id);

	res.locals.user = {
		...res.locals.user,
		username: userInformation[0].username,
		hasAvatar: userInformation[0].avatar_date ? true : false,
		profile: {
			userGroupId: userInformation[0].user_group_id,
			userGroupTitle: group?.title,
			userGroupPriority: group?.display_style_priority,
			messageCount: userInformation[0].message_count,
			registerDate: userInformation[0].register_date,
			lastActivity: userInformation[0].last_activity,
			userState: userInformation[0].user_state,
			isVisible: userInformation[0].visible ? true : false,
			isStaff: userInformation[0].is_staff ? true : false,
			isAdmin: userInformation[0].is_admin ? true : false,
			isBanned: userInformation[0].is_banned ? true : false
		},
		email: {
			email: userInformation[0].email
		}
	};

	next();
};
