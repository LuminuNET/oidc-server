import http from 'http';
import https from 'https';
import express from 'express';
import { applyMiddleware, applyRoutes } from './utils';
import middleware from './middleware';
import errorHandlers from './middleware/errorHandlers';
import routes from './services';
import { loadConfiguration } from './middleware/configuration';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

process.on('uncaughtException', e => {
	console.log(e);
	process.exit(1);
});

process.on('unhandledRejection', e => {
	console.log(e);
	process.exit(1);
});

const router = express();
applyMiddleware(middleware, router);
applyRoutes(routes, router);
applyMiddleware(errorHandlers, router);
loadConfiguration();

const { PORT = 3000 } = process.env;

switch (process.env.NODE_ENV as string) {
	case 'DEV' || 'DEVELOPMENT':
		http.createServer(router).listen(PORT, () => {
			console.info(`Running server on http://localhost:${PORT}`);
		});
		break;
	case 'PROD' || 'PRODUCTION':
		https
			.createServer(
				{
					key: fs.readFileSync(process.env.SSL_KEY_PATH as string),
					cert: fs.readFileSync(process.env.SSL_CERT_PATH as string),
					passphrase: process.env.SSL_PASSPHRASE as string
				},
				router
			)
			.listen(PORT, () => {
				console.info(`Running server on https://localhost:${PORT}`);
			});
		break;
	default:
		console.warn(
			'Server not running! No APP_MODE specified, use mode DEV or PROD'
		);
}
