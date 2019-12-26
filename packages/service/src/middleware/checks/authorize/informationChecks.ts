import { Request, Response, NextFunction } from 'express';
import TService from '../../../types/ServiceType';
import { getServices } from '../../configuration';
import { HTTP400Error } from '../../../utils/httpErrors';

let services: Array<TService>;

const loadServices = async () => {
	services = await getServices();
};

loadServices();

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
