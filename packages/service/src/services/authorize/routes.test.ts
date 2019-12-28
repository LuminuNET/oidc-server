import express, { Router } from 'express';
import request from 'supertest';
import { applyMiddleware, applyRoutes } from '../../utils';
import promiseRequest from 'request-promise';
import middleware from '../../middleware';
import errorHandlers from '../../middleware/errorHandlers';
import routes from '../../services/authorize/routes';

jest.mock('request-promise');
(promiseRequest as any).mockImplementation(() => '{"features": []}');

describe('routes', () => {
	let router: Router;

	beforeAll(() => {
		router = express();
		applyMiddleware(middleware, router);
		applyRoutes(routes, router);
		applyMiddleware(errorHandlers, router);
	});

	//! Authorize endpoint
	test('a non-existing api endpoint', async () => {
		const response = await request(router).post(
			'/api/v11/authorize?response_type=id_token token&client_id=chat.luminu&redirect_uri=https%3A%2F%2Fchat.luminu.net%2Fcb&scope=openid profile&state=4r4sd3r5tefse&nonce=n--dawd...wdawd'
		);
		expect(response.status).toEqual(404);
	});

	test('an empty string', async () => {
		const response = await request(router).post(
			'/api/v1/authorize?response_type=&client_id=chat.luminu&redirect_uri=https%3A%2F%2Fchat.luminu.net%2Fcb&scope=openid profile&state=4r4sd3r5tefse&nonce=n--dawd...wdawd'
		);
		expect(response.status).toEqual(400);
		expect(response.text).toContain('missingOidcAuthorizeParameters');
	});

	test('response type not available', async () => {
		const response = await request(router).post(
			'/api/v1/authorize?response_type=id&client_id=chat.luminu&redirect_uri=https%3A%2F%2Fchat.luminu.net%2Fcb&scope=openid profile&state=4r4sd3r5tefse&nonce=n--dawd...wdawd'
		);
		expect(response.status).toEqual(400);
		expect(response.text).toContain('missingIdTokenRequest');
	});

	test('too many response types', async () => {
		const response = await request(router).post(
			'/api/v1/authorize?response_type=id_token token1 wadwd wad&client_id=chat.luminu&redirect_uri=https%3A%2F%2Fchat.luminu.net%2Fcb&scope=openid profile&state=4r4sd3r5tefse&nonce=n--dawd...wdawd'
		);
		expect(response.status).toEqual(400);
		expect(response.text).toContain('tooManyResponseTypesSet');
	});

	test('client not exists', async () => {
		const response = await request(router).post(
			'/api/v1/authorize?response_type=id_token token&client_id=invalid&redirect_uri=https%3A%2F%2Fchat.luminu.net%2Fcb&scope=openid profile&state=4r4sd3r5tefse&nonce=n--dawd...wdawd'
		);
		expect(response.status).toEqual(400);
		expect(response.text).toContain('clientNotFound');
	});

	test('openid not used', async () => {
		const response = await request(router).post(
			'/api/v1/authorize?response_type=id_token token&client_id=chat.luminu&redirect_uri=https%3A%2F%2Fchat.luminu.net%2Fcb&scope=profile&state=4r4sd3r5tefse&nonce=n--dawd...wdawd'
		);
		expect(response.status).toEqual(400);
		expect(response.text).toContain('openIdNotUsed');
	});

	test('no permissions requested', async () => {
		const response = await request(router).post(
			'/api/v1/authorize?response_type=id_token token&client_id=chat.luminu&redirect_uri=https%3A%2F%2Fchat.luminu.net%2Fcb&scope=openid&state=4r4sd3r5tefse&nonce=n--dawd...wdawd'
		);
		expect(response.status).toEqual(400);
		expect(response.text).toContain('noPermissionRequested');
	});

	test('valid request', async () => {
		const response = await request(router).post(
			'/api/v1/authorize?response_type=id_token token&client_id=chat.luminu&redirect_uri=https%3A%2F%2Fchat.luminu.net%2Fcb&scope=openid profile&state=4r4sd3r5tefse&nonce=n--dawd...wdawd'
		);
		expect(response.status).toEqual(302);
	});

	//! Information endpoint
	test('query missing', async () => {
		const response = await request(router).get(
			'/api/v1/information?client_id=&scope=openid profile'
		);
		expect(response.status).toEqual(400);
	});

	test('valid requests', async () => {
		const response = await request(router).get(
			'/api/v1/information?client_id=chat.luminu&scope=openid profile'
		);
		expect(response.status).toEqual(200);
	});
});
