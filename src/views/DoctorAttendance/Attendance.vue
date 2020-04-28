<template>
    <v-content>
        <template>
            <v-row justify="center">
                <transition name="fade">
                    <div v-show="open">
                        <v-dialog v-model="dialog" persistent max-width="350">
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
                                <v-divider/>
                                <v-card-actions>
                                    <v-btn color="error" @click="dialog = false">NÃO</v-btn>
                                    <v-spacer/>
                                    <v-btn color="success" @click="saveAttendance()">SIM</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </div>
                </transition>
            </v-row>
        </template>
        <v-container>
            <v-row justify="space-around">
                <transition name="fade">
                    <div v-show="open">
                        <v-btn x-large outlined color="primary" class="elevation-3" @click="MedicalRecords = true">
                            PRONTUARIOS
                            <v-icon x-large color="primary">assignment_ind</v-icon>
                        </v-btn>
                        <v-btn x-large outlined color="primary" class="elevation-3" @click="Solicitations = true">
                            Solicitação de EXAMES
                            <v-icon x-large color="primary">assignment</v-icon>
                        </v-btn>
                        <v-btn x-large outlined color="primary" class="elevation-3" @click="Prescriptions = true">
                            PRESCRIÇÕES
                            <v-icon x-large color="primary">note_add</v-icon>
                        </v-btn>
                        <v-btn x-large outlined color="primary" class="elevation-3" @click="Report = true">
                            LAUDOS
                            <v-icon x-large color="primary">description</v-icon>
                        </v-btn>
                        <v-btn x-large outlined color="primary" class="elevation-3" @click="Orientations = true">
                            ORIENTAÇÕES
                            <v-icon x-large color="primary">receipt</v-icon>
                        </v-btn>
                        <v-btn x-large outlined color="primary" class="elevation-3" @click="Attestations = true">
                            ATESTADOS
                            <v-icon x-large color="primary">assignment_late</v-icon>
                        </v-btn>
                    </div>
                </transition>

            </v-row>
            <transition name="fade">
                <v-container fluid v-show="MedicalRecords">
                    <medical-records @close-dialog="MedicalRecords = false"
                                     :consultation="consultation"/>
                </v-container>
            </transition>

            <transition name="fade">
                <v-container fluid v-show="Solicitations">
                    <solicitations @close-dialog="Solicitations = false" :consultation="consultation"/>
                </v-container>
            </transition>

            <transition name="fade">
                <v-container fluid v-show="Prescriptions">
                    <prescription @close-dialog="Prescriptions = false" :consultation="consultation"/>
                </v-container>
            </transition>

            <transition name="fade">
                <v-container fluid v-show="Report">
                    <report @close-dialog="Report = false" :consultation="consultation"/>
                </v-container>
            </transition>

            <transition name="fade">
                <v-container fluid v-show="Orientations">
                    <orientations @close-dialog="Orientations = false" :consultation="consultation"/>
                </v-container>
            </transition>

            <transition name="fade">
                <v-container fluid v-show="Attestations">
                    <attestations @close-dialog="Attestations = false" :consultation="consultation"/>
                </v-container>
            </transition>

        </v-container>
    </v-content>
</template>

<script>
    let moment = require('moment');
    import MedicalRecords from "../../components/Attendance/MedicalRecords";
    import Prescription from "../../components/Attendance/Prescription";
    import Orientations from "../../components/Attendance/Orientations";
    import Attestations from "../../components/Attendance/Attestations";
    import Solicitations from "../../components/Attendance/Solicitations";
    import Report from "../../components/Attendance/Report";

    export default {
        components: {Solicitations, Attestations, Orientations, Prescription, MedicalRecords, Report},
        data: () => ({
            dialog: false,
            query: undefined,
            startConsultation: undefined,
            endConsultation: undefined,
            timeConsultation: undefined,
            Attestations: false,
            Orientations: false,
            Report: false,
            Solicitations: false,
            Prescriptions: false,
            MedicalRecords: false,
        }),
        computed: {
            consultation() {
                return this.query ? this.query.consultation : undefined
            },
            open() {
                return !(this.Attestations === true || this.Orientations === true || this.Report === true || this.Solicitations === true || this.Prescriptions === true || this.MedicalRecords === true);
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
                this.$router.push("MedicalCare")
            }
        }
    }
</script>
