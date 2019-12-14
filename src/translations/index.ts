import VueI18n from 'vue-i18n';
import Vue from 'vue';

import en from './en';

Vue.use(VueI18n);

const messages = {
	en
};

const i18n = new VueI18n({
	fallbackLocale: 'en',
	messages
});

export default i18n;
