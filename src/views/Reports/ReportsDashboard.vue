<template>
  <v-container fluid>
    <DrawerRelatorio @change-selected="(value)=>{selected=value;searchView()}" />

<!--    <DateSelector-->
<!--      v-if="!hide"-->
<!--      :cb="()=>searchView()"-->
<!--      :loadingFather="loading"-->
<!--      @change-date="(value)=>date=value"-->
<!--      @change-date2="(value)=>date2=value"-->
<!--      @change-dateFormatted="(value)=>dateFormatted=value"-->
<!--      @change-dateFormatted2="(value)=>dateFormatted2=value"-->
<!--    />-->

    <general-report
      v-if="selected == 0"
    />

    <luiz-fernando-report
      v-else-if="selected == 1"
      :report="formattedReport"
      :loading="loading"
      :intakes="intakes"
      :reportAllUnits="formattedReportAllUnits"
    />

    <colaborators-production-report v-if="selected == 2"></colaborators-production-report>

    <intakes-report
      v-else-if="selected == 3"
      :report="formattedReport"
      :loading="loading"
      :intakes="intakes"
    />

    <procedures-prices-analises v-else-if="selected == 4" :loading="loading" />
    <best-selling-exams-report
      v-else-if="selected == 5"
      :date="dateBegin"
      :date2="dateEnd"
      :loading="loading"
    />

    <BestSellingConsultationsReport
      v-else-if="selected == 6"
      :date="dateBegin"
      :date2="dateEnd"
      :loading="loading"
    />

    <OuttakesReport
      v-else-if="selected == 7"
      :date="dateBegin"
      :date2="dateEnd"
      :cb="()=>searchView()"
      :loading="loading"
    />
    <NewUsersReport
      v-else-if="selected == 8"
      :date="dateBegin"
      :date2="dateEnd"
      :todayNewUsers="todayNewUsers"
      :loading="loading"
    />
    <SpecialtiesMadeReport
      v-else-if="selected == 9"
      :report="formattedReport"
      :loading="loading"
      :intakes="intakes"
    />
    <ConsultationScheduledExecuted
      v-else-if="selected == 10"
      :report="formattedReport"
      :loading="loading"
      :intakes="intakes"
    />
    <CustomersPerProcedureReport
      v-else-if="selected == 11"
      :report="formattedReport"
      :loading="loading"
    />

    <statsCaixaIntakes v-else-if="selected == 12"></statsCaixaIntakes>
    <statsCaixaOuttakesCategory v-else-if="selected == 13"></statsCaixaOuttakesCategory>
    <statsCaixaOuttakesClinics v-else-if="selected == 14"></statsCaixaOuttakesClinics>
    <Clients v-else-if="selected == 15"></Clients>
    <EmployeeServiceReport v-else-if="selected == 16"></EmployeeServiceReport>
    <statistics-budgets v-else-if="selected == 17"></statistics-budgets>
    <statistic-patients-geo-point v-else-if="selected == 18"></statistic-patients-geo-point>
    <patients-budgets v-else-if="selected == 19"></patients-budgets>
  </v-container>
</template>

