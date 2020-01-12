<template>
    <v-container>
        <v-layout row wrap>
            <v-card>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-layout row wrap>
                            <v-flex xs4>
                                <span>Nome</span>
                            </v-flex>
                            <v-spacer></v-spacer>
                            <v-flex xs3 class="text-center">
                                <span>Salario</span>
                            </v-flex>
                            <v-spacer></v-spacer>
                            <v-flex xs3>
                                <span>Adiantamentos</span>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                    <v-flex xs12>
                        <v-divider></v-divider>
                    </v-flex>
                    <v-flex xs12 v-for="colab in colaborators" :key="colab.name">
                        <v-layout row wrap>
                            <v-flex xs4>
                                <span>{{colab.name}}</span>
                            </v-flex>
                            <v-spacer></v-spacer>
                            <v-flex xs3 class="text-center">
                                <span>{{colab.salary}}</span>
                            </v-flex>
                            <v-spacer></v-spacer>
                            <v-flex xs3>
                                <span>{{sumUserAdvances(colab)}}</span>
                            </v-flex>
                            <v-flex xs12>
                                <v-divider></v-divider>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                    <v-flex xs12>
                        <v-layout row wrap>
                            <v-flex xs4>
                                <span>Total</span>
                            </v-flex>
                            <v-spacer></v-spacer>
                            <v-flex xs3 class="text-center">
                                <span>{{sumSalaries()}}</span>
                            </v-flex>
                            <v-spacer></v-spacer>
                            <v-flex xs3>
                                <span>{{sumAdvances()}}</span>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-card>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        name: "PaymenyReport",
        props: ['colaborators'],
        methods: {
            sumUserAdvances(user) {
                let advanceTotal = 0
                for (let advance in user.advances) {
                    advanceTotal += user.advances[advance].value
                }
                return advanceTotal
            },
            sumSalaries() {
                let salaryTotal = 0
                this.colaborators.forEach((user) => {
                    salaryTotal += user.salary ? user.salary : 0
                })
                return salaryTotal
            },
            sumAdvances() {
                let advanceTotal = 0
                this.colaborators.forEach((user) => {
                    for (let advance in user.advances) {
                        advanceTotal += user.advances[advance].value
                    }
                })
                return advanceTotal
            }
        }
    }
</script>

<style scoped>

</style>
