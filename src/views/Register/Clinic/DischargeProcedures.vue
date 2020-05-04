<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs11>
                <v-text-field
                label="Digite o Número de Prótocolo"
                v-model="numberIntake"
                outlined
                >
                </v-text-field>
            </v-flex>
            <v-flex xs1>
                <v-btn @click="SearchIntake(numberIntake)"
                       rounded
                       fab
                       small
                       class="primary mt-2">
                    <v-icon>search</v-icon>
                </v-btn>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex xs12>
                <v-divider/>
            </v-flex>
            <p :if="intakes" class="mt-3 font-italic font-weight-bold"> Paciente: {{intakes.patient}}</p>
            <v-flex xs12>
                <v-divider/>
            </v-flex>
            <v-flex xs12 v-for="intake in intakes.exams">
                <v-card class="elevation-2 my-3">
                    <v-layout row wrap>
                        <v-flex xs3 class="align-center justify-center">
                            <p class="font-weight-black mt-5">
                                {{intake.name}}
                            </p>
                        </v-flex>
                        <v-flex xs1>
                            <v-divider class="primary" vertical/>
                        </v-flex>
                        <v-flex xs1 class="text-center align-center justify-center">
                            <p class="mt-5"> PREÇO: {{intake.price}}</p>
                        </v-flex>
                        <v-flex xs1>
                            <v-divider class="primary" vertical/>
                        </v-flex>
                        <v-flex xs2 class="mt-4">
                            <v-btn @click="ContestValue(intake)" rounded color="blue" text>Contestar Valor</v-btn>
                        </v-flex>
                        <v-flex xs1>
                            <v-divider class="primary" vertical/>
                        </v-flex>
                        <v-flex xs2>
                            <v-checkbox v-model="intake.realized" color="success" label="Exame Realizado"/>
                        </v-flex>
                    </v-layout>
                    </v-card>
            </v-flex>
            <v-flex xs12>
                <v-divider class="my-3"/>
            </v-flex>
            <v-spacer/>
            <v-flex xs11/>
            <v-flex xs1>
                <v-btn color="success" @click="SendCheckExams"> Enviar</v-btn>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import {mask} from "vue-the-mask";

    export default {
        name: "DischargeProcedures",
        directives: {
            mask
        },
        data() {
            return {
                numberIntake:''
            };
        },
        methods: {
            SearchIntake(number){
                this.$store.dispatch('getSpecificIntake',{number:number, cnpj: this.user.cnpj})
            },
            ContestValue(intake){

            },
            SendCheckExams(){


            }
        },
        computed: {
            user() {
                return this.$store.getters.user
            },
            intakes(){
                return this.$store.getters.intakesClinic
            }
        }
    };
</script>
