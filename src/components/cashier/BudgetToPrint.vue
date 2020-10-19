<template>
    <v-container v-if="budget" fluid class="fill-height ma-0 pa-0">
        <v-layout row wrap>
            <v-flex sm12 xs12>
                <v-card flat class="item-to-print ma-0 mb-0">
                    <v-layout row wrap>
                        <v-flex xs6 class="text-left hidden-print-only">
                        <v-btn class="transparent" text @click="$emit('close')">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-flex>
                        <v-flex xs6 class="text-right hidden-print-only">
                        <v-btn class="transparent" text @click="shareWhatsApp()">
                          <img class="black" src="../../assets/icons/icons8-whatsapp.svg" height="22px">
                        </v-btn>
                          <v-btn class="transparent" text @click="shareFacebook()">
                            <v-icon>facebook</v-icon>
                          </v-btn>
                        <v-btn class="transparent" text @click="download()">
                          <v-icon>cloud_download</v-icon>
                        </v-btn>
                        <v-btn class="transparent" text @click="print()">
                            <v-icon>print</v-icon>
                        </v-btn>
                    </v-flex>
                        <v-flex>
                            <v-card flat class="pa-10 py-2">
                                <v-layout row wrap class="align-center pa-4"
                                          style="border: 2px solid #2196f3; border-radius: 16px">
                                    <v-flex xs6 class="text-left">
                                        <img :src="selectedUnit.logo" height="84px">
                                    </v-flex>
                                    <v-flex xs6 class="text-right pr-4" v-if="this.budget.user">
                                        <v-layout column wrap>
                                            <span class="my-sub-headline primary--text" style="font-size: 1.4em">{{this.budget.user.name}}</span>
                                            <v-flex>
                                                <span class="primary--text font-weight-bold">CPF: </span>
                                                <span class="font-weight-bold">{{this.budget.user.cpf}}</span>
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex xs3 class="align-start pt-6">
                                        <v-layout column wrap class="justify-start align-start">
                                            <span class="primary--text font-weight-bold">Orçamento #</span>
                                            <span class="primary--text font-weight-bold">Data</span>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex xs3 class="align-start pt-6">
                                        <v-layout column wrap class="justify-start align-start">
                                            <span class="font-weight-bold">{{this.budget.id}}</span>
                                            <span class="font-weight-bold">{{this.budget.date.formatted | dateFilter}}</span>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex xs12 class="mt-12 primary py-1 px-4" style="height: 32px">
                                        <v-layout row wrap class="align-center">
                                            <v-flex xs2 class="text-left">
                                                <span class="white--text font-weight-bold">Quantidade</span>
                                            </v-flex>
                                            <v-flex xs6 class="text-left">
                                                <span class="white--text font-weight-bold">Descrição</span>
                                            </v-flex>
                                            <v-flex xs4 class="text-right">
                                                <span class="white--text font-weight-bold">Valor</span>
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex xs12 class="mt-2 py-1 px-4">
                                        <v-layout row wrap class="align-center" v-for="(item, index) in items"
                                                  :key="index">
                                            <v-flex xs2 class="text-center">
                                                <span class="font-weight-bold">1</span>
                                            </v-flex>
                                            <v-flex xs6 class="text-left">
                                                <span class="font-weight-bold">{{item.name}}</span>
                                            </v-flex>
                                            <v-flex xs4 class="text-right">
                                                <span class="font-weight-bold">{{item.price}}</span>
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex xs12 class="text-right mt-4 mr-4" v-if="budget.discount > 0">
                                    <span class="primary--text font-weight-bold pr-6"
                                          style="font-size: 1.2em">SubTotal </span>
                                        <span class="font-weight-bold">{{budget.subTotal.toLocaleString('en-us', {minimumFractionDigits: 2, maximumFractionDigits: 2})}}</span>
                                    </v-flex>
                                    <v-flex xs12 class="text-right mr-4" v-if="budget.discount > 0">
                                    <span class="primary--text font-weight-bold pr-6"
                                          style="font-size: 1.2em">Desconto </span>
                                        <span class="font-weight-bold">{{budget.discount.toLocaleString('en-us', {minimumFractionDigits: 2, maximumFractionDigits: 2})}}</span>
                                    </v-flex>
                                    <v-flex xs12 class="text-right mr-4 mt-2">
                                    <span class="primary--text font-weight-bold pr-6"
                                          style="font-size: 1.2em">Total </span>
                                        <span class="font-weight-bold">{{this.budget.total.toLocaleString('en-us', {minimumFractionDigits: 2, maximumFractionDigits: 2})}}</span>
                                    </v-flex>
                                    <v-flex xs6 class="text-left mt-12">
                                        <v-layout column wrap class="primary--text">
                                            <span class="font-weight-bold">Instituto Pró Saúde do Amazonas</span>
                                            <span v-if="selectedUnit.has_address"> {{selectedUnit.has_address[0].street + ' ' + selectedUnit.has_address[0].number +  ',' +  selectedUnit.has_address[0].neighboor}}</span>
                                            <span>Manaus - AM</span>
                                            <span>CNPJ: 09.066.632/0001-22</span>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex xs6 class="text-end font-italic align-self-end">
                                        <v-spacer/>
                                        <span> Este orçamento tem validade de 15 dias</span>
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        name: "BudgetToPrint",
        props: ['budget'],
        computed: {
            selectedUnit() {
                return this.$store.getters.selectedUnit
            },
            items() {
                if (!this.budget.exams) {
                    return this.budget.specialties
                } else if(!this.budget.specialties) {
                    return this.budget.exams
                }
                return this.budget.specialties.concat(this.budget.exams)
            },
        },
        methods: {
          shareWhatsApp(){
            let initApi = "https://api.whatsapp.com/send?text="
             window.open(initApi + window.location.href)
          },
          shareFacebook(){
            let initApi = "https://www.facebook.com/sharer/sharer.php?u="
            window.open(initApi + window.location.href)
          },
            print() {
                window.print()
            },
          download(){
            const download = document.getElementById("fileRequest");
            download.download = window
          },
          CreatePdf(){
          }
        }
    }
</script>
