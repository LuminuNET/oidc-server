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

	test('a non-existing api method', async () => {
		const response = await request(router).get(
			'/api/v11/authorize?response_type=id_token token&client_id=chat.luminu&redirect_uri=https%3A%2F%2Fchat.luminu.net%2Fcb&scope=openid profile&state=4r4sd3r5tefse&nonce=n--dawd...wdawd'
		);
		expect(response.status).toEqual(404);
	});

	test('an empty string', async () => {
		const response = await request(router).get(
			'/api/v1/authorize?response_type=&client_id=chat.luminu&redirect_uri=https%3A%2F%2Fchat.luminu.net%2Fcb&scope=openid profile&state=4r4sd3r5tefse&nonce=n--dawd...wdawd'
		);
		expect(response.status).toEqual(400);
	});

	test('response type not available', async () => {
		const response = await request(router).get(
			'/api/v1/authorize?response_type=id&client_id=chat.luminu&redirect_uri=https%3A%2F%2Fchat.luminu.net%2Fcb&scope=openid profile&state=4r4sd3r5tefse&nonce=n--dawd...wdawd'
		);
		expect(response.status).toEqual(400);
	});

	test('too many response types', async () => {
		const response = await request(router).get(
			'/api/v1/authorize?response_type=id_token token1 wadwd wad&client_id=chat.luminu&redirect_uri=https%3A%2F%2Fchat.luminu.net%2Fcb&scope=openid profile&state=4r4sd3r5tefse&nonce=n--dawd...wdawd'
		);
		expect(response.status).toEqual(400);
	});

	test('client not exists', async () => {
		const response = await request(router).get(
			'/api/v1/authorize?response_type=id_token token&client_id=invalid&redirect_uri=https%3A%2F%2Fchat.luminu.net%2Fcb&scope=openid profile&state=4r4sd3r5tefse&nonce=n--dawd...wdawd'
		);
		expect(response.status).toEqual(400);
	});

	test('redirect uri invalid', async () => {
		const response = await request(router).get(
			'/api/v1/authorize?response_type=id_token token&client_id=invalid&redirect_uri=https%3A%2F%2Fluminu.net%2Fcb&scope=openid profile&state=4r4sd3r5tefse&nonce=n--dawd...wdawd'
		);
		expect(response.status).toEqual(400);
	});

	test('openid not used', async () => {
		const response = await request(router).get(
			'/api/v1/authorize?response_type=id_token token&client_id=chat.luminu&redirect_uri=https%3A%2F%2Fchat.luminu.net%2Fcb&scope=profile&state=4r4sd3r5tefse&nonce=n--dawd...wdawd'
		);
		expect(response.status).toEqual(400);
	});

	test('no permissions requested', async () => {
		const response = await request(router).get(
			'/api/v1/authorize?response_type=id_token token&client_id=chat.luminu&redirect_uri=https%3A%2F%2Fchat.luminu.net%2Fcb&scope=openid&state=4r4sd3r5tefse&nonce=n--dawd...wdawd'
		);
		expect(response.status).toEqual(400);
	});

	test('valid request', async () => {
		const response = await request(router).get(
			'/api/v1/authorize?response_type=id_token token&client_id=chat.luminu&redirect_uri=https%3A%2F%2Fchat.luminu.net%2Fcb&scope=openid profile&state=4r4sd3r5tefse&nonce=n--dawd...wdawd'
		);
		expect(response.status).toEqual(302);
	});
});
