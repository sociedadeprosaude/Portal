import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'


import Users from '@/store/modules/Users'
import Exams from '@/store/modules/Exams'
import Auth from '@/store/modules/Auth'
import Labor from '@/store/modules/Labor'
import Reports from './modules/Reports'
import FavoriteRoom from "./modules/local/FavoriteRoom";
import Localization from "./modules/Localization"
import Bundles from "./modules/Bundles";
import Clinics from "./modules/Clinics"
import LayoutControl from "./modules/local/LayoutControl";
import Specialties from "./modules/Specialties";
import ShoppingCart from "./modules/local/ShoppingCart";
import ItemsPackage from "./modules/local/ItemsPackage";
import LocalUnit from "./modules/local/Unit";
import Tickets from "./modules/Tickets";
import alertNotifications from "./modules/alertNotifications";

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
    key: 'vuex',
    storage: window.localStorage,
    modules: ['Auth', 'LocalUnit', 'ShoppingCart', 'FavoriteRoom'],
});

const store = new Vuex.Store({
    plugins: [vuexLocal.plugin],

    modules: {
        Auth,
        Users,
        Reports,
        Labor,
        FavoriteRoom,
        Localization,
        Clinics,
        Exams,
        LayoutControl,
        Bundles,
        Specialties,
        ShoppingCart,
        ItemsPackage,
        LocalUnit,
        Tickets,
        alertNotifications,
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
