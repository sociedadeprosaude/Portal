import Home from "../views/operational/Cashier/Cashier";
import Orçamento from "../views/operational/Cashier/Budget";
import Saidas from "../views/operational/Cashier/Outflows";
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
