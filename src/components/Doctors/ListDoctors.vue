<template>
    <v-container fluid>
        <v-layout v-if="doctorsArray" row nowrap>
            <v-flex xs12 v-if="loading">
                <v-progress-circular class="primary--text" indeterminate/>
            </v-flex>
            <v-flex xs12 v-if="doctorsArray.length === 0 && loading === false">
                <p>Não há resultado para a pesquisa realizada</p>
            </v-flex>
            <div v-if="doctors.length !== 0" style="width: 100%">
                <v-flex sm12 v-for="(doctor, i) in doctorsArray" :key="i" class="mb-5">
                    <v-card>
                        <v-flex xs12 sm12>
                            <v-card color="primary">
                                <v-layout row wrap>
                                    <v-flex sm10>
                                        <p class="white--text text-left font-weight-bold pt-4 pb-3 pl-4">
                                            {{doctor.name}}
                                        </p>
                                    </v-flex>
                                    <v-flex sm2 class="text-right mt-2">
                                        <v-btn icon dark @click="editDoctor(doctor)">
                                            <v-icon>edit</v-icon>
                                        </v-btn>
                                        <v-btn icon dark @click="deleteDoctor(doctor)">
                                            <v-icon>delete</v-icon>
                                        </v-btn>
                                        <v-btn icon dark @click="deactiveDoctor(doctor)">
                                            <v-icon>work_off</v-icon>
                                        </v-btn>
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-flex>
                    </v-card>
                </v-flex>
            </div>
        </v-layout>
        <v-dialog v-model="editingDoctor" max-width="500px" v-if="editingDoctor">
            <CreateDoctorCard @clean="selectedDoctor = undefined" :doctor="selectedDoctor"
                              @close="editingDoctor = false"/>
        </v-dialog>
        <v-dialog v-if="selectedDoctor" v-model="deletingDoctor" max-width="500px">
            <v-card>
                <v-card-title>
                    Deletar o médico?
                    <v-spacer/>
                    <v-btn text @click="deletingDoctor = false"><v-icon>close</v-icon></v-btn>
                </v-card-title>
                <v-card-text>
                    <v-divider class="primary"/>
                    <v-layout row wrap class="font-weight-bold justify-center">{{selectedDoctor.name}}</v-layout>
                    <v-divider class="primary"/>
                </v-card-text>
                <v-card-actions class="mx-3">
                    <v-spacer/>
                    <submit-button text="Apagar" color="red" class="white--text" :loading="loading" :success="success"
                                   @reset="success = false" @click="deleteDoctorFromDatabase(selectedDoctor)">
                    </submit-button>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="deactivatingDoctor" v-if="selectedDoctor" max-width="500px" persistent>
            <v-card>
                <v-card-title>
                    <v-spacer/>
                    <v-btn text @click="closeDeactivingDoctor" x-small fab><v-icon>close</v-icon></v-btn>
                </v-card-title>
                <v-select :items="specialtiesDoctor" v-model="specialtyToDeactivate" outlined persistent-hint
                          class="mx-5 mb-4" multiple return-object chips
                          hint="Selecione as especialidades para desativar"/>
                <v-select :items="clinics" v-model="clinicsToDeactivate" outlined persistent-hint item-value="name"
                          item-text="name"
                          class="mx-5 mb-4" multiple return-object chips hint="Selecione a unidade"/>
                <v-card-text>
                    <span>Desativar </span>
                    <span class="font-weight-bold justify-center">{{selectedDoctor.name}}</span>
                    <span> ?</span>
                </v-card-text>
                <v-card-actions class="mx-3">
                    <v-spacer/>
                    <submit-button text="Confirmar" :loading="loading" :success="success" @reset="success = false"
                                   @click="deactivingDoctorFromDatabase(selectedDoctor)">
                    </submit-button>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<script>
    import CreateDoctorCard from "../../components/Doctors/CreateDoctorCard";
    import SubmitButton from "../SubmitButton"

    export default {
        props: ['doctors', 'loading', 'doctorsArray'],
        components: {CreateDoctorCard, SubmitButton},

        data: () => ({
            success: false,
            selectedDoctor: undefined,
            clinics: [],
            specialtiesDoctor: [],
            specialtyToDeactivate: [],
            clinicsToDeactivate: [],
            editingDoctor: false,
            deletingDoctor: false,
            deactivatingDoctor: false,
        }),

        methods: {
            async editDoctor(doctor) {
                this.selectedDoctor = this.doctors[doctor.cpf];
                this.editingDoctor = true;
            },
            async deleteDoctor(doctor){
                this.selectedDoctor = doctor;
                this.deletingDoctor = true;
            },
            async deleteDoctorFromDatabase(item) {
                let doctor = this.doctors[item.cpf];
                this.loading = true;
                await this.$store.dispatch('deleteConsultations', doctor);
                await this.$store.dispatch('deleteDoctor', doctor);
                this.success = true;
                this.loading = false;
                setTimeout(() => {
                    this.deletingDoctor = false
                }, 800)
            },
            deactiveDoctor(doctor){
                this.selectedDoctor = doctor;
                this.clinics = doctor.clinics;
                this.specialtiesDoctor = doctor.specialties.split(', ');
                this.deactivatingDoctor = true;
            },
            closeDeactivingDoctor () {
                this.deactivatingDoctor = false;
                this.specialtyToDeactivate = [];
                this.clinicsToDeactivate = [];
            },
            async deactivingDoctorFromDatabase (doctor) {
                this.loading = true;
                for (let i in this.clinicsToDeactivate) {
                    await this.$store.dispatch('deactivateScheduleDoctor', {
                        doctor: doctor,
                        specialties: this.specialtyToDeactivate,
                        clinic: this.clinicsToDeactivate[i],
                    });
                }
                this.success = true;
                this.loading = false;
                setTimeout(() => {
                    this.closeDeactivingDoctor()
                }, 800)
            }
        }
    }
</script>