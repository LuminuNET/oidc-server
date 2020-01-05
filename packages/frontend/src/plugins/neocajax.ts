import neocajax from 'neocajax';
import Vue from 'vue';

const api = neocajax.create({
	baseUrl: 'http://localhost:3000/api/v1'
});

export { api };

Vue.prototype.$http = api;
