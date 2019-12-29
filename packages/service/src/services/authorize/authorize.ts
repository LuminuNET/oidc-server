import TAuthenticationResponse from '../../types/AuthenticationResponseType';
import dotenv from 'dotenv';
import {
	setUserGrantsForUser,
	getUserGrantsFromUser,
	getServiceByClientId
} from '../../middleware/configuration';
import jwt from 'jsonwebtoken';
import LooseObject from '../../types/LooseObject';

dotenv.config();

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
	scopes: string[],
	state: string,
	nonce: string
): Promise<TAuthenticationResponse> => {
	//! Setting the user id hardcoded. Replace with res.locals later
	const userId = 4;

	const responseTypes: Array<string> = responseType.split(' ');
	const userGrants: LooseObject = await getUserGrantsFromUser(userId);

	// Get private key
	const service = getServiceByClientId(clientId);
	const privateKey = service?.private_key + '';

	// Get JWT access Token
	const accessToken = signToken({ userId, groupPriority: 3 }, privateKey);

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

	// Build user grant
	const userGrant = {
		scopes
	};

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
