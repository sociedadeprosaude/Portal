<template>
    <v-content>
        <template>
            <v-row justify="center">
                <v-spacer v-if='this.$vuetify.breakpoint.name !== "xs"' />
                <v-dialog v-model="dialog" persistent hide-overlay max-width="600">
                    <template v-slot:activator="{ on }">
                        <v-layout row wrap class="align-center justify-center">
                            <v-btn dark color="red" v-on="on">
                                FINALIZAR ATENDIMENTO
                                <v-icon right>exit_to_app</v-icon>
                            </v-btn>
                        </v-layout>
                    </template>
                    <v-card>
                        <v-card-title class="primary white--text">Deseja Finalizar o Atendimento do Paciente Selecionado ?</v-card-title>
                        <v-divider/>
                        <v-card-actions>
                            <v-btn outlined color="error" @click="dialog = false">NÃO</v-btn>
                            <v-spacer/>
                            <v-btn outlined color="success" @click="saveAttendance">SIM</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-spacer v-if="this.$vuetify.breakpoint.name !== 'xs'" />
                <v-flex v-if="this.$vuetify.breakpoint.name === 'xs'" xs12 class="transparent"><p style="color: transparent">.</p></v-flex>
                <v-spacer v-if="this.$vuetify.breakpoint.name !== 'xs'" />
                <v-layout row wrap class="align-center justify-center">
                    <v-btn v-show="show === false" dark color="primary" @click="show = true">
                        <v-icon left>assignment</v-icon>
                        Prontuários do Paciente
                        <v-icon right>visibility</v-icon>
                    </v-btn>
                    <v-btn v-show="show === true" dark color="primary" @click="show = false">
                        <v-icon left>assignment</v-icon>
                        Prontuários do Paciente
                        <v-icon right>visibility_off</v-icon>
                    </v-btn>
                </v-layout>
                <v-spacer v-if='this.$vuetify.breakpoint.name !== "xs"' />
            </v-row>
        </template>

        <v-container>
            <v-row justify="space-around">
                <medical-record-history v-show="show" :id="consultation.user.id"/>
                <transition name="fade">
                    <MedicalRecords :consultation="consultation" :id="consultation.user.id"/>
                </transition>
            </v-row>
        </v-container>

    </v-content>
</template>

<script>
    import MedicalRecordHistory from "../../components/Attendance/MedicalRecordHistory";
    let moment = require('moment');
    import MedicalRecords from "../../components/Attendance/MedicalRecords";
    export default {
        components: {MedicalRecordHistory, MedicalRecords},
        data: () => ({
            dialog: false,
            query: undefined,
            show: false,
            startConsultation: undefined,
            endConsultation: undefined,
            timeConsultation: undefined,
            MedicalRecords: false,
        }),
        computed: {
            consultation() {
                return this.query ? this.query : undefined
            },
        },
        mounted() {
            this.startConsultation = moment().format('HH:mm:ss');
            this.query = this.$route.params.q;
            if (!this.query) {
                this.$router.push('MedicalCare')
            }
            window.addEventListener('beforeunload', this.viewOut())
            //window.addEventListener('load', this.viewOut())
            //window.addEventListener('unload', this.viewOut())
        },
        beforeDestroy() {
            window.removeEventListener('beforeunload', this.viewOut())
        },
        methods: {
            viewOut() {
                console.log('saiu ???')
                this.outtkake()
            },
           async outtkake() {
                if (!this.consultation.end_at){
                    //colocar função aqui dps de pronta
                } else {
                    console.log('já tem outtakke para essa consultation')
                }
               let specialty = await this.$store.dispatch('getDoctorSpecialty', this.consultation)
               let outtake = {
                   intake_id: this.consultation.payment_number,
                   user: this.consultation.user,
                   unit: this.consultation.clinic,
                   doctor: this.consultation.doctor,
                   specialties: specialty,
                   paid: false,
                   crm: this.consultation.doctor.crm
               }
               console.log('outtake: ', outtake)
               //await this.$store.dispatch('addSpecialtyOuttakes', outtake)
               //this.saveAttendance();
            },
            saveAttendance() {
                this.endConsultation = moment().format('HH:mm:ss');
                this.timeConsultation = moment(this.endConsultation, 'HH:mm:ss').diff(moment(this.startConsultation, 'HH:mm:ss'), 'minutes');
                this.$store.dispatch('addTimesToConsultation', {
                    start: this.startConsultation,
                    end: this.endConsultation,
                    durantion: this.timeConsultation,
                    consultation: this.consultation.id,
                    patient: this.consultation.user.id
                });
                this.dialog = false;
                this.outtkake();
                this.$router.push("MedicalCare");
            }
        }
    }
</script>
