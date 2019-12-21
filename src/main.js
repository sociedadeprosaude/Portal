import Vue from 'vue'
import Vuetify from 'vuetify'
// import vuetify from '@/plugins/vuetify'
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


import './registerServiceWorker'
import * as firebase from "firebase";
import VueHtmlToPaper from 'vue-html-to-paper';

const options = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes'
  ],
  styles: [
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
    'https://unpkg.com/kidlat-css/css/kidlat.css'
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

// if (window.location.href.includes('localhost')) {
//   process.env.NODE_ENV = 'development'
//   console.log(process.env.NODE_ENV)
// }
// if (process.env.NODE_ENV === 'development') {
//
// } else {
// }

const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['token'] = token
}

Vue.filter('dateFilter', DateFilter);
Vue.filter('moneyFilter', MoneyFilter);

Vue.config.productionTip = false;

const vuetifyOptions = {
  iconfont: 'md',
  theme: {
    themes: {
      light: {
        primary: '#003B8F',
        secondary: '#1564BF',
        accent: '#00796B',
        error: '#f44336',
        warning: '#ffc107',
        info: '#e91e63',
        success: '#4caf50',
        primary_light: '#63a4ff',
        primary_dark: '#003B8F',
        background: '#EFEFEF'
      },
    },
  },
};

new Vue({
  router,
  store,
  vuetify: new Vuetify(vuetifyOptions),
  render: h => h(App),
  created() {
    firebase.initializeApp(constants.FIREBASE_CONFIG);
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$router.push('/')
      } else {
        this.$router.push('/login')
      }
    })
  },
}).$mount('#app');
