import {
	handleCors,
	handleBodyRequestParsing,
	handleCookieRequestParsing,
	handleCompression
} from './common';

import { handleAPIDocs } from './apiDocs';

export default [
	handleCors,
	handleBodyRequestParsing,
	handleCookieRequestParsing,
	handleCompression,
	handleAPIDocs
];
