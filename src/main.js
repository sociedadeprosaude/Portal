import Vue from 'vue'
import Vuetify from 'vuetify'
// import vuetify from '@/plugins/vuetify'
import 'vuetify/dist/vuetify.min.css'
import './css/main.css'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import constants from '@/utils/constants'
import DateFilter from './filters/date'

import './registerServiceWorker'
import * as firebase from "firebase";

Vue.use(Vuetify)

// Moment.js
window.moment = require('moment')
window.moment.locale('pt-br')

if (process.env.NODE_ENV === 'development') {
  // axios.defaults.baseURL = 'http://prosaude.caixa'
  axios.defaults.baseURL = 'http://caixa.instituicaoprosaude.com:82'
} else {
  axios.defaults.baseURL = 'http://caixa.instituicaoprosaude.com:82'
}

const token = localStorage.getItem('token')
if (token) {
  axios.defaults.headers.common['token'] = token
}

Vue.filter('dateFilter', DateFilter)

Vue.config.productionTip = false

const vuetifyOptions = {
  iconfont: 'md',
  theme: {
    themes: {
      light: {
        primary: '#81d4fa',
        primary_light: '#b6ffff',
        primary_dark: '#4ba3c7',
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107'
      },
    },
  },
}

new Vue({
  router,
  store,
  vuetify: new Vuetify(vuetifyOptions),
  render: h => h(App),
  created() {
    firebase.initializeApp(constants.FIREBASE_CONFIG)
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$router.push('/')
      } else {
        this.$router.push('/login')
      }
    })
  },
}).$mount('#app')
