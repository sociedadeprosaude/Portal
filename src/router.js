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
import NewBundles from "./views/Register/Bundle/NewBundles";
import PaymentCovenants from "./views/Register/PaymentCovenants";
import PaymentMedics from "./views/Register/PaymentMedics";

import ContestValue from "./views/Notifications/contestValues"

import oldDoctors from "./views/Register/oldDoctors";
import Doctors from "./views/Register/Doctors";
import oldClinics from "./views/Register/oldClinics";
import Clinics from "./views/Register/Clinics";
import RegisterNewUserClinic from "./views/Register/Clinic/RegisterClinic"
import DischargeProcedures from "./views/Register/Clinic/DischargeProcedures"
import VerificationForwardingBilling from "./views/Register/Clinic/VerificationForwardingBilling"
import PaymentHistory from "./views/Register/Clinic/PaymentHistoryClinic"
import Units from "./views/Units";
import Bills from "./views/Register/Bills";
import BillsRoute from "./views/Register/BillsRoute";
import BillsMobile from "./views/Register/BillsMobile";
import OuttakesCategories from "./views/Register/OuttakesCategories";

import DoctorScheduling from './views/Operational/DoctorsAgenda/DoctorScheduling'

import MedicalCare from "./views/DoctorAttendance/MedicalCare";
import Attendance from "./views/DoctorAttendance/Attendance";
import TicketsDashboard from "./views/Operational/Tickets/TicketsDashboard";
import TicketsDashboardRoute from "./views/Operational/Tickets/TicketsDashboardRoute";
import RoomDashboard from "./views/Operational/Tickets/RoomDashboard";
import RoomDashboardRoute from "./views/Operational/Tickets/RoomDashboardRoute";


import DoctorsAgendaRoutes from "./routes/DoctorsAgendaRoutes"
import CashierRoutes from "./routes/CashierRoutes";
import discount from "./views/Notifications/discount"
import notifications from "./views/Notifications/notifications";

import RelatoriosDashboard from "@/views/relatorios/RelatoriosDashboard";

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
    meta: {
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
    meta: {
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
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/relatorios',
    name: 'RelatoriosDashboard',
    component: RelatoriosDashboard,
    beforeEnter(to, from, next) {
      store.commit('showOverviewToggle', true)
      next()
    },

  },
  {
    path: '/relatorio',
    name: 'Relatorios',
    component: Reports,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/discount',
    name: 'discount',
    component: discount,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/exams',
    name: 'Exames',
    component: Exams,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/specialties',
    name: 'Specialties',
    component: Specialties,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/labor',
    name: 'labor',
    component: Labor,
    meta: {
      requiresAuth: false
    }
  },

  {
    path: '/olddoctors',
    name: 'olddoctors',
    component: oldDoctors,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/doctors',
    name: 'doctors',
    component: Doctors,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/oldclinics',
    name: 'oldClinics',
    component: oldClinics,
    meta: {
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
    path: '/VerificacaoEncaminhamentos',
    name: 'VerificationForwardingBilling',
    component: VerificationForwardingBilling,
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: '/HistoricoDePagamentos',
    name: 'PaymentHistory',
    component: PaymentHistory,
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
    component: Units,
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: '/pagamento/financeiro',
    name: 'bills',
    //component: Bills,
    component: BillsRoute,
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: '/BillsMobile',
    name: 'BillsMobile',
    component: BillsMobile,
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: '/Categorias',
    name: 'OuttakesCategories',
    component: OuttakesCategories,
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: '/pagamento/convenio',
    name: 'PaymentCovenants',
    component: PaymentCovenants,
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: '/pagamento/medicos',
    name: 'PaymentMedics',
    component: PaymentMedics,
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: '/MedicalCare',
    name: 'MedicalCare',
    component: MedicalCare,
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: '/Attendance',
    name: 'Attendance',
    component: Attendance,
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: '/senhas',
    name: 'Tickets',
    //component : TicketsDashboard,
    component: TicketsDashboardRoute,
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: '/senhas/:sector_name',
    name: 'Roons',
    //component: RoomDashboard,
    component: RoomDashboardRoute,
    meta: {
      requiresAuth: false,
    }
  },

  {
    path: '/notifications',
    name: 'Notifications',
    component: notifications,
    meta: {
      requiresAuth: false,
    },
  },

  {
    path: '/agendamento',
    name: 'doctorScheduling',
    component: DoctorScheduling,
    meta: {
      requiresAuth: false,
    },
  },
];

let routes = mainRoutes.concat(DoctorsAgendaRoutes, CashierRoutes);
let router = new Router({
  mode: 'history',
  routes: routes
});

router.afterEach((to, from, next) => {
  let permissions = [
    {
      id: 0,
      name: 'All:',
      children: [],
    }
  ]
  for (let i in routes) {
    let holder = {
      id: routes[i].name,
      name: routes[i].name,
      path: routes[i].path,
    }
    permissions[0].children.push(holder)
  }
  store.commit('Setpermissions', permissions);
  if (to.path.includes('agenda')) {
    store.commit('setDoctorsAgendaToolbar', true)
  } else {
    store.commit('setDoctorsAgendaToolbar', false)
  }
  if (from.name == 'RelatoriosDashboard') store.commit('showOverviewToggle', false)
  if (to.path.includes('pagamento')) {
    store.commit('setBillsToolbar', true)
  } else {
    store.commit('setBillsToolbar', false)
  }
});

export default router

