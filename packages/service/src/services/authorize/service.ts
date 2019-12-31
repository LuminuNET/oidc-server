import crypto from 'crypto';
import { promisify } from 'util';
import { webPool } from '../../middleware/database';
import {
	getServices as getConfigurationServices,
	loadServices
} from '../../middleware/configuration';

const generateKeyPair = promisify(crypto.generateKeyPair);

export const deleteService = async (clientId: string) => {
	await webPool.query(
		`DELETE FROM \`oidc_services\` WHERE 
		\`client_id\`=${webPool.escape(clientId)}`
	);

	await loadServices();

	return {
		clientId
	};
};

export const getServices = async () => {
	const services = getConfigurationServices().map(element => ({
		client_id: element.client_id,
		name: element.name,
		domain: element.domain,
		callback: element.callback_url,
		public_key: element.public_key
	}));

	return {
		...services
	};
};

export const updateService = async (
	clientId: string,
	name: string,
	domain: string,
	callback: string
) => {
	await webPool.query(
		`UPDATE \`oidc_services\` SET 
		\`name\`=${webPool.escape(name)},
		\`domain\`=${webPool.escape(domain)},
		\`callback\`=${webPool.escape(callback)} 
		WHERE 
		\`client_id\`=${webPool.escape(clientId)}`
	);

	await loadServices();

	return {
		clientId,
		name,
		domain,
		callback
	};
};

export const addService = async (
	clientId: string,
	name: string,
	domain: string,
	callback: string
) => {
	const { privateKey, publicKey } = await generateKeyPair('rsa', {
		modulusLength: 4096,
		publicKeyEncoding: {
			type: 'spki',
			format: 'pem'
		},
		privateKeyEncoding: {
			type: 'pkcs8',
			format: 'pem'
		}
	});

	await webPool.query(
		`INSERT INTO \`oidc_services\`
		(\`client_id\`, \`name\`, \`domain\`, \`callback\`, \`private_key\`, \`public_key\`)
		VALUES (
		${webPool.escape(clientId)},
		${webPool.escape(name)},
		${webPool.escape(domain)},
		${webPool.escape(callback)},
		${webPool.escape(privateKey)},
		${webPool.escape(publicKey)}
		)`
	);

	await loadServices();

	return {
		clientId,
		name,
		domain,
		callback,
		privateKey,
		publicKey
	};
};
