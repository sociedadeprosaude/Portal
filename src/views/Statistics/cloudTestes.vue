<template>
  <v-container v-if="statistics && months && years">
    <v-row>
      <v-col cols="2">
        <v-select :items="years" v-model="year"></v-select>
      </v-col>
      <v-col cols="2">
        <v-select :items="months" v-model="month"></v-select>
      </v-col>
    </v-row>
    <v-row justify="start" align="end">
      <p>
        <span style="font-size: 2em;">Overview</span>
        &emsp; {{monsthsName[month-1]}}
      </p>
    </v-row>
    <v-row>
      <v-col cols="3">
        <MiniStatistic
          icon="mdi-currency-usd"
          :title="total"
          sub-title="faturamento"
          color="orange"
        />
      </v-col>
      <v-col cols="3">
        <MiniStatistic icon="mdi-currency-usd-off" :title="cost" sub-title="Custos" color="red" />
      </v-col>
      <v-col cols="3">
        <MiniStatistic icon="mdi-plus" :title="profit" sub-title="Lucro Líquido" color="green" />
      </v-col>
      <v-col cols="3">
        <MiniStatistic icon="mdi-counter" :title="num" sub-title="Nº Vendas" color="blue" />
      </v-col>
    </v-row>
    {{statistics[year][month]}}
    <v-row class="mt-2">
      <h1>Faturamento</h1>
    </v-row>
    {{totalDataset}}
    <v-row>
      <v-col>
        <v-card elevation="0">
          <CCardBody>
            <CChartLine :datasets="totalDataset" :labels="days" />
          </CCardBody>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else></v-container>
</template>

<script>
import MiniStatistic from "@/components/MiniStatistic";

export default {
  data: vm => ({
    years: null,
    year: null,
    months: null,
    month: null,
    monsthsName: [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro"
    ],
    days: [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
      31
    ]
  }),
  components: {
    MiniStatistic
  },
  mounted() {
    this.$store.dispatch("getAllIntakes");
  },
  methods: {
    round2(num) {
      return num.toFixed(2);
    }
  },
  watch: {
    statistics(val) {
      if (val) {
        this.years = Object.keys(val);
        this.year = this.years[0];
        this.months = Object.keys(val[this.years[0]]);
        this.month = this.months[0];
      }
    },
    year(val) {
      if (val) {
        this.months = Object.keys(this.statistics[val]);
        this.month = this.months[0];
      }
    }
  },
  computed: {
    statistics() {
      return this.$store.getters.getStatistics;
    },
    info() {
      return this.statistics[this.year][this.month];
    },
    total() {
      return String(this.round2(this.info.total));
    },
    cost() {
      return String(this.round2(this.info.cost));
    },
    profit() {
      return String(this.round2(this.info.profit));
    },
    num() {
      return String(this.info.num);
    },
    totalDataset() {
      if (this.info)
        return [
          {
            label: "R$",
            backgroundColor: "rgb(228,102,81,0.9)",
            data: Object.keys(this.info.arrFaturamento).map(
              key => this.info.arrFaturamento[key]
            )
          }
        ];
      return [0];
    },
    defaultDatasets() {
      return [
        {
          label: "R$",
          backgroundColor: "rgb(228,102,81,0.9)",
          data: [30, 39, 10, 5000, 30, 70, 3005]
        }
        // {
        //   label: "Data Two",
        //   backgroundColor: "rgb(0,216,255,0.9)",
        //   data: [39, 80, 40, 35, 40, 20, 45]
        // }
      ];
    }
  }
};
</script>



<style scoped lang="scss">
</style> 
