<template>
  <v-container fluid v-if="skipBudgets">
    <PatientsBudgets
    :budgets="Budgets"
    :budgetsForDate="BudgetsForDate"
    :dates="dates"
    :PatientsArray="PatientsArray"
    >

    </PatientsBudgets>
  </v-container>
  <v-progress-circular v-else indeterminate size="64"></v-progress-circular>
</template>

<script>
import moment from "moment";
import PatientsBudgets from "@/components/Reports/PatientsBudgets";
export default {
  components: {PatientsBudgets},
  data: vm => ({
    BudgetFixed: '',
    skipBudgets: false,
  }),

  mounted() {
  },
  methods: {

  },
  computed: {
    Budgets(){
      console.log('budgets: ', this.BudgetFixed.filter(e => !e.with_transaction))
      return this.BudgetFixed.filter(e => !e.with_transaction)
    },
    NumBudgets(){
      return this.Budgets.length
    },
    selectedUnit() {
      return this.$store.getters.selectedUnit
    },
    PatientsArray(){
      let PatientsArray= []
      this.Budgets.map(e =>{
        PatientsArray.push({
          Nome: e.user[0]? e.user[0].name :'error',
          Telefone: e.user[0]?e.user[0].telephones[0] :'error',
          Data: moment(e.date.formatted,'YYYY-MM-DDTHH:mm:ss').format('DD/MM/YYYY')
        })
    })
      return PatientsArray
    },
    BudgetsForDate(){
      let DateForBudget= {}
      this.Budgets.map(e =>{
        if(DateForBudget[e.date.formatted.substring(0, 10)]){
          DateForBudget[e.date.formatted.substring(0, 10)].NumBudgets +=1
          DateForBudget[e.date.formatted.substring(0, 10)].Budgets.push(e)
        }
        else{
          DateForBudget[e.date.formatted.substring(0, 10)] = {
            Budgets: [],
            NumBudgets: 1,
            date: e.date.formatted.substring(0,10)
          }
          DateForBudget[e.date.formatted.substring(0, 10)].Budgets.push(e)
        }
      return 1
      })
      console.log('DateForBudget', DateForBudget)
      const ordered = {};

      Object.keys(DateForBudget).sort(function (a,b){ if (a > b) {
        return -1;
      }
        if (a < b) {
          return 1;
        }
        return 0;}).forEach(function(key) {
        ordered[key] = DateForBudget[key];
      });

      return ordered
    },
    dates(){
      let dates = []
      dates.push('')
      for(let i in this.BudgetsForDate){
        dates.push( moment(i).format('DD/MM/YYYY'))
      }
      return dates
    }

  },
  apollo: {
    loadTransactions: {
      query: require("@/graphql/budget/loadBudgetsPatient.gql"),
      variables() {
        return {
          unit_name: this.selectedUnit.name
        }
      },
      update(data) {
        console.log('data: ', data.Budget)
        this.BudgetFixed= data.Budget
        this.skipBudgets = true
      },
      skip() {
        return this.skipBudgets
      }
    }
  }
};
</script>