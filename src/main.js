import Vue from 'vue'
import Vuetify from 'vuetify'
import vuetify from '@/plugins/vuetify'
import 'vuetify/dist/vuetify.min.css'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import DateFilter from './filters/date'

import './registerServiceWorker'
import * as firebase from "firebase";

Vue.use(Vuetify)

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

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  created() {
    firebase.initializeApp({
      apiKey: "AIzaSyCdvs5C8J_t9WPQlcZGuuLJ57hwM9_s9BQ",
      authDomain: "prosaude-36f66.firebaseapp.com",
      databaseURL: "https://prosaude-36f66.firebaseio.com",
      projectId: "prosaude-36f66",
      storageBucket: "prosaude-36f66.appspot.com",
      messagingSenderId: "86942539576",
      appId: "1:86942539576:web:9bf02a0a4d8e94b9"
    })
  },
}).$mount('#app')
