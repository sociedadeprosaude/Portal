<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-flex style="width: 100%">
                <v-expansion-panels focusable accordion>
                    <v-expansion-panel v-for="(clinic, i) in clinics.filter((c)=> name ? c.name.includes(name.toUpperCase()) : true)" :key="i" class="mt-3">
                      <v-card >
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
                            </v-flex>
                            <template v-slot:actions>
                                <v-icon color="white">$expand</v-icon>
                            </template>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <ListExamsSpecialties :clinic="clinic" style="width: 100%"/>
                        </v-expansion-panel-content>
                      </v-card>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-flex>
        </v-layout>

        <v-dialog v-model="editingClinic" width="500px" text hide-overlay>
            <EditClinic :clinic="clinic" @close-dialog="closeDialogs" @closeEdit="closeEdit"/>
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
                      <v-progress-circular indeterminate color="primary" v-if="loading"/>
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
        props: ['clinics', 'name'],
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
          closeEdit(){
              this.editingClinic = false;
          },
            closeDialogs() {
                this.clinic = undefined;
                this.editingClinic = false;
                this.deletingClinic = false;
                this.addExamToClinic = false;
                this.addSpecialtyToClinic = false;
                this.deletingExamsSpecialtiesFromClinic = false;
                this.editingExamsSpecialtiesFromClinic = false;
                this.$emit('reload')
            },
        },
    }
</script>