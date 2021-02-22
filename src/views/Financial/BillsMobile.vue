<template>
    <v-container fluid class="fill-height align-start mt-n3 pa-0 background" >
        <v-navigation-drawer
                v-if="billsToolbar"
                class="hidden-print-only primary"
                dark
                absolute
                temporary
                v-model="billsToolbar"
        >
            <v-list>
                <v-list-item
                        v-for="item in menuItemsBills"
                        :key="item.title"
                        @click.native="goRoute(item.link)"
                >
                    <v-list-item-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>{{ item.title }}</v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <router-view class="ma-0 pa-0" />
        <v-bottom-navigation
                fixed
                style="position: fixed"
                color="hidden-sm-and-up"
                class="hidden-print-only primary"
        >

            <v-btn fab small text @click="billsToolbar = !billsToolbar" class="hidden-md-and-up">
                <v-icon color="white">menu</v-icon>
            </v-btn>

            <v-btn fab small @click="goRoute('/pagamento/financeiro/categorias')" >
                <v-icon color="white">playlist_add</v-icon>
            </v-btn>

            <v-btn fab small  @click="goRoute('/pagamento/financeiro/registro')">
                <v-icon color="white">add</v-icon>
            </v-btn>

            <v-btn fab small @click="goRoute('/pagamento/financeiro/pagos')">
                <v-icon color="white">playlist_add_check</v-icon>
            </v-btn>

            <v-btn fab small @click="goRoute('/pagamento/financeiro/pendentes')">
                <v-icon color="white">attach_money</v-icon>
            </v-btn>

        </v-bottom-navigation>
    </v-container>
</template>

<script>
    import {mask} from "vue-the-mask";
    import moment from "moment";


    export default {

        directives: {
            mask
        },
        data() {
            return {

                billsToolbar: false,
                billsToPay: true,
                dialogInfoPaidBill: false,
                dialogPaidBills: false,
                dialogRegisterBill: false,
                other: "Outro",
                year: moment().format("YYYY"),
                selectedMonth: "",
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
                bill: {},

                menuItemsBills: [
                    {
                        title: "Financeiro",
                        link: "/pagamento/financeiro",
                        permission: "Caixa",
                        icon: "attach_money"
                    },
                    {
                        title: "Pagar Convênios",
                        link: "/pagamento/convenio",
                        permission: "Caixa",
                        icon: "receipt"
                    },
                    {
                        icon: "mdi-clipboard-account",
                        title: "Pagar Médicos",
                        link: "/pagamento/medicos",
                        permission: "Caixa"
                    }
                ],
            };
        },
        mounted() {
            this.initiate();
        },
        computed: {
            showBillsMobile () {
                return this.$store.getters.showBillsMobile
            },
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
            outtakesPaidMonth() {
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
            }
        },
        watch: {
            selectedMonth(val) {
                this.getOuttakesPaidMonth();
            }
        },
        methods: {
            goRoute(route) {
                this.$router.push({
                    path: route,
                })
            },
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
                    unit: bill.unit,
                    appends: bill.appends,
                    receipts: bill.receipts
                };
                this.bill = val;
                this.dialogInfoPaidBill = true;
            },
            mapMonths(month) {
                this.selectedMonth = month.format("YYYY-MM");
            },
            daydate(date) {
                var dateMoment = moment(date);
                return this.semanaOptions[dateMoment.day()];
            },
            async initiate() {
                this.goRoute('/pagamento/financeiro/pendentes');
                this.selectedCategory =
                    this.categories[0] != null ? this.categories[0] : "";
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
            async unpayOuttake(outtake) {
                this.loadingDelete = true;
                this.outtakeSelect = outtake;
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

<style scoped>
</style>