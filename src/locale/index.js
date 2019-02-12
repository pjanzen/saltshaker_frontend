import Vue from 'vue';
import Locales from './locale';
import enLocale from 'iview/src/locale/lang/en-US';

// 自动设置语言
const navLang = navigator.language;
const localLang = (navLang === 'en-US' || navLang === 'en-US') ? navLang : false;
const lang = window.localStorage.lang || localLang || 'en-US';

Vue.config.lang = lang;

// 多语言配置
const locales = Locales;
const mergeEN = Object.assign(enLocale, locales['en-US']);
Vue.locale('en-US', mergeEN);
