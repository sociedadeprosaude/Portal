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
    import constants from "../../utils/constants";

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
                let resumes = {
                    // Dinheiro: 0.0,
                    // Crédito: 0.0,
                    // Débito: 0.0,
                    // Exames: 0,
                    // Consultas: 0
                }

                for (let intake in this.intakes) {
                    console.log('intake', this.intakes[intake]);
                    if (!resumes[this.intakes[intake].colaborator.name]) {
                        resumes[this.intakes[intake].colaborator.name] = {
                            Dinheiro: 0.0,
                            Credito: 0.0,
                            Debito: 0.0,
                            Exames: 0,
                            Consultas: 0
                        }
                    }
                    for(let i=0; i< this.intakes[intake].payments.length; i++){
                        if(this.intakes[intake].payments[i] === 'Dinheiro'){
                            resumes[this.intakes[intake].colaborator.name].Dinheiro += parseFloat(this.intakes[intake].valuesPayments[i])
                        }
                        if(this.intakes[intake].payments[i] === 'Crédito'){
                            resumes[this.intakes[intake].colaborator.name].Credito += parseFloat(this.intakes[intake].valuesPayments[i])
                        }
                        if(this.intakes[intake].payments[i] === 'Débito'){
                            resumes[this.intakes[intake].colaborator.name].Debito += parseFloat(this.intakes[intake].valuesPayments[i])
                        }
                    }
                    resumes[this.intakes[intake].colaborator.name][this.intakes[intake].payment_method] += this.intakes[intake].total
                    resumes[this.intakes[intake].colaborator.name].Exames = resumes[this.intakes[intake].colaborator.name].Exames ? this.intakes[intake].exams.length + resumes[this.intakes[intake].colaborator.name].Exames : this.intakes[intake].exams.length
                    resumes[this.intakes[intake].colaborator.name].Consultas = resumes[this.intakes[intake].colaborator.name].Consultas ? this.intakes[intake].specialties.length + resumes[this.intakes[intake].colaborator.name].Consultas : this.intakes[intake].specialties.length
                }
                return resumes
            }
        },
        // watch: {
        //     selectedColaborator(val) {
        //         if (val) {
        //             this.getIntakes(val)
        //         }
        //     }
        // },
        methods: {
            // async getIntakes(colab) {
            //     this.intakes = await this.$store.dispatch('getColaboratorIntakes', colab)
            // },
            // async getColaborators() {
            //     this.colaborators = await this.$store.dispatch('searchUser', {
            //         type: 'colaborator'
            //     })
            //     console.log(this.colaborators)
            // }
        },
        // mounted() {
        //     this.getColaborators()
        // }
    }
</script>

<style scoped>

</style>
