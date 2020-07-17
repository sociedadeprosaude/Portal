<template>
    <v-content>
        <template>
            <v-row justify="center">
                <transition name="fade">
                    <v-dialog v-model="dialog" persistent hide-overlay max-width="350">
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
                                <v-btn outlined color="success" @click="saveAttendance()">SIM</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </transition>
            </v-row>
        </template>

        <v-container>
            <v-row justify="space-around">
                <transition name="fade">
                    <MedicalRecords :consultation="consultation"/>
                </transition>
            </v-row>
        </v-container>

    </v-content>
</template>

<script>
    let moment = require('moment');
    import MedicalRecords from "../../components/Attendance/MedicalRecords";
    export default {
        components: {MedicalRecords},
        data: () => ({
            dialog: false,
            query: undefined,
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
            console.log('p:', this.query)
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
                this.$router.push("MedicalCare")
            }
        }
    }
</script>
