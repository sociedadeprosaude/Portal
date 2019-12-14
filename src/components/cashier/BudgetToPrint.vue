<template>
    <v-container v-if="budget" fluid class="fill-height ma-0 pa-0">
        <v-layout row wrap>
            <v-flex xs6 class="text-left white">
                <v-btn class="transparent" text @click="$emit('close')">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-flex>
            <v-flex xs6 class="text-right white">
                <v-btn class="transparent" text @click="print()">
                    <v-icon>print</v-icon>
                </v-btn>
            </v-flex>
            <v-flex>
                <v-card flat class="pa-10" id="receipt-to-print">
                    <v-layout row wrap class="align-center pa-4" style="border: 2px solid #2196f3; border-radius: 16px">
                        <v-flex xs6 class="text-left">
                            <img src="@/assets/logo-pro-saude.png" height="84px">
                        </v-flex>
                        <v-flex xs6 class="text-right pr-4" v-if="this.budget.user">
                            <v-layout column wrap>
                                <span class="my-sub-headline primary--text" style="font-size: 1.4em">{{this.budget.user.name}}</span>
                                <v-flex>
                                    <span class="primary--text font-weight-bold">CPF: </span>
                                    <span class="font-weight-bold">{{this.budget.user.cpf}}</span>
                                </v-flex>
                            </v-layout>
                        </v-flex>
<!--                        <v-flex xs6 v-else></v-flex>-->
<!--                        <v-flex xs6 class="text-left">-->
<!--                            <v-layout column wrap>-->
<!--                                <span class="primary&#45;&#45;text font-weight-bold mt-2">{{this.budget.user.addresses[0].street}} {{this.budget.user.addresses[0].number}}</span>-->
<!--                                <span v-if="this.budget.user.addresses[0].complement" class="primary&#45;&#45;text font-weight-bold mt-2">{{this.budget.user.addresses[0].complement}}</span>-->
<!--                                <span class="primary&#45;&#45;text font-weight-bold">{{this.budget.user.addresses[0].city}} - {{this.budget.user.addresses[0].uf}}</span>-->
<!--                                <span class="primary&#45;&#45;text font-weight-bold">{{this.budget.user.addresses[0].cep}}</span>-->
<!--                            </v-layout>-->
<!--                        </v-flex>-->
                        <v-flex xs3 class="align-start pt-6">
                            <v-layout column wrap class="justify-start align-start">
                                <span class="primary--text font-weight-bold">Orçamento #</span>
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
                            <v-layout row wrap class="align-center" v-for="(item, index) in items" :key="index">
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
                            <span class="primary--text font-weight-bold pr-6" style="font-size: 1.2em">SubTotal </span>
                            <span class="font-weight-bold">{{budget.subTotal.toLocaleString('en-us', {minimumFractionDigits: 2, maximumFractionDigits: 2})}}</span>
                        </v-flex>
                        <v-flex xs12 class="text-right mr-4" v-if="budget.discount > 0">
                            <span class="primary--text font-weight-bold pr-6" style="font-size: 1.2em">Desconto </span>
                            <span class="font-weight-bold">{{budget.discount.toLocaleString('en-us', {minimumFractionDigits: 2, maximumFractionDigits: 2})}}</span>
                        </v-flex>
                        <v-flex xs12 class="text-right mr-4 mt-2">
                            <span class="primary--text font-weight-bold pr-6" style="font-size: 1.2em">Total </span>
                            <span class="font-weight-bold">{{this.budget.total.toLocaleString('en-us', {minimumFractionDigits: 2, maximumFractionDigits: 2})}}</span>
                        </v-flex>
                        <v-flex xs6 class="text-left mt-12">
                            <v-layout column wrap class="primary--text">
                                <span class="font-weight-bold">Instituto Pró Saúde do Amazonas</span>
                                <span>Rua Major Gabriel 915, Centro</span>
                                <span>Manaus - AM</span>
                                <span>CNPJ: 09.066.632/0001-22</span>
                            </v-layout>
                        </v-flex>
<!--                        <v-flex xs6 class="primary" style="height: 2px; margin-top: 124px;"></v-flex>-->
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>

    export default {
        name: "BudgetToPrint",
        props: ['budget'],
        computed: {
            items() {
                if (!this.budget.exams) {
                    return this.budget.specialties
                } else if(!this.budget.specialties) {
                    return this.budget.exams
                }
                return this.budget.specialties.concat(this.budget.exams)
            },
        },
        data: () => ({}),
        methods: {
            print() {
                window.print()
            }
        }
    }
</script>
