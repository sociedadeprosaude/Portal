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
            <v-flex xs12  v-if="reportSelected === 0">
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

                        <v-flex xs12 v-for="(spec, label) in Procedures" :key="label" class="my-1">
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
                                    {{spec.quantity}}
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
                        <v-flex xs12 v-for="(clinics, label) in report.clinics" :key="label" class="my-1">
                            <v-layout row wrap v-if="clinics.property !== true">
                                <v-flex xs12>
                                    <v-divider></v-divider>
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs2>
                                    <span >{{label}}</span>
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
                                <v-flex xs2 class="font-weight-bold">
                                    Total
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs1 class="font-weight-bold">
                                    {{QuantityTotalFinish}}
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs1 class="font-weight-bold">
                                    {{CostTotalFinish | moneyFilter}}
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs1 class="font-weight-bold">
                                    {{PriceTotalFinish | moneyFilter}}
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs1 class="font-weight-bold">
                                    <span v-if="PriceTotalFinish > 0">{{((PriceTotalFinish - CostTotalFinish) / PriceTotalFinish) * 100 | moneyFilter}}%</span>
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
                                <v-flex xs2>
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
                                <v-flex xs2 class="font-weight-bold">
                                    Total
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs1 class="font-weight-bold">
                                    {{report.quantidadeOuttakes}}
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs2 class="font-weight-bold">
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
                                            {{ this.PriceTotalFinish | moneyFilter}}
                                        </v-flex>
                                        <v-flex xs3 class="border">
                                            {{totalCost | moneyFilter}} ({{(totalCost / this.totalProfit *
                                            100).toFixed(2)}}%)
                                        </v-flex>
                                        <v-flex xs2 class="border">
                                            {{finalProfit | moneyFilter}} ({{(finalProfit / this.totalProfit *
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
        components:{
        },
        name: "LuizFernandoReport",
        props: ['report', 'loading', 'reportAllUnits'],
        data() {
            return {
                now: moment().format('YYYY-MM-DD HH:mm:ss'),
                total: 0,
                reportOptions: ['Relatório Geral'],
                reportSelected: 0
            }
        },
        computed: {
            finalProfit() {
                return (parseFloat(this.totalProfit) - parseFloat(this.totalCost)).toFixed(2)
            },
            totalProfit(){
                return (parseFloat(this.totalSpecialtiesIntakes)+ parseFloat(this.totalExamsIntakes) + parseFloat(this.totalFinancialSupport))
            },
            totalCost() {
                return (parseFloat(this.totalCostSpecialtiesIntakes)+ parseFloat(this.totalCostExamsIntakes) +
                    parseFloat(this.totalTaxaDebit) + parseFloat(this.totalTaxaCredit) +
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
                for (let specialty in this.Procedures) {
                    procQt += this.Procedures[specialty].quantity
                }
                return procQt
            },
            examsQuantity() {
                let quantidade = 0
                for (let clinic in this.report.clinics) {
                    if(this.report.clinics[clinic].property !== true){
                        quantidade += this.report.clinics[clinic].quantidade
                    }
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
                            if(exam.clinic.property !== true){
                                examsSum += exam.price - (exam.price * discountPercentage)
                            }
                        }
                    }
                    return sum + examsSum
                }, 0)
            },
            totalCostExamsIntakes() {
                return this.report.intakesArray.reduce((sum, intake) => {
                    let examCost = 0
                    if (intake.exams) {
                        for(let exam of intake.exams) {
                            if(exam.clinic.property !== true){
                                examCost += parseFloat(exam.cost)
                            }
                        }
                    }
                    return sum + examCost
                }, 0)
            },
            totalSpecialtiesIntakes() {
                let procQt = 0
                for (let specialty in this.Procedures) {

                    procQt += this.Procedures[specialty].price
                }
                return procQt
            },
            totalCostSpecialtiesIntakes() {
                let procQt = 0
                for (let specialty in this.Procedures) {
                    procQt += this.Procedures[specialty].cost
                }
                return procQt
            },
            totalOuttakesInMoney() {
                let total = 0
                let moneyOuttakes = this.report.outtakes.filter((outtake) => {
                    return outtake.payment_method === 'Dinheiro'
                })
                for (let outtake of moneyOuttakes) {
                    total += parseFloat(outtake.value)
                }
                return total
            },
            totalOuttakesNotMoney() {
                let total = 0
                let moneyOuttakes = this.report.outtakes.filter((outtake) => {
                    return outtake.payment_method !== 'Dinheiro'
                })
                for (let outtake of moneyOuttakes) {
                    total += parseFloat(outtake.value)
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
            totalTaxaCredit() {
                return this.report.intakesArray.reduce((sum, intake) => {
                    for (let payment in intake.payments) {
                        if (intake.payments[payment] === 'Crédito' ) {
                            if (intake.parcel[payment] === 1) {
                                return sum + ((parseFloat(intake.valuesPayments[payment]) * 0.026) / 100)
                            } else if (intake.parcel[payment] === 2) {
                                return sum + (((parseFloat(intake.valuesPayments[payment]) * 0.026) / 100) + ((parseFloat(intake.valuesPayments[payment]) * 0.0191) / 100))
                            } else if (intake.parcel[payment] === 3) {
                                return sum + (((parseFloat(intake.valuesPayments[payment]) * 0.026) / 100) + ((parseFloat(intake.valuesPayments[payment]) * 0.0254) / 100))
                            } else if (intake.parcel[payment] === 4) {
                                return sum + (((parseFloat(intake.valuesPayments[payment]) * 0.026) / 100) + ((parseFloat(intake.valuesPayments[payment]) * 0.0317) / 100))
                            } else if (intake.parcel[payment] === 5) {
                                return sum + (((parseFloat(intake.valuesPayments[payment]) * 0.026) / 100) + ((parseFloat(intake.valuesPayments[payment]) * 0.0378) / 100))
                            }
                        }
                    }
                    return sum + 0
                }, 0)
            },
            totalDebit() {
                return this.report.intakesArray.reduce((sum, intake) => {
                    for (let payment in intake.payments) {
                        if (intake.payments[payment] === 'Débito' || intake.payments[payment] === '') {
                            return sum + parseFloat(intake.valuesPayments[payment])
                        }
                    }
                    return sum + 0
                }, 0)
            },
            totalTaxaDebit() {
                return this.report.intakesArray.reduce((sum, intake) => {
                    for (let payment in intake.payments) {
                        if (intake.payments[payment] === 'Débito') {
                            return sum + ((parseFloat(intake.valuesPayments[payment]) * 0.0299)/100)
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
            },
            Procedures(){
                let procedures = {}
                procedures = Object.assign({}, this.report.specialties)
                for(let clinic in this.report.clinics){
                    if(this.report.clinics[clinic].property === true){
                        for(let exam in this.report.clinics[clinic].exams){
                            if(this.report.clinics[clinic].exams[exam].type !== ''){
                                if(!procedures[this.report.clinics[clinic].exams[exam].type]){
                                    procedures[this.report.clinics[clinic].exams[exam].type] = {
                                        quantity: 0,
                                        cost: 0,
                                        price: 0,
                                    }
                                }
                                procedures[this.report.clinics[clinic].exams[exam].type].quantity +=this.report.clinics[clinic].exams[exam].quantity
                                procedures[this.report.clinics[clinic].exams[exam].type].cost +=this.report.clinics[clinic].exams[exam].cost
                                procedures[this.report.clinics[clinic].exams[exam].type].price +=this.report.clinics[clinic].exams[exam].price
                            }
                            else{
                                if(!procedures[this.report.clinics[clinic].exams[exam].name]){
                                    procedures[this.report.clinics[clinic].exams[exam].name] = {
                                        quantity: 0,
                                        cost: 0,
                                        price: 0,
                                    }
                                }
                                procedures[this.report.clinics[clinic].exams[exam].name].quantity +=this.report.clinics[clinic].exams[exam].quantity
                                procedures[this.report.clinics[clinic].exams[exam].name].cost +=this.report.clinics[clinic].exams[exam].cost
                                procedures[this.report.clinics[clinic].exams[exam].name].price +=this.report.clinics[clinic].exams[exam].price


                            }
                        }
                    }
                }
                return procedures
            },
            QuantityTotalFinish(){
                return this.proceduresQuantity + this.examsQuantity
            },
            CostTotalFinish(){
                return this.totalCostSpecialtiesIntakes + this.totalCostExamsIntakes
            },
            PriceTotalFinish(){
                return this.totalSpecialtiesIntakes + this.totalExamsIntakes
            }


        }
    }
</script>

<style scoped>
    .border {
        border: 1px solid grey;
    }
</style>
