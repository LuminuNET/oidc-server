import TService from '../types/ServiceType';
import { getValue, setValue, delValue } from './redis';
import { webPool, forumPool } from './database';
import { MysqlError } from 'mysql';
import TGroup from '../types/GroupType';

let claims: any;
let services: Array<TService>;
let groups: any;

const loadClaims = async () => {
	claims = await import('../config/claims.json' as 'json');
};

const getServiceByClientId = (clientId: string): TService | null => {
	let service: TService | null = null;

	services.forEach(element => {
		if (element['client_id'] === clientId) {
			service = element;
		}
	});

	return service;
};

/**
 * !Sets the user grant in the database and redis
 *
 * 1. If it should create an empty user it inserts a new uid to the db
 * 2. Otherwise it updates the value of an existing user in the database
 * 3. After that it caches that value in redis
 *
 * @param userId
 */
const setUserGrantsForUser = async (
	userId: number,
	userGrants: object | string,
	emptyUser?: boolean
) => {
	userGrants = JSON.stringify(userGrants);

	await new Promise(async resolve => {
		if (emptyUser) {
			webPool.query(
				`INSERT INTO \`oidc_user_grants\` (\`uid\`, \`granted\`) VALUES (${userId}, '${userGrants}')`,
				(error: MysqlError, result: any) => {
					if (error) {
						console.error(
							'Unexpected error at inserting new empty user'
						);
					}

					resolve(result);
				}
			);
		} else {
			webPool.query(
				`UPDATE \`oidc_user_grants\` SET \`granted\`=${webPool.escape(
					userGrants
				)} WHERE \`uid\`=${webPool.escape(userId)}`,
				(error: MysqlError, result: any) => {
					if (error) {
						console.error(
							'Unexpected error at updating existing grant ' +
								error
						);
					}

					resolve(result);
				}
			);
		}

		await setValue('user_grants', userGrants, 3600, userId + '');
	});
};

/**
 * !Gets a user grants from the db, if they are not already stored in redis
 *
 * 1. Checks if there are any cached user grants of the player if so, it will just return them
 * 2. If not it will make a query to our lm_web db and get the user grants object where the userId matches
 * 3. If there's no user entry it will create a new empty user in the db and return an empty object
 * 4. Otherwise it will return the entry for granted
 *
 * @param userId
 */
const getUserGrantsFromUser = async (userId: number): Promise<object> => {
	const redisUserGrants = await getValue('user_grants', userId + '');
	let userGrants: object = {};

	if (redisUserGrants === null) {
		userGrants = await new Promise(resolve => {
			webPool.query(
				`SELECT * FROM oidc_user_grants WHERE \`uid\`=${webPool.escape(
					userId
				)}`,
				async (error: MysqlError, result: any) => {
					if (error) {
						console.error(
							'Unexpected error on getting user grants ' + error
						);
					}

					if (result.length === 0) {
						await setUserGrantsForUser(userId, {}, true);
						resolve({});
					} else {
						await setValue(
							'user_grants',
							result[0].granted,
							3600,
							userId + ''
						);
						resolve(JSON.parse(result[0].granted));
					}
				}
			);
		});
	} else {
		userGrants = JSON.parse(redisUserGrants);
	}

	return userGrants;
};

export const getGroupInformationFromUser = (
	userGroupId: number
): TGroup | null => {
	let userGroup: TGroup | null = null;

	groups.forEach((element: TGroup) => {
		if (element.user_group_id === userGroupId) userGroup = element;
	});

	return userGroup;
};

const formatGroups = (groups: TGroup[]): TGroup[] => {
	return groups.sort(
		(a: any, b: any) => b.display_style_priority - a.display_style_priority
	);
};

const loadGroups = async () => {
	const redisGroups = await getValue('groups');

	if (redisGroups === null) {
		forumPool.query(
			'SELECT * FROM xf_user_group',
			(error: MysqlError, result: TGroup[]) => {
				if (error) {
					console.error(
						'Unexpected error on getting groups ' + error
					);
				}

				groups = formatGroups(result);
				setValue('groups', JSON.stringify(groups));
			}
		);
	} else {
		groups = JSON.parse(redisGroups);
	}
};

const loadServices = async () => {
	const redisServices = await getValue('services');

	if (redisServices === null) {
		webPool.query(
			'SELECT * FROM oidc_services',
			(error: MysqlError, result: TService[]) => {
				if (error) {
					console.error(
						'Unexpected error on loading services ' + error
					);
				}

				services = result;
				setValue('services', JSON.stringify(result));
			}
		);
	} else {
		services = JSON.parse(redisServices);
	}
};

export const loadConfiguration = () => {
	loadClaims();
	loadGroups();
	loadServices();
};

export const getClaims = (): any => {
	return claims;
};

export { getServiceByClientId, setUserGrantsForUser, getUserGrantsFromUser };
