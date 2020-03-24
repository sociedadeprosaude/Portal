import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from '../router'
import constants from '@/utils/constants'
import VuexPersistence from 'vuex-persist'

import Users from '@/store/modules/Users'
import Exams from '@/store/modules/Exams'
import Auth from '@/store/modules/Auth'
import Labor from '@/store/modules/Labor'
import Reports from './modules/Reports'

import Localization from "./modules/Localization"
import Bundles from "./modules/Bundles";
import Doctors from "./modules/Doctors"
import Clinics from "./modules/Clinics"
import Consultations from "./modules/Consultations";
import LayoutControl from "./modules/local/LayoutControl";
import Specialties from "./modules/Specialties";
import Saidas from "./modules/Saidas"
import Budget from "./modules/Budget"
import ShoppingCart from "./modules/local/ShoppingCart";
import Operational from "./modules/Operational";
import ItemsPackage from "./modules/local/ItemsPackage";
import LocalUnit from "./modules/local/Unit";
import Outtakes from "./modules/Outtakes";
import Intakes from "./modules/Intakes";
import Storage from "./modules/Storage";
import Discount from "./modules/Discount"
import Tickets from "./modules/Tickets";


Vue.use(Vuex);

if (process.env.NODE_ENV === 'development') {
    // var AUTH_URL = 'http://prosaude.auth/'
    var AUTH_URL = 'http://caixa.instituicaoprosaude.com:83/'
} else {
    var AUTH_URL = 'http://caixa.instituicaoprosaude.com:83/'
}

const vuexLocal = new VuexPersistence({
    storage: window.localStorage,
    modules: ['LocalUnit']
})

const store = new Vuex.Store({
    // plugins: [vuexLocal.plugin],
    modules: {
        Auth,
        Users,
        Reports,
        Labor,
        Localization,
        Doctors,
        Clinics,
        Exams,
        Consultations,
        LayoutControl,
        Bundles,
        Specialties,
        Saidas,
        Budget,
        ShoppingCart,
        ItemsPackage,
        Operational,
        LocalUnit,
        Outtakes,
        Intakes,
        Storage,
        Tickets,
        Discount
    },

    state: {
        isOnline: false
    },
    mutations: {
        setIsOnline(state, payload) {
            state.isOnline = payload
        }
    },
    actions: {
        startConnectionListener(context) {
            setInterval(() => {
                context.commit('setIsOnline', navigator.onLine)
            }, 2000)
        }
    },
    getters: {
        isOnline(state) {
            return state.isOnline
        }
    }
});

export default store
