import TService from '../types/ServiceType.js';

let claims: any;
let services: Array<TService>;

const loadClaims = async () => {
	claims = await import('../config/claims.json' as 'json');
};

const loadServices = async () => {
	services = await import('../config/services.json' as 'json');
};

const loadConfiguration = () => {
	loadClaims();
	loadServices();
};

loadConfiguration();

export const getClaims = async (): Promise<any> => {
	if (!claims) await loadClaims();
	return claims;
};

export const getServices = async (): Promise<TService[]> => {
	if (!services) await loadServices();
	return services;
};
