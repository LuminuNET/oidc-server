import { Request, Response, NextFunction } from 'express';
import { getServiceByClientId } from '../../configuration';
import { HTTP400Error } from '../../../utils/httpErrors';

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
