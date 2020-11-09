<template>
  <v-container fluid v-if="skipBudgets">
    <PatientsBudgets></PatientsBudgets>
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
    Budget(){
      return this.BudgetFixed.filter(e => !e.with_transaction)
    },
    NumBudgets(){
      return this.Budget.length
    },
    selectedUnit() {
      return this.$store.getters.selectedUnit
    }
  },
  apollo: {
    loadTransactions: {
      query: require("@/graphql/budget/loadBudgets.gql"),
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
    },
  }
};
</script>