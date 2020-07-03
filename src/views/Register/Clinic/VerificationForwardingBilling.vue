<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12>
                <v-card v-for="(intake,i) in outtakes" :key="i">
                    <v-layout row wrap class="background">
                        <v-flex xs12>
                            <v-divider class="primary"></v-divider>
                        </v-flex>
                        <v-flex xs4 class="align-center justify-center">
                            <p class="-black mt-5">
                                {{intake.intakeNumber}}
                            </p>
                        </v-flex>
                        <v-flex xs3>
                            <p class="mt-5" > NUMERO DE EXAMES: {{intake.exams.length}}</p>
                        </v-flex>
                        <v-flex xs4 class="text-center align-center justify-center">
                            <p class="mt-5"> PREÇO TOTAL: {{PriceIntake(intake)}}</p>
                        </v-flex>
                        <v-flex xs12>
                            <v-divider class="primary"></v-divider>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap v-for="(exam,i) in intake.exams" v-bind:key="i">
                        <v-flex xs4>
                            <v-spacer></v-spacer>
                        </v-flex>
                        <v-flex xs3 class="align-center justify-center">
                            <p class="font-weight-black mt-5">
                                {{exam.name}}
                            </p>
                        </v-flex>
                        <v-flex xs4 class="text-center align-center justify-center">
                            <p class="mt-5"> PREÇO: {{exam.price}}</p>
                        </v-flex>
                    </v-layout>
                </v-card>
                <v-card>
                    <v-layout row wrap class="background">
                        <v-flex xs4>
                            <v-spacer></v-spacer>
                        </v-flex>
                        <v-flex xs3>
                            <p class="font-weight-bold">Quantidade Final: {{QuantTot}} </p>
                        </v-flex>
                        <v-flex xs4>
                            <p class="font-weight-bold">Preço final: {{PriceTot}} </p>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>

            <v-flex xs12>
                <v-divider class="my-3"/>
            </v-flex>
            <v-spacer/>
            <v-flex xs12 v-if="loading">
                <v-progress-linear color="primary" indeterminate/>
            </v-flex>
        </v-layout>
    </v-container>
</template>


<script>
    import {mask} from "vue-the-mask";

    export default {
        name: "VerificationForwardingBilling",
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
            };
        },
        async mounted(){
            await  this.InitialConfig()
        },
        methods: {
            async InitialConfig(){
                this.clinic = await this.$store.dispatch('getClinic',this.user.cnpj)
                console.log('clinic: ', this.clinic)
                await this.$store.dispatch('GetReceiptsClinic',this.clinic)
            },
            PriceIntake(intake){
                let price= 0;
                for(let exam of intake.exams){
                    price += exam.price
                }
                return price
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
