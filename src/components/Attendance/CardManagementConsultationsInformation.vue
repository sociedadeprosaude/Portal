<template>
    <v-layout row wrap>
        <v-spacer/>
        <v-flex xs12>
            <v-card class="pa-3" color="indigo darken-4">
                <v-layout row wrap aling-center>
                    <v-flex xs12>
                        <p class="white--text text-left title">Consultas</p>
                    </v-flex>
                    <v-flex xs12 class="mb-0">
                        <v-divider color="white"/>
                    </v-flex>
                    <v-flex xs12 class="mt-3 mx-7 mb-0">
                        <v-layout row wrap>
                            <v-flex xs12 class="mb-0">
                                <DoctorTicketRoom/>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                    <v-flex xs12 class="mt-n3 mb-2">
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
                        <v-card class="cardConsultation">
                            <v-layout row wrap>
                                <v-flex xs4>
                                    <p class="font-weight-black">Consulta</p>
                                </v-flex>
                                <v-flex xs8>
                                    <v-spacer/>
                                </v-flex>
                                <v-flex xs12>
                                    <CardConsultationManagementConsultations :consultation="consultation"/>
                                </v-flex>
                            </v-layout>
                        </v-card>
                    </v-flex>
                    <v-layout row wrap class="align-center justify-center">
                    <v-card-actions class="mt-4 " v-if="consultation.status">
                        <v-btn
                                color="white"
                                rounded
                                @click="dialog = true"
                        >Iniciar Atendimento do Paciente</v-btn>
                    </v-card-actions>
                    </v-layout>
                    <v-flex xs12 class="mt-4 mb-2">
                        <v-divider color="white"/>
                    </v-flex>
                </v-layout>
            </v-card>
        </v-flex>
        <v-dialog v-model="dialog" persistent max-width="600" hide-overlay>
            <v-card>
                <v-card-title class="primary white--text">Deseja Iniciar o Atendimento do Paciente Selecionado ?</v-card-title>
                <v-divider/>
                <v-card-actions>
                    <v-btn outlined color="error" @click="dialog = false">NÃO</v-btn>
                    <v-spacer/>
                    <v-btn outlined color="success" :to="{ name: 'Attendance', params: { q: consultation}}">SIM</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
    import CardPatientManagementConsultations
        from "../doctorsAgenda/ManagementConsultations/CardPatientManagementConsultations";
    import CardConsultationManagementConsultations
        from "../doctorsAgenda/ManagementConsultations/CardConsultationManagementConsultations";
    import DoctorTicketRoom from "./DoctorTicketRoom";
    let moment = require('moment');
    export default {
        name: "CardManagementConsultationsInformation",
        components: {
            DoctorTicketRoom, CardConsultationManagementConsultations, CardPatientManagementConsultations},
        props: ['patient', 'consultation'],
        data: () => ({
            item: 'NOVO',
            dialog:false,
            cancelLoading:false
        }),
        computed: {
            selectedPatient() {
                return this.$store.getters.selectedPatient
            },
        },
    }
</script>
<style scoped>
    .cardw {
        width: 100%;
        height: 125px;
        align-self: center;
    }

    .cardConsultation {
        width: 100%;
        height: 310px;
    }

    .spacerH {
        height: 10px;
    }
</style>