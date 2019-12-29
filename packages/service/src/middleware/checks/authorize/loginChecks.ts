import bcrypt from 'bcrypt';
import { NextFunction, Response, Request } from 'express';
import { HTTP401Error, HTTP400Error } from '../../../utils/httpErrors';
import { incrUser, getValue, delUser } from '../../redis';

export const checkAmountLoginAttempts = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const failedLoginAttempts = await getValue('login', req.ip);

	if (parseInt(failedLoginAttempts + '') >= 5)
		throw new HTTP400Error('tooManyFailedLoginAttempts');

	next();
};

export const checkUserOrEmailExists = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// run some queries to check that

	// write the found data
	res.locals.user = {
		userId: 4,
		register_date: 1,
		groupId: 3,
		username: 'Keimeno'
	};

	next();
};

export const getPasswordHash = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// Gets the password hash from the db
	const passwordHash =
		'$2a$06$/yLRQdUUN/E/vzeUlhR3b.bX9RW02I5eU7ccaR9hKU7KcF/beye6y';

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
