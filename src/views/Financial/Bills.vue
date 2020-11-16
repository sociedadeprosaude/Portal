<template>
    <v-container class="fill-height align-content-space-between" style="height: 90%">
<!--        <BillsMobile  v-if="this.$vuetify.breakpoint.xs" class="fill-height "/>-->
<!--        <Bills-->
<!--                v-else-->
<!--                v-bind:other="other"-->
<!--                v-bind:billsOptions="billsOptions"-->
<!--                v-bind:dialogSelectDate="dialogSelectDate"-->
<!--                v-bind:dialogCategory="dialogCategory"-->
<!--                :switchDate.sync="switchDate"-->
<!--                v-bind:switchCategory="switchCategory"-->
<!--                v-bind:selectedOption="selectedOption"-->
<!--                v-bind:selectedDate="selectedDate"-->
<!--                v-bind:selectedCategory="selectedCategory"-->
<!--                v-bind:loading="loading"-->
<!--                v-bind:loadingFilter="loadingFilter"-->
<!--                v-bind:loadingDelete="loadingDelete"-->
<!--                v-bind:outtakeSelect="outtakeSelect"-->
<!--                v-bind:files="files"-->
<!--                v-bind:filesPreviews="filesPreviews"-->
<!--                v-bind:outtakesPaid="outtakesPaid"-->
<!--                v-bind:outtakesPaidToday="outtakesPaidToday"-->
<!--                v-bind:pendingOuttakes="pendingOuttakes"-->
<!--                v-bind:selectedPaidOuttakesList="selectedPaidOuttakesList"-->
<!--                v-bind:categories="categories"-->
<!--                :getOuttakesPaid="getOuttakesPaid"-->
<!--                :unpayOuttake="unpayOuttake"-->
<!--                :openAppend="openAppend"-->
<!--                @updateCharges="updateCharges()"-->
<!--                @change-selectedOption="(value)=>selectedOption=value"-->
<!--                @change-switchDate="(value)=>switchDate=value"-->
<!--                @change-switchCategory="(value)=>switchCategory=value"-->
<!--                @change-selectedDate="(value)=>selectedDate=value"-->
<!--                @change-selectedCategory="(value)=>selectedCategory=value"-->
<!--        />-->
        <BillsMobile class="fill-height"/>
    </v-container>
</template>

<script>
    import Bills from "@/components/Bills/Bills";
    import BillsMobile from "@/views/Financial/BillsMobile";

    import moment from "moment";

    export default {
        components: {
            Bills,
            BillsMobile
        },
        data() {
            return {
                other: "Outro",
                billsOptions: ["De hoje", "Filtrar"],
                dialogSelectDate: false,
                dialogCategory: false,
                switchDate: true,
                switchCategory: false,
                selectedOption: 0,
                selectedDate: moment().format("YYYY-MM-DD"),
                selectedCategory: "",
                loading: false,
                loadingFilter: false,
                loadingDelete: false,
                outtakesPaid: [],
                outtakesPaidToday: [],
                outtakeSelect: null,
                files: [],
                filesPreviews: [],
                mask: {
                    number: "###"
                },
                Charges: {},
                Transactions: {},
                ChargeSkip: false,
                TransactionSkip: false
            };
        },
        mounted() {

            this.initiate();
        },
        computed: {
            selectedPaidOuttakesList() {
                return this.selectedOption == 0
                    ? this.outtakesPaidToday
                    : this.outtakesPaid;
            },
            pendingOuttakes() {
                if (this.Charges.length) {
                    return this.Charges
                }
                return []
            },
            categories() {
                return this.$store.getters.outtakesCategories;
            }
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
            },
            selectedOption(val) {
                if (val == 1) {
                    this.switchDate = true;
                }
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
                    this.categories.length != 0 ? this.categories[0] : "";
            },
            async getOuttakesPaid() {
                this.loadingFilter = true;
                /* await this.$store.dispatch("getOuttakesPaid", {
                  initialDate: this.switchDate
                    ? moment(this.selectedDate).format("YYYY-MM-DD 00:00:00")
                    : null,
                  finalDate: this.switchDate
                    ? moment(this.selectedDate).format("YYYY-MM-DD 23:59:59")
                    : null,
                  category: this.switchCategory ? this.selectedCategory : null
                }); */
                this.loadingFilter = false;
                return this.Transactions ? this.Transactions : []

            },
            updateCharges() {
                this.ChargeSkip = false
                this.$apollo.queries.LoadChargeBills.refresh()
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
                this.outtakeSelect = {};
                this.loadingDelete = false;
            },
            openAppend(append) {
                window.open(append);
            }
        },
        apollo: {
            LoadChargeBills: {
                query: require("@/graphql/charge/LoadChargeBills.gql"),
                variables: {
                    type: 'bill'
                },
                update(data) {
                    this.Charges = Object.assign(data.Charge)
                    this.ChargeSkip = true
                },
                skip() {
                    return this.ChargeSkip
                }
            },
            LoadTransactionBills: {
                query: require("@/graphql/transaction/LoadTransactionBills.gql"),
                update(data) {
                    console.log('data.transaction', data.Transaction)
                    this.Transactions = Object.assign(data.Transaction)
                    this.outtakesPaid = this.Transactions
                    this.outtakesPaidToday = this.Transactions.filter((e) => e.date.formatted[0, 9] === moment().format('YYYY-MM-DD'))
                    this.TransactionSkip = true
                },
                skip() {
                    return this.TransactionSkip
                }
            }
        }
    };
</script>
