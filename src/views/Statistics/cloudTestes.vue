<template>
  <v-container fluid v-if="statistics && months && years">
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
          :title="`R$ ${total}`"
          sub-title="faturamento"
          color="orange"
        />
      </v-col>
      <v-col cols="3">
        <MiniStatistic
          icon="mdi-currency-usd-off"
          :title="`R$ ${cost}`"
          sub-title="Custos"
          color="red"
        />
      </v-col>
      <v-col cols="3">
        <MiniStatistic
          icon="mdi-plus"
          :title="`R$ ${profit}`"
          sub-title="Lucro Líquido"
          color="green"
        />
      </v-col>
      <v-col cols="3">
        <MiniStatistic icon="mdi-counter" :title="num" sub-title="Nº Vendas" color="blue" />
      </v-col>
    </v-row>
    <v-row class="mt-2">
      <h1>Faturamento</h1>
    </v-row>
    <v-row>
      <v-col>
        <v-card elevation="0">
          <v-row v-if="faturamentoDataset">
            <v-col>
              <line-chart :chart-data="faturamentoDataset" :options="options"></line-chart>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <h1>Mais lucrativos</h1>

        <v-card>
          <v-card-text>
            <div class="progress-group" v-for="(item,i) in profitDataset" :key="i">
              <div class="progress-group-header">
                <span class="title">{{item.name}}</span>
                <span class="ml-auto font-weight-bold">R$ {{item.profit}}</span>
              </div>
              <v-divider />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <h1>Mais vendidos</h1>
        <v-card elevation="0">
          <v-row>
            <v-col>
              <pie-chart :chart-data="maisVendidosDataset" :options="options"></pie-chart>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    {{info}}
    {{maisVendidos}}
    {{profitDataset}}
  </v-container>
  <v-container v-else></v-container>
</template>

<script>
import LineChart from "@/components/Charts/LineChart";
import PieChart from "@/components/Charts/PieChart";

import MiniStatistic from "@/components/MiniStatistic";
export default {
  components: {
    MiniStatistic,
    LineChart,
    PieChart
  },
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
    maisVendidos() {
      return this.info.arrSelled;
    },
    labels() {
      return Object.keys(this.info.arrSelled).map(key => key);
    },
    maisVendidosDataset() {
      return {
        labels: Object.keys(this.info.arrSelled),
        backgroundColor: ["#41B883", "#E46651", "#00D8FF", "#DD1B16"],
        datasets: [
          {
            data: Object.keys(this.info.arrSelled).map(
              key => this.info.arrSelled[key]
            )
          }
        ]
      };
    },
    faturamentoDataset() {
      return {
        labels: this.days,
        datasets: [
          {
            lineTension: 0,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            data: Object.keys(this.info.arrFaturamento).map(
              key => this.info.arrFaturamento[key]
            )
          }
        ]
      };
    },
    options() {
      return {
        // elements: {
        //   point: {
        //     radius: 0
        //   }
        // },
        legend: {
          display: false
        },
        tooltips: {
          enabled: true,
          callbacks: {
            title: (items, data) => "R$ " + items[0].value,
            label: (items, data) => null
          }
        }
      };
    },
    profitDataset() {
      return Object.keys(this.info.arrProfit)
        .map(key => ({
          name: key,
          profit: this.round2(this.info.arrProfit[key])
        }))
        .sort((a, b) => b.profit - a.profit);
    }
  }
};
</script>



<style scoped lang="scss">
@import "~@coreui/coreui/scss/coreui";
</style> 
