<template>
  <v-container fluid v-if="statistics && months && years">
    <statsCaixaOuttakesClinics
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
      :totalLeftToPay="totalLeftToPay"
      :totalToPay="totalToPay"
      :totalRecurrent="totalRecurrent"
      :numOfOuttakesToPay="numOfOuttakesToPay"
      :maisVendidos="maisVendidos"
      :labels="labels"
      :spentDatasetMonthly="spentDatasetMonthly"
      :spentDataset="spentDataset"
      :higherCostDataset="higherCostDataset"
      :mostSpentDataset="mostSpentDataset"
      :mostSpentDatasetMontly="mostSpentDatasetMontly"
      :options="options"

       @change-month="(value)=>month=value"
      @change-year="(value)=>year=value"
    />
  </v-container>
    <v-progress-circular v-else indeterminate size="64"></v-progress-circular>
 
</template>

<script>
import statsCaixaOuttakesClinics from "@/components/Reports/statsCaixaOuttakesClinics";
export default {
  components: {
    statsCaixaOuttakesClinics
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
    this.initialInfo();
  },
  methods: {
    async initialInfo() {
      await this.$store.dispatch("getStatisticsOuttakesClinicsByMonth");
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
      return this.$store.getters.getStatisticsOuttakesClinics;
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
      const arrTotalLeftToPayMonthly = Array.from(Array(12).keys()).map(
        () => 0
      );

      var arrMonths = Object.keys(this.statistics[this.year]).forEach(month => {
        arrTotalToPayMonthly[Number(month) - 1] = this.statistics[this.year][
          month
        ].totalToPay;

        arrTotalLeftToPayMonthly[Number(month) - 1] = this.statistics[
          this.year
        ][month].totalLeftToPay;
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