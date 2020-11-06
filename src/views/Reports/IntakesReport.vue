<template>
    <v-container>
        <v-row align="center" justify="center">
            <v-col cols="4" class="pa-0">
                <v-menu v-model="dateMenuStart">
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                                v-model="formattedSelectedStartDate"
                                label="Data"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                        />
                    </template>
                    <v-date-picker v-model="selectedStartDate"/>
                </v-menu>
            </v-col>
            <v-col cols="4">
                <v-menu v-model="dateMenuFinal">
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                                v-model="formattedSelectedFinalDate"
                                label="Data"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                        />
                    </template>
                    <v-date-picker v-model="selectedFinalDate"/>
                </v-menu>
            </v-col>
            <v-col cols="12" class="py-0">
                <ApolloQuery :query="require('@/graphql/clinics/LoadClinics.gql')"
                             :variables="{property: true}">
                    <template v-slot="{result: {data, loading, error}}">
                        <v-progress-linear v-if="loading" color="primary" indeterminate/>
                        <strong class="red--text" v-else-if="error">Erro ao carregar as unidades, verifique sua
                            conexão</strong>
                        <v-chip-group mandatory v-else-if="data" active-class="primary white--text">
                            <v-chip v-for="unit in data.Clinic" :key="unit.name" @click="selectedUnit = unit">
                                <strong style="font-size: 0.6em">{{ unit.name }}</strong>
                            </v-chip>
                        </v-chip-group>
                    </template>
                </ApolloQuery>
            </v-col>
            <ApolloQuery v-if="selectedUnit" :query="require('@/graphql/transaction/GetTransactions.gql')"
                         :variables="{date_start: selectedStartDate + 'T00:00:00', date_final: selectedFinalDate + 'T23:59:59', unit_name: selectedUnit.name}"
            >
                <template v-slot="{result: {data, loading, error}}">
                    <v-progress-circular indeterminate color="primary" v-if="loading"/>
                    <strong class="red--text" v-else-if="error">Erro ao carregar relatorio, verifique sua
                        conexão</strong>
                    <IntakesReport
                            v-else-if="data"
                            :report="data.Transaction"
                            :dateStart="selectedStartDate"
                            :dateEnd="selectedFinalDate"
                            :loading="loading"
                            :now="now"
                            :total="total"
                            :colaborator="colaborator"
                            :payments="payments(data.Transaction)"
                    />
                </template>
            </ApolloQuery>
        </v-row>
    </v-container>
</template>

<script>
    import IntakesReport from "@/components/Reports/IntakesReport";
    import moment from "moment";

    export default {
        //   name: "IntakesReport",
        props: ["report", "loading"],
        components: {IntakesReport},
        data() {
            return {
                now: moment().format("YYYY-MM-DD HH:mm:ss"),
                total: 0,
                colaborator: null,
                dateMenuStart: false,
                dateMenuFinal: false,
                selectedStartDate: moment().format("YYYY-MM-DD"),
                selectedFinalDate: moment().format("YYYY-MM-DD"),
                selectedUnit: undefined,
            };
        },

        mounted() {
        },
        methods: {
            payments(transactions) {
                let credito = 0;
                let debito = 0;
                let dinheiro = 0;
                console.log('entrei aqui', transactions);
                for (let i in transactions) {
                    console.log('i: ', i);
                    for (let j in transactions[i].payments) {
                        if (transactions[i].payment_methods[j] === 'Dinheiro') {
                            dinheiro += parseFloat(transactions[i].payments[j])
                        }
                        if (transactions[i].payment_methods[j] === 'Debito') {
                            debito += parseFloat(transactions[i].payments[j])
                        }
                        if (transactions[i].payment_methods[j] === 'Credito') {
                            credito += parseFloat(transactions[i].payments[j])
                        }
                    }
                }
                let payments = {};
                payments.credito = credito;
                payments.debito = debito;
                payments.dinheiro = dinheiro;
                console.log('payments : ', payments);
                return payments
            }
        },
        computed: {
            examsQuantity() {
                let quantidade = 0;
                for (let exam in this.report.exams) {
                    quantidade += this.report.exams[exam].quantidade;
                }

                return quantidade;
            },
            colaborators() {
                return this.$store.getters.colaborators;
            },
            intakesReport() {
                return this.$store.getters.intakesReport;
            },
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
            }
        }
    };
</script>

<style scoped>
</style>
