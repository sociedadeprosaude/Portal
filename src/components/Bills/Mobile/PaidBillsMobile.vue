<template>
    <v-container class="ma-0 pa-0" fluid>
        <ApolloQuery :query="require('@/graphql/transaction/LoadBillsPaid.gql')"
                     :variables="{ date_start: formattedDate(dateStart), date_end: formattedDate(dateEnd)}"
        >
            <template v-slot="{result: {data}}">
                <v-row class="align-center justify-center">
                    <v-col cols="12" xs="12" class="primary mt-n5">
                        <v-card class="elevation-0 white--text mt-n2 mt-md-2 primary" style="border-radius: 0">
                            <v-card-title class="font-weight-bold align-lg-center justify-center" v-if="data">
                                {{-totalValue(data) | moneyFilter}}
                            </v-card-title>
                            <v-card-subtitle style="font-size: small" class="white--text font-italic" v-if="data">Valor pago
                            </v-card-subtitle>
                            <v-layout row wrap class="justify-center pt-5">
                                <v-flex xs3>
                                    <v-text-field rounded solo filled dense color="background"
                                                  placeholder="Data inicial"
                                                  background-color="white"
                                                  v-model="dateStart" v-mask="mask.date" append-outer-icon="event"/>

                                </v-flex>
                                <v-flex xs3 class="ml-2">
                                    <v-text-field rounded solo filled dense color="background" class="mr-4"
                                                  background-color="white"
                                                  v-model="dateEnd" v-mask="mask.date" placeholder="Data final"/>
                                </v-flex>
                            </v-layout>
                        </v-card>
                    </v-col>
                </v-row>

                <v-layout row wrap class="justify-center fill-height mt-4" v-if="!data">
                    <v-progress-circular indeterminate color="primary" large :size="200"/>
                </v-layout>
                <v-container fluid class="ma-0 " v-if="data && data.length === 0">
                    <v-card elevation="10" class="pa-4">Não há contas pagas neste mês</v-card>
                </v-container>
                <v-row v-if="data && data.length !== 0" class="align-center justify-center">
                    <v-col md="8" xs="12">
                        <v-card class="pa-2 pb-0 my-0 elevation-0 mb-5"
                                v-for="bill in data.Transaction"
                                :key="bill.id"
                                @click="mapping(bill)">
                            <v-layout row wrap>
                                <v-flex xs4 v-if="bill.with_unit.length !== 0">
                                    <v-img :src="bill.with_unit[0].logo" width="175px"/>
                                </v-flex>
                                <v-flex xs4 v-else/>
                                <v-flex xs8 class="text-end">
                                        <span style="font-weight: bold; font-size: small"
                                              v-if="bill.categories.length !== 0">{{bill.categories[0].name}}</span>
                                    <span style="font-weight: bold; font-size: small" v-else>Sem categoria</span>
                                </v-flex>
                                <v-flex xs4 class="mt-4 text-start">
                                    <strong style="font-size: large">R$ {{-bill.value}}</strong>
                                </v-flex>
                                <v-flex xs8 class="text-end mt-3">
                                    <!--                                    <v-flex class="text-right" v-if="loading">-->
                                    <!--                                        <v-progress-circular indeterminate class="primary&#45;&#45;text"/>-->
                                    <!--                                    </v-flex>-->
                                    <v-flex>
                                        <v-btn @click="$refs[bill.id][0].click()" class="primary mx-1" fab x-small>
                                            <v-icon>receipt</v-icon>
                                        </v-btn>

                                    </v-flex>
                                </v-flex>
                                <v-flex xs12 class="mt-2">
                                    <v-divider color="grey"/>
                                </v-flex>
                                <v-flex xs12 class="text-start">
                                    <span style="font-size: small">Colaborador: </span><span
                                        style="font-weight: bold; font-size: small">
                                        {{bill.colaborator[0].name}}
                                    </span>
                                </v-flex>

                                <v-flex xs12 class="mt-3">
                                    <v-layout row wrap>
                                        <v-flex xs12 class="text-start">
                                            <span style="font-size: small">Método de pagamento: </span><span
                                                style="font-weight: bold; font-size: small">{{bill.payment_methods[0]}}</span>
                                        </v-flex>
                                        <v-flex xs12 class="text-start">
                                            <span style="font-size: small">Data de pagamento: </span><span
                                                style="font-weight: bold; font-size: small">{{bill.date.formatted | dateFilter}}</span>
                                        </v-flex>
                                        <v-flex xs12 class="mt-2">
                                            <span style="font-weight: bold; font-size: small; font-style: italic">{{bill.description}}</span>
                                        </v-flex>

                                        <v-flex xs12 class="mt-1">
                                            <v-divider color="grey"/>
                                        </v-flex>

                                        <v-flex xs12 class="mt-0">
                                            <v-layout row wrap>
                                                <v-flex xs6>
                                                    <v-layout column wrap class="mt-4">
                                                <span class="mb-4 font-weight-bold"
                                                      style="font-size: medium">Anexos</span>
                                                        <v-layout row wrap>
                                                            <v-flex v-for="(append, i) in bill.appends" :key="i">
                                                                <v-card @click="openAppend(append)" flat>
                                                                    <v-avatar>
                                                                        <img :src="append"
                                                                             style="max-width: 124px; max-width: 124px"/>
                                                                    </v-avatar>
                                                                </v-card>
                                                            </v-flex>
                                                        </v-layout>
                                                    </v-layout>

                                                </v-flex>
                                                <v-divider vertical/>
                                                <v-flex xs5>
                                                    <v-layout column wrap class="mt-4 justify-center text-center">
                                                        <span class="mb-4 font-weight-bold" style="font-size: medium">Comprovante</span>
                                                        <!--                                                        <v-flex xs12 sm2 class="text-right"-->
                                                        <!--                                                                v-if="loadingAnexo && outtakeSelect === bill">-->
                                                        <!--                                                            <v-progress-circular indeterminate class="primary&#45;&#45;text"/>-->
                                                        <!--                                                        </v-flex>-->
                                                        <!--                                                        <v-layout row wrap v-else>-->
                                                        <!--                                                            <v-flex v-for="(append, i) in bill.receipts" :key="i">-->
                                                        <!--                                                                <v-card @click="openAppend(append)" flat>-->
                                                        <!--                                                                    <v-avatar>-->
                                                        <!--                                                                        <img :src="append"-->
                                                        <!--                                                                             style="max-width: 124px; max-width: 124px"/>-->
                                                        <!--                                                                    </v-avatar>-->
                                                        <!--                                                                </v-card>-->
                                                        <!--                                                            </v-flex>-->
                                                        <!--                                                        </v-layout>-->
                                                    </v-layout>
                                                </v-flex>
                                            </v-layout>
                                        </v-flex>
                                    </v-layout>
                                    <!--                                    <input-->
                                    <!--                                            v-show="false"-->
                                    <!--                                            type="file"-->
                                    <!--                                            :id="bill.id"-->
                                    <!--                                            :ref="bill.id"-->
                                    <!--                                            multiple-->
                                    <!--                                            v-on:change="handleFileUpload(bill)"-->
                                    <!--                                    />-->
                                </v-flex>
                            </v-layout>
                        </v-card>
                    </v-col>
                </v-row>


                <v-flex xs12>
                    <v-container fluid class="ma-0 pa-0">

                        <v-flex xs12 class="mt-4">
                            <v-card
                                    class="pa-4 my-4 elevation-0 transparent"
                                    v-for="bill in selectedPaidOuttakesList"
                                    :key="bill.id"
                                    @click="mapping(bill)"
                            >
                                <v-layout class="align-center justify-center" row wrap>
                                    <v-flex xs12>
                                        <div>
                        <span
                                style="color: black; font-weight: bold;"
                        >{{ bill.date_to_pay | dateFilter }} - {{ daydate(bill.date_to_pay) }}</span>
                                        </div>
                                    </v-flex>
                                    <!--                            <v-flex xs6 class="text-start">-->
                                    <!--                                <span style="font-weight: bold;">{{bill.category}}</span>-->
                                    <!--                                <br/>-->
                                    <!--                                <span>{{bill.subCategory}}</span>-->
                                    <!--                            </v-flex>-->
                                    <!--                            <v-flex xs5 class="text-right">-->
                                    <!--                                <span class="font-weight-bold">R$ {{bill.value}}</span>-->
                                    <!--                            </v-flex>-->
                                    <!--                            <v-flex xs12>-->
                                    <!--                                <v-divider color="black"/>-->
                                    <!--                            </v-flex>-->
                                </v-layout>
                            </v-card>
                        </v-flex>
                    </v-container>
                </v-flex>

                <v-dialog transition="dialog-bottom-transition" v-model="dialogInfoPaidBill" width="55%">
                    <v-card outlined>
                        <v-flex xs12>

                            <span style="font-weight: bold; color: black; font-size: small">{{ bill.category }}<br/></span>
                            <span style="font-weight: bold; color: red; font-size: small">{{ -bill.value | moneyFilter }}</span>
                        </v-flex>
                        <v-divider/>
                        <v-card-text>
                            <v-layout row wrap>
                                <v-flex xs12>
                                    <span>Colaborador</span>
                                    <br/>
                                    <span style="font-weight: bold; color: black">{{bill.colaborator}}</span>
                                </v-flex>
                                <v-flex xs12>
                                    <span>Descrição</span>
                                    <br/>
                                    <span style="font-weight: bold; color: black">{{bill.description}}</span>
                                </v-flex>
                                <v-flex xs6>
                                    <span>Data</span>
                                    <br/>
                                    <span style="font-weight: bold; color: black">{{bill.date_to_pay | dateFilter}}</span>
                                </v-flex>
                                <v-flex xs6>

                                    <span>Método de Pagamento</span>
                                    <br/>
                                    <span style="font-weight: bold; color: black">{{bill.payment_method}}</span>
                                </v-flex>

                                <v-flex v-for="(append, i) in bill.appends" :key="i" xs6>
                                    <span>Anexos</span>
                                    <br/>
                                    <v-card @click="openAppend(append)" flat>
                                        <v-avatar>
                                            <img :src="append" style="max-width: 124px; max-width: 124px"/>
                                        </v-avatar>
                                    </v-card>
                                </v-flex>

                                <v-flex v-for="(append, j) in bill.receipts" :key="'comp'+j" xs6>
                                    <span>Comprovantes</span>
                                    <br/>
                                    <v-card @click="openAppend(append)" flat>
                                        <v-avatar>
                                            <img :src="append" style="max-width: 124px; max-width: 124px"/>
                                        </v-avatar>
                                    </v-card>
                                </v-flex>
                            </v-layout>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </template>
        </ApolloQuery>
    </v-container>
