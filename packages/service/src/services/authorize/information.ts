import TInformationResponse from '../../types/InformationResponseType';
import {
	getServices,
	getClaims,
	getServiceByClientId
} from '../../middleware/configuration';
import TService from '../../types/ServiceType';

export default async (
	clientId: string,
	scope: string
): Promise<TInformationResponse> => {
	const services = await getServices();
	const claims = await getClaims();

	// @ts-ignore
	const service: TService = getServiceByClientId(clientId);
	const scopes = scope.split(' ').filter(el => el !== 'openid');

	const basicScopes: Array<String> = scopes.filter(element => {
		if (!claims.basic_scopes.length) return false;
		return claims.basic_scopes.indexOf(element) !== -1;
	});

	const advancedScopes: Array<String> = scopes.filter(element => {
		if (!claims.advanced_scopes.length) return false;
		return claims.advanced_scopes.indexof(element) !== -1;
	});

	return {
		name: service.name,
		permission_basic: basicScopes,
		permission_advanced: advancedScopes
	};
};
