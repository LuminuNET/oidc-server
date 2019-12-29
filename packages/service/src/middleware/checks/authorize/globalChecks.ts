import { Request, Response, NextFunction } from 'express';
import TService from '../../../types/ServiceType';
import { getServiceByClientId } from '../../configuration';
import { HTTP400Error } from '../../../utils/httpErrors';

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
