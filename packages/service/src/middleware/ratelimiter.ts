import Redis from 'ioredis';

const redis = new Redis();

// sets the base scoped key for redis
const baseKey = 'lm:web:oidc:';

/**
 * Increment user's usage in redis
 * creates a new string if it doesn't exist
 */
const incrUser = async (use: string, ip: string): Promise<string | null> => {
	const key = baseKey + use + ':' + ip;

	const currentEntry = await redis.get(key);

	if (currentEntry) {
		// increments the value
		redis.incr(key);
	} else {
		// creates a new key for the user with tries set to 1
		// lets the key expire after 5 minutes
		redis.set(key, 1, 'EX', 60 * 5);
	}

	return await redis.get(key);
};

/**
 * Deletes the user count entry before it expires
 */
const delUser = async (use: string, ip: string): Promise<void> => {
	const key = baseKey + use + ':' + ip;

	// removes the key
	redis.del(key);
};

export { incrUser, delUser, baseKey };
