import Bundles from "../views/Register/Bundles"
import Budget from "../views/Operational/Cashier/Budget";
import Cashier from "../views/Operational/Cashier/Cashier";
import PayOnline from "../views/Operational/Cashier/PayOnline";
import Outflows from "../views/Register/Outflows";


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

    {
        path: '/caixa/Saidas',
        name: 'Saidas',
        component: Outflows
    },
    {
        path: '/caixa/Bundles',
        name: 'Bundles',
        component: Bundles
    },
]
