<template>
    <v-container fluid v-if="statistics && monthsNew && yearsNew && skipTransaction">
        <statsCaixaIntakes
                :years="yearsNew"
                :year="year"
                :months="monthsNew"
                :month="month"
                :week="week"
                :monsthsName="monsthsName"
                :monthName="monthName"
                :round2="round2"
                :statistics="statistics"
                :info="info"
                :total="total"
                :numOfSales="numOfSales"
                :maisVendidos="maisVendidos"
                :labels="labels"
                :faturamentoDatasetMonthly="faturamentoDatasetMonthly"
                :faturamentoDatasetWeekly="faturamentoDatasetWeekly"
                :profitDataset="profitDataset"
                :bestSellersDataset="bestSellersDataset"
                :numOfSalesMontlyDataset="numOfSalesMontlyDataset"
                :options="options"

                @change-month="(value)=>month=value"
                @change-year="(value)=>year=value"
        />
    </v-container>
    <v-progress-circular v-else indeterminate size="64"></v-progress-circular>

</template>

<script>
    import statsCaixaIntakes from "@/components/Reports/statsCaixaIntakes";
    import moment from "moment";

    export default {
        components: {statsCaixaIntakes},
        data: () => ({
            year: null,
            months: null,
            month: null,
            week: 0,
            years: null,
            skipTransaction: false,
            lastYear: '',
            lastMonth: '',
            TransactionsFixed: '',
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
            ]
        }),

        mounted() {
            this.initialInfo();
        },
        methods: {

            monthName(month) {
                return this.monsthsName[Number(month) - 1];
            },
            round2(num) {
                return num ? num.toFixed(2) : 0;
            }
        },
        watch: {
            statistics(val) {
                if (val) {
                    this.years = Object.keys(val);
                    this.year = this.years[0];
                    this.months = Object.keys(val[this.years[0]]);
                    this.month = this.months[0];
                }
            },
            year(val) {
                if (val) {
                    this.months = Object.keys(this.statistics[val]);
                    this.month = this.months[this.months.length - 1];
                }
            }
        },
        computed: {
            Transactions() {
                let transactions = this.TransactionsFixed
                return transactions.filter(e => (e.date.formatted.substring(0, 11) >= (this.year + '-' + this.month + '-01')) && (e.date.formatted.substring(0, 11) <= (moment(this.year + '-' + this.month + '-01').add(1, 'months').format('YYYY-MM-DD'))))
            },
            yearsNew() {
                let years = []
                let year = moment().format('YYYY')
                for (let i = parseInt(this.lastYear); i <= parseInt(year); i++) {
                    years.push(i.toString())
                }
                return years
            },
            monthsNew() {
                let months = []
                let month = moment().format('MM')
                if (this.lastYear === moment().format('YYYY')) {
                    for (let i = parseInt(this.lastMonth); i <= parseInt(month); i++) {
                        months.push(i.toString())
                    }
                } else {
                    for (let i = parseInt(this.lastMonth); i <= 12; i++) {
                        months.push(i.toString())
                    }
                }
                return months
            },
            selectedUnit() {
                return this.$store.getters.selectedUnit
            },

            info() {
                let itens = {}
                let arrTotalRaw = []
                let NewMonth = moment(this.year + '-' + (this.month)).add(1, 'months')
                for (let i = 0; i < parseInt(moment(NewMonth).subtract(1, 'days').format('DD')); i++) {
                    arrTotalRaw[i] = 0
                }
                this.Transactions.filter(e => {
                    if (arrTotalRaw[(parseInt(e.date.formatted.substring(8, 11)) - 1)] >= 0) {
                        arrTotalRaw[(parseInt(e.date.formatted.substring(8, 11)) - 1)] += e.value
                    } else {
                        arrTotalRaw[(parseInt(e.date.formatted.substring(8, 11)) - 1)] = 0
                    }
                    e.produts.filter(f => {
                        if (itens[f.with_product ? f.with_product.name : 'error']) {
                            itens[f.with_product ? f.with_product.name : 'error'].numOfSales += 1
                            itens[f.with_product ? f.with_product.name : 'error'].totalRaw += f.price
                        } else {
                            itens[f.with_product ? f.with_product.name : 'error'] = {
                                numOfSales: 1,
                                totalRaw: f.price
                            }
                        }
                    })
                })
                let info = {}
                info.itens = itens
                info.arrTotalRaw = arrTotalRaw
                console.log('info meu: ', info)
                console.log('arrTotalRaw: ', arrTotalRaw)
                console.log('estatisticas deles; ', this.statistics[this.year][this.month])
                return info
            },
            total() {
                let total = 0
                this.Transactions.filter(e => {
                    total += e.value
                })
                console.log('transactions: ', this.Transactions)
                console.log('total : ', total.toFixed(2))
                return String(total.toFixed(2));
            },
            /* cost() {
              return String(this.round2(this.info.totalCost));
            },
            profit() {
              return String(this.round2(this.info.totalProfit));
            }, */
            numOfSales() {
                let sales = 0;
                this.Transactions.filter(e => {
                    sales += parseInt(e.produts.length)
                });
                return sales
            },
            maisVendidos() {
                return this.info.itens;
            },
            labels() {
                return Object.keys(this.info.itens).map(key => key);
            },
            faturamentoDatasetMonthly() {
                return {
                    labels: Array.from(
                        Array(moment(`${this.year}-${this.month}`).daysInMonth()).keys()
                    ).map(num => ++num),
                    datasets: [
                        {
                            lineTension: 0,
                            fill: false,
                            borderColor: "rgb(75, 192, 192)",
                            data: this.info.arrTotalRaw
                        }
                    ]
                };
            },
            faturamentoDatasetWeekly() {
                const days = Array.from(
                    Array(moment(`${this.year}-${this.month}`).daysInMonth()).keys()
                )
                    .map(num => ++num)
                    .slice(8 * this.week, 8 * (1 + this.week));
                const arrData = days.map(num => this.info.arrTotalRaw[num - 1]);
                console.log('days: ', days)
                console.log('week: ', this.week)
                console.log('info: ', this.info)
                return {
                    labels: days,
                    datasets: [
                        {
                            lineTension: 0,
                            fill: false,
                            borderColor: "rgb(75, 192, 192)",
                            data: arrData
                        }
                    ]
                };
            },
            profitDataset() {
                return Object.keys(this.info.itens)
                    .map(key => ({
                        name: key,
                        profit: this.round2(this.info.itens[key].totalRaw)
                    }))
                    .sort((a, b) => b.profit - a.profit)
                    .slice(0, 10);
            },
            bestSellersDataset() {
                return {
                    labels: Object.keys(this.info.itens),
                    datasets: [
                        {
                            data: Object.keys(this.info.itens).map(
                                key => this.info.itens[key].numOfSales
                            )
                        }
                    ]
                };
            },
            numOfSalesMontlyDataset() {
                const arrNum = Array.from(Array(12).keys()).map(() => 0);
                console.log('arrNum', arrNum)
                for (let i = 0; i < arrNum.length; i++) {
                    let sales = 0
                    this.TransactionsFixed.filter(e => {
                        if ((e.date.formatted.substring(0, 11) >= (this.year + '-' + (i + 1) + '-01')) && (e.date.formatted.substring(0, 11) <= (moment(this.year + '-' + (i + 1) + '-01').add(1, 'months').format('YYYY-MM-DD')))) {
                            sales += parseInt(e.produts.length)
                        }
                    })
                    arrNum[i] = sales
                    sales = 0
                }
                /* var arrMonths = Object.keys(this.statistics[this.year]).forEach(
                  month =>
                    (arrNum[Number(month) - 1] = this.statistics[this.year][
                      month
                    ].numOfSales)
                ); */

                return {
                    labels: this.monsthsName,
                    datasets: [
                        {
                            lineTension: 0,
                            fill: false,
                            borderColor: "rgb(75, 192, 192)",
                            data: arrNum
                        }
                    ]
                };
            },

            options() {
                return {
                    legend: {
                        display: false
                    },

                    tooltips: {
                        enabled: true,
                        callbacks: {
                            title: (items) => "R$ " + items[0].value,
                            label: () => null
                        }
                    }
                };
            }
        },
        apollo: {
            loadTransactions: {
                query: require("@/graphql/transaction/GetAllTransactions.gql"),
                variables() {
                    return {
                        unit_name: this.selectedUnit.name
                    }
                },
                update(data) {
                    console.log('data: ', data.Transaction)
                    this.lastYear = data.Transaction[data.Transaction.length - 1].date.formatted.substring(0, 4)
                    this.lastMonth = data.Transaction[data.Transaction.length - 1].date.formatted.substring(5, 7)
                    this.TransactionsFixed = data.Transaction
                    this.skipTransaction = true
                },
                skip() {
                    return this.skipTransaction
                }
            },
        }
    };
</script>