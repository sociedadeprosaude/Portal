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
                <v-layout row wrap>
                    <v-chip-group
                            row
                            mandatory
                            v-model="selectedType"
                            active-class="primary--text">
                        <v-chip v-for="type in types" :key="type">
                            {{ type }}
                        </v-chip>
                    </v-chip-group>
                    <v-divider vertical class="mr-2"></v-divider>
                    <v-chip-group
                            row
                            mandatory
                            v-model="showOption"
                            active-class="primary--text">
                        <v-chip v-for="type in showOptions" :key="type">
                            {{ type }}
                        </v-chip>
                    </v-chip-group>
                </v-layout>
            </v-flex>
            <v-flex xs12 id="card-to-print" v-if="selectedType === 0">
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
                                        <v-flex xs12 v-for="exam in filterExams(clinic.exams)"
                                                :key="clinic.name + exam.name">
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
            <v-flex xs12 id="card-to-print" v-else>
                <v-card flat style="border: 2px solid black">
                    <v-layout row wrap>
                        <v-flex xs2>
                            Exames
                        </v-flex>
                        <v-flex xs9>
                            <v-layout row wrap>
                                <v-flex xs4>
                                    Clínica
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
                            <v-layout row wrap class="align-center py-2" v-for="clinic in this.exams"
                                      :key="clinic.name">
                                <v-flex xs12>
                                    <v-divider class="black"></v-divider>
                                </v-flex>
                                <v-flex xs2>
                                    {{clinic.name}}
                                </v-flex>
                                <v-divider vertical></v-divider>
                                <v-flex xs9>
                                    <v-layout column wrap class="ma-0 pa-0">
                                        <v-flex xs12 v-for="exam in filterClinics(clinic.clinics)" :key="clinic.name + exam.name">
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
                idealProfitPercentage: 105,
                selectedType: 0,
                types: ['Por Clinicas', 'Por Exames'],
                showOptions: ['Tudo', 'Somente as falhas'],
                showOption: 0
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
            filterExams(exams) {
                if (this.showOption === 0) {
                    return exams
                }
                return exams.filter((exam) => {
                    return this.getProfitPercentage(exam) < this.idealProfitPercentage / 100
                })
            },
            filterClinics(clinics) {
                if (this.showOption === 0) {
                    return clinics
                }
                return clinics.filter((exam) => {
                    return this.getProfitPercentage(exam) < this.idealProfitPercentage / 100
                })
            },
            async getClinicExams(clinic) {
                let exams = await this.$store.dispatch('getClinicExams', clinic)
                clinic.exams = exams
            },
            async beginAnalises() {
                this.loading = true
                for (let clinic in this.clinics) {
                    await this.getClinicExams(this.clinics[clinic])
                }
                this.$store.commit('setExams', this.turnClinicsInExams())
                this.loading = false
            },
            turnClinicsInExams() {
                let exams = {}
                for (let clinic of this.clinics) {
                    for (let exam of clinic.exams) {
                        if (!exams[exam.name]) {
                            exams[exam.name] = {
                                name: exam.name,
                                clinics: [{
                                    ...clinic,
                                    cost: exam.cost,
                                    price: exam.price
                                }]
                            }
                        } else {
                            exams[exam.name].clinics.push({
                                ...clinic,
                                cost: exam.cost,
                                price: exam.price
                            })
                        }
                    }
                }
                return exams
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
