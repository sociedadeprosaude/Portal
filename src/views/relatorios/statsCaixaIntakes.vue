<template>
  <v-container fluid v-if="statistics && months && years">
    <statsCaixaIntakes
      :years="years"
      :year="year"
      :months="months"
      :month="month"
      :week="week"
      :monsthsName="monsthsName"
      :monthName="monthName"
      :round2="round2"
      :statistics="statistics"
      :info="info"
      :total="total"
      :cost="cost"
      :profit="profit"
      :numOfSales="numOfSales"
      :maisVendidos="maisVendidos"
      :labels="labels"
      :faturamentoDatasetMonthly="faturamentoDatasetMonthly"
      :faturamentoDatasetWeekly="faturamentoDatasetWeekly"
      :profitDataset="profitDataset"
      :bestSellersDataset="bestSellersDataset"
      :numOfSalesMontlyDataset="numOfSalesMontlyDataset"
      :options="options"
      
      @change-month="(value)=>month=value"
      @change-year="(value)=>year=value"
    />
  </v-container>
  <v-container v-else>loading</v-container>
</template>

<script>
import statsCaixaIntakes from "@/components/Reports2/statsCaixaIntakes";
import moment from "moment";
export default {
  components: { statsCaixaIntakes },
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
    this.initialInfo();
  },
  methods: {
    async initialInfo() {
      await this.$store.dispatch("getStatisticsByMonth");
    },
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
    faturamentoDatasetMonthly() {
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
    faturamentoDatasetWeekly() {
      const days = Array.from(
        Array(moment(`${this.year}-${this.month}`).daysInMonth()).keys()
      )
        .map(num => ++num)
        .slice(8 * this.week, 8 * (1 + this.week));

      const arrData = days.map(num => this.info.arrTotalRaw[num - 1]);

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
    profitDataset() {
      return Object.keys(this.info.itens)
        .map(key => ({
          name: key,
          profit: this.round2(this.info.itens[key].totalProfit)
        }))
        .sort((a, b) => b.profit - a.profit)
        .slice(0, 10);
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