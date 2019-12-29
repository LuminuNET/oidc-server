const BASE_KEY = 'lm:auth:';

export const setItem = (key: string, value: string) => {
	localStorage.setItem(BASE_KEY + key, value);
};

export const getItem = (key: string): string | null => {
	return localStorage.getItem(BASE_KEY + key);
};

export const removeItem = (key: string) => {
	localStorage.removeItem(BASE_KEY + key);
};
