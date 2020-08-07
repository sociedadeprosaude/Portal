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
                    <v-card-actions class="mt-4 " v-if="consultation.status">
                        <v-btn
                                color="white"
                                rounded
                                :disabled="consultation.status === 'Cancelado'"
                                @click="deletedConsultation()"
                                :loading="cancelLoading"
                        > Cancelar
                        </v-btn>
                        <v-btn
                                color="white"
                                rounded
                                :to="{ name: 'AgendamentoConsultas', params: { q: consultation, type:'retorno'}}"
                                :disabled="consultation.status !== 'Pago' || consultation.regress"
                                v-if="consultation.type !== 'Retorno' && consultation.specialty"
                        >Retorno
                        </v-btn>
                        <v-btn
                                color="white"
                                rounded
                                :disabled="consultation.status !== 'Pago' || consultation.consultation_hour"
                                @click="setConsultationHour(consultation)"
                        >
                            Atender
                        </v-btn>
                        <v-btn
                                color="white"
                                rounded
                                @click="ConsultationRecept(consultation)"
                        >
                            Comprovante
                        </v-btn>
                    </v-card-actions>
                    <v-flex xs12 class="mt-4 mb-2">
                        <v-divider color="white"/>
                    </v-flex>
                </v-layout>
            </v-card>
        </v-flex>
        <v-dialog v-model="documentDialog">
            <consultation-document @close="documentDialog=false" :consultation="consultation" />
        </v-dialog>
        <v-dialog v-model="receptDialog">
            <consultation-receipt @close="receptDialog=false" :consultation="consultation" />
        </v-dialog>
    </v-layout>
</template>


<script>
    import CardConsultationManagementConsultations
        from '../../../components/doctorsAgenda/ManagementConsultations/CardConsultationManagementConsultations'
    import CardPatientManagementConsultations
        from '../../../components/doctorsAgenda/ManagementConsultations/CardPatientManagementConsultations'
    import ConsultationDocument from "../commons/ConsultationDocument"
    import ConsultationReceipt from "../commons/ConsultationReceipt"
    let moment = require('moment');

    export default {
        name: "CardInformationManagementConsultations",
        props: ['patient', 'consultation'],
        components: {CardConsultationManagementConsultations, CardPatientManagementConsultations, ConsultationDocument,ConsultationReceipt},

        data: () => ({
            item: 'NOVO',
            documentDialog:false,
            receptDialog:false,
            cancelLoading:false
        }),
        computed: {
            selectedPatient() {
                return this.$store.getters.selectedPatient
            },
        },
        methods: {

            async deletedConsultation() {
                this.cancelLoading = true;
                let patientId = this.consultation.user ? this.consultation.user.uid ? this.consultation.user.uid : this.consultation.user.cpf : this.selectedPatient.uid
                let obj = {
                    id: this.consultation.id,
                    idPatient: patientId,
                    type: this.consultation.type,
                    status: 'Cancelado',
                    payment_number: this.consultation.payment_number,
                    specialty: this.consultation.specialty,
                    previousConsultation: this.consultation.previousConsultation,
                    consultation: this.consultation,
                    exam:this.consultation.exam
                };

                await this.$store.dispatch('eraseAppointment', obj);
                this.cancelLoading = false

            },
            async setConsultationHour(consultation) {
                let consultation_hour = moment().format('YYYY-MM-DD HH:mm:ss');
                if(!consultation.user)
                    consultation.user = this.selectedPatient
                let data = {
                    consultation_hour: consultation_hour,
                    consultation: consultation,
                    id: consultation.id,
                };
                let specialty = await this.$store.dispatch('getDoctorSpecialty', consultation)
                let outtake = {
                    intake_id: consultation.payment_number,
                    user: consultation.user,
                    unit: consultation.clinic,
                    doctor: consultation.doctor,
                    specialties: specialty,
                    paid: false,
                    realized:moment().format('YYYY-MM-DD'),
                    crm: consultation.doctor.crm
                }
                console.log('outtake: ', outtake)
                await this.$store.dispatch('addSpecialtyOuttakes', outtake)
                await this.$store.dispatch('addConsultationHourInConsultation', data);
                this.consultation.consultation_hour = consultation_hour;
                this.documentDialog = true;
            },
            ConsultationRecept(consultation) {
                this.receptDialog = true;
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
