<template>
    <v-content>

        <template>
            <v-row justify="center">
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
                        <v-card-title>Deseja Finalizar o Atendimento ?</v-card-title>
                        <v-divider></v-divider>
                        <v-card-text>
                            <strong>
                                    nome do paciente aqui
                            </strong>
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-btn
                                    color="error"
                                    @click="dialog = false"
                            >
                                NÃO
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-btn
                                    color="success"
                                    :to="{ name: 'MedicalCare'}"
                            >
                                SIM
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
        </template>

        <v-container>

            <v-row justify="space-around">

<!--                <v-dialog v-model="MedicalRecords" width="1000">
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" x-large outlined color="primary" class="elevation-3">
                            PRONTUARIOS
                            <v-icon x-large color="primary">assignment_ind</v-icon>
                        </v-btn>
                    </template>
                    <medical-records @close-dialog="MedicalRecords = false"></medical-records>
                </v-dialog>-->

                <v-btn x-large outlined color="primary" class="elevation-3" @click="MedicalRecords = true">
                    PRONTUARIOS
                    <v-icon x-large color="primary">assignment_ind</v-icon>
                </v-btn>

                <v-dialog v-model="Solicitations" width="1000">
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" x-large outlined color="primary" class="elevation-3">
                            Solicitação de EXAMES
                            <v-icon x-large color="primary">assignment</v-icon>
                        </v-btn>
                    </template>
                    <solicitations :consultation="consultation"></solicitations>
                </v-dialog>

                <v-dialog v-model="Prescriptions" width="1000">
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" x-large outlined color="primary" class="elevation-3">
                            PRESCRIÇÕES
                            <v-icon x-large color="primary">note_add</v-icon>
                        </v-btn>
                    </template>
                    <prescription></prescription>
                </v-dialog>

                <v-dialog v-model="Report" width="1000">
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" x-large outlined color="primary" class="elevation-3">
                            LAUDOS
                            <v-icon x-large color="primary">description</v-icon>
                        </v-btn>
                    </template>
                    <report></report>
                </v-dialog>

                <v-dialog v-model="Orientations" width="1000">
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" x-large outlined color="primary" class="elevation-3">
                            ORIENTAÇÕES
                            <v-icon x-large color="primary">receipt</v-icon>
                        </v-btn>
                    </template>
                    <orientations></orientations>
                </v-dialog>

                <v-dialog v-model="Attestations" width="1000">
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" x-large outlined color="primary" class="elevation-3">
                            ATESTADOS
                            <v-icon x-large color="primary">assignment_late</v-icon>
                        </v-btn>
                    </template>
                    <attestations :consultation="consultation"></attestations>
                </v-dialog>

            </v-row>

            <v-container fluid v-show="MedicalRecords">
                <medical-records @close-dialog="MedicalRecords = false"></medical-records>
            </v-container>

        </v-container>
    </v-content>
</template>

<script>
    import MedicalRecords from "../components/Attendance/MedicalRecords";
    import Prescription from "../components/Attendance/Prescription";
    import Orientations from "../components/Attendance/Orientations";
    import Attestations from "../components/Attendance/Attestations";
    import Solicitations from "../components/Attendance/Solicitations";
    import Report from "../components/Attendance/Report";
    export default {
        components: {Solicitations, Attestations, Orientations, Prescription, MedicalRecords, Report},
        data: () => ({
            dialog: false,
            //o de cima é de finalizar
            query: undefined,
            //os de baixo são componentes de docs
            Attestations: false,
            Orientations: false,
            Report: false,
            Solicitations: false,
            Prescriptions: false,
            MedicalRecords: false,
        }),
        computed:{
            consultation(){
                return this.query ? this.query.consultation : undefined
            }
        },
        mounted() {
            this.query = this.$route.params.q
            console.log("parametro passado pela rota:",{...this.query})
            if(!this.query){
                this.$router.push('MedicalCare')
            }
        },
        watch:{
            //
        },
        methods: {
            //
        }
    }
</script>

<style scoped>
</style>