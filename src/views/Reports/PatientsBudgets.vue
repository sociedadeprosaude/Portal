<template>
  <v-container fluid>
    <v-card>
      <v-card-title class="justify-center">
        <v-row>
          <v-col cols="5">
            <v-menu v-model="dateMenuStart">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                    v-model="formattedSelectedStartDate"
                    hint="Data inicial"
                    persistent-hint
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    outlined
                    dense
                    color="primary"
                />
              </template>
              <v-date-picker v-model="selectedStartDate" locale="pt-br"/>
            </v-menu>
          </v-col>
          <v-col cols="2">
              <v-icon class="primary--text pb-5" large>event</v-icon>
          </v-col>
          <v-col cols="5">
            <v-menu v-model="dateMenuFinal">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                    v-model="formattedSelectedFinalDate"
                    hint="Data final"
                    persistent-hint
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    outlined
                    dense
                    color="primary"
                />
              </template>
              <v-date-picker v-model="selectedFinalDate" locale="pt-br"/>
            </v-menu>
          </v-col>
        </v-row>
      </v-card-title>
    </v-card>
    <v-card v-if="skipBudgets">
      <PatientsBudgets
          v-if="BudgetFixed"
          :budgets="Budgets"
          :budgetsForDate="BudgetsForDate"
          :dates="dates"
          :PatientsArray="PatientsArray"
      >
      </PatientsBudgets>
    </v-card>
    <v-progress-circular v-else indeterminate size="64"></v-progress-circular>
  </v-container>
</template>

<script>
import moment from "moment";
import PatientsBudgets from "@/components/Reports/PatientsBudgets";
export default {
  components: {PatientsBudgets},
  data: vm => ({
    BudgetFixed: '',
    skipBudgets: false,
    dateMenuStart: false,
    dateMenuFinal: false,
    selectedStartDate: moment().format("YYYY-MM-DD"),
    selectedFinalDate: moment().format("YYYY-MM-DD"),
    selectedUnit: undefined,
  }),
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
    },
    formattedSelectedStartDate: {
      get() {
        this.skipBudgets = false
        return moment(this.selectedStartDate).format("DD/MM/YYYY")
      },
      set(val) {
        this.selectedDate = val
      }
    },
    formattedSelectedFinalDate: {
      get() {
        this.skipBudgets = false
        return moment(this.selectedFinalDate).format("DD/MM/YYYY")
      },
      set(val) {
        this.selectedDate = val
      }
    }
  },
  apollo: {
    loadTransactions: {
      query: require("@/graphql/budget/loadBudgetsPatient.gql"),
      variables() {
        return {
          date_start: this.selectedStartDate + 'T00:00:00',
          date_final: this.selectedFinalDate + 'T23:59:59'
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