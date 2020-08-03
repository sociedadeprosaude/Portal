import Budget from "../views/Operational/Cashier/Budget";
import Cashier from "../views/Operational/Cashier/Cashier";
import CashierReports from "@/views/Statistics/StatisticsDashboard";
import PayOnline from "../views/Operational/Cashier/PayOnline";
import StatsCaixa from '../views/Statistics/statsCaixa'
import Bundles from "@/views/Register/Bundles";

import store from "../store/store"

export default [
    {
        path: '/caixa',
        name: 'home',
        component: Cashier
    },
    {
        path: '/caixa2',
        name: 'CashierReports',
        component: CashierReports,
        beforeEnter(to, from, next) {
            store.commit('showOverviewToggle',true)
            next()
        },
      
    },
    {
        path: '/charts',
        name: 'Charts',
        component: StatsCaixa
    },
    {
        path: '/pagamentoOnline/:id',
        name: 'PayOnline',
        component: PayOnline
    },
    {
        path: '/caixa/Orçamento',
        name: 'orçamento',
        component: Budget
    },
]
