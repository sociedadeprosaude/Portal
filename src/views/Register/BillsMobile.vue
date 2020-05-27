<template>
    <v-container>

        <div class="text-center">
            <v-dialog hide-overlay transition="dialog-bottom-transition" persistent fullscreen v-model="dialogRegisterBill">
                <register-bill-mobile @close-dialog="dialogRegisterBill = false"></register-bill-mobile>
            </v-dialog>

            <v-dialog class="fill-height" hide-overlay transition="dialog-bottom-transition" persistent fullscreen v-model="dialogPaidBills">
                <v-card>
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>Lançamentos</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn icon dark @click="dialogPaidBills = false">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-toolbar>

                    <v-flex xs12>
                        <v-container>
                            <v-row>
                                <v-row justify="center">
                                    <v-flex xs12>
                                        <v-chip-group class="pa-5" column active-class="primary--text">
                                            <v-chip color="grey" v-for="(month,i) in months" :key="i" class="white" @click="mapMonths(month)">
                                                <span v-if="month.format('YYYY') === year" style="font-weight: bold;"> {{ month.format('MMMM') }}</span>
                                                <span v-if="month.format('YYYY') !== year" style="font-weight: bold;"> {{ month.format('MM/YYYY') }}</span>
                                            </v-chip>
                                        </v-chip-group>
                                    </v-flex>
                                </v-row>
                            </v-row>


                            <v-container v-if="loadingFilter">
                                <v-row align="center" justify="center">
                                    <v-col>
                                        <v-card elevation="10" class="pa-4">
                                            <v-progress-circular indeterminate color="primary"/>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-container>

                            <v-container v-else-if="selectedPaidOuttakesList.length === 0">
                                <v-row align="center" justify="center">
                                    <v-col>
                                        <v-card elevation="10" class="pa-4">Não há contas pagas neste mês</v-card>
                                    </v-col>
                                </v-row>
                            </v-container>

                            <v-flex xs12 class="mt-4" v-else>
                                <v-card class="pa-4 my-4" v-for="bill in selectedPaidOuttakesList" :key="bill.id" @click="mapping(bill)">
                                    <v-layout class="align-center justify-center" row wrap>
                                        <v-flex xs11>
                                            <div>
                                                <span style="color: #003B8F; font-weight: bold;"> {{ bill.date_to_pay | dateFilter }} - {{ daydate(bill.date_to_pay) }}</span>
                                                <v-flex xs12 class="primary" style="height: 2px;"></v-flex>
                                            </div>
                                        </v-flex>
                                        <v-flex xs6 class="text-start">
                                            <span style="font-weight: bold;">Categoria: {{bill.category}}</span>
                                            <br>
                                            <span>SubCategoria: {{bill.subCategory}}</span>
                                        </v-flex>
                                        <v-flex xs5 class="text-right">
                                            <span class="font-weight-bold">R$ {{bill.value}}</span>
                                        </v-flex>
                                    </v-layout>
                                </v-card>
                            </v-flex>
                        </v-container></v-flex>
                </v-card>
            </v-dialog>

            <v-dialog hide-overlay transition="dialog-bottom-transition" v-model="dialogInfoPaidBill">
                <v-card outlined>
                    <v-card-title class="headline font-weight-bold align-center justify-center">
                        {{bill.category}}
                        <v-spacer></v-spacer>
                        <v-btn icon @click="dialogInfoPaidBill = false">
                            <v-icon color="black">close</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-title class="headline font-weight-bold align-center justify-center">
                        <span style="font-weight: bold; color: red">R$ {{ bill.value }}</span>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-layout row wrap>
                            <v-flex xs12>
                                <span>Colaborador</span><br/>
                                <span style="font-weight: bold; color: black"> {{bill.colaborator}}</span>
                            </v-flex>
                            <v-flex xs12>
                                <span>Descrição</span><br/>
                                <span style="font-weight: bold; color: black"> {{bill.description}}</span>
                            </v-flex>
                            <v-flex xs6>
                                <span>Data da Cobrança</span><br/>
                                <span style="font-weight: bold; color: black"> {{bill.date_to_pay | dateFilter}}</span>
                                <br/>
                                <span>Data da Pagamento</span><br/>
                                <span style="font-weight: bold; color: black"> {{bill.paid | dateFilter}}</span>
                            </v-flex>
                            <v-flex xs6>
                                <span>SubCategoria</span><br/>
                                <span style="font-weight: bold; color: black"> {{bill.subCategory}}</span>
                                <br/>
                                <span>Método de Pagamento</span><br/>
                                <span style="font-weight: bold; color: black"> {{bill.payment_method}}</span>
                            </v-flex>

                            <v-flex v-for="(append, i) in bill.appends" :key="i" xs6>
                                <span>Anexos</span><br/>
                                <v-card @click="openAppend(append)" flat>
                                    <v-avatar>
                                        <img :src="append" style="max-width: 124px; max-width: 124px" />
                                    </v-avatar>
                                </v-card>
                            </v-flex>

                            <v-flex v-for="(append, j) in bill.receipts" :key="'comp'+j" xs6>
                                <span>Comprovantes</span><br/>
                                <v-card @click="openAppend(append)" flat>
                                    <v-avatar>
                                        <img :src="append" style="max-width: 124px; max-width: 124px" />
                                    </v-avatar>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </div>

        <v-row class="align-center justify-center">
            <outtake-order-mobile class="mt-n9" :outtakes="pendingOuttakes"></outtake-order-mobile>
        </v-row>

        <v-container class="ma-0 pa-4">
            <v-row class="align-center justify-center">
                <v-col cols="12" xs="12" class="primary" style="position: absolute">
                    <v-card class="elevation-0" tile color="primary" >
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn fab small>1</v-btn>
                            <v-spacer></v-spacer>
                            <v-btn @click="dialogPaidBills = true" fab small><v-icon color="primary">playlist_add_check</v-icon></v-btn>
                            <v-spacer></v-spacer>
                            <v-btn rounded @click="dialogRegisterBill = true"><v-icon color="primary">add</v-icon></v-btn>
                            <v-spacer></v-spacer>
                            <v-btn fab small>3</v-btn>
                            <v-spacer></v-spacer>
                            <v-btn fab small>4</v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>


    </v-container>
