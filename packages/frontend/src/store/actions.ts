import { CHECK_VALIDITY, ENTER_OIDC } from './actions.type';
import { SET_OIDC, SET_VALIDITY } from './mutations.type';
import { TOidcInput } from '@luminu/types';

const actions = {
	[CHECK_VALIDITY]({ commit }: { commit: any }, payload: any) {
		let validity: boolean = true;

		Object.keys(payload).forEach((el: string) => {
			!payload[el] ? (validity = false) : '';
		});

		commit(SET_VALIDITY, validity);
	},
	[ENTER_OIDC]({ commit, dispatch }: { commit: any; dispatch: any }) {
		const search = window.location.search;
		const queries = new URLSearchParams(search);

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
	}
};

export default actions;
