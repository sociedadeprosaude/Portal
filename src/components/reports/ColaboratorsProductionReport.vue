<template>
    <v-container>
        <v-layout row wrap class="justify-center">
            <v-flex xs12 class="text-center" v-if="!loading">
                <v-layout row wrap>
                    <v-card class="pa-3 ma-3" width="300px" v-for="(resume, name) in intakesResume" :key="name">
                        <v-layout row wrap>
                            <v-flex xs12 class="mb-4">
                                <span class="my-sub-headline">
                                    {{name}}
                                </span>
                            </v-flex>
                            <v-flex xs6>
                                <v-layout column wrap>
                                    <span v-for="i in 3" :key="i">{{Object.keys(resume)[i - 1]}}: {{resume[Object.keys(resume)[i - 1]]}}</span>
                                </v-layout>
                            </v-flex>
                            <v-divider vertical></v-divider>
                            <v-flex xs5>
                                <v-layout column wrap>
                                    <span v-for="i in 2" :key="i">{{Object.keys(resume)[i + 2]}}: {{resume[Object.keys(resume)[i + 2]]}}</span>
                                </v-layout>
                            </v-flex>
                        </v-layout>
                    </v-card>
                </v-layout>
            </v-flex>
            <v-flex xs12 class="text-center" v-else>
                <v-progress-circular indeterminate class="primary--text"></v-progress-circular>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        name: "ColabboratorsProductionReport",
        props: ['intakes', 'loading'],
        data() {
            return {
                colaborators: undefined,
                selectedColaborator: undefined,
                paymentMethods: ['Dinheiro', 'Crédito', 'Débito']
            }
        },
        computed: {
            intakesResume() {
                let resumes = {}
                for (let intake of this.intakes) {
                    if (!resumes[intake.colaborator.name]) {
                        resumes[intake.colaborator.name] = {
                            Dinheiro: 0.0,
                            Credito: 0.0,
                            Debito: 0.0,
                            Exames: 0,
                            Consultas: 0
                        }
                    }
                    if (intake.payments) {
                        for (let i = 0; i < intake.payments.length; i++) {
                            if (intake.payments[i] === 'Dinheiro') {
                                resumes[intake.colaborator.name].Dinheiro += parseFloat(intake.valuesPayments[i])
                            }
                            if (intake.payments[i] === 'Crédito') {
                                resumes[intake.colaborator.name].Credito += parseFloat(intake.valuesPayments[i])
                            }
                            if (intake.payments[i] === 'Débito' || intake.payments[i] === '') {
                                resumes[intake.colaborator.name].Debito += parseFloat(intake.valuesPayments[i])
                            }
                        }
                    } else {
                        resumes[intake.colaborator.name].Dinheiro += parseFloat(intake.total)
                    }
                    resumes[intake.colaborator.name][intake.payment_method] += intake.total
                    if (intake.exams) {
                        resumes[intake.colaborator.name].Exames = resumes[intake.colaborator.name].Exames ? intake.exams.length + resumes[intake.colaborator.name].Exames : intake.exams.length
                    }
                    if (intake.specialties) {
                        resumes[intake.colaborator.name].Consultas = resumes[intake.colaborator.name].Consultas ? intake.specialties.length + resumes[intake.colaborator.name].Consultas : intake.specialties.length
                    }
                }
                return resumes
            }
        },
    }
</script>

<style scoped>
</style>
