const state = {
	isValid: false,
	oidc: {
		response_type: '',
		client_id: '',
		redirect_uri: '',
		scope: '',
		state: '',
		nonce: ''
	},
	prompt: 'consent',
	loading: true,
	loaders: 0,
	finishedLoaders: 0
};

export default state;
