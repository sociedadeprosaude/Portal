import AgendamentoConsultas from "../views/operational/DoctorsAgenda/SchedulingConsultation";
import CadastroConsultasPlantoes from "../views/operational/DoctorsAgenda/RegistrationConsultationsShifts";
import DeletarConsultas from "../views/operational/DoctorsAgenda/DeletarConsultas";
import GerenciamentoConsultas from "../views/operational/DoctorsAgenda/GerenciamentoConsultas";
import ConsultasPacientes from "../views/operational/DoctorsAgenda/PatientConsultations";
import ConsultasCanceladas from "../views/operational/DoctorsAgenda/CanceledConsultations";
import RemarcarConsultas from "../views/operational/DoctorsAgenda/RemarcarConsultas";
import AgendarRetorno from "../views/operational/DoctorsAgenda/ScheduleReturn";
import Cids from "../views/operational/DoctorsAgenda/Cids";
import Declaration from "../views/operational/DoctorsAgenda/Declaration";
import Teste from "../views/operational/DoctorsAgenda/testescrolling";
import Patient from "../views/operational/DoctorsAgenda/Patient";
import Discount from "../views/discount"

export default [
    {
        path: '/agenda/agendamento',
        name: 'AgendamentoConsultas',
        component: AgendamentoConsultas
    },
    {
        path: 'discount',
        name: 'discont',
        component: Discount
    },
    {
        path: '/agenda/CadastroConsultasPlantoes',
        name: 'CadastroConsultasPlantoes',
        component: CadastroConsultasPlantoes
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
        component: ConsultasPacientes,
        props: (route) => ({ query: route.query.q }),
    },
    {
        path:'/agenda/ConsultasCanceladas',
        name:'ConsultasCanceladas',
        component: ConsultasCanceladas,
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
        component: AgendarRetorno,
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
