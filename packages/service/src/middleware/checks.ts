import { Request, Response, NextFunction } from 'express';
import { HTTP400Error } from '../utils/httpErrors';
import TService from '../types/ServiceType';
import { getServices } from './configuration';

let services: Array<TService>;

const loadServices = async () => {
	services = await getServices();
};

loadServices();

export const checkExistsOidcQueries = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (
		!req.query.response_type ||
		!req.query.client_id ||
		!req.query.redirect_uri ||
		!req.query.scope ||
		!req.query.nonce ||
		!req.query.state
	) {
		throw new HTTP400Error('Missing oidc authorize parameter');
	} else {
		next();
	}
};

export const verifyOidcQueries = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// Check if valid implicit response types are set in response_type query
	const responseTypes: Array<String> = req.query.response_type.split(' ');

	switch (responseTypes.length) {
		case 1:
			if (responseTypes[0] !== 'id_token')
				throw new HTTP400Error('Missing id token request');
			break;
		case 2:
			if (responseTypes.indexOf('id_token') === -1) {
				throw new HTTP400Error('Missing id token request');
			} else if (responseTypes.indexOf('token') === -1) {
				throw new HTTP400Error('Missing token request');
			}
			break;
		default:
			throw new HTTP400Error('Too many response types set');
	}

	// Check if service exists
	if (!services[req.query.client_id]) {
		throw new HTTP400Error('Client not found');
	}

	// Check if the redirect uri is valid
	if (services[req.query.client_id].callback_url !== req.query.redirect_uri) {
		throw new HTTP400Error('Redirect Uri invalid');
	}

	// Check if scope is valid
	const scopes: Array<String> = req.query.scope.split(' ');
	if (scopes.indexOf('openid') === -1) {
		throw new HTTP400Error('OpenID not used');
	}

	if (scopes.length === 1) {
		throw new HTTP400Error('No permissions requested');
	}

	// End validation by calling next function
	next();
};
