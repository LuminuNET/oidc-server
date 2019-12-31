import crypto from 'crypto';
import { promisify } from 'util';
import { webPool } from '../../middleware/database';

const generateKeyPair = promisify(crypto.generateKeyPair);

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

	return {
		clientId,
		name,
		domain,
		callback,
		privateKey,
		publicKey
	};
};
