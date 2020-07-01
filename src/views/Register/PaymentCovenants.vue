<template>
    <v-container>
        <v-layout row wrap v-if="!loading">
            <v-flex xs12>
                <span class="my-headline">Convênios</span>
            </v-flex>
            <v-flex xs12 class="px-3 my-3">
                <v-card v-for="(clinic,i) in clinics" :key="i" outlined>
                    <v-layout row wrap>
                        <v-flex xs6 md3>
                            <span class="font-weight-bold">{{clinic.name}}</span>
                        </v-flex>
                        <v-spacer></v-spacer>
                        <v-flex xs3 md1>
                            <v-menu open-on-hover top offset-y>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                            v-bind="attrs"
                                            v-on="on"
                                            class="elevation-0"
                                            small
                                    >
                                        <v-icon>more_vert</v-icon>
                                    </v-btn>
                                </template>

                                <v-list>
                                    <v-list-item
                                            v-for="(item, index) in Menu"
                                            :key="index"
                                            @click="OpenReceipt(item,clinic)"
                                    >
                                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </v-flex>
                    </v-layout>
                    <v-flex xs12 sm12>
                        <v-layout row wrap class="justify-center">
                            <v-flex xs6 md3>
                                <v-card sm3 class="mx-4 elevation-0">
                                        <span class="font-weight-bold">
                                            Custo : {{CostExamsClinic(clinic)}}
                                        </span>
                                </v-card>
                            </v-flex>
                            <v-flex xs6 md3>
                                <v-card sm3 class="mx-4 elevation-0">
                                <span  class="font-weight-bold">
                                            Nº de exames : {{QuantExamsClinic(clinic)}}
                                </span>
                                </v-card>
                            </v-flex>
                            <v-flex md3>
                                <v-card sm3 class="mx-4 elevation-0">
                                <span class="font-weight-bold">
                                             Próximo Pagamento: {{date(clinic.last_payment,clinic.period)}}
                                </span>
                                </v-card>
                            </v-flex>
                           <v-flex md3>
                               <v-card sm3 class="mx-4 elevation-0">
                                   <v-btn @click="ChangeDateDialog(clinic)"><span class="font-weight-black">Alterar Periodo</span>
                                   </v-btn>
                               </v-card>
                           </v-flex>
                        </v-layout>
                    </v-flex>
                    <v-flex xs12 sm12 class="mt-3">
                        <v-layout row wrap class="justify-space-between">

                            <v-btn @click="checkReceipts(clinic)" text>+ detalhes</v-btn>

                            <v-card sm3 class="mx-4 elevation-0" outlined>
                                <v-btn @click="payClinic(clinic)">
                                    <span class="font-weight-black">Pagar</span>
                                </v-btn>
                            </v-card>
                        </v-layout>
                    </v-flex>
                    <v-card v-if="intakesObserv && clinic === clinicSelected">
                        <clinicsIntakes @close-dialog="intakesObserv = false" :clinic="clinicSelected"></clinicsIntakes>
                    </v-card>
                </v-card>
            </v-flex>
        </v-layout>
        <v-dialog v-model="change" max-width="300px">
            <v-card>
                <v-card-title>Período de Pagamento</v-card-title>
                <v-flex class="mt-5 ml-3">
                    <v-select
                        v-model="period"
                        :items="days"
                        label="período"
                    >
                    </v-select>
                </v-flex>
                <v-flex>
                    <v-btn @click="ChangeDate(clinica)">
                        Confirmar
                    </v-btn>
                </v-flex>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogReceipt">
                <ReceiptOuttakesConvenant @close="CloseReceipt()"  :clinicSelected="clinicSelected"></ReceiptOuttakesConvenant>
        </v-dialog>

    </v-container>
</template>

<script>
    import moment from "moment";
    import clinicsIntakes from "../../components/PaymentCovenants/ClinicsIntakes"
    import ReceiptOuttakesConvenant from "../../components/PaymentCovenants/ReceiptOuttakesConvenants"

    export default {
        name: "PaymentCovenants",
        components: {
            clinicsIntakes,ReceiptOuttakesConvenant
        },
        data() {
            return {
                loading: true,
                value: undefined,
                change: false,
                dialogReceipt:false,
                clinica:[],
                clinicSelected:[],
                cost:'',
                intakes:[],
                period:'',
                NumberExams:'',
                intakesObserv:false,
                Menu: [
                    { title: 'Gerar Boleto' },
                    { title: 'Anexar Recibo' },
                ],
                menu2:false,
                dateFormatted2: moment().format("DD/MM/YYYY"),
                date2: moment().format("YYYY-MM-DD 23:59:59"),
                datenow: moment().format('YYYY-MM-DD'),
                days:['10','15','30']
            }
        },
        computed: {
            units() {
                return this.$store.getters.units
            },
            clinics() {
                return this.$store.getters.clinics
            },
            outtakes(){
                return this.$store.getters.outtakeAllClinic
            }
        },
        methods: {
            OpenReceipt(item,clinic){
                this.clinicSelected = clinic
                if(item.title === 'Gerar Boleto'){
                    this.dialogReceipt= !this.dialogReceipt
                }
            },
            QuantExamsClinic(clinic){
                let outtakes = this.outtakes.filter(outtake => outtake.clinic.cnpj === clinic.cnpj)
                let cont =0;
                outtakes.filter(function (element){
                        cont += element.exams.length
                })
                return cont
            },
            CostExamsClinic(clinic){
                let outtakes = this.outtakes.filter(outtake => outtake.clinic.cnpj === clinic.cnpj)
                let cost =0;
                outtakes.filter(function (element){
                    element.exams.filter(function (element2) {
                        cost += element2.price
                    })
                })
                return cost
            },
            CloseReceipt(){
                this.dialogReceipt= !this.dialogReceipt
            },
            async getInitialInfo() {
                await this.$store.dispatch('loadClinics');
                await this.$store.dispatch('GetReceiptsAllClinic');
                this.loading = false
            },
            ChangeDateDialog(clinic) {
                this.clinica = clinic;
                this.change = !this.change;
            },
            async ChangeDate(clinic) {
                this.change = !this.change;
                await this.$store.dispatch('AddPaymentDay', {
                    clinic: clinic,
                    period: this.period
                });
                this.getInitialInfo()
            },
            formatDate(date) {
                if (!date) return null;
                const [year, month, day] = date.split("-");
                return `${day}/${month}/${year}`;
            },
            async CalculateValue(clinic) {
                this.cost = '';
                this.clinica = clinic;
                let ReturnValuesClinic= await this.$store.dispatch('CalculedValuePaymentClinic', clinic)
                this.cost = ReturnValuesClinic.cost
                this.NumberExams = ReturnValuesClinic.NumberExams
            },

            async checkReceipts(clinic){
                this.clinicSelected = clinic
                this.intakesObserv = !this.intakesObserv

            },
            async payClinic(clinic){
                await this.$store.dispatch('PayClinic', clinic)
                this.getInitialInfo()
            },
            date(day,period){
                if(!period){
                    return moment(day).add(30, 'days').format('DD/MM/YYYY')
                }
                else{
                    return moment(day).add(period, 'days').format('DD/MM/YYYY')
                }
            }

        },
        mounted() {
            this.getInitialInfo()
        },
        watch: {

        }
    }
</script>
