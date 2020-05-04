<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs10>
                <v-text-field
                label="Digite o Número de Prótocolo"
                v-model="numberIntake"
                >
                </v-text-field>
            </v-flex>
            <v-flex xs2>
                <v-btn @click="SearchIntake(numberIntake)"
                       rounded
                       class="primary">
                    <v-icon>search</v-icon>
                </v-btn>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex xs12>
                <v-divider></v-divider>
            </v-flex>
            <p :if="intakes"> Paciente: {{intakes.patient}}</p>
            <v-flex xs12>
                <v-divider></v-divider>
            </v-flex>
            <v-flex xs12 v-for="intake in intakes.exams">
                <v-card class="elevation-2">
                    <v-layout row wrap>
                        <v-flex xs3>
                            <p class="font-weight-black text-center align-center justify-center">
                                {{intake.name}}
                            </p>
                        </v-flex>
                        <v-flex xs1>
                            <v-divider vertical></v-divider>
                        </v-flex>
                        <v-flex xs1 class="text-center align-center justify-center">
                            <p> PREÇO: {{intake.price}}</p>
                        </v-flex>
                        <v-flex xs1>
                            <v-divider vertical></v-divider>
                        </v-flex>
                        <v-flex xs2>
                            <v-btn @click="ContestValue(intake)" rounded color="blue">Contestar Valor</v-btn>
                        </v-flex>
                        <v-flex xs1>
                            <v-divider vertical></v-divider>
                        </v-flex>
                        <v-flex xs2>
                            <v-checkbox v-model="intake.realized"  label="Exame Realizado"></v-checkbox>
                        </v-flex>
                    </v-layout>
                    </v-card>
            </v-flex>
            <v-flex xs12>
                <v-divider></v-divider>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex xs11></v-flex>
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
