import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Account from '@/views/Auth/Account'
import Login from '@/views/Auth/Login'
import Register from '@/views/Auth/Register'
import Exams from '@/views/Exams/Home'
import RegisteredExames from '@/views/Exams/RegisteredExams'
import Labor from '@/views/Labor/Home'
import Reports from '@/views/Reports'

import Doctors from '@/views/Doctors'
import Clinics from "@/views/Clinics";


Vue.use(Router)

let router =  new Router({
  routes: [
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
      path: '/exames',
      name: 'Exames',
      component: Exams,
      meta : {
        requiresAuth: false
      }
    },
    {
      path: '/registered_exams',
      name: 'ExamesRegistrados',
      component: RegisteredExames,
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
})

export default router

