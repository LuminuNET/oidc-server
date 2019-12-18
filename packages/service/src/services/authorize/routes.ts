import { Request, Response } from 'express';
import { checkOidcQueries } from '../../middleware/checks';

export default [
	{
		path: '/api/v1/authorize',
		method: 'get',
		handler: [
			checkOidcQueries,
			async ({ query }: Request, res: Response) => {
				const result = { success: true };
				res.status(200).send(result);
			}
		]
	}
];
