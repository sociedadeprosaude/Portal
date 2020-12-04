import Vue from 'vue'
import Vuetify from 'vuetify'
// import vuetify from '@/plugins/vuetify'
//import coreUI from './plugins/coreUI'
import 'vuetify/dist/vuetify.min.css'
import './css/main.css'
import './css/animation.css'
import App from './App.vue'
import router from './router'
import store from './store/store'
import axios from 'axios'
import constants from '@/utils/constants'
import DateFilter from './filters/date'
import MoneyFilter from './filters/money'
import VCurrencyField from 'v-currency-field'

import { iconsSet as icons } from './assets/icons/icons.js'


import './registerServiceWorker'
import * as firebase from "firebase";
import VueHtmlToPaper from 'vue-html-to-paper';
import { createProvider } from './vue-apollo'

const options = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes'
  ],
  styles: [
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
    'https://unpkg.com/kidlat-css/css/kidlat.css',

  ]
};

Vue.use(VueHtmlToPaper, options);

Vue.use(Vuetify);
Vue.use(constants);

Vue.use(VCurrencyField, {
  locale: 'pt-BR',
  decimalLength: 2,
  autoDecimalMode: true,
  min: null,
  max: null,
  defaultValue: 0
});

// Moment.js
window.moment = require('moment');
window.moment.locale('pt-br');


const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['token'] = token
}

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && to.name !== 'Register' && !store.getters.user) next({ name: 'Login' })
  else if ((to.name === 'Login' || to.name === 'Register') && store.getters.user) next({ name: 'Home' })
  else next()
});

Vue.filter('dateFilter', DateFilter);
Vue.filter('moneyFilter', MoneyFilter);

Vue.config.productionTip = false;

const vuetifyOptions = {
  iconfont: 'md',
  theme: {
    themes: {
      light: {
        primary: '#003B8F',
        secondary: '#00796B',
        accent: '#e91e63',
        error: '#f44336',
        warning: '#ffc107',
        info: '#e91e63',
        success: '#4caf50',
        primary_light: '#63a4ff',
        primary_dark: '#003B8F',
        dark_grey: '#808080',
        background: '#DFDFDF',
        blue_grey: '#90A4AE',
        grey_light: '#BDBDBD',
        grey_light2: '#F5F5F5',
        grey_cart: '#9E9E9E',

      },
    },
  },
};

new Vue({
  router,
  store,
  icons,
  vuetify: new Vuetify(vuetifyOptions),
  render: h => h(App),
  apolloProvider: createProvider(),

  created() {
    firebase.initializeApp(constants.FIREBASE_CONFIG);
    firebase.firestore().enablePersistence()

  }
}).$mount('#app');
