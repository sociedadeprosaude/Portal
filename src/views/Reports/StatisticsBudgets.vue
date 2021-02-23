<template>
  <v-container fluid v-if="skipTransaction">
    <statistics-budget
      :NumBudgets="NumBudgets"
      :NumBudgetsPaid="NumBudgetsPaid"
      :NumBudgetsNotPaid="NumBudgetsNotPaid"
      :NumTotal="NumTotal"
      :Budgets="Budget"
      :BudgetsNotPaid="BudgetsNotPaid"
      :BudgetsPaid="BudgetsPaid"

    />
  </v-container>
  <v-progress-circular v-else indeterminate size="64"></v-progress-circular>
 
</template>

<script>
import statisticsBudget from "@/components/Reports/statsBudgets";
export default {
  components: { statisticsBudget },
  data: () => ({
    BudgetFixed: '',
    skipTransaction: false,
  }),

  mounted() {
  },
  methods: {

  },
  computed: {
    Budget(){
      return this.BudgetFixed
    },
    NumBudgets(){
      return this.Budget.length
    },
    NumBudgetsPaid(){
      let paid = 0
      paid = this.Budget.filter(e => e.with_transaction).length
      return paid
    },
    BudgetsPaid(){
      return this.Budget.filter(e => e.with_transaction)
    },
    BudgetsNotPaid(){
      return this.Budget.filter(e => !e.with_transaction)
    },
    NumBudgetsNotPaid(){
      let paid = 0
      paid = this.Budget.filter(e => !e.with_transaction).length
      return paid
    },
    NumTotal(){
      let Nums = {}
      Nums.Comprados =  {numbers: this.NumBudgetsPaid , name:'Pagos'}
      Nums.NaoComprados = {numbers: this.NumBudgetsNotPaid , name:'Não Pagos'}
      console.log('nums', Nums)
      return {
        labels: Object.keys(Nums),
        datasets: [
          {
            data: Object.keys(Nums).map(
                key => Nums[key].numbers
            )
          }
        ]
      };
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
        this.skipTransaction = true
      },
      skip() {
        return this.skipTransaction
      }
    },
  }
};
</script>