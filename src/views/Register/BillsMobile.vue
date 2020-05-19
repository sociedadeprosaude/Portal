<template>
    <v-container>
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

        <v-dialog hide-overlay transition="dialog-bottom-transition" persistent fullscreen v-model="dialogRegisterBill">
            <register-bill-mobile @close-dialog="dialogRegisterBill = false"></register-bill-mobile>
        </v-dialog>

        <v-dialog hide-overlay transition="dialog-bottom-transition" persistent fullscreen v-model="dialogPaidBills">
            <v-container>
                <v-layout class="align-center justify-center" row wrap>
                    <v-flex xs12>
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
                                            <span style="font-weight: bold">Selecione o Mês para Pesquisar</span>
                                            <v-date-picker v-model="selectedMonth" locale="pt-br" type="month"></v-date-picker>
                                        </v-row>
                                        <v-flex xs12 class="transparent"><span style="color: transparent">.</span></v-flex>
                                        <v-row justify="center">
                                            <v-flex xs10>
                                            <v-menu
                                                    v-model="menu"
                                                    :close-on-content-click="false"
                                                    :nudge-right="40"
                                                    transition="scale-transition"
                                                    offset-y
                                                    min-width="290px"
                                            >
                                                <template v-slot:activator="{ on }">
                                                    <v-text-field
                                                            v-model="computedDateFormatted"
                                                            label="Selecione o Mês para Pesquisar"
                                                            prepend-icon="event"
                                                            readonly
                                                            outlined
                                                            rounded
                                                            v-on="on"
                                                    ></v-text-field>
                                                </template>
                                                <v-date-picker type="month" locale="pt-br" v-model="selectedMonth" @input="menu = false"></v-date-picker>
                                            </v-menu>
                                            </v-flex>
                                        </v-row>

                                    </v-row>

                                    <v-row>
                                        <v-chip-group row mandatory v-model="selectedOption" active-class="primary--text">
                                            <v-chip v-for="option in billsOptions" :key="option">{{ option }}</v-chip>
                                        </v-chip-group>
                                    </v-row>

                                    <div v-if="selectedOption === 1">
                                        <v-row dense no-gutters align="start" justify="start">
                                            <v-col>
                                                <v-switch v-model="switchDate" label="Limitar por data"/>
                                                <v-date-picker v-if="switchDate" locale="pt-br" v-model="selectedDate"/>
                                            </v-col>
                                            <v-col>
                                                <v-switch v-model="switchCategory" label="Limitar por categoria"/>
                                                <v-combobox
                                                        v-if="switchCategory"
                                                        label="categoria"
                                                        v-model="selectedCategory"
                                                        :items="categoriesName"
                                                        outlined
                                                        clearable
                                                ></v-combobox>
                                            </v-col>
                                        </v-row>
                                    </div>
                                </v-container>
                                <v-container v-if="loadingFilter">
                                    <v-row align="center" justify="center">
                                        <v-col>
                                            <v-card elevation="10" class="pa-4">
                                                <v-progress-circular indeterminate color="primary"/>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                </v-container>

                                <v-container v-else-if="selectedPaidOuttakesList.length === 0 && this.selectedOption === 0">
                                    <v-row align="center" justify="center">
                                        <v-col>
                                            <v-card elevation="10" class="pa-4">Não há contas pagas hoje</v-card>
                                        </v-col>
                                    </v-row>
                                </v-container>

                                <v-container v-else-if="selectedPaidOuttakesList.length === 0 && this.selectedOption === 1">
                                    <v-row align="center" justify="center">
                                        <v-col>
                                            <v-card elevation="10" class="pa-4">Não há contas pagas que se encaixam nestas condições
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                </v-container>

                                <v-container v-else-if="selectedPaidOuttakesList.length === 0 && this.selectedOption === 2">
                                    <v-row align="center" justify="center">
                                        <v-col>
                                            <v-card elevation="10" class="pa-4">Não há contas pagas neste mês</v-card>
                                        </v-col>
                                    </v-row>
                                </v-container>

                                <v-flex xs12 class="mt-4" v-else>
                                    <v-card class="pa-4 my-4" v-for="bill in selectedPaidOuttakesList" :key="bill.id">
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
                                                                                         class="primary--text"></v-progress-circular>
                                                                </v-flex>
                                                            </v-layout>
                                                        </v-layout>
                                                    </v-flex>
                                                    <v-flex xs12 class="text-right" v-if="loadingDelete && outtakeSelect === bill">
                                                        <v-progress-circular indeterminate class="primary--text"/>
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
                                </v-flex>
                            </v-flex>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-dialog>

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
                menu: false,
                selectedMonth: '',
                billsOptions: ["De hoje", "Filtrar", "Mês"],
                dialogSelectDate: false,
                switchDate: true,
                switchCategory: false,
                selectedOption: 0,
                selectedDate: moment().format("YYYY-MM-DD"),
                selectedCategory: "",
                loading: false,
                loadingFilter: false,
                loadingDelete: false,
                outtakeSelect: [],
                files: [],
                filesPreviews: [],
                mask: {
                    number: "###"
                }
            };
        },
        mounted() {
            this.initiate();
        },
        computed: {
            computedDateFormatted () {
                return this.formatDate(this.selectedMonth)
            },
            outtakesPaid() {
                return this.$store.getters.outtakesPaid.sort((a, b) => {
                    return b.date_to_pay > a.date_to_pay ? 1 : -1;
                });
            },
            outtakesPaidMonth(){
                return this.$store.getters.outtakesPaidMonth.sort((a, b) => {
                    return b.date_to_pay > a.date_to_pay ? 1 : -1;
                });
            },
            outtakesPaidToday() {
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                return this.$store.getters.outtakesPaidToday.sort((a, b) =>
                    b.date_to_pay > a.date_to_pay ? 1 : -1
                );
            },
            selectedPaidOuttakesList() {
                if (this.selectedOption === 0) return this.outtakesPaidToday;
                else if (this.selectedOption === 1) return this.outtakesPaid;
                else if (this.selectedOption === 2) return this.outtakesPaidMonth;
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
            selectedDate(val) {
                this.getOuttakesPaid();
            },
            selectedMonth(val) {
                this.getOuttakesPaidMonth();
            },
            selectedCategory(val) {
                this.getOuttakesPaid();
            },
            switchDate(val) {
                this.getOuttakesPaid();
            },
            switchCategory(val) {
                this.getOuttakesPaid();
            }
        },
        methods: {
            formatDate (date) {
                if (!date) return null
                const [year, month] = date.split('-')
                return `${month}/${year}`
            },
            async initiate() {
                this.loading = true;
                await this.$store.dispatch("getOuttakesCategories");
                await this.$store.dispatch("getOuttakesPending", {
                    finalDate: moment()
                        .add(5, "days")
                        .format("YYYY-MM-DD 23:59:59")
                });
                await this.$store.dispatch("getOuttakesPaidToday");
                this.loading = false;
                this.selectedCategory =
                    this.categoriesName[0] != null ? this.categoriesName[0] : "";
            },
            async getOuttakesPaid() {
                this.loadingFilter = true;
                await this.$store.dispatch("getOuttakesPaid", {
                    initialDate: this.switchDate
                        ? moment(this.selectedDate).format("YYYY-MM-DD 00:00:00")
                        : null,
                    finalDate: this.switchDate
                        ? moment(this.selectedDate).format("YYYY-MM-DD 23:59:59")
                        : null,
                    category: this.switchCategory ? this.selectedCategory : null
                });
                this.loadingFilter = false;
            },
            async getOuttakesPaidMonth() {
                this.loadingFilter = true;
                let start = this.selectedMonth
                start = start+'-01'
                console.log(start)
                let end = this.selectedMonth
                end = end +'-'+ moment(start, 'YYYY-MM-DD').endOf('month').format('DD')
                console.log(end)
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