<template>
  <v-container>
    <v-row>
      <v-col>
        OI
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import moment from 'moment'
export default {
  props: [
      "NumBudgets",
      "NumBudgetsPaid",
      "NumBudgetsNotPaid",
      "NumTotal",
      "Budgets",
      "BudgetsPaid",
      "BudgetsNotPaid"
  ]
};
</script>