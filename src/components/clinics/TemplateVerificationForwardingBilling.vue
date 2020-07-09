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
                        <v-card v-for="(outtake,i) in outtakes" :key="i">
                            <v-layout row wrap class="primary">
                                <v-flex xs12>
                                    <v-divider class="primary"></v-divider>
                                </v-flex>
                                <v-flex xs12 md4 class="align-center font-weight-bold justify-center">
                                    <p class="white--text mt-5">
                                        {{outtake.intakeNumber}}
                                    </p>
                                </v-flex>
                                <v-flex xs6 md3>
                                    <p class="mt-5  body-2  white--text" > Nº DE EXAMES: {{outtake.exams.length}}</p>
                                </v-flex>
                                <v-flex xs6 md4 class="text-center align-center justify-center">
                                    <p class="mt-5 white--text  body-2"> PREÇO TOTAL: {{PriceOuttake(outtake)}}</p>
                                </v-flex>
                                <v-flex xs12>
                                    <v-divider class=primary></v-divider>
                                </v-flex>
                            </v-layout>
                            <v-layout row wrap v-for="(exam,i) in outtake.exams" v-bind:key="i">
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
    export default {
        name: "TemplateVerificationForwardingBilling",
        props:['clinic','QuantTot','PriceTot','outtakes'],
        methods: {
            PriceOuttake(outtake){
                let price= 0;
                for(let exam of outtake.exams){
                    price += exam.price
                }
                return price
            },
        }
    }
</script>

