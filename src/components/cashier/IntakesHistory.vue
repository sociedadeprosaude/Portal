<template>
    <v-container class="my-0 py-0">
        <v-card class="pa-2">
            <v-layout row wrap>
                <v-flex xs12>
                    <span class="my-headline" style="font-size: 1.3em">
                        Histórico
                    </span>
                </v-flex>
                <v-flex xs12>
                    <v-btn-toggle
                            v-model="option"
                            tile
                            color="deep-purple accent-3"
                            group
                            mandatory
                    >
                        <v-btn value="intakes">
                            Vendas
                        </v-btn>
                        <v-btn value="budgets">
                            Orçamentos
                        </v-btn>
                    </v-btn-toggle>
                </v-flex>
                <div v-if="option === 'intakes'">
                    <v-flex xs12 v-for="intake in intakes" :key="intake.id">
                        <v-card :class="['my-2 pa-2', diffByNow(intake) < 30000 ? 'green' : '']">
                            <v-layout row wrap>
                                <v-flex xs12 class="text-left">
                            <span class="my-sub-headline">
                                {{intake.date | dateFilter}}
                            </span>
                                </v-flex>
                                <v-flex xs12 class="text-left">
                            <span class="my-sub-headline">
                                {{intake.id}}
                            </span>
                                </v-flex>
                                <v-flex xs12 class="text-left">
                            <span>
                                {{intake.payment_method}}
                            </span>
                                </v-flex>
                                <v-flex xs12 class="text-left">
                            <span class="my-sub-headline">
                                R$ {{intake.total}}
                            </span>
                                </v-flex>
                            </v-layout>
                        </v-card>
                    </v-flex>
                </div>
                <div v-if="option === 'budgets'">
                    <v-flex xs12 v-for="budget in budgets" :key="budget.id">
                        <v-card ripple class=" my-2 pa-2" @click="selectBudget(budget)">
                            <v-layout row wrap>
                                <v-flex xs10 class="text-left">
                            <span class="my-sub-headline">
                                {{budget.date | dateFilter}}
                            </span>
                                </v-flex>
                                <v-flex xs2>
                                    <v-progress-circular indeterminate v-if="loading" class="primary--text"></v-progress-circular>
                                </v-flex>
                                <v-flex xs12 class="text-left">
                            <span class="my-sub-headline">
                                {{budget.id}}
                            </span>
                                </v-flex>
                                <v-flex xs12 class="text-left">
                            <span>
                                {{budget.payment_method}}
                            </span>
                                </v-flex>
                                <v-flex xs12 class="text-left">
                            <span class="my-sub-headline">
                                R$ {{budget.total}}
                            </span>
                                </v-flex>
                            </v-layout>
                        </v-card>
                    </v-flex>
                </div>
            </v-layout>
        </v-card>
    </v-container>
</template>

<script>
    export default {
        name: "IntakesHistory",
        data() {
            return {
                option: 'budgets',
                loading: false
            }
        },
        methods: {
            async selectBudget(budget) {
                this.loading = true
                budget = await this.$store.dispatch('getBudget', budget.id.toString())
                this.$store.commit('clearShoppingCartItens')
                this.$store.commit('setSelectedBudget', budget)
                // this.selectedBudget = budget
                for (let exam in budget.exams) {
                    this.$store.commit('addShoppingCartItem', budget.exams[exam])
                }
                for (let spec in budget.specialties) {
                    this.$store.commit('addShoppingCartItem', budget.specialties[spec])
                }
                this.loading = false
                // this.$store.commit('setSelectedPatient', budget.user)
            },
            diffByNow(product) {
                let now = moment()
                let date = moment(product.date, 'YYYY-MM-DD HH:mm:ss')
                return now.valueOf() - date.valueOf()
            }
        },
        computed: {
            patient() {
                return this.$store.getters.selectedPatient
            },
            intakes() {
                return this.patient.intakes.sort((a, b) => {
                    if (a.date < b.date) {
                        return 1
                    }
                    return -1
                })
            },
            budgets() {
                return this.patient.budgets.sort((a, b) => {
                    if (a.date < b.date) {
                        return 1
                    }
                    return -1
                })
            }
        }
    }
</script>

<style scoped>

</style>
