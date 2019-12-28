import { Request, Response, NextFunction } from 'express';
import { HTTP400Error } from '../../../utils/httpErrors';

export const checkExistsInformationQueries = (
	{ query }: Request,
	res: Response,
	next: NextFunction
) => {
	if (!query.client_id || !query.scope) {
		throw new HTTP400Error('missingInformationParameters');
	} else {
		next();
	}
};