<script>
import GeneralReport from "@/views/Reports/GeneralReport";
import LuizFernandoReport from "@/views/Reports/LuizFernandoReport";
import ColaboratorsProductionReport from "@/views/Reports/ColaboratorsProductionReport";
import IntakesReport from "@/views/Reports/IntakesReport";
import ProceduresPricesAnalises from "@/views/Reports/ProceduresPricesAnalises";
import BestSellingExamsReport from "@/views/Reports/BestSellingExamsReport";
import BestSellingConsultationsReport from "@/views/Reports/BestSellingConsultationsReport";
import OuttakesReport from "@/views/Reports/OuttakesReport";
import NewUsersReport from "@/views/Reports/NewUsersReport";
import SpecialtiesMadeReport from "@/views/Reports/SpecialtiesMadeReport";
import ConsultationScheduledExecuted from "@/views/Reports/ConsultationScheduledExecuted";
import CustomersPerProcedureReport from "@/views/Reports/CustomersPerProcedureReport";
import statsCaixaIntakes from "@/views/Reports/statsCaixaIntakes";
import statsCaixaOuttakesCategory from "@/views/Reports/statsCaixaOuttakesCategory";
import statsCaixaOuttakesClinics from "@/views/Reports/statsCaixaOuttakesClinics";
import Clients from "@/views/Reports/Clients";
import DrawerRelatorio from "@/components/Drawer/DrawerRelatorio";
import DateSelector from "@/components/Common/DateSelector";
import EmployeeServiceReport from "@/views/Reports/EmployeeServiceReport";
import StatisticsBudgets from "@/views/Reports/StatisticsBudgets";
import StatisticPatientsGeoPoint from "@/views/Reports/StatisticPatientsGeoPoint";
import PatientsBudgets from "@/components/Reports/PatientsBudgets";
export default {
  components: {
    DrawerRelatorio,
    DateSelector,
    ColaboratorsProductionReport,
    GeneralReport,
    LuizFernandoReport,
    IntakesReport,
    ProceduresPricesAnalises,
    BestSellingExamsReport,
    BestSellingConsultationsReport,
    OuttakesReport,
    SpecialtiesMadeReport,
    NewUsersReport,
    ConsultationScheduledExecuted,
    CustomersPerProcedureReport,
    statsCaixaIntakes,
    statsCaixaOuttakesCategory,
    statsCaixaOuttakesClinics,
    Clients,
    EmployeeServiceReport,
    StatisticsBudgets,
    StatisticPatientsGeoPoint,
    PatientsBudgets
  },
  data: vm => ({
    selected: 0,

    date: moment().format("YYYY-MM-DD 00:00:00"),
    date2: moment().format("YYYY-MM-DD 23:59:59"),
    dateFormatted: moment().format("DD/MM/YYYY"),
    dateFormatted2: moment().format("DD/MM/YYYY"),
    dateBegin: null,
    dateEnd: null,
    colaborator: null,
    menu1: false,
    menu2: false,
    skipTransaction: true,
    intakes: undefined,
    formattedReport: undefined,
    formattedReportAllUnits: undefined,
    loading: false,
    todayNewUsers: []
  }),
  methods: {
    async searchView() {
      this.loading = true;

      const id = this.$route.params.idReport;
      switch (id) {
        case "RelatorioGeral":
          this.selected = 0;
          await this.getIntakes();
          await this.searchReports();
          await this.searchReportsAllClinics();
          break;
        case "RelatorioLuizFernando":
          this.selected = 1;
          await this.getIntakes();
          await this.searchReports();
          await this.searchReportsAllClinics();
          break;
        case "RelatorioColaboradoresProducao":
          this.selected = 2;
          // await this.getIntakes(true);
          break;
        case "RelatorioEntradas":
          this.selected = 3;
          await this.getIntakes();
          await this.searchReports();
          break;
        case "RelatorioAnaliseProcedimentosAnalise":
          this.selected = 4;
          break;
        case "RelatorioExamesMaisVendidos":
          await this.getIntakes();
          this.selected = 5;
          break;
        case "RelatorioConsultasMaisVendidas":
          await this.getIntakes();
          this.selected = 6;
          break;
        case "RelatorioSaidas":
          await this.getOuttakes();
          this.selected = 7;

          break;
        case "RelatorioNovosUsuarios":
          this.selected = 8;
          await this.getTodayUsers();
          await this.getUsers();
          break;
        case "RelatorioSpecialidadesFeitas":
          this.selected = 9;
          await this.getIntakes();
          await this.searchReports();
          break;
        case "RelatorioConsultasAgendadas":
          this.selected = 10;
          await this.getIntakes();
          await this.searchReports();
          break;
        case "RelatorioClientesPorProcedimento":
          this.selected = 11;
          await this.searchReports();
          break;
        case "RelatorioEntradasEstatistica":
          this.selected = 12;
          break;
        case "RelatorioSaidasCategoriaEstatistica":
          this.selected = 13;
          break;
        case "RelatorioSaidasClinicasEstatisticas":
          this.selected = 14;
          break;
        case "RelatorioClientesEstatisticas":
          this.selected = 15;
          break;
        case "RelatorioAtendimentosColaboradores":
          this.selected = 16;
          break;
        case "StatisticasOrcamento":
          this.selected = 17;
          break;
        case "StatisticPatientsGeoPoint":
          this.selected = 18;
          break;
        case "PatientsBudgets":
          this.selected = 19;
          break;
        default:
          this.selected = 0;
          break;
      }
      this.dateBegin = this.dateFormatted;
      this.dateEnd = this.dateFormatted2;
      this.loading = false;
    },
    async searchReports() {
      this.skipTransaction = false
      this.$apollo.queries.loadTransactions.refresh()
      console.log('formatReport: ', this.formattedReport)
    },
    async searchReportsAllClinics() {
      this.formattedReportAllUnits = await this.$store.dispatch(
        "searchReportsAllClinics",
        {
          dataInicio: this.date,
          dataFinal: this.date2,
          colaborator: this.colaborator
        }
      );
    },
    async getIntakes(allUnits) {
      this.intakes = await this.$store.dispatch("getIntakes", {
        initialDate: moment(this.date).format("YYYY-MM-DD 00:00:00"),
        finalDate: moment(this.date2).format("YYYY-MM-DD 23:59:59"),
        colaborator: this.colaborator,
        allUnits: allUnits
      });
    },
    async getOuttakes() {
      this.$store.dispatch("getOuttakes", {
        initialDate: moment(this.date).format("YYYY-MM-DD 00:00:00"),
        finalDate: moment(this.date2).format("YYYY-MM-DD 23:59:59")
      });
    },

    async getUsers() {
      this.$store.dispatch("getUsers", {
        initialDate: moment(this.date).format("YYYY-MM-DD 00:00:00"),
        finalDate: moment(this.date2).format("YYYY-MM-DD 23:59:59"),
        type: "PATIENT"
      });
    },
    async getTodayUsers() {
      this.todayNewUsers = await this.$store.dispatch("getTodayUsers", {
        initialDate: moment().format("YYYY-MM-DD 00:00:00"),
        finalDate: moment().format("YYYY-MM-DD 23:59:59"),
        type: "PATIENT"
      });
    },

    async loadClientsServed() {
      this.$store.dispatch("loadClientsServed", {
        initialDate: moment(this.date).format("YYYY-MM-DD 00:00:00"),
        finalDate: moment(this.date2).format("YYYY-MM-DD 23:59:59")
      });
    },
    async loadNewClients() {
      this.$store.dispatch("loadNewClients", {
        initialDate: moment(this.date).format("YYYY-MM-DD 00:00:00"),
        finalDate: moment(this.date2).format("YYYY-MM-DD 23:59:59")
      });
    },

    loadDatasetClients() {
      this.loadClientsServed();
      this.loadNewClients();
    },
    async initialInfo() {
      this.loading = true;
      this.$store.dispatch("showOverviewToggle", true);
      await this.searchView();
      await this.$store.dispatch("getOuttakesCategories");
      // await this.searchReports();
      // await this.searchReportsAllClinics();
      // await this.getOuttakes();
      // await this.getUsers();
      // await this.getTodayUsers();
      // await this.loadClientsServed();
      // await this.getIntakes();
      // await this.getUsers();
      // await this.loadDatasetClients();
      // await this.loadClientsServed();
      // await this.loadNewClients();
      this.dateBegin = this.dateFormatted;
      this.dateEnd = this.dateFormatted2;
      this.loading = false;
    }
  },

  mounted() {
    this.initialInfo();
  },
  computed: {
    colaborators() {
      return this.$store.getters.colaborators;
    },
    hide() {
      return this.selected > 11;
    }
  },
  apollo: {
    loadTransactions: {
      query: require('@/graphql/transaction/GetTransactions.gql'),
      async update(data) {
        this.formattedReport = data.Transaction
        console.log('entrei')
        this.formattedReport = await this.$store.dispatch("searchReports", {
          dataInicio: this.date,
          dataFinal: this.date2,
          intake: this.formattedReport,
          colaborator: this.colaborator
        });
        console.log('formatReport: ', this.formattedReport)
        this.skipTransaction = true
      },
      skip (){
        return this.skipTransaction
      }
    },
  }
};
</script>

