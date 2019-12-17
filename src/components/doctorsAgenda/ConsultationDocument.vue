<template>
    <v-container v-if="consultation" fluid class="fill-height ma-0 pa-0">
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
                            <v-layout column wrap>
                                <strong>Hoje: {{ hoje }} - {{dia}}</strong>
                                <span class="my-sub-headline primary--text" style="font-size: 1.4em">Dr. {{consultation.doctor.name}}</span>
                                <v-flex>
                                    <span class="primary--text font-weight-bold">CRM: </span>
                                    <span class="font-weight-bold">{{consultation.doctor.crm}}</span>
                                </v-flex>
                                <v-flex>
                                    <span class="primary--text font-weight-bold">Especialidade: </span>
                                    <span class="font-weight-bold">{{this.consultation.specialty.name}}</span>
                                </v-flex>
                                <v-flex>
                                <span class="primary--text font-weight-bold">Procedimento: </span>
                                <span class="font-weight-bold">{{this.consultation.type}}</span>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs6 class="text-right">
                            <img src="@/assets/logo-pro-saude.png" height="84px">
                        </v-flex>
                        <v-flex xs12>
                            <v-divider class="primary my-2"></v-divider>
                        </v-flex>
                        <!--                        <v-flex xs6 class="text-left">-->
                        <!--                            <v-layout column wrap>-->
                        <!--                                <span class="primary&#45;&#45;text font-weight-bold mt-2">{{this.budget.user.addresses[0].street}} {{this.budget.user.addresses[0].number}}</span>-->
                        <!--                                <span v-if="this.budget.user.addresses[0].complement" class="primary&#45;&#45;text font-weight-bold mt-2">{{this.budget.user.addresses[0].complement}}</span>-->
                        <!--                                <span class="primary&#45;&#45;text font-weight-bold">{{this.budget.user.addresses[0].city}} - {{this.budget.user.addresses[0].uf}}</span>-->
                        <!--                                <span class="primary&#45;&#45;text font-weight-bold">{{this.budget.user.addresses[0].cep}}</span>-->
                        <!--                            </v-layout>-->
                        <!--                        </v-flex>-->
                        <v-flex xs6 class="text-left">
                            <v-layout column wrap>
                                <span class="my-sub-headline primary--text"
                                      style="font-size: 1.4em">{{user.name}}</span>
                                <v-flex>
                                    <span class="primary--text font-weight-bold">CPF: </span>
                                    <span class="font-weight-bold">{{user.cpf}}</span>
                                </v-flex>
                                <v-flex>
                                    <span class="primary--text font-weight-bold">Data de Nascimento: </span>
                                    <span class="font-weight-bold">{{user.birth_date}}</span><br>
                                </v-flex>
                                <v-flex>
                                    <span class="primary--text font-weight-bold">Idade: </span>
                                    <span class="font-weight-bold">{{idade}}</span><br>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs6 class="pt-6">
                            <v-layout row wrap class="justify-end align-end">
                                <span class="primary--text font-weight-bold mx-2">Data: </span>
                                <span class="font-weight-bold">{{this.consultation.date | dateFilter}}</span>
                            </v-layout>
                        </v-flex>
                        <v-flex xs12 class="mt-2 py-1 px-4">
                            <v-layout row wrap class="align-center">
                                <!--                                <v-flex xs2 class="text-center">-->
                                <!--                                    <span class="font-weight-bold">1</span>-->
                                <!--                                </v-flex>-->
                                <!--                                <v-flex xs6 class="text-left">-->
                                <!--                                    <span class="font-weight-bold">{{item.name}}</span>-->
                                <!--                                </v-flex>-->
                                <!--                                <v-flex xs4 class="text-right">-->
                                <!--                                    <span class="font-weight-bold">{{item.price}}</span>-->
                                <!--                                </v-flex>-->
                            </v-layout>
                        </v-flex>
                        <!--                        <v-flex xs12 class="text-right mt-4 mr-4" v-if="budget.discount > 0">-->
                        <!--                            <span class="primary&#45;&#45;text font-weight-bold pr-6" style="font-size: 1.2em">SubTotal </span>-->
                        <!--                            <span class="font-weight-bold">{{budget.subTotal.toLocaleString('en-us', {minimumFractionDigits: 2, maximumFractionDigits: 2})}}</span>-->
                        <!--                        </v-flex>-->
                        <!--                        <v-flex xs12 class="text-right mr-4" v-if="budget.discount > 0">-->
                        <!--                            <span class="primary&#45;&#45;text font-weight-bold pr-6" style="font-size: 1.2em">Desconto </span>-->
                        <!--                            <span class="font-weight-bold">{{budget.discount.toLocaleString('en-us', {minimumFractionDigits: 2, maximumFractionDigits: 2})}}</span>-->
                        <!--                        </v-flex>-->
                        <!--                        <v-flex xs12 class="text-right mr-4 mt-2">-->
                        <!--                            <span class="primary&#45;&#45;text font-weight-bold pr-6" style="font-size: 1.2em">Total </span>-->
                        <!--                            <span class="font-weight-bold">{{this.budget.total.toLocaleString('en-us', {minimumFractionDigits: 2, maximumFractionDigits: 2})}}</span>-->
                        <!--                        </v-flex>-->
                        <!--                        <v-flex xs6 class="text-left mt-12">-->
                        <!--                            <v-layout column wrap class="primary&#45;&#45;text">-->
                        <!--                                <span class="font-weight-bold">Instituto Pró Saúde do Amazonas</span>-->
                        <!--                                <span>Rua Major Gabriel 915, Centro</span>-->
                        <!--                                <span>Manaus - AM</span>-->
                        <!--                                <span>CNPJ: 09.066.632/0001-22</span>-->
                        <!--                            </v-layout>-->
                        <!--                        </v-flex>-->
                        <!--                        <v-flex xs6 class="primary" style="height: 2px; margin-top: 124px;"></v-flex>-->
                    </v-layout>
                    <v-layout row wrap class="align-center pa-4 mt-4" style="border: 2px solid #2196f3; border-radius: 16px">
                        <v-flex xs12 style="height: 750px"></v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    var moment = require("moment");
    export default {
        name: "Receipt",
        props: ['consultation'],
        computed: {
            idade () {
                return moment().diff(moment(this.user.birth_date, 'DD/MM/YYYY'), 'years')
            },
            user() {
                return this.$store.getters.selectedPatient
            }
        },
        data: () => ({
            consultationHour: moment().locale('pt-BR').format('YYYY-MM-DD HH:mm:ss'),
            hoje: moment().locale('pt-BR').format('DD/MM/YYYY HH:mm:ss'),
            dia: moment().format('dddd'),
        }),
        methods: {
            print() {
                window.print()
            }
        }
    }
</script>
