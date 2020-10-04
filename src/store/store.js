import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'


import Users from '@/store/modules/Users'
import Exams from '@/store/modules/Exams'
import Auth from '@/store/modules/Auth'
import Labor from '@/store/modules/Labor'
import Reports from './modules/Reports'
import FavoriteRoom from "./modules/local/FavoriteRoom";
import AddInformationInConsultation from "./modules/AddInformationInConsultation";
import Cids from "./modules/Cids";
import Medicines from "./modules/Medicines";
import Localization from "./modules/Localization"
import Bundles from "./modules/Bundles";
import Doctors from "./modules/Doctors"
import Clinics from "./modules/Clinics"
import Consultations from "./modules/Consultations";
import LayoutControl from "./modules/local/LayoutControl";
import Specialties from "./modules/Specialties";
import Saidas from "./modules/Outflows"
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
import alertNotifications from "./modules/alertNotifications";
import Schedule from "./modules/schedule"
import PagSeguro from "./modules/PagSeguro"
import Statistics from "./modules/Statistics"

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
    key: 'vuex',
    storage: window.localStorage,
    modules: ['LocalUnit', 'ShoppingCart', 'FavoriteRoom'],

    // reducer: (state) => ({
    //     selectedPatient: state.selectedPatient,
    //     items: state.items,
    // })
});

const store = new Vuex.Store({
    plugins: [vuexLocal.plugin],

    modules: {
        Auth,
        Users,
        Reports,
        Labor,
        Cids,
        AddInformationInConsultation,
        FavoriteRoom,
        Localization,
        Doctors,
        Clinics,
        Exams,
        Consultations,
        LayoutControl,
        Bundles,
        Specialties,
        Saidas,
        Medicines,
        Budget,
        ShoppingCart,
        ItemsPackage,
        Operational,
        LocalUnit,
        Outtakes,
        Intakes,
        Storage,
        Tickets,
        Discount,
        alertNotifications,
        Schedule,
        PagSeguro,
        Statistics
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
