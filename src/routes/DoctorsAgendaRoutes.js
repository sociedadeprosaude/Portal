import CanceledConsultations from "../views/operational/DoctorsAgenda/CanceledConsultations";
import Cids from "../views/operational/DoctorsAgenda/Cids";
import Declaration from "../views/operational/DoctorsAgenda/Declaration";
import DeletarConsultas from "../views/operational/DoctorsAgenda/DeletarConsultas";
import GerenciamentoConsultas from "../views/operational/DoctorsAgenda/GerenciamentoConsultas";
import PatientConsultations from "../views/operational/DoctorsAgenda/PatientConsultations";
import RegistrationConsultationsShifts from "../views/Register/RegistrationConsultationsShifts";
import SchedulingConsultation from "../views/operational/DoctorsAgenda/SchedulingConsultation";
import Teste from '../views/operational/DoctorsAgenda/testescrolling'
import RemarcarConsultas from "../views/operational/DoctorsAgenda/RemarcarConsultas";
import ScheduleReturn from "../views/operational/DoctorsAgenda/ScheduleReturn";


import Discount from "../views/Notifications/discount"

export default [
    {
        path: '/agenda/agendamento',
        name: 'AgendamentoConsultas',
        component: SchedulingConsultation
    },
    {
        path: 'discount',
        name: 'discont',
        component: Discount
    },
    {
        path: '/agenda/CadastroConsultasPlantoes',
        name: 'CadastroConsultasPlantoes',
        component: RegistrationConsultationsShifts
    },
    {
        path: '/agenda/DeletarConsultas',
        name: 'DeletarConsultas',
        component: DeletarConsultas
    },
    {
        path: '/agenda/GerenciamentoConsultas',
        name: 'GerenciamentoConsultas',
        component: GerenciamentoConsultas
    },
    {
        path: '/agenda/ConsultasPacientes',
        name: 'ConsultasPacientes',
        component: PatientConsultations,
        props: (route) => ({ query: route.query.q }),
    },
    {
        path:'/agenda/ConsultasCanceladas',
        name:'ConsultasCanceladas',
        component: CanceledConsultations,
    },
    {
        path:'/agenda/RemarcarConsultas',
        name:'RemarcarConsultas',
        component: RemarcarConsultas,
        props: (route) => ({ query: route.query.q }),
    },
    {
        path: '/agenda/AgendarRetorno',
        name: 'AgendarRetorno',
        component: ScheduleReturn,
        props: (route) => ({ query: route.query.q }),
    },
    {
        path: '/agenda/Cids',
        name: 'Cids',
        component: Cids,
    },
    {
        path: '/agenda/Declaration',
        name: 'Declaration',
        component: Declaration,
    },
    {
        path: '/agenda/teste',
        name: 'Declaration',
        component: Teste,
    }
]
