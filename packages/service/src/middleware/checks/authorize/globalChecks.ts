import { Request, Response, NextFunction } from 'express';
import TService from '../../../types/ServiceType';
import { getServices } from '../../configuration';
import { HTTP400Error } from '../../../utils/httpErrors';

let services: Array<TService>;

const loadServices = async () => {
	services = await getServices();
};

loadServices();

export const verifyClientId = (
	{ query }: Request,
	res: Response,
	next: NextFunction
) => {
	// Check if service exists
	if (!services[query.client_id]) {
		throw new HTTP400Error('clientNotFound');
	}

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

	next();
};
