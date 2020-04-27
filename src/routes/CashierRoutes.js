import Home from "../views/operational/Cashier/Cashier";
import Budget from "../views/operational/Cashier/Budget";
import Outflows from "../views/operational/Cashier/Outflows";
import Bundles from "../views/operational/Cashier/Bundles";

export default [
    {
        path: '/caixa',
        name: 'home',
        component: Home
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
