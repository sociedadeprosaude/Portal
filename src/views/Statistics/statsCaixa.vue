<template>
  <v-container fluid v-if="statistics && months && years">
    <v-row justify="start" align="center">
      <v-col cols="3">
        <p>
          <span style="font-size: 2em;">Overview</span>
        </p>
      </v-col>
      <v-col cols="2">
        <v-select :items="years" label="Ano" v-model="year"></v-select>
      </v-col>
      <v-col cols="2">
        <v-select :items="months" label="Mês" v-model="month">
          <template v-slot:selection>{{monthName(month)}}</template>
          <template v-slot:item="data">{{monthName(data.item)}}</template>
        </v-select>
      </v-col>
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
        <MiniStatistic icon="mdi-counter" :title="numOfSales" sub-title="Nº Vendas" color="blue" />
      </v-col>
    </v-row>
    <v-row class="mt-2">
      <h1>Faturamento (R$)</h1>
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
            <div v-for="(item,i) in profitDataset" :key="i">
              <v-row>
                <v-col>
                  <span class="title">{{item.name}}</span>
                </v-col>
                <v-col>
                  <span class="ml-auto font-weight-bold">R$ {{item.profit}}</span>
                </v-col>
              </v-row>
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
              <pie-chart :chart-data="bestSellersDataset" :options="options"></pie-chart>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="mt-2">
      <h1>Número de vendas</h1>
    </v-row>
    <v-row>
      <v-col>
        <v-card elevation="0">
          <v-row v-if="numOfSalesMontlyDataset">
            <v-col>
              <bar-chart
                :chart-data="numOfSalesMontlyDataset"
                :options="{legend: {
          display: false
        }}"
              ></bar-chart>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else>loading</v-container>
</template>

<script>
import LineChart from "@/components/Charts/LineChart";
import BarChart from "@/components/Charts/BarChart";
import PieChart from "@/components/Charts/PieChart";

import MiniStatistic from "@/components/MiniStatistic";
export default {
  components: {
    MiniStatistic,
    LineChart,
    PieChart,
    BarChart
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
    ]
  }),

  mounted() {
    this.$store.dispatch("getStatisticsByMonth");
  },
  methods: {
    monthName(month) {
      return this.monsthsName[Number(month) - 1];
    },
    round2(num) {
      return num ? num.toFixed(2) : 0;
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
      return String(this.round2(this.info.totalRaw));
    },
    cost() {
      return String(this.round2(this.info.totalCost));
    },
    profit() {
      return String(this.round2(this.info.totalProfit));
    },
    numOfSales() {
      return String(this.info.numOfSales);
    },
    maisVendidos() {
      return this.info.itens;
    },
    labels() {
      return Object.keys(this.info.itens).map(key => key);
    },
    faturamentoDataset() {
      return {
        labels: Array.from(
          Array(moment(`${this.year}-${this.month}`).daysInMonth()).keys()
        ).map(num => ++num),
        datasets: [
          {
            lineTension: 0,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            data: this.info.arrTotalRaw
          }
        ]
      };
    },
    profitDataset() {
      return Object.keys(this.info.itens)
        .map(key => ({
          name: key,
          profit: this.round2(this.info.itens[key].totalProfit)
        }))
        .sort((a, b) => b.profit - a.profit);
    },
    bestSellersDataset() {
      return {
        labels: Object.keys(this.info.itens),
        datasets: [
          {
            data: Object.keys(this.info.itens).map(
              key => this.info.itens[key].numOfSales
            )
          }
        ]
      };
    },
    numOfSalesMontlyDataset() {
      const arrNum = Array.from(Array(12).keys()).map(() => 0);

      var arrMonths = Object.keys(this.statistics[this.year]).forEach(
        month =>
          (arrNum[Number(month) - 1] = this.statistics[this.year][
            month
          ].numOfSales)
      );

      return {
        labels: this.monsthsName,
        datasets: [
          {
            lineTension: 0,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            data: arrNum
          }
        ]
      };
    },

    options() {
      return {
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
    }
  }
};
</script>