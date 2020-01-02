<template>
    <v-container v-if="guide" fluid class="fill-height ma-0 pa-0">
        <v-layout row wrap>

            <v-flex xs12 class="text-right white">
                <v-btn class="transparent" text @click="print()">
                    <v-icon>print</v-icon>
                </v-btn>
            </v-flex>
<!--            <v-flex xs6 class="text-left white">
                <v-btn class="transparent" text @click="$emit('close')">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-flex>-->
            <v-flex>
                <v-card flat class="pa-10" id="attendanceGuide-to-print">
                    <v-layout row wrap class="align-center pa-4" style="border: 2px solid #2196f3; border-radius: 16px">
                        <v-flex xs6 class="text-left">
                            <v-layout column wrap v-for="(item, index) in [items[0]]" :key="index">
                                <span class="my-sub-headline primary--text" style="font-size: 1.4em">{{item.clinic.name}}</span>
                                <v-flex>
                                    <span class="primary--text font-weight-bold">CNPJ: </span>
                                    <span class="font-weight-bold">{{item.clinic.cnpj}}</span>
                                </v-flex>
                                <v-flex>
                                    <v-layout column wrap class="primary--text">
                                        <span class="font-weight-bold"> {{item.clinic.address.street}}, {{item.clinic.address.number}}, {{item.clinic.address.neighboor}}, {{item.clinic.address.cep}}</span>
                                        <span v-if="item.clinic.address.complement">Complemento: {{item.clinic.address.complement}}</span>
                                        <span>{{item.clinic.address.city}} - {{item.clinic.address.state}}</span>
                                        <br/>
                                        <span class="font-weight-bold">Contato.: {{item.clinic.telephone[0]}}</span>
                                        <br/>
                                        <span class="font-weight-bold">Dias e Horarios de Funcionamento:</span>
                                        <span><v-icon>event</v-icon> Segunda-Feira: {{item.clinic.agenda[0]}} <v-icon>alarm</v-icon></span>
                                        <span><v-icon>event</v-icon> Terça-Feira: {{item.clinic.agenda[1]}} <v-icon>alarm</v-icon></span>
                                        <span><v-icon>event</v-icon> Quarta-Feira: {{item.clinic.agenda[2]}} <v-icon>alarm</v-icon></span>
                                        <span><v-icon>event</v-icon> Quinta-Feira: {{item.clinic.agenda[3]}} <v-icon>alarm</v-icon></span>
                                        <span><v-icon>event</v-icon> Sexta-Feira: {{item.clinic.agenda[4]}} <v-icon>alarm</v-icon></span>
                                        <span><v-icon>event</v-icon> Sábado: {{item.clinic.agenda[5]}} <v-icon>alarm</v-icon></span>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs6 class="text-right">
                            <img src="@/assets/logo-pro-saude.png" height="84px">
                        </v-flex>
<!--                        <v-flex xs6 class="text-left">
                            <v-layout column wrap v-if="budget.user.addresses[0]">
                                <span class="primary&#45;&#45;text font-weight-bold mt-2">{{this.budget.user.addresses[0].street}} {{this.budget.user.addresses[0].number}}</span>
                                <span v-if="this.budget.user.addresses[0].complement" class="primary&#45;&#45;text font-weight-bold mt-2">{{this.budget.user.addresses[0].complement}}</span>
                                <span class="primary&#45;&#45;text font-weight-bold">{{this.budget.user.addresses[0].city}} - {{this.budget.user.addresses[0].uf}}</span>
                                <span class="primary&#45;&#45;text font-weight-bold">{{this.budget.user.addresses[0].cep}}</span>
                            </v-layout>
                        </v-flex>
                        <v-flex xs3 class="align-start pt-6">
                            <v-layout column wrap class="justify-start align-start">
                            </v-layout>
                        </v-flex>
                        <v-flex xs3 class="align-start pt-6">
                            <v-layout column wrap class="justify-start align-start">
                                <span class="font-weight-bold">{{this.budget.id}}</span>
                                <span class="font-weight-bold">{{this.budget.date | dateFilter}}</span>
                            </v-layout>
                        </v-flex>-->
                        <v-flex xs12 class="mt-12 primary py-1 px-4" style="height: 32px">
                            <v-layout row wrap class="align-center">
                                <v-flex xs2 class="text-left">
                                    <span class="white--text font-weight-bold">Descrição</span>
                                </v-flex>
                                <v-flex xs6 class="text-left">
                                    <span class="white--text font-weight-bold">Regras</span>
                                </v-flex>
                                <v-flex xs4 class="text-right">
                                    <span class="white--text font-weight-bold">Observações</span>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs12 class="mt-2 py-1 px-4">
                            <v-layout row wrap class="align-center" v-for="(item, index) in items" :key="index">
                                <v-flex xs2 class="text-left">
                                    <span class="font-weight-bold">{{item.name}}</span>
                                </v-flex>
                                <v-flex xs6 class="text-left">
                                    <span class="font-weight-bold">{{item.rules}}</span>
                                </v-flex>
                                <v-flex xs4 class="text-right">
                                    <span class="font-weight-bold">{{item.clinic.obs}}</span>
                                </v-flex>
                            </v-layout>
                        </v-flex>
<!--                        <v-flex xs12 class="text-right mt-4 mr-4" v-if="budget.discount > 0">
                            <span class="primary&#45;&#45;text font-weight-bold pr-6" style="font-size: 1.2em">SubTotal </span>
                            <span class="font-weight-bold">{{budget.subTotal.toLocaleString('en-us', {minimumFractionDigits: 2, maximumFractionDigits: 2})}}</span>
                        </v-flex>
                        <v-flex xs12 class="text-right mr-4" v-if="budget.discount > 0">
                            <span class="primary&#45;&#45;text font-weight-bold pr-6" style="font-size: 1.2em">Desconto </span>
                            <span class="font-weight-bold">{{budget.discount.toLocaleString('en-us', {minimumFractionDigits: 2, maximumFractionDigits: 2})}}</span>
                        </v-flex>
                        <v-flex xs12 class="text-right mr-4 mt-2">
                            <span class="primary&#45;&#45;text font-weight-bold pr-6" style="font-size: 1.2em">Total </span>
                            <span class="font-weight-bold">{{this.budget.total.toLocaleString('en-us', {minimumFractionDigits: 2, maximumFractionDigits: 2})}}</span>
                        </v-flex>-->
                        <v-flex xs6 class="text-left mt-12">
                            <v-layout column wrap class="primary--text">
                                <span class="font-weight-bold">Instituto Pró Saúde do Amazonas</span>
                                <span>Rua Major Gabriel 915, Centro</span>
                                <span>Manaus - AM</span>
                                <span>CNPJ: 09.066.632/0001-22</span>
                            </v-layout>
                        </v-flex>
                        <v-flex xs6 class="primary" style="height: 2px; margin-top: 124px;"></v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        name: "attendanceGuide",
        props: ['guide'],
        computed: {
            items() {
                return this.guide
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
