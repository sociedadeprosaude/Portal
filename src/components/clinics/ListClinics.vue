<template>
    <v-container fluid>
        <v-layout v-if="clinics" row nowrap>
            <v-flex xs12 v-if="loading">
                <v-progress-circular class="primary--text" indeterminate/>
            </v-flex>
            <v-flex xs12 v-if="clinics.length === 0 && loading === false">
                <p>Não há resultado para a pesquisa realizada</p>
            </v-flex>
            <div v-if="clinics.length !== 0" style="width: 100%">
                <v-expansion-panels focusable accordion>
                    <v-expansion-panel v-for="(clinic, i) in clinics" :key="i" class="mt-3">
                        <v-expansion-panel-header class="text-left font-weight-bold pt-4 pb-3 pl-4 primary white--text">
                            {{clinic.name}}
                            <v-spacer/>
                            <v-flex xs1>
                                <v-tooltip top color="primary">
                                    <template v-slot:activator="{ on }">
                                        <v-btn icon dark v-on="on" @click="editClinic(clinic)">
                                            <v-icon color="white">edit</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Editar Clínica</span>
                                </v-tooltip>
                                <v-tooltip top color="primary">
                                    <template v-slot:activator="{ on }">
                                        <v-btn icon dark v-on="on" @click="deleteClinic(clinic)" class="mr-3">
                                            <v-icon color="white">delete</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Deletar Clínica</span>
                                </v-tooltip>
                            </v-flex>


                            <template v-slot:actions>


                                <v-icon color="white">$expand</v-icon>
                            </template>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <ListExamsSpecialties :clinic="clinic" style="width: 100%"/>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
                <!--
                <v-flex sm12 v-for="(clinic, i) in clinics" :key="i" class="mb-5">
                    <v-card>
                        <v-flex xs12 sm12>
                            <v-card color="primary">
                                <v-layout row wrap>
                                    <v-flex sm6>
                                        <p class="white--text text-left font-weight-bold pt-4 pb-3 pl-4">
                                            {{clinic.name}}
                                        </p>
                                    </v-flex>
                                    <v-flex sm6 class="text-right mt-2">

                                        <v-tooltip top color="primary">
                                            <template v-slot:activator="{ on }">
                                                <v-btn icon dark v-on="on" @click="deleteClinic(clinic)">
                                                    <v-icon>delete</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>Deletar Clínica</span>
                                        </v-tooltip>

                                        <v-tooltip top color="primary">
                                            <template v-slot:activator="{ on }">
                                                <v-btn icon dark v-on="on" @click="deleteExamSpecialty(clinic)">
                                                    <v-icon>delete_sweep</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>Apagar Exames e Consultas</span>
                                        </v-tooltip>
                                        <v-tooltip top color="primary">
                                            <template v-slot:activator="{ on }">
                                                <v-btn icon dark v-on="on" @click="editExamSpecialty(clinic)">
                                                    <v-icon>rule</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>Editar Exames e Consultas</span>
                                        </v-tooltip>
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-flex>
                    </v-card>
                </v-flex>
                -->
            </div>
        </v-layout>
        <v-dialog v-model="editingClinic" width="500px" text hide-overlay>
            <EditClinic :clinic="clinic" @close-dialog="closeDialogs"/>
        </v-dialog>
        <v-dialog v-if="clinic" v-model="deletingClinic" max-width="350px">
            <v-card>
                <v-card-title class="headline">Apagar Clínica ?</v-card-title>
                <v-divider/>
                <v-card-text class="headline">
                    {{ clinic.name }}
                </v-card-text>
                <v-divider/>
                <v-card-actions>
                    <v-btn rounded color="error" @click="closeDialogs">Cancelar</v-btn>
                    <v-spacer/>
                    <v-btn rounded color="success" @click="deletingClinicfromDatabase(clinic)">Confirmar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="addExamToClinic" width="500px" text hide-overlay>
            <Exams @close-dialog="closeDialogs"/>
        </v-dialog>
        <v-dialog v-model="addSpecialtyToClinic" width="500px" text hide-overlay>
            <Consultations @close-dialog="closeDialogs"/>
        </v-dialog>
        <v-dialog v-model="deletingExamsSpecialtiesFromClinic" width="850px" text hide-overlay>
            <Products @close-dialog="closeDialogs"/>
        </v-dialog>
        <v-dialog v-model="editingExamsSpecialtiesFromClinic" width="800px" text hide-overlay>
            <Configurations @close-dialog="closeDialogs"/>
        </v-dialog>

    </v-container>
