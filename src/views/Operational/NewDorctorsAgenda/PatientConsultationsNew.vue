<template>
        <v-layout row wrap>
            <v-flex xs8>
                <v-card class="pa-4">
                    <v-layout aling-center row wrap>
                        <patient/>
                    </v-layout>
                    <v-layout aling-center row wrap>
                        <v-flex xs12>
                            <CardPatientManagementConsultations @consultationSelect="consultatioSelect= $event"
                                                                :patient="patient" :NumberConsultations="QtdConsultations"
                                                                :NumberReturns="QtdReturn"
                            />
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
            <v-flex xs4>
                <CardInformationManagementConsultations :patient="patient" :consultation="consultatioSelect"></CardInformationManagementConsultations>
            </v-flex>
        </v-layout>
</template>

<script>
    import moment from 'moment/moment'
    import Patient from '../../../components/Patient/SelectPatientCard'
    import CardPatientManagementConsultations from '../../../components/doctorsAgenda/PatientConsultations/CardPatientManagementConsultations'
    import CardInformationManagementConsultations from '../../../components/doctorsAgenda/ManagementConsultations/CardInformationManagementConsultations'
    export default {
        components:{CardPatientManagementConsultations, CardInformationManagementConsultations, Patient},
        data: vm  => ({
            QtdConsultations:'',
            QtdReturn:'',
            consultatioSelect:{}
        }),
        computed: {
            specialties() {
                return this.$store.getters.specialties;
            },
            computedDateFormatted () {
                return this.formatDate(this.date)
            },
            patient() {
                var val = this.$store.getters.selectedPatient
                if (val != null) {
                    var consultas = []
                    this.QtdConsultations = 0
                    this.QtdReturn = 0
                    for (const key in val.consultations) {

                        if (val.consultations[key].type === 'Consulta') {
                            this.QtdConsultations += 1
                        } else {
                            this.QtdReturn += 1
                        }
                        consultas.push(val.consultations[key])

                    }
                    val.consultations = consultas
                    val.consultations.sort(function(a, b) {

                        if (a.date < b.date) {
                            return 1;
                        }
                        if (a.date > b.date) {
                            return -1;
                        }
                        return 0;
                    });
                }
                return val
            },
        },
        mounted() {
        },
        watch: {
            date (val) {
                this.dateFormatted = this.formatDate(this.date)
            },
        },
        methods: {
        },
    }
</script>
<style scoped>
.tamanho{
    height: 150%;
}
</style>
