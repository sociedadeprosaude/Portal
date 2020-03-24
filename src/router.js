import Vue from 'vue'
import Router from 'vue-router'
import store from "./store/store"
import Home from '@/views/Home'
import Account from '@/views/Auth/Account'
import Login from '@/views/Auth/Login'
import Register from '@/views/Auth/Register'
import Exams from '@/views/Exams'
import Labor from '@/views/Labor/Home'
import Reports from '@/views/Reports'
import Bundles from '@/views/Cashier/Bundles'

import Doctors from '@/views/Doctors'
import Clinics from "@/views/Clinics"
import Units from "./views/Units";
import Bills from "./views/Bills";

import MedicalCare from "./views/MedicalCare";
import Attendance from "./views/Attendance";
import Tickets from "./views/Tickets";
import CardEditor from "./views/CardEditor";

import DoctorsAgendaRoutes from "./routes/DoctorsAgendaRoutes"
import CashierRoutes from "./routes/CashierRoutes";
import discount from "./views/discount"


Vue.use(Router);
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
    path: '/discount',
    name: 'discount',
    component: discount,
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
  {
    path: '/bundles',
    name: 'bundles',
    component : Bundles,
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: '/units',
    name: 'units',
    component : Units,
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: '/bills',
    name: 'bills',
    component : Bills,
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: '/MedicalCare',
    name: 'MedicalCare',
    component : MedicalCare,
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: '/Attendance',
    name: 'Attendance',
    component : Attendance,
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: '/senhas',
    name: 'Tickets',
    component : Tickets,
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: '/editor',
    name: 'Editor',
    component : CardEditor,
    meta: {
      requiresAuth: false,
    }
  },
]

let routes = mainRoutes.concat(DoctorsAgendaRoutes, CashierRoutes)
let router =  new Router({
  mode: 'history',
  routes: routes
})

router.afterEach((to, from, next) => {
  if (to.path.includes('agenda')) {
    store.commit('setDoctorsAgendaToolbar', true)
  } else {
    store.commit('setDoctorsAgendaToolbar', false)
  }
})

export default router

