<template>
  <v-container>
    <v-card class="background pa-4 justify-center mb-3">
      <v-row v-if="transactions && transactions.length > 0" style="font-size: 0.8em" class="mt-n3">
        <v-col cols="8" class="pt-0 mt-0 ">
          <v-chip-group mandatory active-class="primary white--text">
            <v-chip @click="filter = 'with_product'" style="font-size: 0.8em">Por procedimento</v-chip>
            <v-chip @click="filter = 'with_clinic'" style="font-size: 0.8em">Por clinica</v-chip>
          </v-chip-group>
        </v-col>
        <v-col cols="4" class="text-right pt-1">
          <span class="my-sub-headline">Relatório Geral</span>
          <br/>
          <span>{{ transactions[0].date.formatted | dateFilter }} | {{ transactions[transactions.length - 1].date.formatted | dateFilter }}</span>
        </v-col>
        <v-col cols="12" class="pa-2 pt-0">
          <v-card class="pa-4 receipt-to-print">
            <v-row>
              <v-layout row wrap class="blue_grey">
                <v-flex xs3>
                  <h4 v-if="filter === 'with_product'">Procedimento</h4>
                  <h4 v-if="filter === 'with_clinic'">Clínica</h4>
                </v-flex>
                <v-flex xs3>
                  <h4>Quantidade</h4>
                </v-flex>
                <v-flex xs3>
                  <h4>Custo</h4>
                </v-flex>
                <v-flex xs3>
                  <h4>Valor</h4>
                </v-flex>

              </v-layout>

              <v-col cols="12" v-for="i in 2" :key="i" class="my-1 mx-0">
                <strong v-if="i === 1">
                  Entradas
                </strong>
                <strong v-if="i === 2">
                  Saídas
                </strong>
                <v-row v-for="(productTransactions, index) in transactionByProduct.filter(p => i === 1 ? p.price >= 0 : p.price < 0)"
                       :key="index">

                  <v-col cols="3" class="pa-0 text-center">{{ productTransactions.name }}</v-col>

                  <v-col cols="3" class="pa-0  text-center">{{ productTransactions.quantity }}</v-col>

                  <v-col cols="3" class="pa-0  text-center">{{ productTransactions.cost | moneyFilter }}</v-col>

                  <v-col cols="3" class="pa-0  text-center">{{ productTransactions.price | moneyFilter }}</v-col>

                </v-row>
                <v-row class="background">
                  <v-col cols="4" class="pa-0 text-center font-weight-bold">TOTAL</v-col>
                  <v-col cols="4" class="pa-0 text-center font-weight-bold">{{
                      getTotalSumOfProductTransactions(transactionByProduct.filter(p => i === 1 ?
                          p.price >= 0 : p.price < 0)) }}
                  </v-col>
                  <v-col cols="4" class="pa-0 text-center font-weight-bold">{{
                      getTotalPriceOfProductTransactions(transactionByProduct.filter(p => i === 1 ?
                          p.price >= 0 : p.price < 0)) | moneyFilter }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-row class="background">
                  <v-col cols="4" class="pa-0 text-center font-weight-bold">TOTAL</v-col>
                  <v-col cols="4"/>
                  <v-col cols="4" class="pa-0 text-center font-weight-bold">{{
                      getTotalValue(transactions)| moneyFilter }}
                  </v-col>
                </v-row>
              </v-col>

            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-else class="justify-center">
        <strong class="font-italic">Nenhuma venda neste período</strong>
      </v-row>
    </v-card>

  </v-container>
</template>

<script>
export default {
  props: [
    "transactions"
  ],
  mounted() {
    console.log('tra', this.transactions)
  },
  data() {
    return {
      filter: 'with_product'
    }
  },
  computed: {
    transactionByProduct() {
      let products = {}
      for (let transaction of this.transactions) {
        if (transaction.produts.length > 0) {
          for (let product of transaction.produts) {
            if (!products[product[this.filter] ? product[this.filter].name : 'Error']) {
              products[product[this.filter] ? product[this.filter].name : 'Error'] = {
                name: product[this.filter] ? product[this.filter].name : 'Error' || product.description,
                quantity: 0,
                cost: 0,
                price: 0,
                // type: product[this.filter].type
              }
            }
            console.log('transaction: , ', product)
            let cost = 0
            if(product.with_product.type === 'EXAM'){
              cost = this.$apollo.mutate({
                mutation: require('@/graphql/clinics/LoadCostProductClinic.gql'),
                variables: {idClinic:product.with_clinic.id, idProduct:produt.with_product.id}
              })
              cost = cost.data.CostProductClinic.cost
            }
            else{
              cost = this.$apollo.mutate({
                mutation: require('@/graphql/products/LoadProductSpecialtCost.gql'),
                variables: {idProduct:produt.with_product.id}
              })
              cost = cost.data.Product.averageCosts
            }
            products[product[this.filter] ? product[this.filter].name : 'Error'] = {
              name: product[this.filter] ? product[this.filter].name : 'Error',
              quantity: products[product[this.filter] ? product[this.filter].name : 'Error'].quantity + 1,
              price: products[product[this.filter] ? product[this.filter].name : 'Error'].price + product.price,
              cost: products[product[this.filter] ? product[this.filter].name : 'Error'].cost +cost
              // type: product[this.filter].type
            }
          }
        } else {
          if (!products[transaction.description]) {
            products[transaction.description] = {
              name: transaction.description,
              quantity: 0,
              price: 0,
              type: ''
            }
          }
          products[transaction.description] = {
            name: products[transaction.description].name,
            quantity: products[transaction.description].quantity + 1,
            price: products[transaction.description].price + transaction.value,
            type: products[transaction.description].type
          }
        }
      }
      return Object.values(products).sort((a, b) => {
        if (a.type === b.type) {
          return a.name ? a.name.localeCompare(b.name ? b.name : '') : 0
        }
        if (a.type === 'SPECIALTY') return -1
        return 1
      })
    }
  },
  methods: {
        getTotalSumOfProductTransactions(productTransactions) {
          return productTransactions.reduce((acc, transaction) => {
            return acc + transaction.quantity
          }, 0)
        },
        getTotalPriceOfProductTransactions(productTransactions) {
          return productTransactions.reduce((acc, transaction) => {
            return acc + transaction.price
          }, 0)
        },
        getTotalValue (transaction) {
          return transaction.reduce((acc, t) => {
            return acc + t.value
          }, 0)
        }
      }
};
</script>

<style scoped>
.border {
  border: 1px solid grey;
}
</style>