import Vue from 'vue';
//import Vuesax from 'vuesax';
//import 'vuesax/dist/vuesax.css' ;//Vuesax styles
import App from './App.vue';
import { router } from './router';
import store from './store';
import 'bootstrap';

import VeeValidate from 'vee-validate';
import Vuex from 'vuex';
import {BootstrapVue,IconsPlugin} from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
 
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
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.prototype.$IPServidor = 'http://10.161.151.8:8080'
Vue.use(Vuex);

new Vue({
  router,
  store,
  
  render: h => h(App)
}).$mount('#app');

