<template>
  <v-container fluid v-if="statistics && months && years || not">
    <statsCaixaOuttakesCategory v-if="statistics && months && years"
      :years="yearsNew"
      :year="year"
      :months="monthsNew"
      :month="month"
      :week="week"
      :monsthsName="monsthsName"
      :monthName="monthName"
      :round2="round2"
      :statistics="statistics"
      :info="info"
      :totalToPay="total"
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
      :numOfSalesMontlyDataset="numOfSalesMontlyDataset"

      @change-month="(value)=>month=value"
      @change-year="(value)=>year=value"
    />
    <v-flex v-else>
      <p>SEM STATISTICAS</p>
    </v-flex>
  </v-container>
  <v-progress-circular v-else indeterminate size="64"></v-progress-circular>
 
</template>

<script>
import statsCaixaOuttakesCategory from "../../components/Reports/statsCaixaOuttakesCategory";
import moment from "moment";
export default {
  components: { statsCaixaOuttakesCategory },
  data: vm => ({
    years: null,
    year: null,
    months: null,
    month: null,
    not:null,
    week: 0,
    skipTransaction: '',
    lastYear: '',
    lastMonth: '',
    TransactionsFixed: '',
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
          this.month = this.months[this.months.length-1];
        }
      } catch (e) {
        console.log(e);
      }
    }
  },
  computed: {
    Transactions(){
      let transactions = this.TransactionsFixed
      console.log('data inicial mes: ',this.year + '-' + this.month + '-01' )
      console.log('transactions: ', transactions.filter(e => (e.date.formatted >= (this.lastYear + '-' + this.lastMonth + '-01' ))))
      return transactions.filter(e => (e.date.formatted.substring(0,11) >= (this.year + '-' + this.month + '-01' )) && (e.date.formatted.substring(0,11) <= (moment(this.year + '-' + this.month + '-01').add(1,'months').format('YYYY-MM-DD'))))
    },
    yearsNew(){
      let years = []
      let year = moment().format('YYYY')
      console.log('year:', year)
      for(let i=parseInt(this.lastYear); i<= parseInt(year); i++){
        console.log('i:', i)
        years.push(i.toString())
      }
      console.log('years: ', years)
      return years
    },
    monthsNew(){
      let months = []
      let month = moment().format('MM')
      console.log('month:', month)
      if(this.lastYear ===  moment().format('YYYY')){
        for(let i=parseInt(this.lastMonth); i<= parseInt(month); i++){
          console.log('i:', i)
          months.push(i.toString())
        }
      }
      else{
        for(let i=parseInt(this.lastMonth); i<= 12; i++){
          console.log('i:', i)
          months.push(i.toString())
        }
      }
      console.log('months: ', months)
      return months
    },
    selectedUnit() {
      return this.$store.getters.selectedUnit
    },
    statistics() {
      return this.$store.getters.getStatisticsOuttakes;
    },
    info() {
      let itens= {}
      let arrTotalRaw= []
      let NewMonth = moment(this.year + '-' + (this.month)).add(1,'months')
      for(let i=0; i < parseInt(moment(NewMonth).subtract(1,'days').format('DD')); i++){
        arrTotalRaw[i] = 0
      }
      this.Transactions.filter(e=> {
        if(arrTotalRaw[(parseInt(e.date.formatted.substring(8,11))-1)] >= 0){
          console.log('achou, ', e.date.formatted.substring(8,11),'colocando valor', e.value)
          arrTotalRaw[(parseInt(e.date.formatted.substring(8,11))-1)] -= e.value
          console.log('arrTotalRaw: ', arrTotalRaw)
        }
        else{
          console.log('nao achou', (e.date.formatted.substring(8,11)))
          console.log('arrTotalRaw: ', arrTotalRaw)
          arrTotalRaw[(parseInt(e.date.formatted.substring(8,11))-1)] = 0
        }
        console.log('e : ', e)
        if(e.with_clinic.length){
          console.log('e clinic', e.with_clinic[0])
          if(itens[e.with_clinic[0].name]){
            itens[e.with_clinic[0].name].numOfSales += 1
            itens[e.with_clinic[0].name].totalRaw += e.value
          }
          else{
            itens[e.with_clinic[0].name] = {
              numOfSales: 1,
              totalRaw: e.value
            }
          }
        }
        else if( e.categories.length){
          console.log('e categories', e.categories[0])
          if(itens[e.categories[0].name]){
            itens[e.categories[0].name].numOfSales += 1
            itens[e.categories[0].name].totalRaw += e.value
          }
          else{
            itens[e.categories[0].name] = {
              numOfSales: 1,
              totalRaw: e.value
            }
          }
        }
        else if(e.with_doctorPayments.length){
          console.log('e doctor', e.with_doctorPayments[0])
          if(itens[e.with_doctorPayments[0].name]){
            itens[e.with_doctorPayments[0].name].numOfSales += 1
            itens[e.with_doctorPayments[0].name].totalRaw += e.value
          }
          else{
            itens[e.with_doctorPayments[0].name] = {
              numOfSales: 1,
              totalRaw: e.value
            }
          }
        }
        else{
          console.log('e nada')
          if(itens['sem categoria']){
            itens['sem categoria'].numOfSales += 1
            itens['sem categoria'].totalRaw += e.value
          }
          else{
            itens['sem categoria'] = {
              numOfSales: 1,
              totalRaw: e.value
            }
          }
        }
      })
      let info = {}
      info.itens = itens
      info.arrTotalRaw = arrTotalRaw
      console.log('info meu: ', info)
      console.log('arrTotalRaw: ', arrTotalRaw)
      console.log('estatisticas deles; ',this.statistics[this.year][this.month] )
      return info;
    },
    totalLeftToPay() {
      return String(this.round2(this.info.totalLeftToPay));
    },
    totalToPay() {
      return String(this.round2(this.info.totalToPay));
    },
    total() {
      let total=0
      this.Transactions.filter(e => {
        total += e.value
      })
      console.log('transactions: ', this.Transactions )
      console.log('total : ', total.toFixed(2))
      return String(-total.toFixed(2));
    },
    totalRecurrent() {
      return String(this.round2(this.info.totalRecurrent));
    },
    numOfOuttakesToPay() {
      //numero de constas pagas
      let sales=0
      console.log('transactions: ', this.Transactions)
      this.Transactions.filter(e => {
        sales += 1
      })
      return  sales
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
            data: this.info.arrTotalRaw
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
      const arrData = days.map(num => this.info.arrTotalRaw[num - 1]);
      console.log('days: ', days)
      console.log('week: ', this.week)
      console.log('info: ', this.info)
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
          totalToPay: this.round2(-this.info.itens[key].totalRaw)
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
              key => this.info.itens[key].numOfSales
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
    numOfSalesMontlyDataset() {
      const arrNum = Array.from(Array(12).keys()).map(() => 0);
      console.log('arrNum', arrNum)
      for(let i=0; i<arrNum.length; i++){
        let sales=0
        this.TransactionsFixed.filter(e => {
          if ((e.date.formatted.substring(0,11) >= (this.year + '-' + (i+1) + '-01' )) && (e.date.formatted.substring(0,11) <= (moment(this.year + '-' + (i+1) + '-01').add(1,'months').format('YYYY-MM-DD')))) {
            sales += 1
          }
        })
        arrNum[i] = sales
        sales = 0
      }
      /* var arrMonths = Object.keys(this.statistics[this.year]).forEach(
        month =>
          (arrNum[Number(month) - 1] = this.statistics[this.year][
            month
          ].numOfSales)
      ); */

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
  },
  apollo: {
    loadTransactions: {
      query: require("@/graphql/transaction/GetAllNegativeTransactions.gql"),
      update(data) {
        console.log('data: ', data.Transaction)
        if(data.Transaction){
        this.lastYear = data.Transaction[data.Transaction.length - 1].date.formatted.substring(0,4)
        this.lastMonth = data.Transaction[data.Transaction.length - 1].date.formatted.substring(5,7)
        this.TransactionsFixed= data.Transaction
        }
        this.skipTransaction = true
      },
      skip() {
        return this.skipTransaction
      }
    },
  }
};
</script>