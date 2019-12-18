import { Request, Response } from 'express';
import {
	checkExistsOidcQueries,
	verifyOidcQueries,
	checkExistsInformationQueries,
	verifyScope,
	verifyClientId
} from '../../middleware/checks';
import authorize from './authorize';
import TAuthenticationResponse from '../../types/AuthenticationResponseType';
import TInformationResponse from '../../types/InformationResponseType';
import information from './information';

export default [
	{
		path: '/api/v1/authorize',
		method: 'get',
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
	}
];
