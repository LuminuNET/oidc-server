import { footer } from '@luminu/core/translations/en';

const en = {
	navigation: {
		home: 'Home',
		forum: 'Forum',
		login: 'Login',
		logout: 'Logout',
		preferences: 'Preferences'
	},
	global: {
		buildingWebsite: 'Building website'
	},
	modal: {
		accept: 'Accept',
		deny: 'Deny',
		wantsAccessFollowingPartsFromYourAccount:
			'wants to access the following parts from your account'
	},
	login: {
		username: 'Username',
		email: 'Email',
		password: 'Password'
	},
	response: {
		noUsernameOrEmailSpecified: 'No username or email was specified.',
		noPasswordSpecified: 'No password was specified.',
		serviceUnavailable: 'Service unavailable.',
		clientNotFound: 'Client was not found.',
		openIdNotUsed: "OpenID isn't used.",
		missingOidcAuthorizeParameters:
			'Missing OpenID Connect Authorize Parameters.',
		missingIdTokenRequest: 'Missing id_token in request.',
		missingTokenRequest: 'Missing token in request.',
		tooManyResponseTypesSet: 'Too many response types were set.',
		promptCannotBeNoneIfNoConsentGiven:
			'Prompt cannot be none if no consent was given before.',
		requestingUnallowedScopes: 'Unallowed scopes were requested.',
		redirectUriDoesntMatch: "The redirect uri doesn't match.",
		invalidBearerToken: 'An invalid bearer token was sent, try relogging.',
		noPermissionRequested: 'No permission was requested.',
		missingInformationParameters: 'Missing information parameters.',
		tooManyFailedLoginAttempts:
			'Too many failed login requests, please try again later.',
		userNotFound: 'No user with this name or email could be found.',
		incorrectPassword: 'The password is incorrect.'
	},
	permissions: {
		basic: {
			profile: 'Basic Profile',
			email: 'Email'
		},
		advanced: {}
	},
	footer
};

export default en;
