<template>
  <v-container fluid v-if="statistics && months && years">
    <v-row justify="start" align="center">
      <v-col cols="12" md="3">
        <p>
          <span style="font-size: 2em;">Overview</span>
        </p>
      </v-col>
      <v-col cols="6" md="2">
        <v-select :items="years" label="Ano" v-model="year"></v-select>
      </v-col>
      <v-col cols="6" md="2">
        <v-select :items="months" label="Mês" v-model="month">
          <template v-slot:selection>{{monthName(month)}}</template>
          <template v-slot:item="data">{{monthName(data.item)}}</template>
        </v-select>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="6" md="3">
        <MiniStatistic
          icon="mdi-currency-usd"
          :title="`R$ ${totalLeftToPay}`"
          sub-title="Restando pagar"
          color="orange"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <MiniStatistic
          icon="mdi-currency-usd-off"
          :title="`R$ ${totalToPay}`"
          sub-title="Contas total"
          color="red"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <MiniStatistic
          icon="mdi-update"
          :title="`R$ ${totalRecurrent}`"
          sub-title="Custos recorrentes"
          color="blue-grey darken-2"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <MiniStatistic
          icon="mdi-counter"
          :title="numOfOuttakesToPay"
          sub-title="Nº de contas pendentes"
          color="blue"
        />
      </v-col>
    </v-row>
    <v-row class="mt-2">
      <h1>Gastos (R$)</h1>
    </v-row>
    <v-row>
      <v-col>
        <v-card elevation="0">
          <v-row>
            <v-col>
              <line-chart
                :chart-data="this.$vuetify.breakpoint.xs?spentDataset:spentDatasetMonthly"
                :options="options"
              ></line-chart>
              <div v-if="this.$vuetify.breakpoint.xs">
                <v-icon @click="week -= week == 0 ? 0:1">mdi-minus</v-icon>
                semana {{week+1}}
                <v-icon @click="week += week == 3 ? 0:1">mdi-plus</v-icon>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <h1>Maiores gastos</h1>

        <v-card>
          <v-card-text>
            <div v-for="(item,i) in higherCostDataset" :key="i">
              <v-row>
                <v-col class="text-left">
                  <span class="title">{{i+1}}. {{item.name}}</span>
                </v-col>
                <v-col>
                  <span class="ml-auto font-weight-bold">R$ {{item.totalToPay}}</span>
                </v-col>
              </v-row>
              <v-divider />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <h1>Maiores gastos (Nº)</h1>

        <v-card elevation="0">
          <pie-chart
            :chart-data="mostSpentDataset"
            :options="{
            legend: {
     display:mostSpentDataset.labels.length > 15 ? false:true
}}"
          ></pie-chart>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="mt-2">
      <h1>Número de gastos</h1>
    </v-row>
    <v-row>
      <v-col>
        <v-card elevation="0">
          <v-row v-if="mostSpentDatasetMontly">
            <v-col>
              <bar-chart
                :chart-data="mostSpentDatasetMontly"
                :options="{
                legend: {
          display: false
        },
        scales: {
            xAxes: [{
                stacked: true
            }],
          
        }
     
              }"
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
    week: 0,
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
    this.$store.dispatch("getStatisticsOuttakesByMonth");
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
      try {
        if (val) {
          this.months = Object.keys(this.statistics[val]);
          this.month = this.months[0];
        }
      } catch (e) {
        console.log(e);
      }
    }
  },
  computed: {
    statistics() {
      return this.$store.getters.getStatisticsOuttakes;
    },
    info() {
      return this.statistics[this.year][this.month];
    },
    totalLeftToPay() {
      return String(this.round2(this.info.totalLeftToPay));
    },
    totalToPay() {
      return String(this.round2(this.info.totalToPay));
    },
    totalRecurrent() {
      return String(this.round2(this.info.totalRecurrent));
    },
    numOfOuttakesToPay() {
      return String(this.info.numOfOuttakesToPay);
    },
    maisVendidos() {
      return this.info.itens;
    },
    labels() {
      return Object.keys(this.info.itens).map(key => key);
    },
    spentDatasetMonthly() {
      return {
        labels: Array.from(
          Array(moment(`${this.year}-${this.month}`).daysInMonth()).keys()
        ).map(num => ++num),
        datasets: [
          {
            lineTension: 0,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            data: this.info.arrTotalToPay
          }
        ]
      };
    },
    spentDataset() {
      const days = Array.from(
        Array(moment(`${this.year}-${this.month}`).daysInMonth()).keys()
      )
        .map(num => ++num)
        .slice(8 * this.week, 8 * (1 + this.week));

      const arrData = days.map(num => this.info.arrTotalToPay[num - 1]);

      return {
        labels: days,
        datasets: [
          {
            lineTension: 0,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            data: arrData
          }
        ]
      };
    },
    higherCostDataset() {
      return Object.keys(this.info.itens)
        .map(key => ({
          name: key,
          totalToPay: this.round2(this.info.itens[key].totalToPay)
        }))
        .sort((a, b) => b.totalToPay - a.totalToPay)
        .slice(0, 10);
    },
    mostSpentDataset() {
      return {
        labels: Object.keys(this.info.itens),
        datasets: [
          {
            data: Object.keys(this.info.itens).map(
              key => this.info.itens[key].numOfOuttakes
            )
          }
        ]
      };
    },
    mostSpentDatasetMontly() {
      const arrTotalToPayMonthly = Array.from(Array(12).keys()).map(() => 0);
      const arrTotalLeftToPayMonthly = Array.from(Array(12).keys()).map(() => 0);

      var arrMonths = Object.keys(this.statistics[this.year]).forEach(month => {
        arrTotalToPayMonthly[Number(month) - 1] = this.statistics[this.year][
          month
        ].totalToPay;

        arrTotalLeftToPayMonthly[Number(month) - 1] = this.statistics[this.year][
          month
        ].totalLeftToPay;
      });

      return {
        labels: this.monsthsName,
        datasets: [
          {
            lineTension: 0,
            fill: false,
            backgroundColor: "rgba(75, 192, 192,0.4)",
            data: arrTotalToPayMonthly
          },
          {
            lineTension: 0,
            fill: false,
            backgroundColor: "rgba(255, 99, 132,1)",
            data: arrTotalLeftToPayMonthly
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