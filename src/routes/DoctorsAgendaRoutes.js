import CanceledConsultations from "../views/Operational/DoctorsAgenda/CanceledConsultations";
import Cids from "../views/Operational/DoctorsAgenda/Cids";
import Declaration from "../views/Operational/DoctorsAgenda/Declaration";
import NewGerenciamentoConsultas from "../views/Operational/NewDorctorsAgenda/ManagementConsultationsNew";
import PatientConsultationsNew from "../views/Operational/NewDorctorsAgenda/PatientConsultationsNew";
import DoctorScheduling from '../views/Operational/DoctorsAgenda/DoctorScheduling'
import ManagementSchedules from '../views/Operational/DoctorsAgenda/ManagementSchedules'
import Discount from "../views/Notifications/discount"
import weeklyTable from "../views/Operational/DoctorsAgenda/weeklyTable";
import HistoryMedicalRecorsPatient from "../views/Operational/DoctorsAgenda/HistoryMedicalRecorsPatient";

export default [
    {
        path: '/agenda/TabelaSemanal',
        name: 'weeklyTable',
        component : weeklyTable,
        meta: {
          requiresAuth: false,
        }
    },
    {
        path: '/agenda/HistoricoDeProntuariosDoPaciente',
        name: 'HistoryMedicalRecorsPatient',
        component : HistoryMedicalRecorsPatient,
        meta: {
            requiresAuth: false,
        }
    },
    {
        path: '/agenda/agendamento',
        name: 'AgendamentoConsultas',
        component: DoctorScheduling,
        props: (route) => ({ query: route.query }),
    },
    {
        path: 'discount',
        name: 'discont',
        component: Discount
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
        path: '/agenda/GerenciarAgendas',
        name: 'managementSchedules',
        component: ManagementSchedules,
    }
]
