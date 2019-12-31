import { getGroups as getConfiguratedGroups } from '../../middleware/configuration';

export const getGroups = async () => {
	return getConfiguratedGroups();
};
