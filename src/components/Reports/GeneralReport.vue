<template>
  <v-container>
    <v-row v-if="transactions && transactions.length > 0" style="font-size: 0.8em">
      <v-col cols="12" class="pa-0">
        <v-card class="pa-4 receipt-to-print">
          <v-row>
            <v-col cols="6" class="pa-0">
              <v-row>
                <v-col cols="12" align="start" class="py-0">
                  <span class="my-sub-headline mb-4 mx-4">Relatório Geral</span>
                </v-col>
                <v-col cols="12" align="start" class="py-0">
                  <span class="mx-4">{{ transactions[0].date.formatted | dateFilter }} - {{ transactions[transactions.length - 1].date.formatted | dateFilter }}</span>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" class="pa-0">
              <v-row row wrap class="mt-2">
                <v-col cols="12" class="pa-0">
                  <v-divider></v-divider>
                </v-col>
                <v-col cols="1" class="pa-0">
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col cols="3" class="pa-0">Procedimento</v-col>
                <v-col cols="1" class="pa-0">
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col cols="3" class="pa-0">Quantidade</v-col>
                <v-col cols="1" class="pa-0">
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col cols="2" class="pa-0">R$</v-col>
                <v-col cols="1" class="pa-0">
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col cols="12" class="pa-0">
                  <v-divider></v-divider>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12" v-for="i in 2" :key="i" class="my-4">
              <strong v-if="i === 1">
                Entradas
              </strong>
              <strong v-if="i === 2">
                Saídas
              </strong>
              <v-row v-for="(productTransactions, index) in transactionByProduct.filter(p => i === 1 ? p.price >= 0 : p.price < 0)" :key="index">
                <v-col cols="12" class="pa-0">
                  <v-divider></v-divider>
                </v-col>
                <v-col cols="1" class="pa-0">
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col cols="3" class="pa-0">{{ productTransactions.name }}</v-col>
                <v-col cols="1" class="pa-0">
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col cols="3" class="pa-0">{{ productTransactions.quantity }}</v-col>
                <v-col cols="1" class="pa-0">
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col cols="2" class="pa-0">{{ productTransactions.price }}</v-col>
                <v-col cols="1" class="pa-0">
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col cols="12" class="pa-0">
                  <v-divider></v-divider>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" class="pa-0">
                  <v-divider></v-divider>
                </v-col>
                <v-col cols="1" class="pa-0">
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col cols="3" class="pa-0">Total</v-col>
                <v-col cols="1" class="pa-0">
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col cols="3" class="pa-0">{{ getTotalSumOfProductTransactions(transactionByProduct.filter(p => i === 1 ? p.price >= 0 : p.price < 0)) }}</v-col>
                <v-col cols="1" class="pa-0">
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col cols="2" class="pa-0">{{ getTotalPriceOfProductTransactions(transactionByProduct.filter(p => i === 1 ? p.price >= 0 : p.price < 0)) }}</v-col>
                <v-col cols="1" class="pa-0">
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col cols="12" class="pa-0">
                  <v-divider></v-divider>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-card class="pa-4">
        <strong>Nenhuma venda neste período</strong>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>

export default {
  props: [
    "transactions"
  ],
  computed: {
    transactionByProduct() {
      let products = {}
      for (let transaction of this.transactions) {
        if (transaction.produts.length > 0) {
          for (let product of transaction.produts) {
            if (!products[product.with_product.name]) {
              products[product.with_product.name] = {
                name: product.with_product.name || product.description,
                quantity: 0,
                price: 0,
                type: product.with_product.type
              }
            }
            products[product.with_product.name] = {
              name: product.with_product.name,
              quantity: products[product.with_product.name].quantity + 1,
              price: products[product.with_product.name].price + product.price,
              type: product.with_product.type
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
          return a.name.localeCompare(b.name)
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
  }
};
</script>

<style scoped>
.border {
  border: 1px solid grey;
}
</style>
