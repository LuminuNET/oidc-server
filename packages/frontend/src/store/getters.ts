import {
	GET_OIDC,
	GET_VALIDITY,
	GET_PROMPT,
	GET_LOADERS,
	GET_FINISHED_LOADERS
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
	}
};

export default getters;
