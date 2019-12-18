type TAuthenticationResponse = {
	id_token: String;
	expires_in: Number;
	state: String;
	access_token?: String;
	token_type?: String;
};

export default TAuthenticationResponse;
