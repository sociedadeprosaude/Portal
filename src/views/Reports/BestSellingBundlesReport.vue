<template>
    <v-container>
        <v-card>
            <v-row class="justify-center">
                <v-col sm="3" xs="12">
                    <v-menu v-model="dateMenuStart">
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                    v-model="formattedSelectedStartDate"
                                    hint="Data inicial"
                                    persistent-hint
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                    outlined
                                    dense
                                    color="primary"
                            />
                        </template>
                        <v-date-picker v-model="selectedStartDate" locale="pt-br"/>
                    </v-menu>
                </v-col>
                <v-icon class="primary--text pb-5" large>event</v-icon>
                <v-col sm="3" xs="12">
                    <v-menu v-model="dateMenuFinal">
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                    v-model="formattedSelectedFinalDate"
                                    hint="Data final"
                                    persistent-hint
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                    outlined
                                    dense
                                    color="primary"

                            />
                        </template>
                        <v-date-picker v-model="selectedFinalDate" locale="pt-br"/>
                    </v-menu>
                </v-col>
            </v-row>
            <ApolloQuery :query="require('@/graphql/productTransaction/loadBundlesTransactions.gql')"
                         :variables="{dateStart: formattedDateStart(formattedSelectedStartDate), dateEnd:formattedDateEnd(formattedSelectedFinalDate)}">
                <template v-slot="{result: {data, loading, error}}">
                    <v-row class="justify-center" v-if="loading || !data">
                        <v-col class="mt-n2" sm="8">
                            <v-progress-linear color="primary" indeterminate/>
                        </v-col>
                    </v-row>
                    <v-col cols="12" v-else-if="error">
                        <strong class="red--text">
                            Erro ao carregar pacotes, verifique sua conexão
                        </strong>
                    </v-col>
                    <v-col cols="12" v-else-if="data" class=" pa-0 pr-4">
                        <BestSellingBundlesReport
                                :date="formattedSelectedStartDate"
                                :date2="formattedSelectedFinalDate"
                                :search="search"
                                :now="now"
                                :total="total"
                                :options="options"
                                :optionSelected="optionSelected"
                                :headers="headers"
                                :BundlesFormatArray="BundlesFormatArray(data)"
                                :numSales="numSales(data)"
                                :totalPrice="totalPrice(data)"
                                :totalCost="totalCost(data)"
                                :totalProfit="totalProfit(data)"

                                @change-search="(value)=>search=value"
                                @change-optionSelected="(value)=>optionSelected=value"
                        />
                    </v-col>

                </template>
            </ApolloQuery>

        </v-card>
    </v-container>
</template>

<script>
    import BestSellingBundlesReport from "@/components/Reports/BestSellingBundlesReport";
    import moment from "moment";

    export default {
        components: {BestSellingBundlesReport},
        data() {
            return {
                dateMenuStart: false,
                dateMenuFinal: false,
                loadBundles: false,
                selectedStartDate: moment().subtract('7', "d").format("YYYY-MM-DD"),
                selectedFinalDate: moment().format("YYYY-MM-DD"),
                search: "",
                now: moment().format("YYYY-MM-DD HH:mm:ss"),
                total: 0,
                options: ["Pacotes", "Pacotes separados por clinica"],
                optionSelected: 0,
                headers: [
                    {
                        text: "Pacote",
                        align: "start",
                        sortable: false,
                        value: "name"
                    },
                    {text: "Quantidade vendida", value: "numSales", align: "center"},
                    {text: "Custo total", value: "cost",  align: "center"},
                    {text: "Venda total", value: "price", align: "center"},
                    {text: "Lucro liquido", value: "profit"}
                ]
            };
        },
        methods: {
            formattedDateStart(date) {
                date = date + 'T00:00:00Z';
                return moment(date, 'DD/MM/YYYYTHH:mm:ss').format('YYYY-MM-DDTHH:mm:ss')
            },
            formattedDateEnd(date) {
                date = date + 'T23:59:59Z';
                return moment(date, 'DD/MM/YYYYTHH:mm:ss').format('YYYY-MM-DDTHH:mm:ss')
            },
            BundlesFormatArray(data) {
                if (data.Transaction[0]) {
                    let bundles = [];
                    data.Transaction.map(e => {
                        if (bundles[e.product.name]) {
                            bundles[e.product.name].numSales += 1;
                            bundles[e.product.name].price += e.price;
                            bundles[e.product.name].cost += e.averageCost;
                            bundles[e.product.name].profit = bundles[e.product.name].price - bundles[e.product.name].cost
                        } else {
                            bundles[e.product.name] = {
                                numSales: 1,
                                name: e.product.name,
                                price: e.price,
                                cost: e.cost,
                                profit: e.price - e.cost
                            }
                        }
                    });
                    let FormattedBundles = [];
                    for (let i in bundles) {
                        FormattedBundles.push(bundles[i])
                    }

                    this.loadBundles = true;
                    return FormattedBundles
                }
            },
            numSales(data) {
                if (this.BundlesFormatArray(data)){
                    return this.BundlesFormatArray(data).reduce(
                        (total, e) => total + e.numSales,
                        0
                    );
                } else return 0

            },
            totalPrice(data) {
                if (this.BundlesFormatArray(data)) {
                    return this.BundlesFormatArray(data).reduce(
                        (total, e) => total + e.price,
                        0
                    );
                } else return 0;
            },
            totalCost(data) {
                if (this.BundlesFormatArray(data)) {
                    return this.BundlesFormatArray(data).reduce(
                        (total, e) => total + e.cost,
                        0
                    );
                } else return 0
            },
            totalProfit(data) {
                if (this.BundlesFormatArray(data)) {
                    return this.BundlesFormatArray(data).reduce(
                        (total, e) => total + e.profit,
                        0
                    );
                } else return 0
            }
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

        }
    };
</script>

<style scoped>
    .subTable {
        border-radius: 0px;
        border: 1px solid black;
    }
</style>