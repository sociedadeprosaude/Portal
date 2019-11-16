import Vue from 'vue'
import Router from 'vue-router'
import store from "./store/store";
import Home from '@/views/Home'
import Account from '@/views/Auth/Account'
import Login from '@/views/Auth/Login'
import Register from '@/views/Auth/Register'
import Exams from '@/views/Exams'
import Labor from '@/views/Labor/Home'
import Reports from '@/views/Reports'

import Doctors from '@/views/Doctors'
import Clinics from "@/views/Clinics";

import DoctorsAgendaRoutes from "./routes/DoctorsAgendaRoutes";


Vue.use(Router)
let mainRoutes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta : {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/cadastro',
    name: 'Register',
    component: Register,
  },
  {
    path: '/conta',
    name: 'Conta',
    component: Account,
    meta : {
      requiresAuth: true
    }
  },
  {
    path: '/relatorio',
    name: 'Relatorios',
    component: Reports,
    meta : {
      requiresAuth: true
    }
  },
  {
    path: '/exams',
    name: 'Exames',
    component: Exams,
    meta : {
      requiresAuth: false
    }
  },
  {
    path: '/labor',
    name: 'labor',
    component: Labor,
    meta : {
      requiresAuth: false
    }
  },

  {
    path: '/doctors',
    name: 'doctors',
    component: Doctors,
    meta : {
      requiresAuth: false
    }
  },
  {
    path: '/clinics',
    name: 'clinics',
    component: Clinics,
    meta : {
      requiresAuth: false
    }
  },
]

let routes = mainRoutes.concat(DoctorsAgendaRoutes)
let router =  new Router({
  routes: routes
})

router.afterEach((to, from) => {
  if (to.path.includes('agenda')) {
    store.commit('setDoctorsAgendaToolbar', true)
  } else {
    store.commit('setDoctorsAgendaToolbar', false)
  }
})

export default router

