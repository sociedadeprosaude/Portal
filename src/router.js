import Vue from 'vue'
import Router from 'vue-router'
import store from "./store/store"
import Home from '@/views/Home'
import Account from '@/views/Auth/Account'
import Login from '@/views/Auth/Login'
import Register from '@/views/Auth/Register'
import Exams from "./views/Register/Exams";
import Specialties from "./views/Register/Specialties";
import Labor from "./views/Personal/Labor";
import Reports from "./views/Register/Reports";
import Bundles from "./views/Register/Bundles";
import NewBundles from "./views/Register/Bundle/NewBudget";
import PaymentCovenants from "./views/Register/PaymentCovenants";
import ContestValue from "./views/Notifications/contestValues"

import Doctors from "./views/Register/Doctors";
import Clinics from "./views/Register/Clinics";
import RegisterNewUserClinic from "./views/Register/Clinic/RegisterClinic"
import DischargeProcedures from "./views/Register/Clinic/DischargeProcedures"
import Units from "./views/Units";
import Bills from "./views/Register/Bills";

import DoctorScheduling from './views/DoctorScheduling'

import MedicalCare from "./views/DoctorAttendance/MedicalCare";
import TicketsDashboard from "./views/Operational/Tickets/TicketsDashboard";


import DoctorsAgendaRoutes from "./routes/DoctorsAgendaRoutes"
import CashierRoutes from "./routes/CashierRoutes";
import discount from "./views/Notifications/discount"
import notifications from "./views/Notifications/notifications";

import weeklyTable from "./views/Operational/WeeklyTable/weeklyTable";
const Clinic = {
  props: ['id'],
  template: '<div>Clinic {{ id }}</div>'
}
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
    path: '/ContestValueAlert',
    name: 'ContestValue',
    component: ContestValue,
    meta : {
      requiresAuth: true
    }
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
    path: '/specialties',
    name: 'Specialties',
    component: Specialties,
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
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/clinics/RegisterNewUserClinic/Clinic/:id',
    name: 'RegisterNewUserClinic',
    component: RegisterNewUserClinic,
    props: true,
    meta: {
      requiresAuth: false,
    }
  },

  {
    path: '/DischargeProcedures',
    name: 'DischargeProcedures',
    component: DischargeProcedures,
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: '/bundlesNew',
    name: 'bundles',
    component: Bundles,
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: '/bundles',
    name: 'Newbundles',
    component: NewBundles,
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
    path: '/PaymentCovenants',
    name: 'PaymentCovenants',
    component : PaymentCovenants,
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
    path: '/weeklyTable',
    name: 'weeklyTable',
    component : weeklyTable,
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: '/senhas',
    name: 'Tickets',
    component : TicketsDashboard,
    meta: {
      requiresAuth: false,
    }
  },

  {
    path: '/notifications',
    name: 'Notifications',
    component : notifications,
    meta: {
      requiresAuth: false,
    },
  },

  {
    path: '/agendamento',
    name: 'doctorScheduling',
    component : DoctorScheduling,
    meta: {
      requiresAuth: false,
    },
  },
];

let routes = mainRoutes.concat(DoctorsAgendaRoutes, CashierRoutes);
let router =  new Router({
  mode: 'history',
  routes: routes
});

router.afterEach((to, from, next) => {
  if (to.path.includes('agenda')) {
    store.commit('setDoctorsAgendaToolbar', true)
  } else {
    store.commit('setDoctorsAgendaToolbar', false)
  }
});

export default router

