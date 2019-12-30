import bcrypt from 'bcrypt';
import validator from 'validator';
import { NextFunction, Response, Request } from 'express';
import {
	HTTP401Error,
	HTTP400Error,
	HTTP404Error
} from '../../../utils/httpErrors';
import { incrUser, getValue, delUser } from '../../redis';
import { forumPool } from '../../database';

// @ts-ignore
import { unserialize } from 'php-unserialize';

export const checkAmountLoginAttempts = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const failedLoginAttempts = await getValue('login', req.ip);

	// if (parseInt(failedLoginAttempts + '') >= 5)
	// 	throw new HTTP400Error('tooManyFailedLoginAttempts');

	next();
};

export const checkUserOrEmailExists = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// run some queries to check that
	const isEmail = validator.isEmail(req.body.user);

	let query: any = `SELECT * FROM xf_user WHERE \`${
		isEmail ? 'email' : 'username'
	}\`=${forumPool.escape(req.body.user)}`;

	const userInformation: any = await forumPool.query(query);

	if (!userInformation.length) {
		throw new HTTP404Error('userNotFound');
	}

	// write the found data
	res.locals.user = {
		userId: userInformation[0]['user_id'],
		register_date: userInformation[0]['register_date'],
		groupId: userInformation[0]['user_group_id'],
		hasAvatar: userInformation[0]['avatar_date'] ? true : false,
		username: userInformation[0]['username']
	};

	next();
};

export const getPasswordHash = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// Gets the password hash from the db
	const serializedHash: any = await forumPool.query(
		`SELECT \`data\` FROM xf_user_authenticate WHERE \`user_id\`=${forumPool.escape(
			res.locals.user.userId
		)}`
	);

	const unserializedHash = unserialize(serializedHash[0]['data'].toString());

	let passwordHash: string = unserializedHash['hash'];

	// Need to replace the hash prefix because xenforo uses an old
	// hashing format and bcrypt doesn't support this anymore
	passwordHash = passwordHash.replace('y', 'a');

	res.locals.passwordHash = passwordHash;

	next();
};

export const checkPassword = async (
	{ body, ip }: Request,
	res: Response,
	next: NextFunction
) => {
	const isCorrectPassword = await bcrypt.compare(
		body.password,
		res.locals.passwordHash
	);

	if (!isCorrectPassword) {
		incrUser('login', ip);
		throw new HTTP401Error('incorrectPassword');
	}

	delUser('login', ip);
	next();
};
