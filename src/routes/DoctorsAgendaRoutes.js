import CanceledConsultations from "../views/Operational/DoctorsAgenda/CanceledConsultations";
import Cids from "../views/Operational/DoctorsAgenda/Cids";
import Declaration from "../views/Operational/DoctorsAgenda/Declaration";
import DeletarConsultas from "../views/Operational/DoctorsAgenda/DeleteConsultations";
import NewGerenciamentoConsultas from "../views/Operational/NewDorctorsAgenda/ManagementConsultationsNew";
import PatientConsultationsNew from "../views/Operational/NewDorctorsAgenda/PatientConsultationsNew";
import RegistrationConsultationsShifts from "../views/Register/RegistrationConsultationsShifts";
//import SchedulingConsultation from "../views/Operational/DoctorsAgenda/SchedulingConsultation";
import RemarcarConsultas from "../views/Operational/DoctorsAgenda/RescheduleConsultations";
import ScheduleReturn from "../views/Operational/DoctorsAgenda/ScheduleReturn";
import DoctorScheduling from '../views/Operational/DoctorsAgenda/DoctorScheduling'

import Discount from "../views/Notifications/discount"

export default [
    {
        path: '/agenda/agendamento',
        name: 'AgendamentoConsultas',
        component: DoctorScheduling
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
        name: 'NewGerenciamentoConsultas',
        component: NewGerenciamentoConsultas
    },
    {
        path: '/agenda/ConsultasPacientes',
        name: 'PatientConsultationsNew',
        component: PatientConsultationsNew,
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
    }
]
