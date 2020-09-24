<template>
    <v-container fluid>
        <v-layout v-if="clinics" row nowrap>
            <div style="width: 100%">
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
<!--                                <v-tooltip top color="primary">
                                    <template v-slot:activator="{ on }">
                                        <v-btn icon dark v-on="on" @click="deleteClinic(clinic)" class="mr-3">
                                            <v-icon color="white">delete</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Deletar Clínica</span>
                                </v-tooltip>-->
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
                    <v-btn rounded color="success" @click="deleteClinic">ConfirmarAPOLLO</v-btn>
'                  <ApolloMutation
                      :mutation="require('@/graphql/clinics/DeleteClinics.gql')"
                      :variables="{ id: clinic.id }"
                      @done="closeDialogs"
                  >
                    <template v-slot="{ mutate, loading, error }">
                      <v-progress-circular indeterminate color="primary" v-if="loading"></v-progress-circular>
                      <v-btn rounded color="success" @click="mutate()">Confirmar</v-btn>
                      <p v-if="error">Ocorreu um erro: {{ error }}</p>
                    </template>
                  </ApolloMutation>'
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
        props: ['clinics'],
        components: {EditClinic, Exams, Consultations, Configurations, Products,ListExamsSpecialties},
        data: () => ({
            clinic: undefined,
            editingClinic: false,
            deletingClinic: false,
            addExamToClinic: false,
            addSpecialtyToClinic: false,
            deletingExamsSpecialtiesFromClinic: false,
            editingExamsSpecialtiesFromClinic: false,
        }),
        mounted () {
/*            for (let i in this.clinics) {
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
            }*/
        },
        methods: {
            editClinic(clinic) {
                this.clinic = clinic;
                this.editingClinic = true;
            },
            deleteClinic(clinic) {
                this.clinic = clinic;
                console.log('for edit:', this.clinic)
                this.deletingClinic = true;
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