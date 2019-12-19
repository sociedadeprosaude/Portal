<template>
    <v-container>
        <v-layout row wrap v-if="report">
            <v-flex xs12>
                <v-card class="pa-4 receipt-to-print">
                    <v-layout row wrap>
                        <v-flex xs6 class="text-left">
                            <span class="my-sub-headline">Relatório Geral</span>
                        </v-flex>
                        <v-flex xs6 class="text-right">
                            <span>{{now | dateFilter}}</span>
                        </v-flex>
                        <v-flex xs12>
                            <v-layout row wrap class="mt-2">
                                <v-flex xs12>
                                    <v-divider></v-divider>
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs4>
                                    Procedimento
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs2>
                                    Custo
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs2>
                                    Venda
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs12>
                                    <v-divider></v-divider>
                                </v-flex>
                            </v-layout>
                        </v-flex>

                        <v-flex xs12>
                            <span class="my-headline">Consultas</span>
                        </v-flex>
                        <v-flex xs12 v-for="(spec, label) in report.specialties" :key="label" class="my-1">
                            <v-layout row wrap>
                                <v-flex xs12>
                                    <v-divider></v-divider>
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs2>
                                    {{label}}
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs1>
                                    {{spec.quantidade}}
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs2>
                                    {{spec.cost | moneyFilter}}
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs2>
                                    {{spec.price | moneyFilter}}
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs12>
                                    <v-divider></v-divider>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs12>
                            <span class="my-headline">Exames</span>
                        </v-flex>
                        <v-flex xs12 v-for="(exam, label) in report.exams" :key="label" class="my-1">
                            <v-layout row wrap>
                                <v-flex xs12>
                                    <v-divider></v-divider>
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs2>
                                    {{label}}
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs1>
                                    {{exam.quantidade}}
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs2>
                                    {{exam.cost | moneyFilter}}
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs2>
                                    {{exam.price | moneyFilter}}
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs12>
                                    <v-divider></v-divider>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs12>
                            <v-layout row wrap class="mt-2">
                                <v-flex xs12>
                                    <v-divider></v-divider>
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs2>
                                    Total
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs1>
                                    {{proceduresQuantity}}
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs2>
                                    {{report.totalCusto | moneyFilter}}
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs2>
                                    {{report.totalBruto | moneyFilter}}
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs12>
                                    <v-divider></v-divider>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs12>
                            <span class="my-headline">Saídas</span>
                        </v-flex>
                        <v-flex xs12 v-for="(outtake, label) in report.saidas" :key="label" class="my-1">
                            <v-layout row wrap>
                                <v-flex xs12>
                                    <v-divider></v-divider>
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs2>
                                    {{label}}
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs1>
                                    {{outtake.quantidade}}
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs2>
                                    {{outtake.value | moneyFilter}}
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs2>
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs12>
                                    <v-divider></v-divider>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs12>
                            <v-layout row wrap class="mt-2">
                                <v-flex xs12>
                                    <v-divider></v-divider>
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs2>
                                    Total Saidas
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs1>
                                    {{report.quantidadeSaidas}}
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs2>
                                    {{report.totalSaidas | moneyFilter}}
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs2>
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs12>
                                    <v-divider></v-divider>
                                </v-flex>
                            </v-layout>
                        </v-flex>

                        <v-flex xs12>
                            <v-layout row wrap>
                                <v-flex xs12>
                                    <v-layout row wrap>
                                        <v-flex xs12>
                                            <v-divider></v-divider>
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs3>
                                            Crédito
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs3>
                                            Débito
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs2>
                                            Dinheiro
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-divider></v-divider>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs12>
                                    <v-layout row wrap>
                                        <v-flex xs12>
                                            <v-divider></v-divider>
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs3>
                                            {{report.credito | moneyFilter}}
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs3>
                                            {{report.debito | moneyFilter}}
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs2>
                                            {{report.dinheiro | moneyFilter}}
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-divider></v-divider>
                                        </v-flex>
                                    </v-layout>
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
    export default {
        name: "GeneralReport",
        props: ['report', 'loading'],
        mounted() {
            console.log('rep', this.report)
        },
        data() {
            return {
                now: moment().format('YYYY-MM-DD HH:mm:ss')
            }
        },
        computed: {
            proceduresQuantity() {
                let procQt = 0
                for(let exam in this.report.exams) {
                    procQt += this.report.exams[exam].quantidade
                }
                for(let specialty in this.report.specialties) {
                    procQt += this.report.specialties[specialty].quantidade
                }
                return procQt
            }
        }
    }
</script>

<style scoped>


</style>
