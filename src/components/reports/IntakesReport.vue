<template>
    <v-container>
        <v-layout row wrap v-if="report">
            <v-flex xs12>
                <v-card class="pa-4 receipt-to-print">
                    <v-layout row wrap>
                        <v-flex xs6 class="text-left">
                            <span class="my-sub-headline">Relatório Vendas</span>
                        </v-flex>
                        <v-flex xs6 class="text-right">
                            <span>{{now | dateFilter}}</span>
                        </v-flex>
                        <v-flex xs12 v-for="(intake, label) in report.intakes" :key="label" class="my-1">
                            <v-flex xs12>
                                <v-layout row wrap class="mt-2">
                                    <v-flex xs12>
                                        <v-divider></v-divider>
                                    </v-flex>
                                    <v-flex xs1>
                                        <v-divider vertical></v-divider>
                                    </v-flex>
                                    <v-flex xs5 class="font-weight-black">
                                        Intake
                                    </v-flex>
                                    <v-flex xs1>
                                        <v-divider vertical></v-divider>
                                    </v-flex>
                                    <v-flex xs1 class="font-weight-black">
                                        Custo
                                    </v-flex>
                                    <v-flex xs1>
                                        <v-divider vertical></v-divider>
                                    </v-flex>
                                    <v-flex xs2 class="font-weight-black">
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
                            <v-layout row wrap>
                                <v-flex xs12>
                                    <v-divider></v-divider>
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs5>
                                    {{label}}
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs1>
                                    {{intake.cost | moneyFilter}}
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs2>
                                    {{intake.price | moneyFilter}}
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs12>
                                    <v-divider></v-divider>
                                </v-flex>
                            </v-layout>
                            <v-flex xs12 v-if="intake.exams.length > 0">
                                <v-layout row wrap class="mt-2">
                                    <v-flex xs12>
                                        <v-divider></v-divider>
                                    </v-flex>
                                    <v-flex xs1>
                                        <v-divider vertical></v-divider>
                                    </v-flex>
                                    <v-flex xs2 class="font-weight-bold">
                                        Exames
                                    </v-flex>
                                    <v-flex xs1>
                                        <v-divider vertical></v-divider>
                                    </v-flex>
                                    <v-flex xs2 class="font-weight-bold">
                                        Clinica
                                    </v-flex>
                                    <v-flex xs1>
                                        <v-divider vertical></v-divider>
                                    </v-flex>
                                    <v-flex xs1 class="font-weight-bold">
                                        Custo
                                    </v-flex>
                                    <v-flex xs1>
                                        <v-divider vertical></v-divider>
                                    </v-flex>
                                    <v-flex xs2 class="font-weight-bold">
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
                            <v-flex xs12 v-for="(examees, labels) in intake.exams" :key="labels" class="my-1">

                                <v-layout row wrap>
                                    <v-flex xs12>
                                        <v-divider></v-divider>
                                    </v-flex>
                                    <v-flex xs1>
                                        <v-divider vertical></v-divider>
                                    </v-flex>
                                    <v-flex xs2>
                                        {{examees.name}}
                                    </v-flex>
                                    <v-flex xs1>
                                        <v-divider vertical></v-divider>
                                    </v-flex>
                                    <v-flex xs2 >
                                        {{examees.clinic.name}}
                                    </v-flex>
                                    <v-flex xs1>
                                        <v-divider vertical></v-divider>
                                    </v-flex>
                                    <v-flex xs1>
                                        {{examees.cost | moneyFilter}}
                                    </v-flex>
                                    <v-flex xs1>
                                        <v-divider vertical></v-divider>
                                    </v-flex>
                                    <v-flex xs2>
                                        {{examees.price | moneyFilter}}
                                    </v-flex>
                                    <v-flex xs1>
                                        <v-divider vertical></v-divider>
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-divider></v-divider>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                            <v-flex xs12 v-if="intake.specialties.length > 0">
                                <v-layout row wrap class="mt-2">
                                    <v-flex xs12>
                                        <v-divider></v-divider>
                                    </v-flex>
                                    <v-flex xs1>
                                        <v-divider vertical></v-divider>
                                    </v-flex>
                                    <v-flex xs5 class="font-weight-bold">
                                        Especialidade
                                    </v-flex>
                                    <v-flex xs1>
                                        <v-divider vertical></v-divider>
                                    </v-flex>
                                    <v-flex xs1 class="font-weight-bold">
                                        Custo
                                    </v-flex>
                                    <v-flex xs1>
                                        <v-divider vertical></v-divider>
                                    </v-flex>
                                    <v-flex xs2 class="font-weight-bold">
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
                            <v-flex xs12 v-for="(specialtie, labels) in intake.specialties" :key="labels" class="my-1">
                                <v-layout row wrap>
                                    <v-flex xs12>
                                        <v-divider></v-divider>
                                    </v-flex>
                                    <v-flex xs1>
                                        <v-divider vertical></v-divider>
                                    </v-flex>
                                    <v-flex xs5>
                                        {{specialtie.name}}
                                    </v-flex>
                                    <v-flex xs1>
                                        <v-divider vertical></v-divider>
                                    </v-flex>
                                    <v-flex xs1>
                                        {{specialtie.cost | moneyFilter}}
                                    </v-flex>
                                    <v-flex xs1>
                                        <v-divider vertical></v-divider>
                                    </v-flex>
                                    <v-flex xs2>
                                        {{specialtie.price | moneyFilter}}
                                    </v-flex>
                                    <v-flex xs1>
                                        <v-divider vertical></v-divider>
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-divider></v-divider>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                            <v-flex xs12 v-for="i in 3">
                                <v-divider color="black"></v-divider>
                            </v-flex>

                        </v-flex>
                        <v-flex xs12>
                            <span class="my-headline">Relatório</span>
                        </v-flex>

                        <v-flex xs12>
                            <v-layout row wrap >
                                <v-flex xs12 class="my-1">
                                    <v-layout row wrap class="mt-2">
                                        <v-flex xs12>
                                            <v-divider></v-divider>
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs3>
                                            Total Crédito
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs3>
                                            Total Débito
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs2>
                                            Total Caixa
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-divider></v-divider>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs12 class="my-1">
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
                                <v-flex xs12 class="my-1">
                                    <v-layout row wrap>
                                        <v-flex xs12>
                                            <v-divider></v-divider>
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs3>
                                            Taxa Crédito
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs3>
                                            Taxa Débito
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs2>
                                            Total Bruto - Taxas
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-divider></v-divider>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs12 class="my-1">
                                    <v-layout row wrap>
                                        <v-flex xs12>
                                            <v-divider></v-divider>
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs3>
                                            {{parseFloat(report.totalTaxaCredito) | moneyFilter}}
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs3>
                                            {{parseFloat(report.totalTaxaDebito) | moneyFilter}}
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs2>
                                            {{(((report.totalBruto)- parseFloat(report.totalTaxaDebito)) - parseFloat(report.totalTaxaCredito) )| moneyFilter}}
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-divider></v-divider>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>

                                <v-flex xs12 class="my-1">
                                    <v-layout row wrap>
                                        <v-flex xs12>
                                            <v-divider></v-divider>
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs3>
                                            Total Bruto
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs3>
                                            Total Liquido
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs2>
                                            Saldo Final
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-divider></v-divider>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>

                                <v-flex xs12 class="my-1">
                                    <v-layout row wrap>
                                        <v-flex xs12>
                                            <v-divider></v-divider>
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs3>
                                            {{ this.report.totalBruto.toFixed(2)}}
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs3>
                                            {{(this.report.totalBruto - this.report.totalCusto -  parseFloat(report.totalTaxaDebito) - parseFloat(report.totalTaxaCredito)).toFixed(2)}}
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs2>
                                            {{(this.report.totalBruto - this.report.totalCusto - parseFloat(report.totalTaxaDebito) - parseFloat(report.totalTaxaCredito)).toFixed(2)}}
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
    import moment from "moment"
    export default {
        name: "IntakesReport",
        props: ['report', 'loading'],
        mounted() {
            console.log('rep', this.report)
        },
        data() {
            return {
                now: moment().format('YYYY-MM-DD HH:mm:ss'),
                total: 0,
            }
        },
        computed: {
            proceduresQuantity() {
                let procQt = 0
                for(let specialty in this.report.specialties) {
                    procQt += this.report.specialties[specialty].quantidade
                }
                return procQt
            },
            examsQuantity(){
                let quantidade=0
                for(let exam in this.report.exams){
                    quantidade +=this.report.exams[exam].quantidade
                }
                return quantidade
            }
        }
    }
</script>

<style scoped>
</style>