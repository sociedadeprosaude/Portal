import AgendamentoConsultas from "../views/DoctorsAgenda/AgendamentoConsultas";
import CadastroConsultasPlantoes from "../views/DoctorsAgenda/CadastroConsultasPlantoes";
import Medicos from "../views/DoctorsAgenda/Medicos";
import Pacientes from "../views/DoctorsAgenda/Pacientes";
import DeletarConsultas from "../views/DoctorsAgenda/DeletarConsultas";
import GerenciamentoConsultas from "../views/DoctorsAgenda/GerenciamentoConsultas";
import ConsultasMedicos from "../views/DoctorsAgenda/ConsultasMedicos";
import ConsultasPacientes from "../views/DoctorsAgenda/ConsultasPacientes";
import ConsultasCanceladas from "../views/DoctorsAgenda/ConsultasCanceladas";
import RemarcarConsultas from "../views/DoctorsAgenda/RemarcarConsultas";
import AgendarRetorno from "../views/DoctorsAgenda/AgendarRetorno";
import Cids from "../views/DoctorsAgenda/Cids";
import Declaration from "../views/DoctorsAgenda/Declaration";
import Teste from "../views/DoctorsAgenda/testescrolling";

export default [
    {
        path: '/agenda/agendamento',
        name: 'AgendamentoConsultas',
        component: AgendamentoConsultas
    },
    {
        path: '/agenda/CadastroConsultasPlantoes',
        name: 'CadastroConsultasPlantoes',
        component: CadastroConsultasPlantoes
    },
    {
        path: '/agenda/Medicos',
        name: 'Medicos',
        component: Medicos
    },
    {
        path: '/agenda/Pacientes',
        name: 'Pacientes',
        component: Pacientes
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
        path: '/agenda/ConsultasMedicos',
        name: 'ConsultasMedicos',
        component: ConsultasMedicos
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