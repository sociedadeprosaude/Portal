<template>
    <v-container class="fill-height white ma-0 pa-0 align-start" fluid>
        <v-container v-if="budget" fluid class="ma-0 pa-0 white">
            <v-layout row wrap>
                <v-flex xs12>
                    <v-tabs>
                        <v-flex xs1 class="text-left white hidden-print-only mt-2">
                            <v-btn class="transparent" text @click="$emit('close')">
                                <v-icon>close</v-icon>
                            </v-btn>
                        </v-flex>
                        <v-tab>Recibo</v-tab>
                        <v-tab v-for="(item, i) in examsPerClinic" :key=i>{{i}}</v-tab>
                        <v-spacer/>
                        <v-flex xs1 class="text-right white hidden-print-only mt-2">
                            <v-btn class="transparent" text @click="print('receipt')">
                                <v-icon>print</v-icon>
                            </v-btn>
                        </v-flex>
                        <v-tab-item>
                            <v-card flat class="pa-10 receipt-to-print" ref="receipt" id="receipt">
                                <v-layout row wrap class="align-center pa-4"
                                          style="border: 2px solid #2196f3; border-radius: 16px">
                                    <v-flex xs6 class="text-left">
                                        <v-layout column wrap>
                                            <span class="my-sub-headline primary--text" style="font-size: 1.4em">{{this.budget.user.name}}</span>
                                            <v-flex>
                                                <span class="primary--text font-weight-bold">CPF: </span>
                                                <span class="font-weight-bold">{{this.budget.user.cpf}}</span>
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex xs6 class="text-right">
                                        <img :src="selectedUnit.logo" height="84px">
                                    </v-flex>
                                    <v-flex xs6 class="text-left">
                                        <v-layout column wrap v-if="budget.user.addresses[0]">
                                            <span class="primary--text font-weight-bold mt-2">{{this.budget.user.addresses[0].street}} {{this.budget.user.addresses[0].number}}</span>
                                            <span v-if="this.budget.user.addresses[0].complement"
                                                  class="primary--text font-weight-bold mt-2">{{this.budget.user.addresses[0].complement}}</span>
                                            <span class="primary--text font-weight-bold">{{this.budget.user.addresses[0].city}} - {{this.budget.user.addresses[0].uf}}</span>
                                            <span class="primary--text font-weight-bold">{{this.budget.user.addresses[0].cep}}</span>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex xs3 class="align-start pt-6">
                                        <v-layout column wrap class="justify-start align-start">
                                            <span class="primary--text font-weight-bold">Recibo #</span>
                                            <span class="primary--text font-weight-bold">Data</span>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex xs3 class="align-start pt-6">
                                        <v-layout column wrap class="justify-start align-start">
                                            <span class="font-weight-bold">{{this.budget.id}}</span>
                                            <span class="font-weight-bold">{{this.budget.date | dateFilter}}</span>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex xs12 class="mt-12 primary py-1 px-4" style="height: 32px">
                                        <v-layout row wrap class="align-center">
                                            <v-flex xs2 class="text-left">
                                                <span class="white--text font-weight-bold">Quantidade</span>
                                            </v-flex>
                                            <v-flex xs6 class="text-left">
                                                <span class="white--text font-weight-bold">Descrição</span>
                                            </v-flex>
                                            <v-flex xs4 class="text-right">
                                                <span class="white--text font-weight-bold">Valor</span>
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex xs12 class="mt-2 py-1 px-4">
                                        <v-layout row wrap class="align-center" v-for="(item, index) in items"
                                                  :key="index">
                                            <v-flex xs2 class="text-center">
                                                <span class="font-weight-bold">1</span>
                                            </v-flex>
                                            <v-flex xs6 class="text-left">
                                                <span class="font-weight-bold">{{item.name}}</span>
                                            </v-flex>
                                            <v-flex xs4 class="text-right">
                                                <span class="font-weight-bold">{{item.price}}</span>
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex xs12 class="text-right mt-4 mr-4" v-if="budget.discount > 0">
                                    <span class="primary--text font-weight-bold pr-6"
                                          style="font-size: 1.2em">SubTotal </span>
                                        <span class="font-weight-bold">{{budget.subTotal.toLocaleString('en-us', {minimumFractionDigits: 2, maximumFractionDigits: 2})}}</span>
                                    </v-flex>
                                    <v-flex xs12 class="text-right mr-4" v-if="budget.discount > 0">
                                    <span class="primary--text font-weight-bold pr-6"
                                          style="font-size: 1.2em">Desconto </span>
                                        <span class="font-weight-bold">{{budget.discount.toLocaleString('en-us', {minimumFractionDigits: 2, maximumFractionDigits: 2})}}</span>
                                    </v-flex>
                                    <v-flex xs12 class="text-right mr-4 mt-2">
                                    <span class="primary--text font-weight-bold pr-6"
                                          style="font-size: 1.2em">Total </span>
                                        <span class="font-weight-bold">{{this.budget.total.toLocaleString('en-us', {minimumFractionDigits: 2, maximumFractionDigits: 2})}}</span>
                                    </v-flex>
                                    <v-flex xs6 class="text-left mt-12">
                                        <v-layout column wrap class="primary--text">
                                            <span class="font-weight-bold">Instituto Pró Saúde do Amazonas</span>
                                            <span>Rua Prof. Felix Valois 39, Cidade Nova</span>
                                            <span>Manaus - AM</span>
                                            <span>CNPJ: 09.066.632/0001-22</span>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex xs6 class="primary" style="height: 2px; margin-top: 124px;"></v-flex>

                                </v-layout>
                            </v-card>
                        </v-tab-item>
                        <v-tab-item v-for="(item, i) in examsPerClinic" :key=i>
                            <attendance-guide class="receipt-to-print" :guide=item :ref="'guide-' + i"
                                              :id="'guide-' + i"/>
                        </v-tab-item>
                    </v-tabs>
                </v-flex>
            </v-layout>
        </v-container>
    </v-container>
</template>

<script>
    import AttendanceGuide from "./AttendanceGuide";

    export default {
        name: "Receipt",
        props: ['budget'],
        components: {
            AttendanceGuide
        },
        computed: {
            selectedUnit() {
                return this.$store.getters.selectedUnit
            },
            items() {
                return this.budget.specialties.concat(this.budget.exams)
            },
            examsPerClinic() {
                let examsPerClinic = {}
                for (let exam in this.budget.exams) {
                    if (!examsPerClinic[this.budget.exams[exam].clinic.name]) {
                        examsPerClinic[this.budget.exams[exam].clinic.name] = []
                    }
                    examsPerClinic[this.budget.exams[exam].clinic.name].push(this.budget.exams[exam])
                }
                return examsPerClinic
            }
        },
        methods: {
            print(ref) {
                window.print()
            }
        }
    }
</script>
