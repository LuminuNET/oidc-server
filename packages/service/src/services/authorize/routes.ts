// successful tasks
import authorize from './authorize';
import information from './information';
import authenticateUser from './login';

// types import
import { Request, Response, NextFunction } from 'express';
import TAuthenticationResponse from '../../types/AuthenticationResponseType';
import TInformationResponse from '../../types/InformationResponseType';

// middleware
import {
	checkExistsOidcQueries,
	verifyOidcQueries,
	verifyPrompt,
	verifyAccessToken,
	getProfileInformation
} from '../../middleware/checks/authorize/authorizeChecks';
import {
	verifyClientId,
	verifyScope
} from '../../middleware/checks/authorize/globalChecks';
import { checkExistsInformationQueries } from '../../middleware/checks/authorize/informationChecks';
import {
	checkUserOrEmailExists,
	getPasswordHash,
	checkPassword,
	checkAmountLoginAttempts
} from '../../middleware/checks/authorize/loginChecks';

export default [
	{
		path: '/api/v1/authorize',
		method: 'post',
		handler: [
			verifyAccessToken,
			checkExistsOidcQueries,
			verifyClientId,
			verifyScope,
			verifyOidcQueries,
			verifyPrompt,
			getProfileInformation,
			async ({ query }: Request, res: Response) => {
				const result: TAuthenticationResponse = await authorize(
					query.response_type,
					query.client_id,
					query.redirect_uri,
					res.locals.scopes,
					query.state,
					query.nonce,
					res.locals.user
				);
				res.status(302).send(result);
			}
		]
	},
	{
		path: '/api/v1/information',
		method: 'get',
		handler: [
			checkExistsInformationQueries,
			verifyClientId,
			verifyScope,
			async ({ query }: Request, res: Response) => {
				const result: TInformationResponse = await information(
					query.client_id,
					query.scope
				);
				res.status(200).send(result);
			}
		]
	},
	{
		path: '/api/v1/login',
		method: 'post',
		handler: [
			checkAmountLoginAttempts,
			checkUserOrEmailExists,
			getPasswordHash,
			checkPassword,
			async (req: Request, res: Response) => {
				const result = authenticateUser(
					res.locals.user.userId,
					res.locals.user.username,
					res.locals.user.hasAvatar
				);
				res.status(200).send(result);
			}
		]
	}
];
