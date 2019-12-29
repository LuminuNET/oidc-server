import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export default (userId: number, username: string): object => {
	const accessToken = jwt.sign(
		{ userId, username },
		process.env.PRIVATE_KEY + '',
		{
			algorithm: 'HS256',
			expiresIn: 3600 * 24 * 356,
			issuer: 'https://auth.luminu.net'
		}
	);

	return {
		accessToken,
		message: 'loginSuccessful',
		success: true
	};
};