</template>

<script>
    import {mask} from "vue-the-mask";
    import moment from "moment";
    import OuttakeOrderMobile from "../../components/reports/Mobile/OuttakeOrderMobile";
    import RegisterBillMobile from "../../components/Bills/Mobile/RegisterBillMobile";
    export default {
        components: {RegisterBillMobile, OuttakeOrderMobile},
        directives: {
            mask
        },
        data() {
            return {
                dialogInfoPaidBill: false,
                dialogPaidBills: false,
                dialogRegisterBill: false,
                other: "Outro",
                year: moment().format('YYYY'),
                selectedMonth: '',
                dialogSelectDate: false,
                switchDate: true,
                switchCategory: false,
                selectedCategory: "",
                loading: false,
                loadingFilter: false,
                loadingDelete: false,
                outtakeSelect: [],
                files: [],
                filesPreviews: [],
                mask: {
                    number: "###"
                },
                semanaOptions: [
                    "Domingo",
                    "Segunda-feira",
                    "Terça-feira",
                    "Quarta-feira",
                    "Quinta-feira",
                    "Sexta-feira",
                    "Sábado"
                ],
                bill:{}
            };
        },
        mounted() {
            this.initiate();
        },
        computed: {
            months() {
                let now = moment()
                let fiveMonthsAgo = now.add(-5, 'M').clone()
                let momentDates = []
                for (let i = 0; i < 12; i++) {
                    momentDates.push(fiveMonthsAgo.clone())
                    fiveMonthsAgo = fiveMonthsAgo.add(1,'M')
                }
                return momentDates
            },
            outtakesPaidMonth(){
                return this.$store.getters.outtakesPaidMonth.sort((a, b) => {
                    return b.date_to_pay > a.date_to_pay ? 1 : -1;
                });
            },
            selectedPaidOuttakesList() {
                return this.outtakesPaidMonth;
            },
            pendingOuttakes() {
                return this.$store.getters.outtakesPending.sort((a, b) => {
                    return b.date_to_pay < a.date_to_pay ? 1 : -1;
                });
            },
            categories() {
                return this.$store.getters.outtakesCategories;
            },
            categoriesName() {
                return this.categories.map(e => e.name);
            },
        },
        watch: {
            selectedMonth(val) {
                this.getOuttakesPaidMonth();
            },
        },
        methods: {
            mapping(bill) {
                let val = {
                    id: bill.id,
                    paid: bill.paid,
                    value: bill.value,
                    category: bill.category,
                    colaborator: bill.colaborator.name,
                    date_to_pay: bill.date_to_pay,
                    description: bill.description,
                    create_at: bill.created_at,
                    payment_method: bill.payment_method,
                    subCategory: bill.subCategory,
                    unit: bill.unit,
                    appends: bill.appends,
                    receipts: bill.receipts,
                }
                this.bill = val
                this.dialogInfoPaidBill = true
            },
            mapMonths(month){
              this.selectedMonth = month.format('YYYY-MM');
            },
            daydate(date) {

                var dateMoment = moment(date);
                return this.semanaOptions[dateMoment.day()];
            },
            async initiate() {
                this.loading = true;
                await this.$store.dispatch("getOuttakesCategories");
                await this.$store.dispatch("getOuttakesPending", {
                    finalDate: moment()
                        .add(5, "days")
                        .format("YYYY-MM-DD 23:59:59")
                });
                this.loading = false;
                this.selectedCategory =
                    this.categoriesName[0] != null ? this.categoriesName[0] : "";
            },
            async getOuttakesPaidMonth() {
                this.loadingFilter = true;
                let start = this.selectedMonth
                start = start+'-01'
                let end = this.selectedMonth
                end = end +'-'+ moment(start, 'YYYY-MM-DD').endOf('month').format('DD')
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
            async unpayOuttake(outtake) {
                this.loadingDelete = true;
                this.outtakeSelect = outtake;
                await this.$store.dispatch("updateOuttake", {
                    outtake: outtake,
                    field: "paid",
                    value: "delete"
                });
                await this.$store.dispatch("getOuttakes", {
                    finalDate: moment()
                        .add(5, "days")
                        .format("YYYY-MM-DD 23:59:59")
                });
                this.outtakeSelect = [];
                this.loadingDelete = false;
            },
            openAppend(append) {
                window.open(append);
            }
        }
    };
</script>