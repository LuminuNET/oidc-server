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
			algorithm: 'RS256',
			expiresIn: 600,
			issuer: 'https://auth.luminu.net'
		}
	);
};

const flattenObject = function(ob: LooseObject) {
	let toReturn: any = {};

	for (var i in ob) {
		if (!ob.hasOwnProperty(i)) continue;

		if (typeof ob[i] == 'object') {
			const flatObject = flattenObject(ob[i]);
			for (let x in flatObject) {
				if (!flatObject.hasOwnProperty(x)) continue;

				toReturn[x] = flatObject[x];
			}
		} else {
			toReturn[i] = ob[i];
		}
	}
	return toReturn;
};

export default async (
	responseType: string,
	clientId: string,
	redirectUri: string,
	scopes: string[],
	state: string,
	nonce: string,
	user: any
): Promise<TAuthenticationResponse> => {
	const userId = user.userId;

	const responseTypes: Array<string> = responseType.split(' ');
	const userGrants: LooseObject = await getUserGrantsFromUser(userId);

	// Get private key
	const service = getServiceByClientId(clientId);
	const privateKey = service?.private_key + '';

	// Get JWT access Token
	const accessToken = signToken({ userId, groupPriority: 3 }, privateKey);

	const requiredInformation: String[] = Object.keys(user).filter(
		element => scopes.indexOf(element) !== -1
	);

	const requiredCachedInformation = requiredInformation.map(
		(element: any) => user[element]
	);

	// Get JWT id token
	const idToken = signToken(
		{
			aud: clientId,
			nonce,
			userId: user.userId,
			username: user.username,
			hasAvatar: user.hasAvatar,
			...flattenObject(requiredCachedInformation)
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
		expires_in: 600,
		state,
		access_token: accessToken,
		token_type: 'bearer'
	};
};
