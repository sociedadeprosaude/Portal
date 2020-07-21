<template>
  <v-container fluid>
    <DrawerRelatorio @change-selected="(value)=>selected=value" />

    <DateSelector
      :cb="()=>getIntakes()"
      @change-date="(value)=>date=value"
      @change-date2="(value)=>date2=value"
      @change-dateFormatted="(value)=>dateFormatted=value"
      @change-dateFormatted2="(value)=>dateFormatted2=value"
    />

    <general-report
      v-if="selected == 0"
      :report="formattedReport"
      :loading="loading"
      :intakes="intakes"
      :reportAllUnits="formattedReportAllUnits"
    />

    <luiz-fernando-report
      v-if="selected == 1"
      :report="formattedReport"
      :loading="loading"
      :intakes="intakes"
      :reportAllUnits="formattedReportAllUnits"
    />

    <colaborators-production-report v-if="selected == 2" :loading="loading" :intakes="intakes"></colaborators-production-report>

    <intakes-report
      v-if="selected == 3"
      :report="formattedReport"
      :loading="loading"
      :intakes="intakes"
    />

    <procedures-prices-analises v-if="selected == 4" />
    <best-selling-exams-report v-if="selected == 5" :date="dateBegin" :date2="dateEnd" />

    <BestSellingConsultationsReport v-if="selected == 6" :date="dateBegin" :date2="dateEnd" />

    <OuttakesReport v-if="selected == 7" :date="dateBegin" :date2="dateEnd" :cb="pesquisar" />
    <NewUsersReport
      v-if="selected == 8"
      :date="dateBegin"
      :date2="dateEnd"
      :todayNewUsers="todayNewUsers"
    />
    <SpecialtiesMadeReport
      v-if="selected == 9"
      :report="formattedReport"
      :loading="loading"
      :intakes="intakes"
    />
    <ConsultationScheduledExecuted
      v-if="selected == 10"
      :report="formattedReport"
      :loading="loading"
      :intakes="intakes"
    />
    <CustomersPerProcedureReport
      v-if="selected == 11"
      :report="formattedReport"
      :loading="loading"
    />

    <statsCaixaIntakes v-else-if="selected == 12"></statsCaixaIntakes>
    <statsCaixaOuttakesCategory v-else-if="selected == 13"></statsCaixaOuttakesCategory>
    <statsCaixaOuttakesClinics v-else-if="selected == 14"></statsCaixaOuttakesClinics>
    <Clients v-else-if="selected == 15"></Clients>
  </v-container>
</template>

<script>
import GeneralReport from "@/views/relatorios/GeneralReport";
import LuizFernandoReport from "@/views/relatorios/LuizFernandoReport";
import ColaboratorsProductionReport from "@/views/relatorios/ColaboratorsProductionReport";
import IntakesReport from "@/views/relatorios/IntakesReport";
import ProceduresPricesAnalises from "@/views/relatorios/ProceduresPricesAnalises";
import BestSellingExamsReport from "@/views/relatorios/BestSellingExamsReport";
import BestSellingConsultationsReport from "@/views/relatorios/BestSellingConsultationsReport";
import OuttakesReport from "@/views/relatorios/OuttakesReport";
import NewUsersReport from "@/views/relatorios/NewUsersReport";
import SpecialtiesMadeReport from "@/views/relatorios/SpecialtiesMadeReport";
import ConsultationScheduledExecuted from "@/views/relatorios/ConsultationScheduledExecuted";
import CustomersPerProcedureReport from "@/views/relatorios/CustomersPerProcedureReport";
import statsCaixaIntakes from "@/views/relatorios/statsCaixaIntakes";
import statsCaixaOuttakesCategory from "@/views/relatorios/statsCaixaOuttakesCategory";
import statsCaixaOuttakesClinics from "@/views/relatorios/statsCaixaOuttakesClinics";
import Clients from "@/views/relatorios/Clients";

import DrawerRelatorio from "@/components/Drawer/DrawerRelatorio";
import DateSelector from "@/components/Common/DateSelector";

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
    Clients
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
    intakes: undefined,
    formattedReport: undefined,
    formattedReportAllUnits: undefined,
    loading: false,
    todayNewUsers: []
  }),
  methods: {
    async getIntakes() {
      console.log("flag1");
      this.loading = true;
      console.log("flag2");
      this.intakes = await this.$store.dispatch("getIntakes", {
        initialDate: moment(this.date).format("YYYY-MM-DD 00:00:00"),
        finalDate: moment(this.date2).format("YYYY-MM-DD 23:59:59"),
        colaborator: this.colaborator
      });
      console.log("flag3");
      await this.pesquisar();
      console.log("flag4");
      this.loading = false;
    },
    async pesquisar() {
      if (this.selected == 5) {
        this.loadDatasetClients();
      } else {
        this.$store.dispatch("getUsers", {
          initialDate: moment(this.date).format("YYYY-MM-DD 00:00:00"),
          finalDate: moment(this.date2).format("YYYY-MM-DD 23:59:59"),
          type: "PATIENT"
        });
        this.$store.dispatch("getOuttakes", {
          initialDate: moment(this.date).format("YYYY-MM-DD 00:00:00"),
          finalDate: moment(this.date2).format("YYYY-MM-DD 23:59:59")
        });
        this.formattedReport = await this.$store.dispatch("searchReports", {
          dataInicio: this.date,
          dataFinal: this.date2,
          colaborator: this.colaborator
        });
        this.formattedReportAllUnits = await this.$store.dispatch(
          "searchReportsAllClinics",
          {
            dataInicio: this.date,
            dataFinal: this.date2,
            colaborator: this.colaborator
          }
        );
      }

      this.dateBegin = this.dateFormatted;
      this.dateEnd = this.dateFormatted2;
    },

    loadDatasetClients() {
      this.$store.dispatch("loadClientsServed", {
        initialDate: moment(this.date).format("YYYY-MM-DD 00:00:00"),
        finalDate: moment(this.date2).format("YYYY-MM-DD 23:59:59")
      });
      this.$store.dispatch("loadNewClients", {
        initialDate: moment(this.date).format("YYYY-MM-DD 00:00:00"),
        finalDate: moment(this.date2).format("YYYY-MM-DD 23:59:59")
      });
    },
    async initialInfo() {
      await this.$store.dispatch("getOuttakes", {
        initialDate: moment(this.date).format("YYYY-MM-DD 00:00:00"),
        finalDate: moment(this.date2).format("YYYY-MM-DD 23:59:59")
      });
      await this.$store.dispatch("getUsers", {
        initialDate: moment(this.date).format("YYYY-MM-DD 00:00:00"),
        finalDate: moment(this.date2).format("YYYY-MM-DD 23:59:59"),
        type: "PATIENT"
      });
      this.todayNewUsers = await this.$store.dispatch("getTodayUsers", {
        initialDate: moment().format("YYYY-MM-DD 00:00:00"),
        finalDate: moment().format("YYYY-MM-DD 23:59:59"),
        type: "PATIENT"
      });
      await this.$store.dispatch("getOuttakesCategories");
      await this.$store.dispatch("loadClientsServed", {
        initialDate: moment(this.date).format("YYYY-MM-DD 00:00:00"),
        finalDate: moment(this.date2).format("YYYY-MM-DD 23:59:59")
      });

      await this.getIntakes();
      await this.loadDatasetClients();
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
  }
};
</script>

