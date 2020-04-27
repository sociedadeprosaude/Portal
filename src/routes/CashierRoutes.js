import Home from "../views/Cashier/Cashier";
import Orçamento from "../views/Cashier/Budget";
import Saidas from "../views/Cashier/Outflows";
import Bundles from "../views/Cashier/Bundles";

export default [
    {
        path: '/caixa',
        name: 'home',
        component: Home
    },
    {
        path:'/caixa/Orçamento',
        name:'orçamento',
        component: Orçamento
    },

    {
        path:'/caixa/Saidas',
        name:'Saidas',
        component: Saidas
    },
    {
        path:'/caixa/Bundles',
        name:'Bundles',
        component: Bundles
    },
]
