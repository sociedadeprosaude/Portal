<template>
    <v-content>
        <template>
            <v-row justify="center">
                <v-spacer/>
                <transition name="fade">
                    <v-dialog v-model="dialog" persistent hide-overlay max-width="600">
                        <template v-slot:activator="{ on }">
                            <v-btn
                                    dark
                                    color="red"
                                    v-on="on"
                            >
                                FINALIZAR ATENDIMENTO
                                <v-icon right>exit_to_app</v-icon>
                            </v-btn>
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
                </transition>
                <v-spacer/>
                <v-btn v-show="show === false" dark color="primary" @click="show = true">
                    Vizualizar Histórico de consultas do Paciente
                    <v-icon right>visibility</v-icon>
                </v-btn>
                <v-btn v-show="show === true" dark color="primary" @click="show = false">
                    Esconder Histórico de consultas do Paciente
                    <v-icon right>visibility_off</v-icon>
                </v-btn>
                <v-spacer/>
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
        },
        methods: {
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
                this.$router.push("MedicalCare");
            }
        }
    }
</script>
