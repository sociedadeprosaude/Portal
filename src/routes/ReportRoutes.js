
import store from "../store/store"

import RelatoriosDashboard from "@/views/relatorios/RelatoriosDashboard";

import GeneralReport from "@/views/relatorios/GeneralReport";


export default [

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
        path: '/relatorios/GeneralReport',
        name: 'GeneralReport',
        component: GeneralReport,
        beforeEnter(to, from, next) {
            store.commit('showOverviewToggle', true)
            next()
        },

    },

]
