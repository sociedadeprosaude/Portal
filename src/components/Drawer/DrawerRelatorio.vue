<template>
    <v-navigation-drawer
            hide-overlay
            :right="false"
            v-model="overviewDrawer"
            temporary
            disable-resize-watcher
            app
            dark
            clipped
    >
        <v-list dense>
            <v-list-item
                    v-for="(item,index) in items"
                    :key="index"
                    link
                    @click="$router.push({name:'RelatoriosDashboard',params:{idReport:item.link}}),$emit('change-selected',index), overviewDrawer=false"
            >
                <v-list-item-content>
                    <v-list-item-title>{{item.txt}}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>

export default {
  props: [],
  data() {
    return {
      selected: 0,
      items: [
        {
          txt: "Relatório Financeiro Geral",
          link: "RelatorioGeral"
        },
        {
          txt: "Relatório Luiz Fernando",
          link: "RelatorioLuizFernando"
        },
        {
          txt: "Produção do Colaborador",
          link: "RelatorioColaboradoresProducao"
        },
        {
          txt: "Relatório de Vendas",
          link: "RelatorioEntradas"
        },
        {
          txt: "Analise de preço de exames",
          link: "RelatorioAnaliseProcedimentosAnalise"
        },
        {
          txt: "Exames mais vendidos",
          link: "RelatorioExamesMaisVendidos"
        },
        {
          txt: "Consultas mais vendidas",
          link: "RelatorioConsultasMaisVendidas"
        },
        {
          txt: "Relatório de Saídas",
          link: "RelatorioSaidas"
        },
        {txt: "Novos associados", link: "RelatorioNovosUsuarios"},
        {
          txt: "Relatório Especialidades",
          link: "RelatorioSpecialidadesFeitas"
        },
        {
          txt: "Relatório Consulta Marcada x Realizada",
          link: "RelatorioConsultasAgendadas"
        },
        {
          txt: "Relatorio Paciente por Procedimento",
          link: "RelatorioClientesPorProcedimento"
        },
        {txt: "Intakes", link: "RelatorioEntradasEstatistica"},
        {
          txt: "Outtakes",
          link: "RelatorioSaidasCategoriaEstatistica"
        },
        {
          txt: "Outtakes clinicas",
          link: "RelatorioSaidasClinicasEstatisticas"
        },
        {txt: "Clientes", link: "RelatorioClientesEstatisticas"},
        {txt: "Relatorio de Atendimentos por Colaboradores", link: "RelatorioAtendimentosColaboradores"},
        {
          txt: "Statisticas Orcamentos",
          link: "StatisticasOrcamento"
        },
        {
          txt: "Pacientes por Bairro",
          link: "StatisticPatientsGeoPoint"
        },
        {
          txt: "Orçamentos Não Comprados",
          link: "PatientsBudgets"
        },
        {
          txt: "Pacientes",
          link: "Patients"
        },
        {
          txt: "Consultas do Médico",
          link: "ConsultationsByDoctor"
        },
      ],
    };
  },

  computed: {
    overviewDrawer: {
      get() {
        return this.$store.getters.overviewDrawer;
      },
      set(val) {
        this.$store.dispatch("overviewToggle", val);
      }
    }
  }
}
</script>

<style>
</style>