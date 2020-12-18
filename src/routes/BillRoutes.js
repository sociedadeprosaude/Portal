import OuttakesCategories from "../views/Financial/OuttakesCategories"
import BillsMobile from "../views/Financial/BillsMobile";
import PaidBillMobile from "../components/Bills/Mobile/PaidBillsMobile"
import RegisterBillMobile from "../components/Bills/Mobile/RegisterBillMobile"
import OuttakeOrderMobile from "../components/Reports/Mobile/OuttakeOrderMobile";

export default [

    {
        path: '/pagamento/financeiro',
        name: 'BillsMobile',
        component: BillsMobile,
        meta: {
            requiresAuth: false,
        },
        children: [
            {
                path: 'categorias',
                component: OuttakesCategories,
            },
            {
                path: 'registro',
                component: RegisterBillMobile,
            },
            {
                path: 'pagos',
                component: PaidBillMobile,
            },
            {
                path: 'pendentes',
                component: OuttakeOrderMobile,
            },

        ]
    },
]