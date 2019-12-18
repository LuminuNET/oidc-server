import TAuthenticationResponse from '../../types/AuthenticationResponseType';

export default async (
	responseType: String,
	clientId: String,
	redirectUri: String,
	scope: String,
	state: String,
	nonce: String
): Promise<TAuthenticationResponse> => {
	const responseTypes: Array<String> = responseType.split(' ');

	return {
		id_token: '',
		expires_in: 1,
		state: '',
		access_token: '',
		token_type: ''
	};
};
