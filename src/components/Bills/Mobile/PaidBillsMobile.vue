<template>
    <v-container fluid class="fill-height align-start " style="width: 120%">

<!--        <v-toolbar dark color="primary" class="justify-center">-->
<!--            <v-toolbar-title>Lançamentos</v-toolbar-title>-->
<!--        </v-toolbar>-->

        <v-flex xs12>
            <v-row justify="space-around">
                <v-col cols="12" xs="12">
                    <v-flex xs12 class="elevation-0 primary" >
                        <v-chip-group class="mt-n6" active-class="primary--text">
                            <v-chip
                                    color="grey lighten-2"
                                    v-for="(month,i) in months"
                                    :key="i"
                                    class="white"
                                    @click="mapMonths(month)"
                            >
                      <span
                              v-if="month.format('YYYY') === year"
                              style="font-weight: bold; font-size: small"
                      >{{ month.format('MMMM') }}</span>
                                <span
                                        v-if="month.format('YYYY') !== year"
                                        style="font-weight: bold; font-size: small"
                                >{{ month.format('MM/YYYY') }}</span>
                            </v-chip>
                        </v-chip-group>
                    </v-flex>
                </v-col>
            </v-row>
            <v-container fluid class="ma-0 pa-0">
                <v-container v-if="loadingFilter">
                    <v-row align="center" justify="center">
                        <v-col>
                            <v-card elevation="10" class="pa-4">
                                <v-progress-circular indeterminate color="primary"/>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>

                <v-container fluid class="ma-0 " v-else-if="selectedPaidOuttakesList.length === 0">

                    <v-card elevation="10" class="pa-4">Não há contas pagas neste mês</v-card>

                </v-container>

                <v-flex xs12 class="mt-4" v-else>
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
                            <v-flex xs6 class="text-start">
                                <span style="font-weight: bold;">{{bill.category}}</span>
                                <br/>
                                <span>{{bill.subCategory}}</span>
                            </v-flex>
                            <v-flex xs5 class="text-right">
                                <span class="font-weight-bold">R$ {{bill.value}}</span>
                            </v-flex>
                            <v-flex xs12>
                                <v-divider color="black"/>
                            </v-flex>
                        </v-layout>
                    </v-card>
                </v-flex>
            </v-container>
        </v-flex>
        <v-dialog transition="dialog-bottom-transition" v-model="dialogInfoPaidBill">
            <v-card outlined>
                <v-flex xs12>
                    <span style="font-weight: bold; color: black; font-size: small">{{ bill.category }}<br/></span>
                    <span style="font-weight: bold; color: red; font-size: small">R$ {{ bill.value }}</span>
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
                            <span>Data da Cobrança</span>
                            <br/>
                            <span style="font-weight: bold; color: black">{{bill.date_to_pay | dateFilter}}</span>
                            <br/>
                            <span>Data da Pagamento</span>
                            <br/>
                            <span style="font-weight: bold; color: black">{{bill.paid | dateFilter}}</span>
                        </v-flex>
                        <v-flex xs6>
                            <span>SubCategoria</span>
                            <br/>
                            <span style="font-weight: bold; color: black">{{bill.subCategory}}</span>
                            <br/>
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
    </v-container>
</template>
<script>
    import moment from "moment";

    export default {
        name: "PaidBillsMobile",
        data: () => ({
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
                return this.$store.getters.outtakesPaidMonth.sort((a, b) => {
                    return b.date_to_pay > a.date_to_pay ? 1 : -1;
                });
            },
        },
        methods: {
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
                    category: bill.category,
                    colaborator: bill.colaborator.name,
                    date_to_pay: bill.date_to_pay,
                    description: bill.description,
                    create_at: bill.created_at,
                    payment_method: bill.payment_method,
                    unit: bill.unit,
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