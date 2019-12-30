import mysql from 'mysql';
import util from 'util';
import dotenv from 'dotenv';

dotenv.config();

const forumPool = mysql.createPool({
	connectionLimit: 10,
	host: process.env.FORUM_DB_HOST,
	user: process.env.FORUM_DB_USER,
	password: process.env.FORUM_DB_PASSWORD,
	database: process.env.FORUM_DB_DATABASE
});

const webPool = mysql.createPool({
	connectionLimit: 10,
	host: process.env.WEB_DB_HOST,
	user: process.env.WEB_DB_USER,
	password: process.env.WEB_DB_PASSWORD,
	database: process.env.WEB_DB_DATABASE
});

// Ping database to check for common exception errors.
forumPool.getConnection((err, connection) => {
	if (err) {
		if (err.code === 'PROTOCOL_CONNECTION_LOST') {
			console.error('Database connection was closed.');
		}
		if (err.code === 'ER_CON_COUNT_ERROR') {
			console.error('Database has too many connections.');
		}
		if (err.code === 'ECONNREFUSED') {
			console.error('Database connection was refused.');
		}
	}

	if (connection) connection.release();

	return;
});

webPool.getConnection((err, connection) => {
	if (err) {
		if (err.code === 'PROTOCOL_CONNECTION_LOST') {
			console.error('Database connection was closed.');
		}
		if (err.code === 'ER_CON_COUNT_ERROR') {
			console.error('Database has too many connections.');
		}
		if (err.code === 'ECONNREFUSED') {
			console.error('Database connection was refused.');
		}
	}

	if (connection) connection.release();

	return;
});

// Promisify for Node.js async/await.
// @ts-ignore
forumPool.query = util.promisify(forumPool.query);

// @ts-ignore
webPool.query = util.promisify(webPool.query);

export { forumPool, webPool };
