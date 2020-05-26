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
                <v-container>
                    <v-row class="align-center justify-center">
                        <v-col cols="12" xs="12" class="primary">
                            <v-card>
                                <!--                            <v-flex xs12>
                                                                <v-card class="pa-4 my-4">
                                                                    <v-layout row wrap>
                                                                        <v-flex xs12>
                                                                            <v-layout row wrap>
                                                                                <span>{{bill.category}}</span>
                                                                                <br>
                                                                                <span>{{bill.subCategory}}</span>
                                                                                <v-divider vertical class="mx-4"/>
                                                                                <span>{{bill.payment_method}}</span>
                                                                                <v-divider vertical class="mx-4"/>
                                                                                <span class="font-weight-bold">{{bill.date_to_pay | dateFilter}}</span>
                                                                                <v-divider vertical class="mx-4"/>
                                                                                <span class="font-weight-bold">{{bill.paid | dateFilter}}</span>
                                                                                <v-divider vertical class="mx-4"/>
                                                                                <v-spacer/>
                                                                                <span class="font-weight-bold">{{bill.value}}</span>

                                                                                <v-flex xs12>
                                                                                    <span>{{bill.description}}</span>
                                                                                </v-flex>
                                                                                <v-flex xs12 sm10 class="mt-4">
                                                                                    <v-layout row wrap>
                                                                                        <v-layout column wrap>
                                                                                            <span class="my-sub-headline mb-4">Anexos</span>
                                                                                            <v-layout row wrap>
                                                                                                <v-flex v-for="(append, i) in bill.appends" :key="i">
                                                                                                    <v-card @click="openAppend(append)" flat>
                                                                                                        <img :src="append" style="max-width: 124px; max-width: 124px"/>
                                                                                                    </v-card>
                                                                                                </v-flex>
                                                                                            </v-layout>
                                                                                        </v-layout>
                                                                                        <v-divider vertical/>
                                                                                        <v-layout column wrap>
                                                                                            <span class="my-sub-headline mb-4">Comprovante</span>
                                                                                            <v-layout row wrap v-if="!loading">
                                                                                                <v-flex v-for="(append, i) in bill.receipts" :key="i">
                                                                                                    <v-card @click="openAppend(append)" flat>
                                                                                                        <img :src="append" style="max-width: 124px; max-width: 124px"/>
                                                                                                    </v-card>
                                                                                                </v-flex>
                                                                                            </v-layout>
                                                                                            <v-flex xs12 sm2 class="text-right" v-else>
                                                                                                <v-progress-circular indeterminate
                                                                                                                     class="primary&#45;&#45;text"></v-progress-circular>
                                                                                            </v-flex>
                                                                                        </v-layout>
                                                                                    </v-layout>
                                                                                </v-flex>
                                                                                <v-flex xs12 class="text-right" v-if="loadingDelete && outtakeSelect === bill">
                                                                                    <v-progress-circular indeterminate class="primary&#45;&#45;text"/>
                                                                                </v-flex>
                                                                                <v-flex xs12 class="text-right" v-else>

                                                                                    <v-btn @click="unpayOuttake(bill)" class="error mx-2" fab small>
                                                                                        <v-icon>money_off</v-icon>
                                                                                    </v-btn>
                                                                                </v-flex>
                                                                            </v-layout>
                                                                        </v-flex>
                                                                    </v-layout>
                                                                </v-card>
                                                            </v-flex>-->
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
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
                            <v-btn @click="dialogPaidBills = true" fab small class="success" dark><v-icon color="white">playlist_add_check</v-icon></v-btn>
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
                this.dialogInfoPaidBill = true
                console.log('kill', bill)
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