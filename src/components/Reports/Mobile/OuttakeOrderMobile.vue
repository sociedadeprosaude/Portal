<template>
    <v-container class="ma-0 pa-0 align-start justify-center" fluid>
        <ApolloQuery :query="require('@/graphql/transaction/LoadBillsToPay.gql')"
                     :variables="{ date_start: formattedDateStart(formattedSelectedStartDate), date_end: formattedDateEnd(formattedSelectedFinalDate), type: 'bill'}"
        >

            <template v-slot="{result: {data, loading}, query}">
                <v-row class="align-center justify-center">
                    <v-col cols="12" xs="12" class="primary mt-n5">
                        <v-card class="elevation-0 white--text mt-md-2 primary" style="border-radius: 0">
                            <v-card-title class="font-weight-bold align-lg-center justify-center" v-if="data.Charge[0]">
                                {{ data.Charge[0].balance | moneyFilter }}
                            </v-card-title>
                            <v-card-subtitle style="font-size: small" class="white--text font-italic"
                                             v-if="data.Charge[0]">
                                Saldo
                            </v-card-subtitle>

                            <v-layout row wrap class="justify-center pt-5 white--text">
                                <v-col sm="2" xs="12">
                                    <v-menu v-model="dateMenuStart">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field
                                                    v-model="formattedSelectedStartDate"
                                                    readonly
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    outlined
                                                    dense
                                                    rounded
                                                    color="white"
                                                    background-color="white"
                                            />
                                        </template>
                                        <v-date-picker v-model="selectedStartDate" locale="pt-br"/>
                                    </v-menu>
                                </v-col>
                                <v-icon class="white--text pb-5 hidden-sm-and-down" large>event</v-icon>
                                <v-col sm="2" xs="12">
                                    <v-menu v-model="dateMenuFinal">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field
                                                    v-model="formattedSelectedFinalDate"
                                                    readonly
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    outlined
                                                    dense
                                                    rounded
                                                    color="primary"
                                                    background-color="white"

                                            />
                                        </template>
                                        <v-date-picker v-model="selectedFinalDate" locale="pt-br"/>
                                    </v-menu>
                                </v-col>
                            </v-layout>

                        </v-card>
                    </v-col>
                </v-row>
                <v-layout row wrap class="justify-center fill-height mt-4" v-if="!data">
                    <v-progress-circular indeterminate color="primary" large :size="200"/>
                </v-layout>
                <v-container fluid v-if="loading">
                    <v-progress-circular indeterminate/>
                </v-container>
                <v-container fluid class="ma-0 " v-if="data">
                    <BillsOuttakeOrder :data="data" @reload="reload(query)" />
                </v-container>
            </template>
        </ApolloQuery>
    </v-container>
</template>

