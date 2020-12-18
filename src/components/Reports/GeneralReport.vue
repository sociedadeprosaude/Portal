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
                                <v-flex xs4>
                                    <h4 v-if="filter === 'with_product'">Procedimento</h4>
                                    <h4 v-if="filter === 'with_clinic'">Clínica</h4>
                                </v-flex>
                                <v-flex xs2>
                                    <h4>Quantidade</h4>
                                </v-flex>
                                <v-flex xs2>
                                    <h4>Custo</h4>
                                </v-flex>
                                <v-flex xs2>
                                    <h4>Valor</h4>
                                </v-flex>
                                <v-flex xs2>
                                    <h4>%</h4>
                                </v-flex>

                            </v-layout>

                            <v-col cols="12" v-for="i in 2" :key="i" class="my-1 mx-0">
                                <strong v-if="i === 1">
                                    Entradas
                                </strong>
                                <strong v-if="i === 2">
                                    Saídas
                                </strong>
                                <v-row v-for="(productTransactions, index) in transactionByProduct.filter(p => i === 1 ? p.type === 'Product' : p.type === 'Bill')"
                                       :key="index">

                                    <v-col cols="4" class="pa-0 text-center">{{ productTransactions.name}}</v-col>

                                    <v-col cols="2" class="pa-0  text-center">{{ productTransactions.quantity }}</v-col>

                                    <v-col cols="2" class="pa-0  text-center">{{ i === 1 ? productTransactions.cost:
                                        -productTransactions.cost | moneyFilter }}
                                    </v-col>

                                    <v-col v-if="i===1" cols="2" class="pa-0  text-center">{{ productTransactions.price
                                        | moneyFilter }}
                                    </v-col>

                                    <v-col v-else cols="2" class="pa-0  text-center">{{
                                        ShowerCategories(productTransactions.categories) }}
                                    </v-col>

                                    <v-col v-if="(((productTransactions.price - productTransactions.cost)/productTransactions.cost)*100) >= 0"
                                           cols="2" class="pa-0 text-center">
                                        {{profitPercentage(productTransactions.price, productTransactions.cost)}}
                                    </v-col>
                                    <v-col v-else cols="2" class="pa-0 text-center colorText">
                                        {{profitPercentage(productTransactions.price, productTransactions.cost)}}
                                    </v-col>

                                </v-row>
                                <v-row class="background">
                                    <v-col cols="4" class="pa-0 text-center font-weight-bold">TOTAL</v-col>
                                    <v-col cols="4" class="pa-0 text-center font-weight-bold">{{
                                        getTotalSumOfProductTransactions(transactionByProduct.filter(p => i === 1 ?
                                        p.type === 'Product' : p.type === 'Bill')) }}
                                    </v-col>
                                    <v-col cols="4" class="pa-0 text-center font-weight-bold">{{
                                        getTotalPriceOfProductTransactions(transactionByProduct.filter(p => i === 1 ?
                                        p.type === 'Product' : p.type === 'Bill'), i) | moneyFilter
                                        }}
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="12">
                                <v-row class="background">
                                    <v-col cols="3"></v-col>
                                    <v-col cols="3" class="pa-0 text-center font-weight-bold">DINHEIRO</v-col>
                                    <v-col cols="3" class="pa-0 text-center font-weight-bold">CRÉDITO</v-col>
                                    <v-col cols="3" class="pa-0 text-center font-weight-bold">DÉBITO</v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="3" class="pa-0 text-center font-weight-bold">TOTAL</v-col>
                                    <v-col cols="3" class="pa-0 text-center font-weight-bold">{{ payments.money|
                                        moneyFilter }}
                                    </v-col>
                                    <v-col cols="3" class="pa-0 text-center font-weight-bold">{{ payments.credito|
                                        moneyFilter }}
                                    </v-col>
                                    <v-col cols="3" class="pa-0 text-center font-weight-bold">{{ payments.debito|
                                        moneyFilter }}
                                    </v-col>
                                    <v-col cols="3" class="pa-0 text-center font-weight-bold">TAXAS</v-col>
                                    <v-col cols="3" class="pa-0 text-center font-weight-bold">{{ 0| moneyFilter }}
                                    </v-col>
                                    <v-col cols="3" class="pa-0 text-center font-weight-bold">{{
                                        payments.taxaCredito.toFixed(6) }}
                                    </v-col>
                                    <v-col cols="3" class="pa-0 text-center font-weight-bold">{{
                                        payments.taxaDebito.toFixed(6) }}
                                    </v-col>
                                </v-row>
                                <v-row class="background">
                                    <v-col cols="4" class="pa-0 text-center font-weight-bold">TOTAL BRUTO</v-col>
                                    <v-col cols="4" class="pa-0 text-center font-weight-bold">TOTAL SAIDAS</v-col>
                                    <v-col cols="4" class="pa-0 text-center font-weight-bold">TOTAL LIQUIDO</v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="4" class="pa-0 text-center font-weight-bold">{{
                                        getTotalPriceOfProductTransactions(transactionByProduct.filter(p => p.type ===
                                        'Product'), 1) | moneyFilter
                                        }}
                                    </v-col>
                                    <v-col cols="4" class="pa-0 text-center font-weight-bold">{{
                                        getTotalPriceOfProductTransactions(transactionByProduct.filter(p => p.type ===
                                        'Bill'), 2) | moneyFilter
                                        }}
                                    </v-col>
                                    <v-col cols="4" class="pa-0 text-center font-weight-bold">{{
                                        getTotalValue(transactions)| moneyFilter
                                        }}
                                    </v-col>
                                </v-row>
                                <v-row class="background">
                                    <v-col cols="4" class="pa-0 text-center font-weight-bold">TOTAL BRUTO</v-col>
                                    <v-col cols="4" class="pa-0 text-center font-weight-bold">SAIDAS ESPERADAS</v-col>
                                    <v-col cols="4" class="pa-0 text-center font-weight-bold">TOTAL LIQUIDO</v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="4" class="pa-0 text-center font-weight-bold">{{
                                        getTotalPriceOfProductTransactions(transactionByProduct.filter(p => p.type ===
                                        'Product'), 1) | moneyFilter
                                        }}
                                    </v-col>
                                    <v-col cols="4" class="pa-0 text-center font-weight-bold">{{
                                        getTotalCostOfProductTransactions(transactionByProduct.filter(p => p.type ===
                                        'Product'), 1) | moneyFilter
                                        }}
                                    </v-col>
                                    <v-col cols="4" class="pa-0 text-center font-weight-bold">{{
                                        estimatedTotal(
                                        parseFloat(getTotalPriceOfProductTransactions(transactionByProduct.filter(p =>
                                        p.type === 'Product'), 1)),
                                        parseFloat(getTotalCostOfProductTransactions(transactionByProduct.filter(p =>
                                        p.type === 'Product'), 1))) | moneyFilter
                                        }}
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
    import constants from "@/utils/constants";

    export default {
        props: [
            "transactions"
        ],
        mounted() {
            console.log('tra', this.transactions)
        },
        data() {
            return {
                filter: 'with_product',
                transactionProduct: []
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
                                    type: 'Product'
                                    // type: product[this.filter].type
                                }
                            }
                            let cost = product.averageCost ? product.averageCost : 0

                            products[product[this.filter] ? product[this.filter].name : 'Error'] = {
                                name: product[this.filter] ? product[this.filter].name : 'Error',
                                quantity: products[product[this.filter] ? product[this.filter].name : 'Error'].quantity + 1,
                                price: products[product[this.filter] ? product[this.filter].name : 'Error'].price + product.price,
                                cost: products[product[this.filter] ? product[this.filter].name : 'Error'].cost + cost,
                                type: products[product[this.filter] ? product[this.filter].name : 'Error'].type

                                //type: product[this.filter] ? product[this.filter].type : 'Error'
                            }
                        }
                    } else {
                        if (!products[transaction.description]) {
                            products[transaction.description] = {
                                name: transaction.description,
                                quantity: 0,
                                cost: 0,
                                type: 'Bill',
                                categories: transaction.categories
                            }
                        }
                        console.log('Bill: ', transaction)
                        products[transaction.description] = {
                            name: products[transaction.description].name,
                            quantity: products[transaction.description].quantity + 1,
                            cost: products[transaction.description].cost + transaction.value,
                            type: products[transaction.description].type,
                            categories: transaction.categories
                        }
                        console.log('transaction bill: ', products[transaction.description])
                    }
                }
                return Object.values(products).sort((a, b) => {
                    if (a.type === b.type) {
                        return a.name ? a.name.localeCompare(b.name ? b.name : '') : 0
                    }
                    if (a.type === 'SPECIALTY') return -1
                    return 1
                })
            },
            payments() {
                let money = 0
                let credito = 0
                let debito = 0
                let taxaCredito = 0
                let taxaDebito = 0
                for (let transaction of this.transactions) {
                    if (transaction.value > 0) {
                        for (let payment in transaction.payment_methods) {
                            if (transaction.payment_methods[payment] === 'Dinheiro') {
                                money += transaction.payments[payment]
                            } else if (transaction.payment_methods[payment] === 'Crédito') {
                                credito += transaction.payments[payment]
                                if (transaction.parcels[payment] === '1') {
                                    taxaCredito += constants.PAYMENT_METHODS.credit.INITIAL_TAX
                                } else {
                                    let tax = parseInt(transaction.parcels[payment]) - 2
                                    taxaCredito += constants.PAYMENT_METHODS.credit.PARCEL_TAX[tax]
                                }
                            } else if (transaction.payment_methods[payment] === 'Débito') {
                                debito += transaction.payments[payment]
                                taxaDebito += constants.PAYMENT_METHODS.debit.INITIAL_TAX
                            }
                        }
                    }
                }
                let payments = {}
                payments.money = money
                payments.credito = credito
                payments.debito = debito
                payments.taxaCredito = taxaCredito
                payments.taxaDebito = taxaDebito
                return payments
            }
          }
        }
      }
      let payments= {}
      payments.money = money
      payments.credito = credito
      payments.debito = debito
      payments.taxaCredito = taxaCredito
      payments.taxaDebito = taxaDebito
      return payments
    }
  },
  methods: {
    ShowerCategories(Categories){
      let ShowerCategories = ''
      Categories.map(e => {
        ShowerCategories += ', '+ e.name
      })
      return ShowerCategories.substring(1,)
    },
        getTotalSumOfProductTransactions(productTransactions) {
          return productTransactions.reduce((acc, transaction) => {
            return acc + transaction.quantity
          }, 0)
        },
        getTotalPriceOfProductTransactions(productTransactions,i) {
          if(i === 1){
            return productTransactions.reduce((acc, transaction) => {
              return acc + transaction.price
            }, 0)
          }
          else{
            return productTransactions.reduce((acc, transaction) => {
              return acc + transaction.cost
            }, 0)
          }
        },
        methods: {
            ShowerCategories(Categories) {
                let ShowerCategories = '';
                Categories.map(e => {
                    ShowerCategories += ', ' + e.name
                });
                return ShowerCategories
            },
            getTotalSumOfProductTransactions(productTransactions) {
                return productTransactions.reduce((acc, transaction) => {
                    return acc + transaction.quantity
                }, 0)
            },
            getTotalPriceOfProductTransactions(productTransactions, i) {
                if (i === 1) {
                    return productTransactions.reduce((acc, transaction) => {
                        return acc + transaction.price
                    }, 0)
                } else {
                    return productTransactions.reduce((acc, transaction) => {
                        return acc + transaction.cost
                    }, 0)
                }
            },
            getTotalCostOfProductTransactions(productTransactions, i) {
                return productTransactions.reduce((acc, transaction) => {
                    return acc + transaction.cost
                }, 0)

            },
            getTotalValue(transaction) {
                return transaction.reduce((acc, t) => {
                    return acc + t.value
                }, 0)
            },
            profitPercentage(price, cost) {
                if (price >= 0) {
                    return (((price - cost) / cost) * 100).toFixed(2) + '%'
                } else {
                    return ''
                }
            },
            estimatedTotal(bruto, custo) {
                return parseFloat(bruto) - parseFloat(custo)
            }


        }
    };
</script>

<style scoped>
    .border {
        border: 1px solid grey;
    }

    .colorText {
        color: red;
    }
</style>