<template>
  <v-container fluid>
    <v-navigation-drawer
      hide-overlay
      :right="false"
      v-model="overviewDrawer"
      absolute
      temporary
      disable-resize-watcher
      app
      dark
      clipped
    >
      <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          @click="selected = item.value; overviewDrawer=false"
        >
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-container v-if="!hide">
      <v-row class="align-content-sm-space-between pa-0 ma-0 justify-center">
        <v-col cols="3" class="mr-3">
          <v-menu
            ref="menu1"
            v-model="menu1"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="dateFormatted"
                label="Data Inicial"
                dense
                prepend-icon="event"
                v-on="on"
              />
            </template>
            <v-date-picker v-model="date" no-title @input="menu1 = false" />
          </v-menu>
        </v-col>
        <v-col cols="3" class="ml-3">
          <v-menu
            v-model="menu2"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="dateFormatted2"
                label="Data Final"
                prepend-icon="event"
                readonly
                dense
                v-on="on"
              />
            </template>
            <v-date-picker v-model="date2" no-title @input="menu2 = false" />
          </v-menu>
        </v-col>
      </v-row>
      <v-row class="align-center pa-0 ma-0">
        <v-col class="pa-0 ma-0">
          <v-btn @click="getIntakes()" color="blue" v-if="!loading">Pesquisar</v-btn>
          <v-progress-circular indeterminate class="primary--text" v-else />
        </v-col>
      </v-row>
    </v-container>

    <general-report
      v-if="selected == 0"
      :report="formattedReport"
      :loading="loading"
      :intakes="intakes"
      :reportAllUnits="formattedReportAllUnits"
    />
    <OuttakesReport v-if="selected == 1" :date="dateBegin" :date2="dateEnd" :cb="pesquisar" />
    <procedures-prices-analises v-if="selected == 2"></procedures-prices-analises>
    <statsCaixaIntakes v-if="selected == 3"></statsCaixaIntakes>
    <statsCaixaOuttakes v-if="selected == 4"></statsCaixaOuttakes>
    <Clients v-if="selected == 5"></Clients>
  </v-container>
</template>

<script>
import ProceduresPricesAnalises from "@/components/reports/ProceduresPricesAnalises";
import GeneralReport from "@/components/reports/GeneralReport";
import OuttakesReport from "@/components/reports/OuttakesReport";

import statsCaixaIntakes from "./statsCaixa";
import statsCaixaOuttakes from "./statsCaixaOuttakes";
import Clients from "./Clients";

export default {
  components: {
    GeneralReport,
    ProceduresPricesAnalises,
    OuttakesReport,
    statsCaixaIntakes,
    statsCaixaOuttakes,
    Clients
  },
  data: vm => ({
    selected: 4,
    items: [
      { title: "Relatorio financeiro geral", value: 0 },
      { title: "Relatorio de Saidas", value: 1 },
      { title: "Análise de preço de exames", value: 2 },
      { title: "Intakes", value: 3 },
      { title: "Outtakes", value: 4 },
      { title: "Clientes", value: 5 }
    ],

    date: moment().format("YYYY-MM-DD 00:00:00"),
    date2: moment().format("YYYY-MM-DD 23:59:59"),
    dateFormatted: moment().format("DD/MM/YYYY"),
    dateFormatted2: moment().format("DD/MM/YYYY"),
    dateBegin: null,
    colaborator: null,
    dateEnd: null,
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
      this.loading = true;
      this.intakes = await this.$store.dispatch("getIntakes", {
        initialDate: moment(this.date).format("YYYY-MM-DD 00:00:00"),
        finalDate: moment(this.date2).format("YYYY-MM-DD 23:59:59"),
        colaborator: this.colaborator
      });

      await this.pesquisar();
      this.loading = false;
    },
    async pesquisar() {
      this.loading = true;
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
      this.loading = false;
    },
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
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
    }
  },
  async mounted() {
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
    this.getIntakes();
    this.loadDatasetClients();
  },
  computed: {
    colaborators() {
      return this.$store.getters.colaborators;
    },
    hide() {
      return this.selected == 4 || this.selected == 3;
    },
    overviewDrawer: {
      get() {
        return this.$store.getters.overviewDrawer;
      },
      set(val) {
        this.$store.dispatch("overviewToggle", val);
      }
    }
  },
  watch: {
    date(val) {
      this.dateFormatted = this.formatDate(this.date);
    },
    date2(val) {
      this.dateFormatted2 = this.formatDate(this.date2);
    }
  }
};
</script>

