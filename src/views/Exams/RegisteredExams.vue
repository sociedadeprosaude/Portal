<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12 class="mx-4">
                <v-text-field
                        label="Solo"
                        placeholder="Codigo do recibo"
                        solo
                        v-model="search"
                ></v-text-field>
            </v-flex>
            <v-flex xs2
                    class="text-xs-center ma-3"
                    :key="index"
                    v-for="(budget, index) in registeredBudgetCodes"
            >
                <v-card :class="budget.verified ? 'primary' : ''"
                        @click="registerBudget(budget)" ripple hover>
                    <v-card-title>
                        {{budget.code}}
                    </v-card-title>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        name: "RegisteredExams",
        data() {
            return {
                search: ''
            }
        },
        computed: {
            registeredBudgetCodes() {
                return this.$store.getters.registeredBudgetCodes.filter((a) => {
                    return a.code.includes(this.search)
                })
            },
            user() {
                return this.$store.getters.user
            }
        },
        methods: {
            registerBudget(budget) {
                this.$store.dispatch('registerBudget', {
                    budgetCode: budget.code,
                    verified: !budget.verified,
                    user: this.user
                })
            }
        },
        mounted() {
            this.$store.dispatch('getBudgets')
        }
    }
</script>

<style scoped>

</style>
