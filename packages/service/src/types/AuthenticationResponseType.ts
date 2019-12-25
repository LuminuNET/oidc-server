type TAuthenticationResponse = {
	id_token: string;
	expires_in: number;
	state: string;
	access_token?: string;
	token_type?: string;
};

export default TAuthenticationResponse;
