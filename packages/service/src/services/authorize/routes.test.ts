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
		const response = await request(router)
			.post(
				'/api/v1/authorize?response_type=&client_id=chat.luminu&redirect_uri=https%3A%2F%2Fchat.luminu.net%2Fcb&scope=openid profile&state=4r4sd3r5tefse&nonce=n--dawd...wdawd'
			)
			.set(
				'Authorization',
				'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInVzZXJuYW1lIjoiS2VpbWVubyIsImhhc0F2YXRhciI6dHJ1ZSwiaWF0IjoxNTc3ODE0NjMwLCJleHAiOjE2MDg1NzMwMzAsImlzcyI6Imh0dHBzOi8vYXV0aC5sdW1pbnUubmV0In0.sOW1ddbXXaxYpld2QYUFl_Oa02lmy_IPdVEioEL1lDztMAMroxZ92nsNhPCJqHcImTSPIJfCC09waux0jxQou5eruFDQf0JkDJNzZNKlhOgeFu4MKfUqQMxF2griXKXrucGjcQ9docLBtTGvpWauH18onxwptl0N9Iwp9kUWkFbaQKogvNuTE8Yc6bRFIOGZ-oaAieaUAPcRgbc8iAv04wv4rZe-yKOflp2aRRD1EupYZ5PkJ7wLXJWsCp387Osb1rU-qODMPd_lwLhilBPyf7jCGC-P8k4qAiMiH_99DDDb3vC_5gQ8oXAQlEkLd523mkr_hDa1CyR1IJvVrlLBG-4SImy7Ugh6VooFfEdfYDM_LWSODHgyZHMoEiCwJjbRFe9A61R_uI9diR-Pvy3yMI7MarmHMq7o0y_730sndM1GatnSfuggtgjeuuhbidq295jmsCFAGjpLylvHxUz0LxL8yWXj3j5gY_JDLMT5zC7N3I5-MclVydmC6Qa3DRU0CNCzrEC-twVDv0FECsLUluRE03HuyM3A9w0QT5Cobm94armzN49y1HK-qood-LY3GP-lWtVZWxuCmtDw6x5SAVIPhgxrxmD554YnP2Sxv7X-Rf5nkkLqxVSTL59eTxoDbiqZ0wEY6Lsr-Ri7rCIc0OKvRhm_HPhfKEAhSgO7OyI'
			);
		expect(response.status).toEqual(400);
		expect(response.text).toContain('missingOidcAuthorizeParameters');
	});

	test('response type not available', async () => {
		const response = await request(router)
			.post(
				'/api/v1/authorize?response_type=id&client_id=chat.luminu&redirect_uri=https%3A%2F%2Fchat.luminu.net%2Fcb&scope=openid profile&state=4r4sd3r5tefse&nonce=n--dawd...wdawd'
			)
			.set(
				'Authorization',
				'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInVzZXJuYW1lIjoiS2VpbWVubyIsImhhc0F2YXRhciI6dHJ1ZSwiaWF0IjoxNTc3ODE0NjMwLCJleHAiOjE2MDg1NzMwMzAsImlzcyI6Imh0dHBzOi8vYXV0aC5sdW1pbnUubmV0In0.sOW1ddbXXaxYpld2QYUFl_Oa02lmy_IPdVEioEL1lDztMAMroxZ92nsNhPCJqHcImTSPIJfCC09waux0jxQou5eruFDQf0JkDJNzZNKlhOgeFu4MKfUqQMxF2griXKXrucGjcQ9docLBtTGvpWauH18onxwptl0N9Iwp9kUWkFbaQKogvNuTE8Yc6bRFIOGZ-oaAieaUAPcRgbc8iAv04wv4rZe-yKOflp2aRRD1EupYZ5PkJ7wLXJWsCp387Osb1rU-qODMPd_lwLhilBPyf7jCGC-P8k4qAiMiH_99DDDb3vC_5gQ8oXAQlEkLd523mkr_hDa1CyR1IJvVrlLBG-4SImy7Ugh6VooFfEdfYDM_LWSODHgyZHMoEiCwJjbRFe9A61R_uI9diR-Pvy3yMI7MarmHMq7o0y_730sndM1GatnSfuggtgjeuuhbidq295jmsCFAGjpLylvHxUz0LxL8yWXj3j5gY_JDLMT5zC7N3I5-MclVydmC6Qa3DRU0CNCzrEC-twVDv0FECsLUluRE03HuyM3A9w0QT5Cobm94armzN49y1HK-qood-LY3GP-lWtVZWxuCmtDw6x5SAVIPhgxrxmD554YnP2Sxv7X-Rf5nkkLqxVSTL59eTxoDbiqZ0wEY6Lsr-Ri7rCIc0OKvRhm_HPhfKEAhSgO7OyI'
			);
		expect(response.status).toEqual(400);
		expect(response.text).toContain('missingIdTokenRequest');
	});

	test('too many response types', async () => {
		const response = await request(router)
			.post(
				'/api/v1/authorize?response_type=id_token token1 wadwd wad&client_id=chat.luminu&redirect_uri=https%3A%2F%2Fchat.luminu.net%2Fcb&scope=openid profile&state=4r4sd3r5tefse&nonce=n--dawd...wdawd'
			)
			.set(
				'Authorization',
				'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInVzZXJuYW1lIjoiS2VpbWVubyIsImhhc0F2YXRhciI6dHJ1ZSwiaWF0IjoxNTc3ODE0NjMwLCJleHAiOjE2MDg1NzMwMzAsImlzcyI6Imh0dHBzOi8vYXV0aC5sdW1pbnUubmV0In0.sOW1ddbXXaxYpld2QYUFl_Oa02lmy_IPdVEioEL1lDztMAMroxZ92nsNhPCJqHcImTSPIJfCC09waux0jxQou5eruFDQf0JkDJNzZNKlhOgeFu4MKfUqQMxF2griXKXrucGjcQ9docLBtTGvpWauH18onxwptl0N9Iwp9kUWkFbaQKogvNuTE8Yc6bRFIOGZ-oaAieaUAPcRgbc8iAv04wv4rZe-yKOflp2aRRD1EupYZ5PkJ7wLXJWsCp387Osb1rU-qODMPd_lwLhilBPyf7jCGC-P8k4qAiMiH_99DDDb3vC_5gQ8oXAQlEkLd523mkr_hDa1CyR1IJvVrlLBG-4SImy7Ugh6VooFfEdfYDM_LWSODHgyZHMoEiCwJjbRFe9A61R_uI9diR-Pvy3yMI7MarmHMq7o0y_730sndM1GatnSfuggtgjeuuhbidq295jmsCFAGjpLylvHxUz0LxL8yWXj3j5gY_JDLMT5zC7N3I5-MclVydmC6Qa3DRU0CNCzrEC-twVDv0FECsLUluRE03HuyM3A9w0QT5Cobm94armzN49y1HK-qood-LY3GP-lWtVZWxuCmtDw6x5SAVIPhgxrxmD554YnP2Sxv7X-Rf5nkkLqxVSTL59eTxoDbiqZ0wEY6Lsr-Ri7rCIc0OKvRhm_HPhfKEAhSgO7OyI'
			);
		expect(response.status).toEqual(400);
		expect(response.text).toContain('tooManyResponseTypesSet');
	});

	test('client not exists', async () => {
		const response = await request(router)
			.post(
				'/api/v1/authorize?response_type=id_token token&client_id=invalid&redirect_uri=https%3A%2F%2Fchat.luminu.net%2Fcb&scope=openid profile&state=4r4sd3r5tefse&nonce=n--dawd...wdawd'
			)
			.set(
				'Authorization',
				'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInVzZXJuYW1lIjoiS2VpbWVubyIsImhhc0F2YXRhciI6dHJ1ZSwiaWF0IjoxNTc3ODE0NjMwLCJleHAiOjE2MDg1NzMwMzAsImlzcyI6Imh0dHBzOi8vYXV0aC5sdW1pbnUubmV0In0.sOW1ddbXXaxYpld2QYUFl_Oa02lmy_IPdVEioEL1lDztMAMroxZ92nsNhPCJqHcImTSPIJfCC09waux0jxQou5eruFDQf0JkDJNzZNKlhOgeFu4MKfUqQMxF2griXKXrucGjcQ9docLBtTGvpWauH18onxwptl0N9Iwp9kUWkFbaQKogvNuTE8Yc6bRFIOGZ-oaAieaUAPcRgbc8iAv04wv4rZe-yKOflp2aRRD1EupYZ5PkJ7wLXJWsCp387Osb1rU-qODMPd_lwLhilBPyf7jCGC-P8k4qAiMiH_99DDDb3vC_5gQ8oXAQlEkLd523mkr_hDa1CyR1IJvVrlLBG-4SImy7Ugh6VooFfEdfYDM_LWSODHgyZHMoEiCwJjbRFe9A61R_uI9diR-Pvy3yMI7MarmHMq7o0y_730sndM1GatnSfuggtgjeuuhbidq295jmsCFAGjpLylvHxUz0LxL8yWXj3j5gY_JDLMT5zC7N3I5-MclVydmC6Qa3DRU0CNCzrEC-twVDv0FECsLUluRE03HuyM3A9w0QT5Cobm94armzN49y1HK-qood-LY3GP-lWtVZWxuCmtDw6x5SAVIPhgxrxmD554YnP2Sxv7X-Rf5nkkLqxVSTL59eTxoDbiqZ0wEY6Lsr-Ri7rCIc0OKvRhm_HPhfKEAhSgO7OyI'
			);
		expect(response.status).toEqual(400);
		expect(response.text).toContain('clientNotFound');
	});

	test('openid not used', async () => {
		const response = await request(router)
			.post(
				'/api/v1/authorize?response_type=id_token token&client_id=chat.luminu&redirect_uri=https%3A%2F%2Fchat.luminu.net%2Fcb&scope=profile&state=4r4sd3r5tefse&nonce=n--dawd...wdawd'
			)
			.set(
				'Authorization',
				'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInVzZXJuYW1lIjoiS2VpbWVubyIsImhhc0F2YXRhciI6dHJ1ZSwiaWF0IjoxNTc3ODE0NjMwLCJleHAiOjE2MDg1NzMwMzAsImlzcyI6Imh0dHBzOi8vYXV0aC5sdW1pbnUubmV0In0.sOW1ddbXXaxYpld2QYUFl_Oa02lmy_IPdVEioEL1lDztMAMroxZ92nsNhPCJqHcImTSPIJfCC09waux0jxQou5eruFDQf0JkDJNzZNKlhOgeFu4MKfUqQMxF2griXKXrucGjcQ9docLBtTGvpWauH18onxwptl0N9Iwp9kUWkFbaQKogvNuTE8Yc6bRFIOGZ-oaAieaUAPcRgbc8iAv04wv4rZe-yKOflp2aRRD1EupYZ5PkJ7wLXJWsCp387Osb1rU-qODMPd_lwLhilBPyf7jCGC-P8k4qAiMiH_99DDDb3vC_5gQ8oXAQlEkLd523mkr_hDa1CyR1IJvVrlLBG-4SImy7Ugh6VooFfEdfYDM_LWSODHgyZHMoEiCwJjbRFe9A61R_uI9diR-Pvy3yMI7MarmHMq7o0y_730sndM1GatnSfuggtgjeuuhbidq295jmsCFAGjpLylvHxUz0LxL8yWXj3j5gY_JDLMT5zC7N3I5-MclVydmC6Qa3DRU0CNCzrEC-twVDv0FECsLUluRE03HuyM3A9w0QT5Cobm94armzN49y1HK-qood-LY3GP-lWtVZWxuCmtDw6x5SAVIPhgxrxmD554YnP2Sxv7X-Rf5nkkLqxVSTL59eTxoDbiqZ0wEY6Lsr-Ri7rCIc0OKvRhm_HPhfKEAhSgO7OyI'
			);
		expect(response.status).toEqual(400);
		expect(response.text).toContain('openIdNotUsed');
	});

	test('no permissions requested', async () => {
		const response = await request(router)
			.post(
				'/api/v1/authorize?response_type=id_token token&client_id=chat.luminu&redirect_uri=https%3A%2F%2Fchat.luminu.net%2Fcb&scope=openid&state=4r4sd3r5tefse&nonce=n--dawd...wdawd'
			)
			.set(
				'Authorization',
				'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInVzZXJuYW1lIjoiS2VpbWVubyIsImhhc0F2YXRhciI6dHJ1ZSwiaWF0IjoxNTc3ODE0NjMwLCJleHAiOjE2MDg1NzMwMzAsImlzcyI6Imh0dHBzOi8vYXV0aC5sdW1pbnUubmV0In0.sOW1ddbXXaxYpld2QYUFl_Oa02lmy_IPdVEioEL1lDztMAMroxZ92nsNhPCJqHcImTSPIJfCC09waux0jxQou5eruFDQf0JkDJNzZNKlhOgeFu4MKfUqQMxF2griXKXrucGjcQ9docLBtTGvpWauH18onxwptl0N9Iwp9kUWkFbaQKogvNuTE8Yc6bRFIOGZ-oaAieaUAPcRgbc8iAv04wv4rZe-yKOflp2aRRD1EupYZ5PkJ7wLXJWsCp387Osb1rU-qODMPd_lwLhilBPyf7jCGC-P8k4qAiMiH_99DDDb3vC_5gQ8oXAQlEkLd523mkr_hDa1CyR1IJvVrlLBG-4SImy7Ugh6VooFfEdfYDM_LWSODHgyZHMoEiCwJjbRFe9A61R_uI9diR-Pvy3yMI7MarmHMq7o0y_730sndM1GatnSfuggtgjeuuhbidq295jmsCFAGjpLylvHxUz0LxL8yWXj3j5gY_JDLMT5zC7N3I5-MclVydmC6Qa3DRU0CNCzrEC-twVDv0FECsLUluRE03HuyM3A9w0QT5Cobm94armzN49y1HK-qood-LY3GP-lWtVZWxuCmtDw6x5SAVIPhgxrxmD554YnP2Sxv7X-Rf5nkkLqxVSTL59eTxoDbiqZ0wEY6Lsr-Ri7rCIc0OKvRhm_HPhfKEAhSgO7OyI'
			);
		expect(response.status).toEqual(400);
		expect(response.text).toContain('noPermissionRequested');
	});

	test('valid request', async () => {
		const response = await request(router)
			.post(
				'/api/v1/authorize?response_type=id_token token&client_id=chat.luminu&redirect_uri=https%3A%2F%2Fchat.luminu.net%2Fcb&scope=openid profile&state=4r4sd3r5tefse&nonce=n--dawd...wdawd'
			)
			.set(
				'Authorization',
				'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInVzZXJuYW1lIjoiS2VpbWVubyIsImhhc0F2YXRhciI6dHJ1ZSwiaWF0IjoxNTc3ODE0NjMwLCJleHAiOjE2MDg1NzMwMzAsImlzcyI6Imh0dHBzOi8vYXV0aC5sdW1pbnUubmV0In0.sOW1ddbXXaxYpld2QYUFl_Oa02lmy_IPdVEioEL1lDztMAMroxZ92nsNhPCJqHcImTSPIJfCC09waux0jxQou5eruFDQf0JkDJNzZNKlhOgeFu4MKfUqQMxF2griXKXrucGjcQ9docLBtTGvpWauH18onxwptl0N9Iwp9kUWkFbaQKogvNuTE8Yc6bRFIOGZ-oaAieaUAPcRgbc8iAv04wv4rZe-yKOflp2aRRD1EupYZ5PkJ7wLXJWsCp387Osb1rU-qODMPd_lwLhilBPyf7jCGC-P8k4qAiMiH_99DDDb3vC_5gQ8oXAQlEkLd523mkr_hDa1CyR1IJvVrlLBG-4SImy7Ugh6VooFfEdfYDM_LWSODHgyZHMoEiCwJjbRFe9A61R_uI9diR-Pvy3yMI7MarmHMq7o0y_730sndM1GatnSfuggtgjeuuhbidq295jmsCFAGjpLylvHxUz0LxL8yWXj3j5gY_JDLMT5zC7N3I5-MclVydmC6Qa3DRU0CNCzrEC-twVDv0FECsLUluRE03HuyM3A9w0QT5Cobm94armzN49y1HK-qood-LY3GP-lWtVZWxuCmtDw6x5SAVIPhgxrxmD554YnP2Sxv7X-Rf5nkkLqxVSTL59eTxoDbiqZ0wEY6Lsr-Ri7rCIc0OKvRhm_HPhfKEAhSgO7OyI'
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
