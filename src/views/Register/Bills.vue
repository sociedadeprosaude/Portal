<template>
    <v-container>
        <v-layout row wrap>
            <RegisterBill/>
            <v-flex xs12 class="text-left mt-6">
                <span class="my-headline">{{pendingOuttakes.length}} Contas à pagar</span>
            </v-flex>
            <v-flex xs12>
                <outtake-order :outtakes="pendingOuttakes"/>
            </v-flex>
            <v-flex xs12 class="text-left mt-6">
                <span class="my-headline">{{selectedPaidOuttakesList.length}} Contas pagas</span>
            </v-flex>
            <v-container>
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
                            >
                            </v-combobox>
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
            <v-flex xs12 class="mt-4" v-else>
                <v-card class="pa-4 my-4" v-for="bill in selectedPaidOuttakesList" :key="bill.id">
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-layout row wrap>
                                <span>{{bill.category}}</span>
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
        </v-layout>
    </v-container>
</template>

<script>
    import OuttakeOrder from "../../components/reports/OuttakeOrder";
    import RegisterBill from "../../components/Bills/RegisterBill";
    import {mask} from "vue-the-mask";
    import moment from "moment";

    export default {
        name: "Bills",
        directives: {
            mask
        },
        components: {
            OuttakeOrder,
            RegisterBill

        },
        data() {
            return {
                other: "Outro",
                billsOptions: ["De hoje", "Filtrar"],
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
            outtakesPaid() {
                return this.$store.getters.outtakesPaid.sort((a, b) => {
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
