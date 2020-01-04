import { footer } from '@luminu/core/translations/de';

const de = {
	navigation: {
		home: 'Home',
		forum: 'Forum',
		login: 'Login',
		logout: 'Logout',
		preferences: 'Einstellungen'
	},
	global: {
		buildingWebsite: 'Webseite lädt'
	},
	modal: {
		accept: 'Akzeptieren',
		deny: 'Abbrechen',
		wantsAccessFollowingPartsFromYourAccount:
			'will über die folgenden Teile deines Accounts verfügen können'
	},
	login: {
		username: 'Nutzername',
		email: 'Email',
		password: 'Passwort'
	},
	response: {
		noUsernameOrEmailSpecified:
			'Es wurde weder ein Nutzername noch eine Email angegeben.',
		noPasswordSpecified: 'Kein Passwort wurde angegeben.',
		serviceUnavailable: 'Der Server ist derzeitig unerreichbar.',
		clientNotFound: 'Der Client konnte nicht gefunden werden.',
		openIdNotUsed: 'OpenID wird nicht verwendet.',
		missingOidcAuthorizeParameters:
			'Es fehlen die OpenID Connect Authorisierungs-Parameter.',
		missingIdTokenRequest: 'Es wird nach keinem id_token gefragt.',
		missingTokenRequest: 'Es wird nach keinem token gefragt.',
		tooManyResponseTypesSet: 'Es wurden zu viele response_types gesetzt.',
		promptCannotBeNoneIfNoConsentGiven:
			'Der Prompt kann nicht none sein, wenn kein consent gegeben wurde.',
		requestingUnallowedScopes: 'Unerlaubte scopes wurden angefragt.',
		redirectUriDoesntMatch: 'Die redirect_uri ist nicht verifiziert.',
		invalidBearerToken: 'Ein ungültiger token wurde angegeben.',
		noPermissionRequested: 'Es wurden keine Rechte angefragt.',
		missingInformationParameters: 'Es fehlen die Informations-Parameter.',
		tooManyFailedLoginAttempts:
			'Du hast versucht dich zu häufig anzumelden, bitte warte einen Moment.',
		userNotFound: 'Es konnte kein Nutzer mit der Email gefunden werden.',
		incorrectPassword: 'Das angegebene Passwort ist falsch.'
	},
	permissions: {
		basic: {
			profile: 'Profileinsicht',
			email: 'Email'
		},
		advanced: {}
	},
	footer
};

export default de;
