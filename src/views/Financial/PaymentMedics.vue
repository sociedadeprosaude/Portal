<template>
    <v-container>
        <v-layout row wrap v-if="!loading">
            <v-flex xs12>
                <span class="my-headline">Médicos</span>
            </v-flex>
            <v-flex xs12>
                <v-card>
                    <v-layout row wrap>
                        <v-flex xs12 class="px-3 my-3">
                          <ApolloQuery
                              :query="require('@/graphql/doctors/LoadDoctorsPayment.gql')"
                          >
                            <template slot-scope="{ result: { data } }">
                            <v-card v-for="(doctor,i) in data ? data.Doctor : []" :key="i" outlined class="mb-4 primary">

                                <v-layout row wrap>
                                    <v-flex s10 md3 class="text-left">
                                        <span class="font-weight-bold white--text ml-2">{{doctor.name.toUpperCase()}}</span>
                                    </v-flex>
                                    <v-spacer></v-spacer>
                                    <v-flex xs2 md1>
                                        <v-menu open-on-hover top offset-y>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        class="elevation-0 transparent"
                                                        small
                                                        dark
                                                >
                                                    <v-icon>more_vert</v-icon>
                                                </v-btn>
                                            </template>
                                            <v-list>
                                                <v-list-item
                                                        v-for="(item, index) in Menu"
                                                        :key="index"
                                                        @click="OpenReceipt(item,doctor)"
                                                >
                                                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                                                </v-list-item>
                                            </v-list>
                                        </v-menu>
                                    </v-flex>
                                </v-layout>
                                <v-flex xs12 sm12>
                                    <v-layout row wrap class="justify-center">
                                        <v-flex xs5 md2>
                                            <v-card sm3 class="mx-4 elevation-0 transparent">
                                                <span class="font-weight-bold white--text">
                                                    Custo : {{CostExamsDoctor(doctor)}}
                                                </span>
                                            </v-card>
                                        </v-flex>
                                        <v-flex xs7 md2>
                                            <v-card sm3 class="mx-4 elevation-0 transparent">
                                                <span  class="font-weight-bold white--text">
                                                            Nº de exames : {{QuantExamsDoctor(doctor)}}
                                                </span>
                                            </v-card>
                                        </v-flex>
                                        <v-flex xs12 class="mb-4 hidden-md-and-up">
                                            <v-spacer></v-spacer>
                                        </v-flex>
                                        <v-flex md3>
                                            <v-card sm3 class="mx-4 elevation-0 transparent">
                                            <span class="font-weight-bold white--text">
                                                         Próximo Pagamento: {{date(doctor.last_payment,doctor.period)}}
                                            </span>
                                            </v-card>
                                        </v-flex>
                                        <v-flex xs12 class="mb-2 hidden-md-and-up">
                                            <v-spacer></v-spacer>
                                        </v-flex>
                                        <v-flex md3>
                                            <v-card sm3 class="mx-4 elevation-0 transparent">
                                                <v-btn @click="ChangeDateDialog(doctor)"  outlined dark class=" elevation-0">
                                                    <span class="font-weight-bold white--text">
                                                        Alterar Periodo
                                                    </span>
                                                </v-btn>
                                            </v-card>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs12 class="mb-4 hidden-md-and-up">
                                    <v-spacer></v-spacer>
                                </v-flex>
                                <v-flex xs12 sm12 class="mt-3">
                                    <v-layout row wrap class="justify-space-between">
                                        <v-flex xs6 class="text-left">
                                            <v-btn @click="checkReceipts(doctor)" text dark>+ detalhes</v-btn>
                                        </v-flex>
                                        <v-flex xs6 class="text-right">
                                            <v-card class="mx-4 elevation-0 transparent">
                                                <v-btn @click="payDoctor(doctor)" outlined dark class="elevation-0">
                                                    <span class="font-weight-bold white--text">
                                                        Pagar
                                                    </span>
                                                </v-btn>
                                            </v-card>
                                        </v-flex>
                                        <v-flex xs12 class="mb-2">
                                            <v-spacer></v-spacer>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-card v-if="intakesObserv && doctor === doctorSelected">
                                    <DoctorOuttakes @close-dialog="intakesObserv = false" :doctor="doctorSelected" :outtakes="outtakesSelected"></DoctorOuttakes>
                                </v-card>
                            </v-card>
                            </template>
                          </ApolloQuery>
                        </v-flex>
                        <v-flex xs12>
                            <v-card class="mx-4 elevation-0 transparent">
                                <v-btn @click="payAllDoctor()"  outlined class="elevation-0">
                                 <span class="font-weight-bold">
                                     Pagar Todos
                                 </span>
                                </v-btn>
                            </v-card>
                        </v-flex>
                    </v-layout>
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
                    <v-btn @click="ChangeDate()">
                        Confirmar
                    </v-btn>
                </v-flex>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogReceipt">
            <ReceiptOuttakesDoctor @close="CloseReceipt()"  :doctorSelected="doctorSelected" :outtakes="outtakesSelected"></ReceiptOuttakesDoctor>
        </v-dialog>
    </v-container>
