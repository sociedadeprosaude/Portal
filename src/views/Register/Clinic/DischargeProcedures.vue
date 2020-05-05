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
                            <v-btn @click="DividerContestValue(intake)" rounded color="blue" text>Contestar Valor</v-btn>
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
            <v-flex xs12 v-if="loading">
                <v-progress-linear color="primary" indeterminate/>
            </v-flex>
        </v-layout>
        <v-dialog v-model="successUpdateExams" persistent max-width="400">
            <v-card>
                <v-layout row wrap>
                    <v-flex xs12>
                        <p  class="mt-3 font-italic font-weight-bold">Atualizado Com Sucesso</p>
                    </v-flex>
                    <v-flex xs12>
                        <v-btn color="success" @click="successUpdateExams = !successUpdateExams">Fechar</v-btn>
                    </v-flex>
                </v-layout>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogContestValue" persistent max-width="400">
            <v-card>
                <v-layout row wrap>
                    <v-flex xs12>
                        <p  class="mt-3 font-italic font-weight-bold">Exame: {{ContestExam.name}}</p>
                    </v-flex>
                    <v-flex xs12>
                        <p>Valor Atual: {{ContestExam.price}}</p>
                    </v-flex>
                    <v-flex xs2>
                    <v-spacer></v-spacer>
                    </v-flex>
                    <v-flex xs8>
                        <v-text-field v-model="NewValue" label="Valor Correto"></v-text-field>
                    </v-flex>
                    <v-flex xs2>
                        <v-spacer></v-spacer>
                    </v-flex>
                    <v-flex xs12>
                        <v-btn color="success" @click="FunctionContestValue">Enviar</v-btn>
                    </v-flex>
                </v-layout>
            </v-card>
        </v-dialog>
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
                numberIntake:'',
                loading: false,
                successUpdateExams: false,
                dialogContestValue: false,
                ContestExam:[],
                NewValue: ''
            };
        },
        methods: {
            async SearchIntake(number){
                this.loading= true;
                await this.$store.dispatch('getSpecificIntake',{number:number, cnpj: this.user.cnpj})
                this.loading= false;
            },
            DividerContestValue(intake){
                this.dialogContestValue= true;
                this.ContestExam= intake
            },
            async FunctionContestValue(){
                let clinic= await this.$store.dispatch('getClinic', this.user.cnpj)
                this.ContestExam.NewValue = this.NewValue
                await this.$store.dispatch('addNewContestValue',{exams:this.ContestExam, value:this.NewValue, cnpj:this.user.cnpj, numberIntake:this.intakes.intakeNumber, clinic:clinic.docs[0].id})
                this.dialogContestValue = !this.dialogContestValue
                this.NewValue=0

            },
            async SendCheckExams(){
                this.loading= true;
                await this.$store.dispatch('updatingSpecificIntake',{number:this.intakes.intakeNumber, exams: this.intakes.exams})
                this.loading= false;
                this.successUpdateExams= true;
                this.numberIntake = '';
                this.intakes.exams = {};
                this.intakes.patient ='';
            }
        },
        computed: {
            user() {
                return this.$store.getters.user
            },
            intakes(){
                return this.$store.getters.intakesClinic
            },
            contestvalue(){
                return this.$store.getters.contestValue;
            }
        }
    };
</script>
