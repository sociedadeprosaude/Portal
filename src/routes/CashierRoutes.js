import Bundles from "../views/Register/Bundles"
import Budget from "../views/operational/Cashier/Budget";
import Cashier from "../views/operational/Cashier/Cashier";
import Outflows from "../views/Register/Outflows";

export default [
    {
        path: '/caixa',
        name: 'home',
        component: Cashier
    },
    {
        path:'/caixa/Orçamento',
        name:'orçamento',
        component: Budget
    },

    {
        path:'/caixa/Saidas',
        name:'Saidas',
        component: Outflows
    },
    {
        path:'/caixa/Bundles',
        name:'Bundles',
        component: Bundles
    },
]
