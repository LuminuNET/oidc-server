import { Request, Response } from 'express';
import {
	checkExistsOidcQueries,
	verifyOidcQueries
} from '../../middleware/checks';
import authorize from './authorize';
import TAuthenticationResponse from '../../types/AuthenticationResponseType';

export default [
	{
		path: '/api/v1/authorize',
		method: 'get',
		handler: [
			checkExistsOidcQueries,
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
	}
];
