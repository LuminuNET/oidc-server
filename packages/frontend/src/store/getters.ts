import {
	GET_OIDC,
	GET_VALIDITY,
	GET_PROMPT,
	GET_LOADERS,
	GET_FINISHED_LOADERS,
	GET_USER_ID,
	GET_LOGGED_IN
} from './getters.type';
import { TOidcInput } from '@luminu/types';

const getters = {
	[GET_OIDC](store: any): TOidcInput {
		return store.oidc;
	},
	[GET_VALIDITY](store: any): boolean {
		return store.isValid;
	},
	[GET_PROMPT](store: any): string {
		return store.prompt;
	},
	[GET_LOADERS](store: any): number {
		return store.loaders;
	},
	[GET_FINISHED_LOADERS](store: any): number {
		return store.finishedLoaders;
	},
	[GET_LOGGED_IN](store: any): boolean {
		return store.isLoggedIn;
	},
	[GET_USER_ID](store: any): number {
		return store.userId;
	}
};

export default getters;
