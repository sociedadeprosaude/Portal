<template>
    <v-layout row wrap>
        <v-spacer/>
        <v-flex xs12>
            <v-card class="pa-4" color="indigo darken-4">
                <v-layout row wrap aling-center>
                    <v-flex xs12>
                        <p class="white--text text-left title">Consultas</p>
                    </v-flex>
                    <v-flex xs12 class="mb-2">
                        <v-divider color="white"/>
                    </v-flex>
                    <v-flex xs12 class="mt-3 mx-7">
                        <v-card class="cardw">
                            <v-layout row wrap>
                                <v-flex xs4>
                                    <p class="font-weight-black">Paciente</p>
                                </v-flex>
                                <v-flex xs8>
                                    <v-spacer/>
                                </v-flex>
                                <v-flex xs12>
                                    <CardPatientManagementConsultations :patient="patient"/>
                                </v-flex>
                            </v-layout>
                        </v-card>
                    </v-flex>
                    <v-flex xs12 class="mt-4 mb-2">
                        <v-divider color="white"/>
                    </v-flex>
                    <v-flex xs12 class="mt-3 mx-7">
                        <v-card class="cardConsultation ">
                            <v-layout row wrap>
                                <v-flex xs4>
                                    <p class="font-weight-black">Consulta</p>
                                </v-flex>
                                <v-flex xs8>
                                    <v-spacer/>
                                </v-flex>
                                <v-flex xs12>
                                    <card-consultation-management-consultations :consultation="consultation"/>
                                </v-flex>
                            </v-layout>
                        </v-card>
                    </v-flex>
                    <v-card-actions class="ml-4 mt-4 " v-if="consultation.status">
                        <v-btn
                                color="white"
                                rounded
                                :disabled="consultation.status === 'Cancelado'"
                                @click="deletedConsultation()"
                                class="mx-2"
                        > Cancelar
                        </v-btn>
                        <v-btn
                                color="white"
                                rounded
                                class="mx-2"
                                :to="{ name: 'AgendarRetorno', params: { q: {...this.consultation}}}"
                                :disabled="consultation.status !== 'Pago'"
                                v-if="consultation.type !== 'Retorno'"
                        >Retorno
                        </v-btn>
                        <v-btn
                                color="white"
                                rounded
                                class="mx-2"
                                @click="setConsultationHour(consultation)"
                        >
                            Atender
                        </v-btn>
                    </v-card-actions>
                    <v-flex xs12 class="mt-4 mb-2">
                        <v-divider color="white"/>
                    </v-flex>
                </v-layout>
            </v-card>
            <transition name="fade">
                <v-container fluid v-show="Report">
                    <report @close-dialog="Report = false" :consultation="consultation"/>
                </v-container>
            </transition>
            <v-dialog v-model="documentDialog">
                <ReportPDF @close-dialog="documentDialog = false" :consultation="consultation" :item="item"/>
            </v-dialog>
        </v-flex>
    </v-layout>
</template>


<script>
    import CardConsultationManagementConsultations
        from '../../../components/doctorsAgenda/ManagementConsultations/CardConsultationManagementConsultations'
    import CardPatientManagementConsultations
        from '../../../components/doctorsAgenda/ManagementConsultations/CardPatientManagementConsultations'
    import Report from '../../../components/Attendance/Report'
    import ReportPDF from "../../../components/Attendance/printing/reportPDF";

    let moment = require('moment');

    export default {
        name: "CardInformationManagementConsultations",
        props: ['patient', 'consultation'],
        components: {CardConsultationManagementConsultations, CardPatientManagementConsultations, Report, ReportPDF},

        data: () => ({
            Report: false,
            documentDialog: false,
            item: 'NOVO'
        }),
        computed: {

        },
        mounted() {
            this.initialConfig()

        },
        watch: {
        },
        methods: {

            async initialConfig() {

            },
            deletedConsultation() {
                this.$store.dispatch('eraseAppointment', {
                    idConsultation: this.consultation.id,
                    idPatient: this.consultation.user.cpf,
                    type: this.consultation.type,
                    status: 'Cancelado',
                    payment_number: this.consultation.payment_number,
                    specialty: this.consultation.specialty.name,
                    previousConsultation: this.consultation.previousConsultation,
                    consultation: this.consultation
                });
                this.dialog = false

            },
            setConsultationHour(consultation) {
                let consultation_hour = moment().format('YYYY-MM-DD hh:mm:ss');
                let data = {
                    consultation_hour: consultation_hour,
                    consultation: consultation,
                    id: consultation.id,
                };
                this.$store.dispatch('addConsultationHourInConsultation', data);
                this.consultation.consultation_hour = consultation_hour;
                console.log(this.consultation);
                this.Report =  true;
                this.documentDialog = true;
            }

        },
    }
</script>
<style scoped>
    .cardw {
        width: 100%;
        height: 150px;
        align-self: center;
    }

    .cardConsultation {
        width: 100%;
        height: 350px;
    }

    .spacerH {
        height: 10px;
    }
</style>
