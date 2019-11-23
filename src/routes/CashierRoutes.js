import Home from "../views/Cashier/Home";
import Cadastrar from "../views/Cashier/Cadastrar";
import Orçamento from "../views/Cashier/Orçamento";
import Relatorio from "../views/Cashier/Relatorio";
import Consultas from "../views/Cashier/Consultas";
import Exames from "../views/Cashier/Exames";
import Saidas from "../views/Cashier/Saidas";
import Bundles from "../views/Cashier/Bundles";
import Clinics from "../views/Cashier/Clinics";

export default [
    {
        path: '/caixa',
        name: 'home',
        component: Home
    },
    {
        path:'/caixa/Cadastrar',
        name:'cadastrar',
        component: Cadastrar
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
        path:'/caixa/Consultas',
        name:'Consultas',
        component: Consultas
    },
    {
        path:'/caixa/Exames',
        name:'Exames',
        component: Exames
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
    {
        path:'/caixa/Clinics',
        name:'Clinics',
        component: Clinics
    },
]