</template>

<script>
    import moment from "moment/moment";
    import DoctorOuttakes from "../../components/DoctorOuttakes"
    import ReceiptOuttakesDoctor from "../../components/OuttakesDoctor/ReceiptOuttakesDoctor"



    export default {
        name: "PaymentMedics",
        components: {
            DoctorOuttakes,ReceiptOuttakesDoctor
        },
        data() {
            return {
                loading: true,
                value: undefined,
                change: false,
                dialogReceipt:false,
                doctorSelected:[],
                cost:'',
                ChargeSkip:false,
                outtakesSelected:[],
                intakes:[],
                period:'',
                NumberExams:'',
                intakesObserv:false,
                charges:[],
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
            outtakes(){
                return this.$store.getters.outtakeAllDoctors
            }
        },
        methods: {
            OpenReceipt(item,doctor){
                this.outtakesSelected= this.outtakes.filter(outtake => outtake.doctor.crm === doctor.crm)
                this.doctorSelected = doctor
                if(item.title === 'Gerar Boleto'){
                    this.dialogReceipt= !this.dialogReceipt
                }
            },
            QuantExamsDoctor(doctor){
                let outtakes = this.outtakes.filter(outtake => outtake.doctor.crm === doctor.crm)
                let cont =0;
                outtakes.filter(function (element){
                    cont += 1
                })
                return cont
            },
            /* CostExamsDoctor(doctor){
                let outtakes = this.outtakes.filter(outtake => outtake.doctor.crm === doctor.crm)
                let cost =0;
                outtakes.filter(function (element){
                    cost += element.consultations.price
                })
                return cost
            }, */
            CloseReceipt(){
                this.dialogReceipt= !this.dialogReceipt
            },
            async getInitialInfo() {
                this.loading = false
            },
            ChangeDateDialog(doctor) {
                this.doctorSelected = doctor;
                this.change = !this.change;
            },
            async ChangeDate() {
                console.log('doctor: ', this.doctorSelected)
                this.change = !this.change;
                await this.$store.dispatch('AddPaymentDayDoctor', {
                    doctor: this.doctorSelected,
                    period: this.period
                });
                this.getInitialInfo()
            },
            formatDate(date) {
                if (!date) return null;
                const [year, month, day] = date.split("-");
                return `${day}/${month}/${year}`;
            },
            async CalculateValue(doctor) {
                this.cost = '';
                this.doctorSelected = doctor;
               let ReturnValuesClinic= await this.$store.dispatch('CalculedValuePaymentDoctor', doctor)
               this.cost = ReturnValuesClinic.cost
                this.NumberExams = ReturnValuesClinic.NumberExams
            },

            async checkReceipts(doctor){
                this.outtakesSelected= this.outtakes.filter(outtake => outtake.doctor.crm === doctor.crm)
                this.doctorSelected = doctor
                this.intakesObserv = !this.intakesObserv

            },
            async payDoctor(doctor){
                await this.$store.dispatch('PayDoctor', doctor)
                this.getInitialInfo()
            },
            async payAllDoctor(){
                await this.$store.dispatch('PayAllDoctor', this.doctors)
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
        }
    }
</script>