import neojax from 'neojax';
import Vue from 'vue';

const api = neojax.create({
	baseUrl: 'http://localhost:3000/api/v1'
});

export { api };

Vue.prototype.$http = api;
