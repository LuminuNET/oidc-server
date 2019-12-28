import {
	CHECK_VALIDITY,
	ENTER_OIDC,
	ENTER_PROMPT,
	REGISTER_LOADING,
	FINISHED_LOADING
} from './actions.type';
import {
	SET_OIDC,
	SET_VALIDITY,
	SET_PROMPT,
	ADD_LOADER,
	ADD_FINISHED_LOADER,
	UPDATE_LOADING_STATE
} from './mutations.type';
import { TOidcInput } from '@luminu/types';
import { GET_FINISHED_LOADERS, GET_LOADERS } from './getters.type';

const getQueries = (): URLSearchParams => {
	const search = window.location.search;
	return new URLSearchParams(search);
};

const actions = {
	[CHECK_VALIDITY]({ commit }: { commit: any }, payload: any) {
		let validity: boolean = true;

		Object.keys(payload).forEach((el: string) => {
			!payload[el] ? (validity = false) : '';
		});

		commit(SET_VALIDITY, validity);
	},
	[ENTER_OIDC]({ commit, dispatch }: { commit: any; dispatch: any }) {
		const queries = getQueries();

		const payload: TOidcInput | any = {
			responseType: queries.get('response_type'),
			clientId: queries.get('client_id'),
			redirectUri: queries.get('redirect_uri'),
			scope: queries.get('scope'),
			state: queries.get('state'),
			nonce: queries.get('nonce')
		};

		dispatch(CHECK_VALIDITY, payload);
		commit(SET_OIDC, payload);
	},
	[ENTER_PROMPT]({ commit }: { commit: any }) {
		const queries = getQueries();

		const payload = queries.get('prompt');

		commit(SET_PROMPT, payload);
	},
	[REGISTER_LOADING]({ commit }: { commit: any }) {
		commit(ADD_LOADER);
	},
	[FINISHED_LOADING]({ commit, getters }: { commit: any; getters: any }) {
		commit(ADD_FINISHED_LOADER);

		const loaders: number = getters[GET_LOADERS];
		const finishedLoaders: number = getters[GET_FINISHED_LOADERS];

		if (loaders === finishedLoaders && loaders) {
			commit(UPDATE_LOADING_STATE, false);
		}
	}
};

export default actions;
