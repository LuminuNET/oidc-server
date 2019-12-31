// successful tasks
import authorize from './authorize';
import information from './information';
import authenticateUser from './login';
import {
	addService,
	updateService,
	getServices,
	deleteService
} from './service';

// types import
import { Request, Response, NextFunction } from 'express';
import TAuthenticationResponse from '../../types/AuthenticationResponseType';
import TInformationResponse from '../../types/InformationResponseType';

// middleware
import {
	checkExistsOidcQueries,
	verifyOidcQueries,
	verifyPrompt,
	verifyAccessToken,
	getProfileInformation
} from '../../middleware/checks/authorize/authorizeChecks';
import {
	verifyClientId,
	verifyScope,
	checkApiKey
} from '../../middleware/checks/authorize/globalChecks';
import { checkExistsInformationQueries } from '../../middleware/checks/authorize/informationChecks';
import {
	checkUserOrEmailExists,
	getPasswordHash,
	checkPassword,
	checkAmountLoginAttempts
} from '../../middleware/checks/authorize/loginChecks';
import { getGroups } from './groups';

export default [
	{
		path: '/api/v1/authorize',
		method: 'post',
		handler: [
			verifyAccessToken,
			checkExistsOidcQueries,
			verifyClientId,
			verifyScope,
			verifyOidcQueries,
			verifyPrompt,
			getProfileInformation,
			async ({ query }: Request, res: Response) => {
				const result: TAuthenticationResponse = await authorize(
					query.response_type,
					query.client_id,
					query.redirect_uri,
					res.locals.scopes,
					query.state,
					query.nonce,
					res.locals.user
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
			checkAmountLoginAttempts,
			checkUserOrEmailExists,
			getPasswordHash,
			checkPassword,
			async (req: Request, res: Response) => {
				const result = authenticateUser(
					res.locals.user.userId,
					res.locals.user.username,
					res.locals.user.hasAvatar
				);
				res.status(200).send(result);
			}
		]
	},
	{
		path: '/api/v1/services',
		method: 'post',
		handler: [
			checkApiKey,
			async (req: Request, res: Response) => {
				const result = await addService(
					req.body.client_id,
					req.body.name,
					req.body.domain,
					req.body.callback
				);
				res.status(200).send(result);
			}
		]
	},
	{
		path: '/api/v1/services',
		method: 'put',
		handler: [
			checkApiKey,
			async (req: Request, res: Response) => {
				const result = await updateService(
					req.body.client_id,
					req.body.name,
					req.body.domain,
					req.body.callback
				);
				res.status(200).send(result);
			}
		]
	},
	{
		path: '/api/v1/services',
		method: 'get',
		handler: [
			checkApiKey,
			async (req: Request, res: Response) => {
				const result = await getServices();
				res.status(200).send(result);
			}
		]
	},
	{
		path: '/api/v1/services',
		method: 'delete',
		handler: [
			checkApiKey,
			async (req: Request, res: Response) => {
				const result = await deleteService(req.body.client_id);
				res.status(200).send(result);
			}
		]
	},
	{
		path: '/api/v1/groups',
		method: 'get',
		handler: [
			async (req: Request, res: Response) => {
				const result = await getGroups();
				res.status(200).send(result);
			}
		]
	}
];
