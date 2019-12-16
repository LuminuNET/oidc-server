import { SET_OIDC, SET_VALIDITY } from './mutations.type';

const mutations = {
	[SET_VALIDITY](store: any, payload: any) {
		store.isValid = payload;
	},
	[SET_OIDC](store: any, payload: any) {
		store.oidc = payload;
	}
};

export default mutations;
