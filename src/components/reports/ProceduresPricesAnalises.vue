<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12 class="mb-4">
                <v-btn v-if="allLoaded" class="primary rounded" @click="beginAnalises">Iniciar Analise</v-btn>
                <v-progress-circular v-else class="primary--text" indeterminate></v-progress-circular>
                <v-text-field
                v-model="idealProfitPercentage"
                label="Porcentagem Ideal de Lucro"></v-text-field>
            </v-flex>
            <v-flex xs12>
                <v-card flat style="border: 2px solid black">
                    <v-layout row wrap>
                        <v-flex xs2>
                            Clínica
                        </v-flex>
                        <v-flex xs9>
                            <v-layout row wrap>
                                <v-flex xs4>
                                    Exame
                                </v-flex>
                                <v-flex xs2>
                                    Custo/Preço
                                </v-flex>
                                <v-flex xs2>
                                    Custo Ideal
                                </v-flex>
                                <v-flex xs2>
                                    Preço Ideal
                                </v-flex>
                                <v-flex xs2>
                                    Lucro
                                </v-flex>
                            </v-layout>
                        </v-flex>

                        <v-flex xs12>
                            <v-layout row wrap class="align-center py-2" v-for="clinic in clinics" :key="clinic.name">
                                <v-flex xs12>
                                    <v-divider class="black"></v-divider>
                                </v-flex>
                                <v-flex xs2>
                                    {{clinic.name}}
                                </v-flex>
                                <v-divider vertical></v-divider>
                                <v-flex xs9>
                                    <v-layout column wrap class="ma-0 pa-0">
                                        <v-flex xs12 v-for="exam in clinic.exams" :key="clinic.name + exam.name">
                                            <v-divider></v-divider>
                                            <v-layout row wrap class="align-center ma-0 pa-0">
                                                <v-flex xs4>
                                                    <span>{{exam.name}}</span>
                                                </v-flex>
                                                <v-flex xs2>
                                                    <span>{{exam.cost}}/{{exam.price}}</span>
                                                </v-flex>
                                                <v-flex xs2>
                                                    <span>{{getIdealCost(exam)}}</span>
                                                </v-flex>
                                                <v-flex xs2>
                                                    <span>{{getIdealPrice(exam)}}</span>
                                                </v-flex>
                                                <v-flex xs2>
                                                    <span :class="[getProfitPercentage(exam) < idealProfitPercentage / 100 ? 'red--text' : '']">{{(getProfitPercentage(exam) * 100).toFixed(2)}}%</span>
                                                </v-flex>
                                            </v-layout>
                                            <v-divider></v-divider>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs12>
                                    <v-divider class="black"></v-divider>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        name: "ProceduresPricesAnalises",
        data() {
            return {
                loading: false,
                idealProfitPercentage: 105
            }
        },
        computed: {
            exams() {
                return this.$store.getters.exams
            },
            clinics() {
                return this.$store.getters.clinics
            },
            allLoaded() {
                return this.$store.getters.clinicsLoaded && !this.loading
            }
        },
        methods: {
            async getClinicExams(clinic) {
                let exams = await this.$store.dispatch('getClinicExams', clinic)
                clinic.exams = exams
            },
            async beginAnalises() {
                this.loading = true
                for (let clinic in this.clinics) {
                    await this.getClinicExams(this.clinics[clinic])
                }
                this.loading = false
            },
            getIdealCost(exam) {
                return (exam.price / (1 + this.idealProfitPercentage / 100)).toFixed(2)
            },
            getIdealPrice(exam) {
                return (exam.cost + (this.idealProfitPercentage / 100 * exam.cost)).toFixed(2)
            },
            getProfitPercentage(exam) {
                return ((exam.price - exam.cost) / exam.cost)
            }
        }
    }
</script>

<style scoped>

</style>
