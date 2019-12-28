import axios from 'axios';
import Vue from 'vue';

const api = axios.create({
	baseURL: 'http://localhost:3000/api/v1'
});

export { api };

Vue.prototype.$http = api;
