import { Request, Response, NextFunction } from 'express';
import { HTTP400Error } from '../utils/httpErrors';

export const checkOidcQueries = (
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
