
import store from "../store/store"

import RelatoriosDashboard from "@/views/relatorios/RelatoriosDashboard";


export default [

    {
        path: '/relatorios/:idReport',
        name: 'RelatoriosDashboard',
        component: RelatoriosDashboard,
        beforeEnter(to, from, next) {
            store.commit('showOverviewToggle', true)
            next()
        },
    },
    {
        path: '/relatorios',
        name: 'RelatoriosDashboard',
        component: RelatoriosDashboard,
        beforeEnter(to, from, next) {
            next("relatorios/RelatorioGeral")
        },
    },

]
