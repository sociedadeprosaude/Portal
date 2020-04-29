<template>
    <v-container>
        <v-layout row wrap v-if="!loading">
            <v-flex xs12>
                <span class="my-headline">Convênios</span>
            </v-flex>
            <v-flex xs12 class="px-3 my-3">
                <v-expansion-panels inset>
                    <v-expansion-panel
                            v-for="(clinic,i) in clinics"
                            :key="i"
                    >
                        <v-expansion-panel-header>
                            <v-flex xs3>
                                <span>
                                {{clinic.name}}
                                </span>
                            </v-flex>
                            <v-flex xs2>
                                <span>
                                    {{clinic.telephone[0]}}
                                </span>
                            </v-flex>
                            <v-flex xs2>
                                Próximo Pagamento:
                            </v-flex>
                            <v-flex xs2>
                               {{clinic.paymentDayFormat}}
                            </v-flex>
                            <v-flex xs3>
                                <v-btn @click="ChangeDateDialog(clinic)">Alterar Data</v-btn>
                            </v-flex>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>

                            <v-layout row wrap>
                                <v-flex xs12>
                                    <span class="my-headline text-left">Pagamentos Anteriores</span>
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
                    <v-expansion-panel
                            v-for="(clinic,i) in clinics"
                            :key="i"
                    >
                        <v-expansion-panel-header>
                            <v-flex xs3>
                                <span>
                                {{clinic.name}}
                                </span>
                            </v-flex>
                            <v-flex xs2>
                                <span>
                                    Dia: {{clinic.paymentDayFormat}}
                                </span>
                            </v-flex>
                            <v-flex xs4 v-if="cost !=='' && clinica === clinic">
                                <span class="font-weight-bold">Custo :{{cost}} </span>
                            </v-flex>
                            <v-flex xs4 v-else>
                                <v-btn @click="CalculateValue(clinic)">ver valor até o momento</v-btn>
                            </v-flex>
                            <v-flex xs3>
                                <v-btn @click="Pay(clinic)">Pagar</v-btn>
                            </v-flex>
                        </v-expansion-panel-header>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-flex>
        </v-layout>
        <v-dialog v-model="change" max-width="300px">
            <v-card>
                <v-card-title>
                   Alterar Data
                </v-card-title>
                <v-flex class="mt-5 ml-3">
                    <v-menu
                            v-model="menu2"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            max-width="290px"
                            min-width="290px"
                    >
                        <template v-slot:activator="{ on }">
                            <v-text-field
                                    v-model="dateFormatted2"
                                    label="Nova Data"
                                    prepend-icon="event"
                                    readonly
                                    dense
                                    v-on="on"
                            ></v-text-field>
                        </template>
                        <v-date-picker v-model="date2" no-title @input="menu2 = false"></v-date-picker>
                    </v-menu>
                </v-flex>
                <v-flex>
                <v-btn @click="ChangeDate(clinica)">
                    Confirmar
                </v-btn>
                </v-flex>
            </v-card>
        </v-dialog>

    </v-container>
</template>

<script>
    import moment from "moment";

    export default {
        name: "Home",
        components: {

        },
        data() {
            return {
                loading: true,
                value: undefined,
                change: false,
                clinica:[],
                cost:'',
                menu2:false,
                dateFormatted2: moment().format("DD/MM/YYYY"),
                date2: moment().format("YYYY-MM-DD 23:59:59"),
                datenow: moment().format('YYYY-MM-DD'),
            }
        },
        computed: {
            units() {
                return this.$store.getters.units
            },
           clinics(){
               return this.$store.getters.clinics
           }
        },
        methods: {
            async getInitialInfo() {
                await this.$store.dispatch('loadClinics')
                this.loading = false
            },
            ChangeDateDialog(clinic){
                this.clinica= clinic;
                this.change= !this.change;
            },
            async ChangeDate(clinic){
                this.change= !this.change;
                await this.$store.dispatch('AddPaymentDay',{clinic:clinic, paymentDay:this.date2, paymentDayFormat: this.dateFormatted2})
                this.getInitialInfo()
            },
            formatDate(date) {
                if (!date) return null;
                const [year, month, day] = date.split("-");
                return `${day}/${month}/${year}`;
            },
            async CalculateValue(clinic){
                this.cost=''
                this.clinica = clinic
                this.cost = await this.$store.dispatch('CalculedValuePaymentClinic', clinic)
            },
            async Pay(clinic){
                await this.$store.dispatch('PayClinic', clinic)
                this.getInitialInfo()
            }

        },
        mounted() {
            this.getInitialInfo()
        },
        watch: {
            date2(val) {
                this.dateFormatted2 = this.formatDate(this.date2);
            }
        }
    }
</script>

<style scoped>

</style>
