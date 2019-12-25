import { Request, Response, NextFunction } from 'express';
import TService from '../../../types/ServiceType';
import { getServices } from '../../configuration';
import { HTTP400Error } from '../../../utils/httpErrors';

let services: Array<TService>;

const loadServices = async () => {
	services = await getServices();
};

loadServices();

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
		throw new HTTP400Error('Missing oidc authorize parameter');
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

	// Check if the redirect uri is valid
	if (services[query.client_id].callback_url !== query.redirect_uri) {
		throw new HTTP400Error('Redirect Uri invalid');
	}

	// End validation by calling next function
	next();
};
