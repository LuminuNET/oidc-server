import {
	SET_OIDC,
	SET_VALIDITY,
	SET_PROMPT,
	ADD_LOADER,
	ADD_FINISHED_LOADER,
	UPDATE_LOADING_STATE
} from './mutations.type';

const mutations = {
	[SET_VALIDITY](store: any, payload: any) {
		store.isValid = payload;
	},
	[SET_OIDC](store: any, payload: any) {
		store.oidc = payload;
	},
	[SET_PROMPT](store: any, payload: any) {
		store.prompt = payload;
	},
	[ADD_LOADER](store: any) {
		store.loaders++;
	},
	[ADD_FINISHED_LOADER](store: any) {
		store.finishedLoaders++;
	},
	[UPDATE_LOADING_STATE](store: any, payload: boolean) {
		store.loading = payload;
	}
};

export default mutations;
