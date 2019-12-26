import { Request, Response, NextFunction } from 'express';
import authorize from './authorize';
import TAuthenticationResponse from '../../types/AuthenticationResponseType';
import TInformationResponse from '../../types/InformationResponseType';
import information from './information';
import {
	checkExistsOidcQueries,
	verifyOidcQueries
} from '../../middleware/checks/authorize/authorizeChecks';
import {
	verifyClientId,
	verifyScope
} from '../../middleware/checks/authorize/globalChecks';
import { checkExistsInformationQueries } from '../../middleware/checks/authorize/informationChecks';

export default [
	{
		path: '/api/v1/authorize',
		method: 'post',
		handler: [
			checkExistsOidcQueries,
			verifyClientId,
			verifyScope,
			verifyOidcQueries,
			async ({ query }: Request, res: Response) => {
				const result: TAuthenticationResponse = await authorize(
					query.response_type,
					query.client_id,
					query.redirect_uri,
					query.scope,
					query.state,
					query.nonce
				);
				res.status(302).send(result);
			}
		]
	},
	{
		path: '/api/v1/information',
		method: 'get',
		handler: [
			checkExistsInformationQueries,
			verifyClientId,
			verifyScope,
			async ({ query }: Request, res: Response) => {
				const result: TInformationResponse = await information(
					query.client_id,
					query.scope
				);
				res.status(200).send(result);
			}
		]
	},
	{
		path: '/api/v1/login',
		method: 'post',
		handler: [
			async ({ ip }: Request, res: Response) => {
				const result = {};
				res.status(200).send(result);
			}
		]
	}
];