</template>
<script>
    import moment from "moment";
    import {mask} from 'vue-the-mask'

    export default {
        name: "PaidBillsMobile",
        directives: {
            mask,
        },
        data: () => ({
            mask: {
                date: '##/##/####',
            },
            dateStart: moment().subtract(1, 'month').format('DD/MM/YYYY'),
            dateEnd: moment().format('DD/MM/YYYY'),
            selectedMonth: "",
            loadingFilter: false,
            dialogInfoPaidBill: false,
            bill: {},
            year: moment().format("YYYY"),
        }),
        watch: {
            selectedMonth(val) {
                this.getOuttakesPaidMonth();
            }
        },
        computed: {

            months() {
                let now = moment();
                let fiveMonthsAgo = now.add(-5, "M").clone();
                let momentDates = [];
                for (let i = 0; i < 12; i++) {
                    momentDates.push(fiveMonthsAgo.clone());
                    fiveMonthsAgo = fiveMonthsAgo.add(1, "M");
                }
                return momentDates;
            },
            selectedPaidOuttakesList() {
                return this.outtakesPaidMonth;
            },
            outtakesPaidMonth() {
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                return this.$store.getters.outtakesPaidMonth.sort((a, b) => {
                    return b.date_to_pay > a.date_to_pay ? 1 : -1;
                });
            },
        },
        methods: {
            formattedDate (date) {
                return moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD')
            },
            totalValue (data) {
                let total = 0;
                for (let bill in data.Transaction){
                    total = total + data.Transaction[bill].value
                }
                return total;

            },
            mapMonths(month) {
                this.selectedMonth = month.format("YYYY-MM");
            },
            async getOuttakesPaidMonth() {
                this.loadingFilter = true;
                let start = this.selectedMonth;
                start = start + "-01";
                let end = this.selectedMonth;
                end =
                    end +
                    "-" +
                    moment(start, "YYYY-MM-DD")
                        .endOf("month")
                        .format("DD");
                await this.$store.dispatch("getOuttakesPaidMonth", {
                    initialDate: this.switchDate
                        ? moment(start).format("YYYY-MM-DD 00:00:00")
                        : null,
                    finalDate: this.switchDate
                        ? moment(end).format("YYYY-MM-DD 23:59:59")
                        : null,
                    category: this.switchCategory ? this.selectedCategory : null
                });
                this.loadingFilter = false;
            },
            mapping(bill) {
                this.bill = {
                    id: bill.id,
                    paid: bill.paid,
                    value: bill.value,
                    category: bill.categories[0].name,
                    colaborator: bill.colaborator[0].name,
                    date_to_pay: bill.date.formatted,
                    description: bill.description,
                    create_at: bill.created_at,
                    payment_method: bill.payment_methods[0],
                    unit: bill.with_unit[0].name,
                    appends: bill.appends,
                    receipts: bill.receipts
                };
                this.dialogInfoPaidBill = true;
            },
            openAppend(append) {
                window.open(append);
            }
        }
    }
</script>
