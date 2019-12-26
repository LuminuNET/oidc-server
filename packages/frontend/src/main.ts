import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './translations';

import './plugins';

Vue.config.productionTip = false;

const vm = new Vue({
	router,
	store,
	i18n,
	render: h => h(App)
}).$mount('#app');

export { vm };
