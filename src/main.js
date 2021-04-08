import Vue from 'vue';
//import Vuesax from 'vuesax';
//import 'vuesax/dist/vuesax.css' ;//Vuesax styles
import App from './App.vue';
import { router } from './router';
import store from './store';
import 'bootstrap';
import VeeValidate, { Validator } from "vee-validate";
import es from 'vee-validate/dist/locale/es'
import Vuex from 'vuex';
import {BootstrapVue,IconsPlugin} from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import './assets/css/main.css'; 
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faHome,
  faUser,
  faUserPlus,
  faSignInAlt,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';

library.add(faHome, faUser, faUserPlus, faSignInAlt, faSignOutAlt);

Vue.use(require('vue-moment'));
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

Vue.config.productionTip = false;

Vue.use(VeeValidate,{ fieldsBagName: 'veeFields'});
Validator.localize("es", es);

Vue.component('font-awesome-icon', FontAwesomeIcon);

//Vue.prototype.$IPServidor = 'http://10.161.151.8:8080'
//Vue.prototype.$IPServidor = 'http://192.168.232.98:8080'
//Vue.prototype.$IPServidor  = 'http://10.168.0.120:8080'
Vue.prototype.$IPServidor = 'http://10.161.187.35:8080'

Vue.use(Vuex);

new Vue({
  router,
  store,
  
  render: h => h(App)
}).$mount('#app');


