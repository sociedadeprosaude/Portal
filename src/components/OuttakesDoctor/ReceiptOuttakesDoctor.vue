<template>
    <v-card class="receipt-to-print white ma-0 pa-0 align-start fill-height pr-5 pl-5 ">
        <v-layout row wrap class="hidden-print-only">
            <v-flex xs1 class="text-left white mt-2">
                <v-btn class="transparent" text @click="$emit('close')">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex xs1 class="text-right white mt-2">
                <v-btn class="transparent" text @click="print('receipt')">
                    <v-icon>print</v-icon>
                </v-btn>
            </v-flex>
        </v-layout>
        <v-layout row wrap  style="border: 2px solid #2196f3; border-radius: 16px">
            <v-flex xs6 class="text-left">
                <v-layout column wrap>
                    <span class="my-sub-headline primary--text" style="font-size: 1.4em">{{this.doctorSelected.name}}</span>
                    <v-flex>
                        <span class="primary--text font-weight-bold">CRM: </span>
                        <span class="font-weight-bold">{{this.doctorSelected.crm}}</span>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex xs6 class="text-right">
                <img :src="selectedUnit.logo" height="84px">
            </v-flex>
            <v-flex xs12>
                <v-card v-for="(charge,i) in outtakes" v-bind:key="i" class="elevation-0">
                        <v-layout row wrap>
                            <v-flex xs5 class="align-center justify-center">
                                <p class="font-weight-black mt-5">
                                    {{charge._id}}
                                </p>
                            </v-flex>
                            <v-flex xs1>
                                <v-spacer></v-spacer>
                            </v-flex>
                            <v-flex xs6 class="text-center align-center justify-center">
                                <p class="mt-5"> PREÇO: {{charge.value ? -charge.value : 0}}</p>
                            </v-flex>
                            <v-flex xs12>
                                <v-divider color="black"></v-divider>
                            </v-flex>
                        </v-layout>
                </v-card>
                <v-layout row wrap>
                    <v-flex xs6>
                        <p class="font-weight-black">Valor Total</p>
                    </v-flex>
                    <v-flex xs6> Valor total: {{-CostExamsDoctor}}</v-flex>
                </v-layout>
                <v-layout>
                    <v-flex xs6 class="text-left mt-12">
                        <v-layout column wrap class="primary--text">
                          <span class="font-weight-bold">Medikon</span>
                          <span v-if="selectedUnit.has_address"> {{selectedUnit.has_address[0].street + ' ' + selectedUnit.has_address[0].number +  ',' +  selectedUnit.has_address[0].neighboor}}</span>
                          <span>Manaus - AM</span>
                          <span>CNPJ: 33.531.977/0001-94</span>
                        </v-layout>
                    </v-flex>
                    <v-flex xs6 class="primary" style="height: 2px; margin-top: 124px;"></v-flex>
                </v-layout>
            </v-flex>
            <v-flex xs12>
                <v-divider class="my-3"/>
            </v-flex>
            <v-spacer/>
            <v-flex xs11/>
            <v-flex xs12 v-if="loading">
                <v-progress-linear color="primary" indeterminate/>
            </v-flex>
        </v-layout>
    </v-card>
</template>

<script>

    export default {
        name: "ReceiptOuttakesConvenants",
        props: ['doctorSelected', 'outtakes'],
        mounted() {
            this.$store.dispatch('GetReceiptsDoctor', this.doctorSelected)

        },
        data() {
            return {
                numberIntake: '',
                loading: false,
                successUpdateExams: false,
                dialogContestValue: false,
                ContestExam:[],
                NewValue: '',
                priceTotal: 0
            };
        },
        computed: {
            selectedUnit() {
                return this.$store.getters.selectedUnit
            },
          CostExamsDoctor(){
            let cost = 0;
            console.log('outtakes: ', this.outtakes)
            for(let i in this.outtakes){
              cost += parseFloat(this.outtakes[i].value)
            }
            return cost ? cost : 0
          },
        },
        methods: {
            print(ref) {
                window.print()
            },
            PriceIntake(intake){
                let price= 0;
                for(let exam of intake.exams){
                    price += exam.price
                    this.priceTotal += exam.price
                }
                return price
            },
        }
    }
</script>
