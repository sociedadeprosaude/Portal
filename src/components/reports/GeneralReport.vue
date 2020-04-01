<template>
    <v-container>
        <v-layout row wrap v-if="report">
            <v-flex xs12>
                <v-chip-group
                        row
                        mandatory
                        v-model="reportSelected"
                        active-class="primary--text"
                >
                    <v-chip v-for="report in reportOptions" :key="report">
                        {{ report }}
                    </v-chip>
                </v-chip-group>
            </v-flex>
            <v-flex xs12>
                <v-card class="pa-4 receipt-to-print">
                    <v-layout row wrap>
                        <v-flex xs6 class="text-left">
                            <img :src="report.unit.logo" height="64px">
                        </v-flex>
                        <v-flex xs6 class="text-right">
                            <v-layout column wrap>
                                <span class="my-sub-headline mb-4">Relatório Geral</span>
                                <span>{{report.dataInicio | dateFilter}} até {{report.dataFinal | dateFilter}}</span>
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
                                    Procedimento
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs1>
                                    Quantidade
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs1>
                                    Custo
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs1>
                                    Venda
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs1>
                                    %
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
                                <v-flex xs1>
                                    {{spec.cost | moneyFilter}}
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs1>
                                    {{spec.price | moneyFilter}}
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs1>
                                    <span v-if="spec.price > 0">{{((spec.price - spec.cost) / spec.price) * 100 | moneyFilter}}%</span>
                                    <span v-else>0%</span>
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
                                <v-flex xs1>
                                    {{report.totalCustoEspecialts | moneyFilter}}
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs1>
                                    {{totalSpecialtiesIntakes | moneyFilter}}
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs1>
                                    <span v-if="totalSpecialtiesIntakes > 0">{{((totalSpecialtiesIntakes - report.totalCustoEspecialts) / totalSpecialtiesIntakes) * 100 | moneyFilter}}%</span>
                                    <span v-else>0%</span>
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
                            <span class="my-headline">Clínicas</span>
                        </v-flex>
                        <v-flex xs12 v-for="(clinics, label) in report.clinics" :key="label" class="my-1">
                            <v-layout row wrap>
                                <v-flex xs12>
                                    <v-divider></v-divider>
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs2>
                                    <span class="font-weight-bold">{{label}}</span>
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs1>
                                    {{clinics.quantidade}}
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs1>
                                    {{clinics.cost | moneyFilter}}
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs1>
                                    {{clinics.price | moneyFilter}}
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs1>
                                    <span v-if="clinics.price > 0">{{((clinics.price - clinics.cost) / clinics.price) * 100 | moneyFilter}}%</span>
                                    <span v-else>0%</span>
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs12 class="mt-4" v-if="reportSelected === 1">
                                    <v-layout row wrap v-for="(exam, name) in clinics.exams" :key="name">
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs2>
                                            - {{name}}
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs1>
                                            {{exam.quantity}}
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs1>
                                            {{exam.cost | moneyFilter}}
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs1>
                                            {{exam.price | moneyFilter}}
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs1>
                                            <span v-if="exam.price  > 0">{{((exam.price - exam.cost) / exam.price ) * 100 | moneyFilter}}%</span>
                                            <span v-else>0%</span>
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
                                    {{examsQuantity}}
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs1>
                                    {{report.totalCustoExams | moneyFilter}}
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs1>
                                    {{totalExamsIntakes | moneyFilter}}
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs1>
                                    <span v-if="totalExamsIntakes > 0">{{((totalExamsIntakes - report.totalCustoExams) / totalExamsIntakes) * 100 | moneyFilter}}%</span>
                                    <span v-else>0%</span>
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
                            <span class="my-headline">Gastos</span>
                        </v-flex>
                        <v-flex xs12 v-for="outtake in report.outtakes" :key="outtake.id" class="my-1">
                            <v-layout row wrap>
                                <v-flex xs12>
                                    <v-divider></v-divider>
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs2 class="font-weight-bold">
                                    {{outtake.category}}
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
                                <v-flex xs12 class="mt-4" v-if="reportSelected === 1">
                                    <v-layout row wrap>
                                        <v-flex xs12>
                                            <span>- {{outtake.description}}</span>
                                        </v-flex>
                                    </v-layout>
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
                                    {{report.quantidadeOuttakes}}
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs2>
                                    {{totalOuttakesInMoney + totalOuttakesNotMoney | moneyFilter}}
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

                        <v-flex xs12 class="mt-2">
                            <v-layout row wrap v-if="report.financialSupportIntakes.length > 0">
                                <v-flex xs12>
                                    <span class="my-headline">Aportes Financeiros</span>
                                </v-flex>
                                <v-flex xs12 v-for="intake in report.financialSupportIntakes" :key="intake.date"
                                        class="my-1">
                                    <v-layout row wrap>
                                        <v-flex xs12>
                                            <v-divider></v-divider>
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs2 class="font-weight-bold">
                                            {{intake.category}}
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs1>
                                            <!--                                            {{outtake.quantidade}}-->
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs2>
                                            {{intake.value | moneyFilter}}
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs2>
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs12 class="mt-4" v-if="reportSelected === 1">
                                            <v-layout row wrap>
                                                <v-flex xs12>
                                                    <span>{{intake.description}}</span>
                                                </v-flex>
                                            </v-layout>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-divider></v-divider>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-flex>

                        <v-flex xs12>
                            <span class="my-headline">Relatório</span>
                        </v-flex>

                        <v-flex xs12>
                            <v-layout row wrap>
                                <v-flex xs12 class="my-2">
                                    <v-layout row wrap>
                                        <v-flex xs1>
                                            <v-layout row wrap class="fill-height align-center justify-center">
                                                <span></span>
                                            </v-layout>
                                        </v-flex>
                                        <v-flex xs11>
                                            <v-layout row wrap>
                                                <v-flex xs12>
                                                    <v-layout row wrap>
                                                        <v-flex xs2></v-flex>
                                                        <v-flex xs3 class="border">Crédito
                                                        </v-flex>
                                                        <v-flex xs3 class="border">Débito
                                                        </v-flex>
                                                        <v-flex xs3 class="border">Dinheiro
                                                        </v-flex>
                                                        <v-flex xs1 class="border">
                                                            <span>%</span>
                                                        </v-flex>
                                                    </v-layout>
                                                </v-flex>
                                            </v-layout>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs12 class="my-2">
                                    <v-layout row wrap>
                                        <v-flex xs1 class="border">
                                            <v-layout row wrap class="fill-height align-center justify-center">
                                                <span>Entradas</span>
                                            </v-layout>
                                        </v-flex>
                                        <v-flex xs11>
                                            <v-layout row wrap>
                                                <v-flex xs12>
                                                    <v-layout row wrap>
                                                        <v-flex xs2 class="border">Saldo Bruto</v-flex>
                                                        <v-flex xs3 class="border">{{totalCredit | moneyFilter}}
                                                        </v-flex>
                                                        <v-flex xs3 class="border">{{totalDebit | moneyFilter}}
                                                        </v-flex>
                                                        <v-flex xs3 class="border">{{totalMoney +
                                                            totalFinancialSupport | moneyFilter}}
                                                        </v-flex>
                                                        <v-flex xs1>
                                                        </v-flex>
                                                    </v-layout>
                                                </v-flex>
                                                <v-flex xs12>
                                                    <v-layout row wrap>
                                                        <v-flex xs2 class="border">Total</v-flex>
                                                        <v-flex xs3 class="border">{{totalCredit | moneyFilter}}
                                                            ({{(totalCredit/totalRawIntake * 100).toFixed(2)}}%)
                                                        </v-flex>
                                                        <v-flex xs3 class="border">{{totalDebit | moneyFilter}}
                                                            ({{(totalDebit/totalRawIntake * 100).toFixed(2)}}%)
                                                        </v-flex>
                                                        <v-flex xs3 class="border">{{totalMoney +
                                                            totalFinancialSupport | moneyFilter}}
                                                            ({{(totalMoney/totalRawIntake * 100).toFixed(2)}}%)
                                                        </v-flex>
                                                        <v-flex xs1>
                                                        </v-flex>
                                                    </v-layout>
                                                </v-flex>
                                            </v-layout>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs12 class="my-2">
                                    <v-layout row wrap>
                                        <v-flex xs1 class="border">
                                            <v-layout class="align-center fill-height justify-center">
                                                <span>Saídas</span>
                                            </v-layout>
                                        </v-flex>
                                        <v-flex xs11>
                                            <v-layout row wrap>
                                                <v-flex xs12>
                                                    <v-layout row wrap>
                                                        <v-flex xs2 class="border">Custo Médicos</v-flex>
                                                        <v-flex xs3 class="border">{{0 | moneyFilter}}
                                                        </v-flex>
                                                        <v-flex xs3 class="border">{{0 | moneyFilter}}
                                                        </v-flex>
                                                        <v-flex xs3 class="border">{{report.totalCustoEspecialts |
                                                            moneyFilter}}
                                                        </v-flex>
                                                        <v-flex xs1 class="border">
                                                            {{(report.totalCustoEspecialts/this.report.totalBruto *
                                                            100).toFixed(2)}}%
                                                        </v-flex>
                                                    </v-layout>
                                                </v-flex>
                                                <v-flex xs12>
                                                    <v-layout row wrap>
                                                        <v-flex xs2 class="border">Custo Clínicas</v-flex>
                                                        <v-flex xs3 class="border">{{0 | moneyFilter}}
                                                        </v-flex>
                                                        <v-flex xs3 class="border">{{0 | moneyFilter}}
                                                        </v-flex>
                                                        <v-flex xs3 class="border">{{report.totalCustoExams |
                                                            moneyFilter}}
                                                        </v-flex>
                                                        <v-flex xs1 class="border">
                                                            {{(report.totalCustoExams/this.report.totalBruto *
                                                            100).toFixed(2)}}%
                                                        </v-flex>
                                                    </v-layout>
                                                </v-flex>
                                                <v-flex xs12>
                                                    <v-layout row wrap>
                                                        <v-flex xs2 class="border">Gastos Op. (dia-a-dia)</v-flex>
                                                        <v-flex xs3 class="border">{{0 | moneyFilter}}</v-flex>
                                                        <v-flex xs3 class="border">{{this.totalOuttakesNotMoney |
                                                            moneyFilter}}
                                                        </v-flex>
                                                        <v-flex xs3 class="border">{{this.totalOuttakesInMoney |
                                                            moneyFilter}}
                                                        </v-flex>
                                                        <v-flex xs1 class="border">
                                                            {{(totalOuttakesInMoney/this.report.totalBruto *
                                                            100).toFixed(2)}}%
                                                        </v-flex>
                                                    </v-layout>
                                                </v-flex>
                                                <v-flex xs12>
                                                    <v-layout row wrap>
                                                        <v-flex xs2 class="border">Taxas do cartão</v-flex>
                                                        <v-flex xs3 class="border">{{parseFloat(report.totalTaxaCredito)
                                                            | moneyFilter}}
                                                        </v-flex>
                                                        <v-flex xs3 class="border">{{parseFloat(report.totalTaxaDebito)
                                                            | moneyFilter}}
                                                        </v-flex>
                                                        <v-flex xs3 class="border">{{0 | moneyFilter}}
                                                        </v-flex>
                                                        <v-flex xs1 class="border">
                                                            {{((parseFloat(report.totalTaxaCredito) +
                                                            parseFloat(report.totalTaxaDebito))/this.report.totalBruto *
                                                            100).toFixed(2)}}%
                                                        </v-flex>
                                                    </v-layout>
                                                </v-flex>
                                                <v-flex xs12>
                                                    <v-layout row wrap>
                                                        <v-flex xs2 class="border">Total</v-flex>
                                                        <v-flex xs3 class="border">{{parseFloat(report.totalTaxaCredito)
                                                            | moneyFilter}}
                                                        </v-flex>
                                                        <v-flex xs3 class="border">{{parseFloat(report.totalTaxaDebito)
                                                            | moneyFilter}}
                                                        </v-flex>
                                                        <v-flex xs3 class="border">{{report.totalCustoEspecialts +
                                                            report.totalCustoExams + totalOuttakesInMoney |
                                                            moneyFilter}}
                                                        </v-flex>
                                                        <v-flex xs1 class="border">
                                                            {{((parseFloat(report.totalTaxaCredito) +
                                                            parseFloat(report.totalTaxaDebito) +
                                                            report.totalCustoEspecialts +
                                                            report.totalCustoExams +
                                                            totalOuttakesInMoney)/this.report.totalBruto *
                                                            100).toFixed(2)}}%
                                                        </v-flex>
                                                    </v-layout>
                                                </v-flex>
                                            </v-layout>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs12 class="my-2">
                                    <v-layout row wrap>
                                        <v-flex xs1 class="border">
                                            <v-layout row wrap class="fill-height align-center justify-center">
                                                <span>Total</span>
                                            </v-layout>
                                        </v-flex>
                                        <v-flex xs11>
                                            <v-layout row wrap>
                                                <v-flex xs12>
                                                    <v-layout row wrap>
                                                        <v-flex xs2 class="border">
                                                            <v-layout row wrap
                                                                      class="align-center justify-center fill-height">
                                                                <v-divider class="black mx-4"></v-divider>
                                                            </v-layout>
                                                        </v-flex>
                                                        <v-flex xs3 class="border">{{report.credito -
                                                            parseFloat(report.totalTaxaCredito) | moneyFilter}}
                                                        </v-flex>
                                                        <v-flex xs3 class="border">{{report.debito -
                                                            parseFloat(report.totalTaxaDebito) - totalOuttakesNotMoney |
                                                            moneyFilter}}
                                                        </v-flex>
                                                        <v-flex xs3 class="border">{{report.dinheiro +
                                                            totalFinancialSupport - report.totalCustoEspecialts -
                                                            report.totalCustoExams - totalOuttakesInMoney |
                                                            moneyFilter}}
                                                        </v-flex>
                                                        <v-flex xs1 class="border">
                                                            {{((report.credito -
                                                            parseFloat(report.totalTaxaCredito) + report.debito -
                                                            parseFloat(report.totalTaxaDebito) + report.dinheiro +
                                                            totalFinancialSupport - report.totalCustoEspecialts -
                                                            report.totalCustoExams -
                                                            totalOuttakesInMoney)/this.report.totalBruto *
                                                            100).toFixed(2)}}%
                                                        </v-flex>
                                                    </v-layout>
                                                </v-flex>
                                            </v-layout>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>

                                <v-flex xs12 class="my-1">
                                    <v-layout row wrap class="justify-center">
                                        <v-flex xs3 class="border">
                                            Total Bruto
                                        </v-flex>
                                        <v-flex xs3 class="border">
                                            Custos
                                        </v-flex>
                                        <v-flex xs2 class="border">
                                            Saldo Final
                                        </v-flex>
                                    </v-layout>
                                </v-flex>

                                <v-flex xs12 class="my-1">
                                    <v-layout row wrap class="justify-center">
                                        <v-flex xs3 class="border">
                                            {{ this.totalRawIntake | moneyFilter}}
                                        </v-flex>
                                        <v-flex xs3 class="border">
                                            {{totalCost | moneyFilter}} ({{(totalCost / this.report.totalBruto *
                                            100).toFixed(2)}}%)
                                        </v-flex>
                                        <v-flex xs2 class="border">
                                            {{finalProfit | moneyFilter}} ({{(finalProfit / this.report.totalBruto *
                                            100).toFixed(2)}}%)
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
        name: "GeneralReport",
        props: ['report', 'loading'],
        data() {
            return {
                now: moment().format('YYYY-MM-DD HH:mm:ss'),
                total: 0,
                reportOptions: ['Relatorio Geral', 'Relatorio Geral Detalhado'],
                reportSelected: 0
            }
        },
        computed: {
            finalProfit() {
                return this.report.totalBruto + parseFloat(this.totalFinancialSupport) -
                    (parseFloat(this.report.totalCusto) + parseFloat(this.report.totalTaxaDebito) +
                        parseFloat(this.report.totalTaxaCredito) +
                        parseFloat(this.totalOuttakesInMoney) + parseFloat(this.totalOuttakesNotMoney)).toFixed(2)
            },
            totalCost() {
                return (parseFloat(this.report.totalCusto) +
                    parseFloat(this.report.totalTaxaDebito) + parseFloat(this.report.totalTaxaCredito) +
                    parseFloat(this.totalOuttakesInMoney) + parseFloat(this.totalOuttakesNotMoney))
            },
            totalFinancialSupport() {
                let total = 0
                for (let support in this.report.financialSupportIntakes) {
                    total += this.report.financialSupportIntakes[support].value
                }
                return total
            },
            proceduresQuantity() {
                let procQt = 0
                for (let specialty in this.report.specialties) {
                    procQt += this.report.specialties[specialty].quantidade
                }
                return procQt
            },
            examsQuantity() {
                let quantidade = 0
                for (let clinic in this.report.clinics) {
                    quantidade += this.report.clinics[clinic].quantidade
                }
                return quantidade
            },
            totalExamsIntakes() {
                return this.report.intakesArray.reduce((sum, intake) => {
                    let examsSum = 0
                    let discountPercentage = 0
                    if (intake.subTotal > 0) {
                        discountPercentage = intake.discount / intake.subTotal
                    }
                    if (intake.exams) {
                        for (let exam of intake.exams) {
                            examsSum += exam.price - (exam.price * discountPercentage)
                        }
                    }
                    return sum + examsSum
                }, 0)
            },
            totalSpecialtiesIntakes() {
                return this.report.intakesArray.reduce((sum, intake) => {
                    let specialtiesSum = 0
                    let discountPercentage = 0
                    if (intake.subTotal > 0) {
                        discountPercentage = intake.discount / intake.subTotal
                    }
                    if (intake.specialties) {
                        for (let spec of intake.specialties) {
                            specialtiesSum += spec.price - (spec.price * discountPercentage)
                        }
                    }
                    return sum + specialtiesSum
                }, 0)
            },
            totalOuttakesInMoney() {
                let total = 0
                let moneyOuttakes = this.report.outtakes.filter((outtake) => {
                    return outtake.payment_method === 'Dinheiro'
                })
                for (let outtake of moneyOuttakes) {
                    total += outtake.value
                }
                return total
            },
            totalOuttakesNotMoney() {
                let total = 0
                let moneyOuttakes = this.report.outtakes.filter((outtake) => {
                    return outtake.payment_method !== 'Dinheiro'
                })
                for (let outtake of moneyOuttakes) {
                    total += outtake.value
                }
                return total
            },
            totalRawIntake() {
                return this.report.intakesArray.reduce((sum, intake) => sum + parseFloat(intake.total), 0)
            },
            totalCredit() {
                return this.report.intakesArray.reduce((sum, intake) => {
                    for (let payment in intake.payments) {
                        if (intake.payments[payment] === 'Crédito') {
                            return sum + parseFloat(intake.valuesPayments[payment])
                        }
                    }
                    return sum + 0
                }, 0)
            },
            totalDebit() {
                return this.report.intakesArray.reduce((sum, intake) => {
                    for (let payment in intake.payments) {
                        if (intake.payments[payment] === 'Débito' || intake.payments[payment] === '') {
                            if (isNaN(parseFloat(intake.valuesPayments[payment]))) {
                                intake.valuesPayments[payment] = 0.00
                            }
                            return sum + parseFloat(intake.valuesPayments[payment])
                        }
                    }
                    return sum + 0
                }, 0)
            },
            totalMoney() {
                return this.report.intakesArray.reduce((sum, intake) => {
                    for (let payment in intake.payments) {
                        if (intake.payments[payment] === 'Dinheiro') {
                            return sum + parseFloat(intake.valuesPayments[payment])
                        }
                    }
                    return sum + 0
                }, 0)
            }
        }
    }
</script>

<style scoped>
    .border {
        border: 1px solid grey;
    }
</style>