<script>
    import {mask} from 'vue-the-mask'
    import moment from "moment";

    import BillsOuttakeOrder from "../../Bills/OuttakeOrder/BillsOuttakeOrder"

    export default {
        directives: {
            mask,
        },
        components: {

            BillsOuttakeOrder
        },
        data() {
            return {
                mask: {
                    date: '##/##/####',
                },
                dateStart: moment().subtract(1, 'month').format('DD/MM/YYYY'),
                dateEnd: moment().format('DD/MM/YYYY'),
                dateMenuStart: false,
                dateMenuFinal: false,
                selectedStartDate: moment().format("YYYY-MM-DD"),
                selectedFinalDate: moment().format("YYYY-MM-DD"),
                monthSelected: 'Outubro',
                isEditing: false,
                loading: false,
                loadingAnexo: false,
                outtakeSelect: [],
                today: moment().format("YYYY-MM-DD"),
                date: moment().format("YYYY-MM-DD"),
                files: [],
                options: {
                    duration: 500,
                    offset: 15,
                    easing: "easeInQuint"
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
                monsthsName: [
                    "Janeiro",
                    "Fevereiro",
                    "Março",
                    "Abril",
                    "Maio",
                    "Junho",
                    "Julho",
                    "Agosto",
                    "Setembro",
                    "Outubro",
                    "Novembro",
                    "Dezembro"
                ],
                lastYear: '',
                lastMonth: '',
                month: null,
            };
        },
        computed: {
            formattedSelectedStartDate: {
                get() {
                    return moment(this.selectedStartDate).format("DD/MM/YYYY")
                },
                set(val) {
                    this.selectedDate = val
                }
            },
            formattedSelectedFinalDate: {
                get() {
                    return moment(this.selectedFinalDate).format("DD/MM/YYYY")
                },
                set(val) {
                    this.selectedDate = val
                }
            },
            // years() {
            //   let years = [];
            //   let year = moment().format('YYYY');
            //   for (let i = parseInt(this.lastYear); i <= parseInt(year); i++) {
            //
            //       months.push(i.toString())
            //     }
            //   } else {
            //     for (let i = parseInt(this.lastMonth); i <= 12; i++) {
            //
            //       months.push(i.toString())
            //     }
            //   }
            //   return months
            // },
            pendingOuttakes() {
                return this.$store.getters.outtakesPending.sort((a, b) => {
                    return b.date_to_pay < a.date_to_pay ? 1 : -1;
                });
            },
            user() {
                return this.$store.getters.user.group;
            },
            dates() {
                let holder = this.outtakesByDate(this.pendingOuttakes);
                let dates = [];
                for (let item in holder) {
                    dates.push(holder[item][0].date_to_pay)
                }
                return dates
            },

            totalPayable() {

                let total = 0.00;
                total = total.toFixed(2)
                return total
            }
        },
        watch: {
            date(val) {
                this.$vuetify.goTo("#group-" + val, this.options);
            },

        },
        methods: {
            //
            //   let dateMoment = moment(date);
            //   return this.semanaOptions[dateMoment.day()];
            // },
            reload(query){
              console.log('chamando novamente')
              query.refresh()
            },
            formattedDateStart(date) {
                date = date + '00:00:00';
                return moment(date, 'DD/MM/YYYYHH:mm:ss').format('YYYY-MM-DDTHH:mm:ssZ')
            },
            formattedDateEnd(date) {
                date = date + '23:59:59';
                return moment(date, 'DD/MM/YYYYHH:mm:ss').format('YYYY-MM-DDTHH:mm:ssZ')
            },
            outtakesByDate(outtakes) {
                let res = {};
                for (let outtake in outtakes) {
                    let targetDate = outtakes[outtake].date_to_pay;
                    if (!res[targetDate]) {
                        res[targetDate] = [];
                    }
                    res[targetDate].push(outtakes[outtake]);
                }
                return res;
            },
            async editBillValue(bill) {
                if (!this.isEditing) {
                    await this.$store.dispatch("editOuttakes", bill);
                    await this.$store.dispatch("getOuttakes");
                    this.loading = false;
                }

            },
            distanceToToday(date) {
                let now = moment();
                return moment(date, "YYYY-MM-DD").diff(now, "days");
            },
            async payTransaction(charge, query) {
                this.loading = true
                let transactionId = uuid.v4()
                let mutationBuilder = new MutationBuilder()
                mutationBuilder.addMutation({
                    mutation: require('@/graphql/transaction/CreateTransactionBill.gql'),
                    variables: {
                        date: {formatted: `${moment().format("YYYY-MM-DDTHH:mm:ss")}`},
                        id: transactionId,
                        value: charge.value,
                        type: 'Bill',
                        description: charge.description,
                        payment_methods: charge.payment_methods,
                        dat_pay: {formatted: charge.date_to_pay.formatted}
                    }
                })

                for (let category of charge.categories) {
                    mutationBuilder.addMutation({
                        mutation: require('@/graphql/transaction/MergeTransactionCategories.gql'),
                        variables: {
                            transactionId,
                            categoryId: category.id
                        }
                    })
                }
                for (let unit of charge.with_unit) {
                    mutationBuilder.addMutation({
                        mutation: require('@/graphql/transaction/MergeTransactionWithUnit.gql'),
                        variables: {
                            transactionId,
                            unitId: unit.id
                        }
                    })
                }

            }
        }
    }

</script>
