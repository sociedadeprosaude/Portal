import Home from "../views/Cashier/Cashier";
import Orçamento from "../views/Cashier/Budget";
import Relatorio from "../views/Cashier/Relatorio";
import Saidas from "../views/Cashier/Saidas";
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
        path:'/caixa/Relatorio',
        name:'relatorio',
        component: Relatorio
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
