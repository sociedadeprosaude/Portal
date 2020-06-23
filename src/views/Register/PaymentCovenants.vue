<template>
    <v-container>
        <v-layout row wrap v-if="!loading && !intakesObserv">
            <v-flex xs12>
                <span class="my-headline">Convênios</span>
            </v-flex>
            <v-flex xs12 class="px-3 my-3">
                <v-expansion-panels inset>
                    <v-expansion-panel v-for="(clinic,i) in clinics" :key="i">
                        <v-expansion-panel-header>
                            <v-layout row wrap>
                                <v-flex xs6 md3>
                                    <span>{{clinic.name}}</span>
                                </v-flex>
                                <v-flex xs6 md2>
                                    <span>{{clinic.telephone[0]}}</span>
                                </v-flex>
                                <v-flex xs12 class="hidden-md-and-up">
                                    <p class="py-2"></p>
                                </v-flex>
                                <v-flex xs7 md3>
                                    Próximo Pagamento: {{date(clinic.last_payment,clinic.period)}}
                                </v-flex>
                                <v-flex>
                                    <v-spacer></v-spacer>
                                </v-flex>
                                <v-flex>
                                    Período de Pagamento: {{clinic.period}}
                                </v-flex>

                            </v-layout>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-layout row wrap>
                                <v-flex xs12 md2>
                                    <v-btn @click="ChangeDateDialog(clinic)">Alterar Periodo</v-btn>
                                </v-flex>
                            </v-layout>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-flex>
            <v-flex xs12>
                <span class="my-headline">Pagar</span>
            </v-flex>
            <v-flex xs12 class="px-3 my-3">
                <v-expansion-panels inset>
                    <v-expansion-panel v-for="(clinic,i) in clinics" :key="i">
                        <v-expansion-panel-header>
                            <v-layout row wrap>
                                <v-flex xs6 md3>
                                    <span>{{clinic.name}}</span>
                                </v-flex>
                                <v-flex xs6 md2>
                                    <span>Dia: {{clinic.paymentDayFormat}}</span>
                                </v-flex>
                                <v-flex xs12 class="hidden-md-and-up">
                                    <v-divider class="py-2"></v-divider>
                                </v-flex>
                                <v-flex  md3 v-if="cost !=='' && clinica === clinic">
                                    <span class="font-weight-bold">Custo :{{cost}} </span>
                                </v-flex>
                                <v-flex xs12 md3 v-else>
                                    <v-btn @click="CalculateValue(clinic)">Valor até o momento</v-btn>
                                </v-flex>
                                <v-flex xs12 class="hidden-md-and-up">
                                    <p class="py-2"></p>
                                </v-flex>
                                <v-flex  md2>
                                    <v-btn @click="checkReceipts(clinic)">Recibos</v-btn>
                                </v-flex>
                                <v-flex  md2>
                                    <v-btn @click="Pay(clinic)">Pagar</v-btn>
                                </v-flex>
                            </v-layout>
                        </v-expansion-panel-header>
                    </v-expansion-panel>
                </v-expansion-panels>
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

        <v-card v-if="intakesObserv">
            <clinicsIntakes @close-dialog="intakesObserv = false" :clinic="clinicSelected"></clinicsIntakes>
        </v-card>
    </v-container>
</template>

<script>
    import moment from "moment";
    import clinicsIntakes from "../../components/PaymentCovenants/ClinicsIntakes"

    export default {
        name: "Home",
        components: {
            clinicsIntakes
        },
        data() {
            return {
                loading: true,
                value: undefined,
                change: false,
                clinica:[],
                clinicSelected:[],
                cost:'',
                intakes:[],
                period:'',
                intakesObserv:false,
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
            }
        },
        methods: {
            async getInitialInfo() {
                await this.$store.dispatch('loadClinics');
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
                    paymentDay: this.date2,
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
                this.cost = await this.$store.dispatch('CalculedValuePaymentClinic', clinic)
            },

            async checkReceipts(clinic){
                this.clinicSelected = clinic
                this.intakesObserv=true

            },
            async Pay(clinic){
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
