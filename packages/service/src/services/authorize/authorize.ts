import TAuthenticationResponse from '../../types/AuthenticationResponseType';
import dotenv from 'dotenv';
import {
	setUserGrantsForUser,
	getUserGrantsFromUser,
	getServiceByClientId
} from '../../middleware/configuration';
import jwt from 'jsonwebtoken';

dotenv.config();

type LooseObject = object & {
	[key: string]: any;
};

const signToken = (payload: object, privateKey: string) => {
	return jwt.sign(
		{
			...payload
		},
		privateKey,
		{
			algorithm: 'HS256',
			expiresIn: 600,
			issuer: 'https://auth.luminu.net'
		}
	);
};

export default async (
	responseType: string,
	clientId: string,
	redirectUri: string,
	scope: string,
	state: string,
	nonce: string
): Promise<TAuthenticationResponse> => {
	const responseTypes: Array<string> = responseType.split(' ');

	//! Setting the user id hardcoded. Replace with res.locals later
	const userId = 4;

	// Get private key
	const service = getServiceByClientId(clientId);
	const privateKey = service?.private_key + '';

	// Get JWT access Token
	const accessToken = signToken({ userId }, privateKey);

	// Get JWT id token
	const idToken = signToken(
		{
			aud: clientId,
			nickname: 'Keimeno',
			group: 'Developer',
			groupPriority: 3,
			nonce
		},
		privateKey
	);

	// Get scopes
	const scopes = scope.split(' ');

	// Build user grant
	const userGrant = {
		scopes
	};

	const userGrants: LooseObject = await getUserGrantsFromUser(userId);

	userGrants[clientId] = userGrant;

	setUserGrantsForUser(userId, userGrants);

	return {
		id_token: idToken,
		expires_in: 3600,
		state,
		access_token: accessToken,
		token_type: 'bearer'
	};
};