</template>
<script>

    import EditClinic from "../../components/clinics/EditClinic";
    import Exams from "../../components/clinics/Exams";
    import Consultations from "../../components/clinics/Consultations";
    import Products from "../../components/clinics/Products";
    import ListExamsSpecialties from "../../components/clinics/ListExamsSpecialties";
    import Configurations from "../../components/clinics/Configurations";

    export default {
        props: ['clinics', 'loading'],
        components: {EditClinic, Exams, Consultations, Configurations, Products,ListExamsSpecialties},

        data: () => ({
            clinic: undefined,
            editingClinic: false,
            deletingClinic: false,
            addExamToClinic: false,
            addSpecialtyToClinic: false,
            deletingExamsSpecialtiesFromClinic: false,
            editingExamsSpecialtiesFromClinic: false,

            defaultItem: {
                name: '',
                cnpj: '',
                telephone: [''],
                address: {
                    street: '',
                    number: '',
                    neighborhood: '',
                    cep: '',
                    complement: '',
                    state: '',
                    city: '',
                },
                startWeek: '',
                endWeek: '',
                startSaturday: '',
                endSaturday: ''
            },
        }),
        mounted () {
            for (let i in this.clinics) {
                let clinic = i;
                let exams = [];
                let specialties = [];

                for (let i in clinic.exams) {
                    exams.push({
                        ...clinic.exams[i]
                    });
                }
                this.clinics[i].exams = exams;
                for (let i in clinic.specialties) {
                    specialties.push({
                        ...clinic.specialties[i]
                    });
                }
                this.clinics[i].specialties = specialties;

            }
        },
        computed: {

        },

        methods: {
            editClinic(clinic) {
                this.clinic = this.clinics[this.clinics.indexOf(clinic)];
                this.editingClinic = true;
            },
            deleteClinic(clinic) {
                this.clinic = clinic;
                this.deletingClinic = true;
            },
            async deletingClinicfromDatabase(clinic) {
                await this.$store.dispatch('deleteClinic', clinic);
                setTimeout(() => {
                    this.closeDialogs()
                }, 1000)
            },
            selectClinic(clinic, index) {
                if (!clinic) {
                    clinic = this.defaultItem;
                    this.$store.dispatch('putIndex', index);
                }
                this.$store.dispatch('selectClinic', clinic);
                this.listando(clinic);
            },
            async addExam(clinic) {
                await this.selectClinic(clinic);
                this.addExamToClinic = true;
            },
            async addSpecialty(clinic) {
                await this.selectClinic(clinic);
                this.addSpecialtyToClinic = true;
            },
            async deleteExamSpecialty(clinic) {
                await this.selectClinic(clinic);
                this.deletingExamsSpecialtiesFromClinic = true;
            },
            async editExamSpecialty(clinic) {
                await this.selectClinic(clinic);
                this.editingExamsSpecialtiesFromClinic = true;
            },
            closeDialogs() {
                this.clinic = undefined;
                this.editingClinic = false;
                this.deletingClinic = false;
                this.addExamToClinic = false;
                this.addSpecialtyToClinic = false;
                this.deletingExamsSpecialtiesFromClinic = false;
                this.editingExamsSpecialtiesFromClinic = false;
            },

            listando(clinic) {
                let val = this.$store.getters.clinics.filter(a => {
                    return a.name === clinic.name;
                });
                return val;
            },

            allExams() {
                let clinic = this.listando[0];
                let exams = [];

                for (let i in clinic.exams) {
                    exams.push({
                        ...clinic.exams[i]
                    });
                }
                return exams;
            },

            allSpecialties() {
                let clinic = this.listando[0];
                let specialties = [];

                for (let i in clinic.specialties) {
                    specialties.push({
                        ...clinic.specialties[i]
                    });
                }
                return specialties;
            }
        },
    }
</script>