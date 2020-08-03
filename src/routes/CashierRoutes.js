import Budget from "../views/Operational/Cashier/Budget";
import Cashier from "../views/Operational/Cashier/Cashier";
import PayOnline from "../views/Operational/Cashier/PayOnline";
import Bundles from '@/views/Register/Bundles'


export default [
    {
        path: '/caixa',
        name: 'home',
        component: Cashier
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
