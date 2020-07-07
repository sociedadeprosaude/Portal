<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12 class="px-3 my-3">
                <v-card outlined class="mb-4 primary">
                    <v-layout row wrap>
                        <v-flex xs10 md3 class="text-left">
                            <span class="font-weight-bold white--text ml-2">{{clinic.name}}</span>
                        </v-flex>
                    </v-layout>
                    <v-flex xs12 sm12>
                        <v-layout row wrap class="justify-center">
                            <v-spacer></v-spacer>
                            <v-flex xs7 md4>
                                <v-card sm3 class="mx-4 elevation-0 transparent text-left">
                                    <span class="font-weight-bold white--text">
                                        Nº de exames : {{QuantTot}}
                                    </span>
                                </v-card>
                            </v-flex>
                            <v-flex xs5 md4>
                                <v-card sm3 class="mx-4 elevation-0 transparent text-left">
                                    <span class="font-weight-bold white--text">
                                        Custo : {{PriceTot}}
                                    </span>
                                </v-card>
                            </v-flex>
                            <v-flex xs12 class="mb-4 hidden-md-and-up">
                                <v-spacer></v-spacer>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                    <v-flex xs12 class="mt-3">
                        <v-card v-for="(intake,i) in last ? lastOuttakes : outtakes" :key="i">
                            <v-layout row wrap class="primary">
                                <v-flex xs12>
                                    <v-divider class="primary"></v-divider>
                                </v-flex>
                                <v-flex xs12 md4 class="align-center font-weight-bold justify-center">
                                    <p class="white--text mt-5">
                                        {{intake.intakeNumber}}
                                    </p>
                                </v-flex>
                                <v-flex xs6 md3>
                                    <p class="mt-5  body-2  white--text" > Nº DE EXAMES: {{intake.exams.length}}</p>
                                </v-flex>
                                <v-flex xs6 md4 class="text-center align-center justify-center">
                                    <p class="mt-5 white--text  body-2"> PREÇO TOTAL: {{PriceIntake(intake)}}</p>
                                </v-flex>
                                <v-flex xs12>
                                    <v-divider class=primary></v-divider>
                                </v-flex>
                            </v-layout>
                            <v-layout row wrap v-for="(exam,i) in intake.exams" v-bind:key="i">
                                <v-flex md4 class="hidden-sm-and-down">
                                    <v-spacer></v-spacer>
                                </v-flex>
                                <v-flex xs8 md3 class="align-center justify-center">
                                    <p class="font-weight-black mt-5">
                                        {{exam.name}}
                                    </p>
                                </v-flex>
                                <v-flex xs4 md4 class="text-center align-center justify-center">
                                    <p class="mt-5"> PREÇO: {{exam.price}}</p>
                                </v-flex>
                            </v-layout>
                        </v-card>
                    </v-flex>

                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>


<script>
    import {mask} from "vue-the-mask";

    export default {
        name: "PaymentHistory",
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
                NewValue: '',
                clinic:[],
                last:false,
                lastOuttakes:[]
            };
        },
        async mounted(){
            await  this.InitialConfig()
        },
        methods: {
            async InitialConfig(){
                this.clinic = await this.$store.dispatch('getClinic',this.user.cnpj)
                await this.$store.dispatch('GetReceiptsClinic',this.clinic)
            },
            PriceIntake(intake){
                let price= 0;
                for(let exam of intake.exams){
                    price += exam.price
                }
                return price
            },
            async GetLastPayment(){
                this.last= !this.last
                this.lastOuttakes = await this.$store.dispatch('GetLastReceiptsClinic',this.clinic)
                console.log('lastOuttakes: ', this.lastOuttakes)
            },
            closeDialog: function() {
                this.$emit('close-dialog')
            }
        },
        computed:{
            user() {
                return this.$store.getters.user
            },
            outtakes(){
                return this.$store.getters.IntakesExamsClinics
            },
            PriceTot(){
                let cost =0;
                this.outtakes.filter(function (element){
                    element.exams.filter(function (element2) {
                        cost += element2.price
                    })
                })
                return cost
            },
            QuantTot(){
                let quant =0;
                this.outtakes.filter(function (element){
                    element.exams.filter(function (element2) {
                        quant += 1
                    })
                })
                return quant
            }
        }
    };
</script>
