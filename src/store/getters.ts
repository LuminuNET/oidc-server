import { GET_OIDC, GET_VALIDITY } from './getters.type';
import { TOidcInput } from '@luminu/types';

const getters = {
	[GET_OIDC](store: any): TOidcInput {
		return store.oidc;
	},
	[GET_VALIDITY](store: any): boolean {
		return store.isValid;
	}
};

export default getters;
