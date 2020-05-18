<template>
        <v-layout row wrap>
            <v-flex xs8>
                <v-card class="pa-4">
                    <v-layout aling-center row wrap>
                        <v-flex xs12 sm4>
                            <v-combobox
                                    v-model="especialtie"
                                    :items="specialties"
                                    item-text="name"
                                    return-object
                                    label="Especialidade"
                                    outlined
                                    color="write"
                            >
                            </v-combobox>
                        </v-flex>
                        <v-flex sm2>
                            <v-spacer></v-spacer>
                        </v-flex>
                        <v-flex xs4>
                            <v-menu
                                    ref="menu1"
                                    v-model="menu1"
                                    :close-on-content-click="false"
                                    transition="scale-transition"
                                    offset-y
                                    max-width="290px"
                                    min-width="290px"
                            >
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                            outlined
                                            v-model="dateFormatted"
                                            label="Data Inicial"
                                            @blur="date = parseDate(dateFormatted)"
                                            v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker v-model="date" no-title @input="menu1 = false"></v-date-picker>
                            </v-menu>
                        </v-flex>
                    </v-layout>
                    <v-layout aling-center row wrap>
                        <v-flex xs12>
                            <CardDoctorsManagementConsultations @consultationSelect="consultatioSelect= $event" @patientSelect="patientSelected = $event" :especialtie="especialtie" :date="date"></CardDoctorsManagementConsultations>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
            <v-flex xs4>
                <v-card class="pa-4" color="indigo darken-4">
                    <v-layout row wrap aling-center>
                        <v-flex xs12>
                            <p class="white--text text-left title">Consultas</p>
                        </v-flex>
                        <v-flex xs12>
                            <v-divider color="white"></v-divider>
                        </v-flex>
                        <v-flex xs12 class="spacerH">
                            <v-spacer></v-spacer>
                        </v-flex>
                        <v-flex xs1>
                            <v-spacer></v-spacer>
                        </v-flex>
                        <v-flex xs10>
                            <v-card class="cardw">
                                <v-layout row wrap>
                                    <v-flex xs4>
                                        <p class="font-weight-black">Paciente</p>
                                    </v-flex>
                                    <v-flex xs8>
                                        <v-spacer></v-spacer>
                                    </v-flex>
                                    <v-flex xs12>
                                        <CardPatientManagementConsultations :patient="patientSelected"></CardPatientManagementConsultations>
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-flex>
                        <v-flex xs1>
                            <v-spacer></v-spacer>
                        </v-flex>
                        <v-flex xs12 class="spacerH">
                            <v-spacer></v-spacer>
                        </v-flex>
                        <v-flex xs12>
                            <v-divider color="white"></v-divider>
                        </v-flex>
                        <v-flex xs12 class="spacerH">
                            <v-spacer></v-spacer>
                        </v-flex>
                        <v-flex xs1>
                            <v-spacer></v-spacer>
                        </v-flex>
                        <v-flex xs10>
                            <v-card class="cardConsultation">
                                <v-layout row wrap>
                                    <v-flex xs4>
                                        <p class="font-weight-black">Consulta</p>
                                    </v-flex>
                                    <v-flex xs8>
                                        <v-spacer></v-spacer>
                                    </v-flex>
                                    <v-flex xs12>
                                        <card-consultation-management-consultations :consultation="consultatioSelect"></card-consultation-management-consultations>
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-flex>
                        <v-flex xs1>
                            <v-spacer></v-spacer>
                        </v-flex>
                        <v-flex xs12 class="spacerH">
                            <v-spacer></v-spacer>
                        </v-flex>
                        <v-card-actions>
                            <v-btn
                                    color="error"
                                    rounded
                                    :disabled="consultatioSelect.status === 'Cancelado'"
                                    @click="deleted()"
                            >
                                Cancelar
                                <v-icon>delete</v-icon>
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-btn
                                    color="blue"
                                    rounded
                                    dark
                                    :to="{ name: 'AgendarRetorno', params: { q: {...this.consultatioSelect}}}"
                                    :disabled="consultatioSelect.status !== 'Pago'"
                                    v-if="consultatioSelect.type !== 'Retorno'"
                            >Retorno
                                <v-icon>refresh</v-icon>
                            </v-btn>
                        </v-card-actions>
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
</template>

<script>
    import moment from 'moment/moment'
    import CardDoctorsManagementConsultations from '../../../components/doctorsAgenda/ManagementConsultations/CardDoctorsManagementConsultations'
    import CardPatientManagementConsultations from '../../../components/doctorsAgenda/ManagementConsultations/CardPatientManagementConsultations'
    import CardConsultationManagementConsultations from '../../../components/doctorsAgenda/ManagementConsultations/CardConsultationManagementConsultations'
    export default {
        components:{CardDoctorsManagementConsultations, CardPatientManagementConsultations, CardConsultationManagementConsultations},
        data: vm  => ({
            date: new Date().toISOString().substr(0, 10),
            dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
            menu1: false,
            especialtie: '',
            patientSelected:{},
            consultatioSelect:{}
        }),
        computed: {
            specialties() {
                return this.$store.getters.specialties;
            },
            computedDateFormatted () {
                return this.formatDate(this.date)
            },
        },
        mounted() {
            this.initialConfig()
            this.date = moment().format('YYYY-MM-DD')
            this.dateFormatted = moment().format('DD/MM/YYYY')
        },
        watch: {
            date (val) {
                this.dateFormatted = this.formatDate(this.date)
            },
        },
        methods: {
            async initialConfig() {
                await this.$store.dispatch("getSpecialties")
                this.especialidade = this.specialties[0]
            },
            formatDate (date) {
                if (!date) return null

                const [year, month, day] = date.split('-')
                return `${day}/${month}/${year}`
            },
            parseDate (date) {
                if (!date) return null

                const [month, day, year] = date.split('/')
                return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
            },
            returnOutRule(item){
                var dateConsultation = moment(item.consultation.date)
                var today = moment()
                var diff = today.diff(dateConsultation,'days')
                return diff > 21
            },
            deleted() {
                this.$store.dispatch('eraseAppointment', {
                    idConsultation: this.consultatioSelect.routine_id,
                    idPatient: this.consultatioSelect.user.cpf,
                    type: this.consultatioSelect.type,
                    status: this.consultatioSelect.status,
                    payment_number: this.consultatioSelect.payment_number,
                    specialty: this.consultatioSelect.specialty.name,
                    regress: this.consultatioSelect.consultation.regress,
                    previousConsultation: this.consultatioSelect.consultation.previousConsultation,
                    consultation:this.consultatioSelect.consultation
                })
                this.clear()
                this.dialog = false

            },
            verConsole(item){
                console.log('item: ', item)
            }

        },
    }
</script>
<style scoped>
    .cardw{
        width: 100%;
        height: 150px;
        align-self: center;
    }
    .cardConsultation{
        width: 100%;
        height: 300px;
        align-self: center;
    }
    .spacerH{
        height: 10px;
    }
</style>
