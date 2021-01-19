<template>
  <v-container>
    <v-row>
      <v-col cols="12" v-for="(colaboratorIntakes, index) of intakesByColaborators" :key="index">
        <v-card flat :class="[index === 0 ? 'bordered' : '']">
          <v-row>
            <v-col cols="12" align="center">
              <strong>{{colaboratorIntakes[0].colaborator[0].name}}</strong>
            </v-col>
            <v-col cols="2" class="pt-0 pl-8" style="font-size: 0.9em">
              <span>Cr: <strong>{{ getValuePaidByMethod('Crédito', colaboratorIntakes).toFixed(2) }}</strong></span>
            </v-col>
            <v-col cols="2" class="pt-0" style="font-size: 0.9em">
              <span>Db: <strong>{{ getValuePaidByMethod('Débito', colaboratorIntakes).toFixed(2) }}</strong></span>
            </v-col>
            <v-col cols="2" class="pt-0" style="font-size: 0.9em">
              <span>Pix: <strong>{{ getValuePaidByMethod('Pix', colaboratorIntakes).toFixed(2) }}</strong></span>
            </v-col>
            <v-col cols="2" class="pt-0" style="font-size: 0.9em">
              <span>R$: <strong>{{ getValuePaidByMethod('Dinheiro', colaboratorIntakes).toFixed(2) }}</strong></span>
            </v-col>
            <v-col cols="2" class="pt-0" style="font-size: 0.9em">
              <span>Total: <strong>{{ getTotalPaid(colaboratorIntakes).toFixed(2) }}</strong></span>
            </v-col>
            <v-col v-if="index === 0" align="start" style="position: absolute; bottom: -20px" class="ml-4">
              <img src="@/assets/winner.svg" height="42px">
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "ColaboratorsProductionReportComponent",
  props: [
    "transactions"
  ],
  computed: {
    intakesByColaborators() {
      let colabs = {}
      for (let transaction of this.transactions.filter(t => t.value >= 0)) {
        let colaborator = transaction.colaborator[0]
        if (!colaborator) continue
        if (!colabs[colaborator.name]) {
          colabs[colaborator.name] = []
        }
        colabs[colaborator.name].push(transaction)
      }
      return Object.values(colabs).sort((a, b) => this.getTotalPaid(b) - this.getTotalPaid(a))
    }
  },
  methods: {
    getValuePaidByMethod(method, transactions) {
      let total = 0
      for (let transaction of transactions) {
        transaction.payment_methods.map((item, index) => {
          if (item === method) {
            total += transaction.payments[index]
          }
        })
      }
      return total
    },
    getTotalPaid(transactions) {
      return transactions.reduce((total, transaction) => {return total + transaction.value}, 0)
    }
  },
  mounted() {
    console.log('aa', this.transactions)
  }
};
</script>

<style scoped>
.bordered {
  border: 2px solid green;
}
</style>
