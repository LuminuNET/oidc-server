import { Request, Response, NextFunction } from 'express';
import TService from '../../../types/ServiceType';
import { getServiceByClientId } from '../../configuration';
import { HTTP400Error, HTTP401Error } from '../../../utils/httpErrors';
import dotenv from 'dotenv';

dotenv.config();

export const verifyClientId = (
	{ query }: Request,
	res: Response,
	next: NextFunction
) => {
	// Check if service exists
	const service: TService | null = getServiceByClientId(query.client_id);

	if (service === null) {
		throw new HTTP400Error('clientNotFound');
	}

	res.locals.clientId = query.client_id;

	next();
};

export const verifyScope = (
	{ query }: Request,
	res: Response,
	next: NextFunction
) => {
	// Check if scope is valid
	const scopes: Array<String> = query.scope.split(' ');
	if (scopes.indexOf('openid') === -1) {
		throw new HTTP400Error('openIdNotUsed');
	}

	if (scopes.length === 1) {
		throw new HTTP400Error('noPermissionRequested');
	}

	res.locals.scopes = scopes;

	next();
};

export const checkApiKey = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const apiKey = req.headers.authorization?.split(' ')[1];

	if (apiKey !== process.env.API_KEY) {
		throw new HTTP401Error('Unauthorized');
	}

	next();
};
