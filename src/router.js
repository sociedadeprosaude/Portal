import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Caixa from '@/views/Sales/Home'
import Prontuarios from '@/views/Prontuarios/Home'
import Account from '@/views/Auth/Account'
import Login from '@/views/Auth/Login'
import Exams from '@/views/Exams/Home'
import RegisteredExames from '@/views/Exams/RegisteredExams'


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
      path: '/caixa',
      name: 'Caixa',
      component: Caixa,
      meta : {
        requiresAuth: true
      }
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
      path: '/prontuarios',
      name: 'Prontuarios',
      component: Prontuarios,
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
  ]
})

export default router

