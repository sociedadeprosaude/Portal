<template>
    <v-container>
        <v-layout row wrap v-if="!loading">
            <v-flex xs12>
                <span class="my-headline white--text"> {{initialDate}} - {{finalDate}}</span>
            </v-flex>
            <v-flex class="my-2" xs12 v-for="colab in colaboratorsReport" :key="colab.name">
                <v-layout row wrap>
                    <v-card class="pa-4">
                        <span>{{colab.name}}</span>
                        <v-divider vertical class="mx-3"></v-divider>
                        <span>{{colab.quantity}}</span>
                        <v-divider vertical class="mx-3"></v-divider>
                        <span>R$ {{getValueOfColab(colab)}}</span>
                    </v-card>
                </v-layout>
            </v-flex>
            <v-flex xs12>
                <v-divider class="my-2"></v-divider>
            </v-flex>
            <v-flex class="my-2" xs12 v-for="colab in listOfVerifiers" :key="colab.id">
                <v-layout row wrap>
                    <v-card class="pa-4">
                        <span>{{colab.name}}</span>
                        <v-divider vertical class="mx-3"></v-divider>
                        <span>{{colab.quantity}}</span>
                    </v-card>
                </v-layout>
            </v-flex>
        </v-layout>
        <v-layout v-else class="align-center">
            <v-flex xs12 class="text--center">
                <v-progress-circular color="white" indeterminate></v-progress-circular>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        name: "Reports",
        data() {
            return {
                loading: true,
                initialDate: '01-10-2019 00:00',
                finalDate: '01-11-2019 00:00'
            }
        },
        computed: {
            budgets() {
                return this.$store.getters.budgetList
            },
            listOfVerifiers() {
                let res = {}
                for (let budget in this.budgets) {
                    if (!this.budgets[budget].verified) continue
                    if (!res[this.budgets[budget].verified_by]) {
                        res[this.budgets[budget].verified_by] = {
                            quantity: 0,
                            name: this.budgets[budget].verified_by
                        }
                    }
                    res[this.budgets[budget].verified_by].quantity = res[this.budgets[budget].verified_by].quantity + 1
                }
                return res
            },
            colaboratorsReport() {
                let res = {}
                for (let budget in this.budgets) {
                    if (!this.budgets[budget].verified) continue
                    let initialDate = moment(this.initialDate, 'DD-MM-YYYY')
                    let finallDate = moment(this.finalDate, 'DD-MM-YYYY')
                    let budgetDate = moment(this.budgets[budget].date, 'DD-MM-YYYY')
                    if(!budgetDate.isAfter(initialDate) || !budgetDate.isBefore(finallDate)) continue
                    if (!res[this.budgets[budget].colaborator]) {
                        res[this.budgets[budget].colaborator] = {
                            quantity: 0,
                            name: this.budgets[budget].colaborator,
                            date: this.budgets[budget].date
                        }
                    }
                    res[this.budgets[budget].colaborator].quantity = res[this.budgets[budget].colaborator].quantity + 1
                }
                return res
            }
        },
        methods: {
            getValueOfColab(colab) {
                let biggerColab = Object.values(this.colaboratorsReport).sort((a, b) => {
                    return b.quantity - a.quantity
                })
                biggerColab = biggerColab[0]
                console.log(biggerColab)
                return Math.floor(200 * colab.quantity / biggerColab.quantity)
            }
        },
        mounted() {
            this.$store.dispatch('getBudgetsByDate', {initialDate: this.initialDate, finalDate: this.finalDate})
                .then(() => {
                    this.loading = false
                })
        }
    }
</script>

<style scoped>

</style>
