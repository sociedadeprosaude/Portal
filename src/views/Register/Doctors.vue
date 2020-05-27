<template>
    <v-container>
        <v-layout row wrap>

            <v-flex xs12 class="my-4"
                    v-if="!loadingDoctors"
            >

                <v-data-table
                        :headers="headers"
                        :items="doctorsArray"
                        :search="search"
                        item-key="cpf"
                        class="elevation-1"
                        :items-per-page="-1"
                >
                    <template v-slot:top>
                        <v-flex xs12 class="text-right pa-2">
                            <v-layout row wrap>
                                <v-text-field prepend-icon="search" v-model="search" label="Pesquisa" class="mx-2"/>
                                <v-spacer/>
                                <v-btn rounded color="primary" dark class="mx-2 mt-3" text
                                       @click="addSpecialtyDialog()">
                                    ADICIONAR ESPECIALIDADE
                                    <v-icon right>school</v-icon>
                                </v-btn>
                                <v-spacer></v-spacer>
                                <v-btn rounded color="primary" dark class="mb-2 mx-2" @click="modifySpecialtyDialog()">
                                    <v-icon>edit</v-icon>
                                    <v-icon>school</v-icon>
                                </v-btn>
                                <v-btn rounded color="primary" dark class="mb-2 mx-2" @click="addSpecialtyDialog()">
                                    <v-icon>add</v-icon>
                                    <v-icon>school</v-icon>
                                </v-btn>
                                <v-btn rounded color="primary" dark class="mb-2" @click="addDoctor()">
                                    ADICIONAR MEDICO
                                    <v-icon right>person_add</v-icon>
                                </v-btn>
                            </v-layout>
                        </v-flex>
                    </template>

                    <template v-slot:item.action="{ item }">
                        <v-layout row wrap>
                            <v-btn fab text class="warning mx-1 my-1" x-small>
                                <v-icon color="white" @click="editItem(item)">edit</v-icon>
                            </v-btn>
                            <v-btn fab text class="error mx-1 my-1" x-small>
                                <v-icon color="white" @click="confirmDeletion(item)">delete</v-icon>
                            </v-btn>
                            <v-btn icon class="grey my-1 mx-1" dark x-small text fab>
                                <v-icon @click="deactivateDoctor(item)">power_settings_new</v-icon>
                            </v-btn>
                        </v-layout>
                    </template>

                    <template v-slot:no-results>
                        <v-alert :value="true" color="error" icon="warning">
                            Your search for "{{ search }}" found no results.
                        </v-alert>
                    </template>

                </v-data-table>
            </v-flex>
            <v-flex xs12 class="text-center" v-else>
                <v-progress-circular indeterminate class="primary--text"/>
            </v-flex>
        </v-layout>

        <v-dialog v-model="createDoctorDialog" v-if="createDoctorDialog" max-width="500px">
            <create-doctor-card @clean="selectedDoctor = undefined" @close="createDoctorDialog = false"/>
        </v-dialog>
        <v-dialog v-model="editDoctorDialog" v-if="editDoctorDialog" max-width="500px">
            <create-doctor-card @clean="selectedDoctor = undefined" :doctor="selectedDoctor"
                                @close="editDoctorDialog = false"/>
        </v-dialog>
        <v-dialog v-if="selectedDoctor" v-model="confirmDeletionDialog" max-width="500px">
            <v-card>
                <v-card-title>
                    Deletar o médico?
                    <v-spacer/>
                    <v-btn text @click="confirmDeletionDialog = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <v-divider class="primary"/>
                    <v-layout row wrap class="font-weight-bold justify-center">{{selectedDoctor.name}}</v-layout>
                    <v-divider class="primary"/>
                </v-card-text>
                <v-card-actions class="mx-3">
                    <v-spacer/>
                    <submit-button text="Apagar" color="red" class="white--text" :loading="loading" :success="success"
                                   @reset="success = false"
                                   @click="deleteItem(selectedDoctor)">
                    </submit-button>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-if="selectedDoctor" v-model="confirmDeactivate" max-width="500px" persistent>
            <v-card>
                <v-card-title>
                    <v-spacer/>
                    <v-btn text @click="confirmDeactivate = false, cleanSpecialtyToDeactivate()" x-small fab>
                        <v-icon>close</v-icon>
                    </v-btn>
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
                                   @click="confirmDesactivateDoctor(selectedDoctor)">
                    </submit-button>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="createSpecialtyDialog" max-width="500px">
            <v-card>
                <v-card-title>
                    Adicionar Especialidade Médica
                    <v-spacer/>
                    <v-btn text @click="createSpecialtyDialog = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-divider/>
                <v-card-text>
                    <v-layout row wrap class="align-center justify-center">
                        <strong>CADASTRADAS:</strong>
                        <v-flex xs12 class="my-4 mx-2">
                            <v-chip
                                    v-for="specialty in specialties"
                                    :key="specialty.name"
                                    class="v-chip--select-multi"
                                    text-color="white"
                                    color="info"
                            >{{ specialty.name }}
                            </v-chip>
                        </v-flex>
                        <v-divider/>
                        <v-flex xs12>
                            <v-text-field repend-icon="school" v-model="specialty" label="Especialidade" outlined
                                          rounded filled/>
                        </v-flex>

                        <v-flex xs12>
                            <v-select
                                    label="É Necessário Agendar Exame(s) ?"
                                    v-model="exam"
                                    :items="typeOptions"
                                    outlined
                                    rounded
                                    filled
                                    chips
                                    color="pink"
                                    clearable
                                    hide-details
                            >
                                <template v-slot:selection="data">
                                    <v-chip
                                            :key="JSON.stringify(data.item)"
                                            :input-value="data.selected"
                                            :disabled="data.disabled"
                                            class="v-chip--select-multi"
                                            @click.stop="data.parent.selectedIndex = data.index"
                                            @input="data.parent.selectItem(data.item)"
                                            text-color="white"
                                            color="info"
                                    >
                                        {{ data.item.text }}
                                    </v-chip>
                                </template>
                            </v-select>
                        </v-flex>

                    </v-layout>
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <submit-button text="Adicionar" :loading="loading" :success="success" @reset="success = false"
                                   @click="addSpecialty">
                    </submit-button>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="editSpecialtyDialog" max-width="500px">
            <v-card>
                <v-card-title>
                    Editar Especialidade Médica
                    <v-spacer></v-spacer>
                    <v-btn text @click="editSpecialtyDialog = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-layout row wrap class="align-center justify-center">
                        <strong>CADASTRADAS:</strong>
                        <v-flex xs12 class="my-4 mx-2">
                            <v-select
                                    label="Selecione a Especialidade para Editar"
                                    v-model="specialty"
                                    :items="specialties"
                                    outlined
                                    rounded
                                    filled
                                    return-object
                                    item-text="name"
                                    chips
                                    color="pink"
                                    clearable
                                    hide-details
                            >
                                <template v-slot:selection="data">
                                    <v-chip
                                            :key="JSON.stringify(data.item)"
                                            :input-value="data.selected"
                                            :disabled="data.disabled"
                                            class="v-chip--select-multi"
                                            @click.stop="data.parent.selectedIndex = data.index"
                                            @input="data.parent.selectItem(data.item)"
                                            text-color="white"
                                            color="info"
                                    >
                                        {{ data.item.name }}
                                    </v-chip>
                                </template>
                            </v-select>
                        </v-flex>
                        <v-divider></v-divider>

                        <v-flex xs12 class="my-4 mx-2">
                            <v-select
                                    label="Especialidade Selecionda para Edição"
                                    v-model="specialty"
                                    :items="specialties"
                                    outlined
                                    rounded
                                    filled
                                    return-object
                                    item-text="name"
                                    chips
                                    readonly
                                    color="pink"
                                    hide-details
                            >
                                <template v-slot:selection="data">
                                    <v-chip
                                            :key="JSON.stringify(data.item)"
                                            :input-value="data.selected"
                                            :disabled="data.disabled"
                                            class="v-chip--select-multi"
                                            @click.stop="data.parent.selectedIndex = data.index"
                                            @input="data.parent.selectItem(data.item)"
                                            text-color="white"
                                            color="info"
                                    >
                                        {{ data.item.name }}
                                    </v-chip>
                                </template>
                            </v-select>
                        </v-flex>

                        <v-flex xs12>
                            <v-select
                                    label="É Necessário Agendar Exame(s) ?"
                                    v-model="exam"
                                    :items="typeOptions"
                                    outlined
                                    rounded
                                    filled
                                    chips
                                    color="pink"
                                    clearable
                                    hide-details
                            >
                                <template v-slot:selection="data">
                                    <v-chip
                                            :key="JSON.stringify(data.item)"
                                            :input-value="data.selected"
                                            :disabled="data.disabled"
                                            class="v-chip--select-multi"
                                            @click.stop="data.parent.selectedIndex = data.index"
                                            @input="data.parent.selectItem(data.item)"
                                            text-color="white"
                                            color="info"
                                    >
                                        {{ data.item.text }}
                                    </v-chip>
                                </template>
                            </v-select>
                        </v-flex>

                    </v-layout>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <submit-button text="Editar" :loading="loading" :success="success" @reset="success = false"
                                   @click="editSpecialty">
                    </submit-button>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>

</template>

<script>
    import CreateDoctorCard from "../../components/doctorsAgenda/CreateDoctorCard";
    import SubmitButton from "../../components/SubmitButton";

    export default {
        components: {
            SubmitButton,
            CreateDoctorCard
        },
        data: () => ({
            createDoctorDialog: false,
            clinics: [],
            clinicsToDeactivate: [],
            editDoctorDialog: false,
            specialtyToDeactivate: [],
            confirmDeletionDialog: false,
            createSpecialtyDialog: false,
            confirmDeactivate: false,
            editSpecialtyDialog: false,
            selectedDoctor: undefined,
            specialty: undefined,
            specialtiesDoctor: [],
            loading: false,
            success: false,
            search: '',
            dialog: false,
            exam: undefined,
            typeOptions:[
                { text:'sim', value: true },
                { text:'não', value: false }
                ],
            headers: [
                {
                    text: 'Nome',
                    align: 'left',
                    value: 'name',
                    filterable: true
                },
                {text: 'CPF', value: 'cpf', sortable: false, align: 'center'},
                {text: 'CRM', value: 'crm', sortable: false, align: 'center'},
                {text: 'Especialidades', value: 'specialties', sortable: false, align: 'center'},
                {text: 'Ações', value: 'action', sortable: false, align: 'center'}
            ],
        }),

        computed: {
            loadingDoctors() {
                return !this.$store.getters.doctorsLoaded
            },
            specialties() {
                return this.$store.getters.specialties
            },
            doctors() {
                return this.$store.getters.doctors
            },
            doctorsArray() {
                let array = [];
                for (let doc in this.doctors) {
                    let holder = {
                        ...this.doctors[doc],
                        specialties: this.getSpecialties(this.doctors[doc]),
                    };
                    array.push(holder)
                }
                return array
            },
        },
        mounted() {
            this.$store.dispatch('getClinics');
            this.$store.dispatch('getDoctors');
            this.$store.dispatch('getSpecialties');
        },

        methods: {
            addSpecialtyDialog() {
                this.createSpecialtyDialog = true
            },
            cleanSpecialtyToDeactivate() {
                this.specialtyToDeactivate = [];
                this.clinicsToDeactivate = [];
            },
            async addSpecialty() {
                this.loading = true;
                await this.$store.dispatch('addSpecialty', {
                    name: this.specialty.toUpperCase(),
                    status: "DEACTIVATE",
                    exam: this.exam
                });
                await this.$store.dispatch('getSpecialties');
                this.success = true;
                this.loading = false;
                setTimeout(() => {
                    this.specialty = undefined;
                    this.exam = undefined;
                }, 1000)
            },
            modifySpecialtyDialog() {
                this.editSpecialtyDialog = true
            },
            async editSpecialty() {
                this.loading = true;
                await this.$store.dispatch('editSpecialty', {
                    name: this.specialty.name.toUpperCase(),
                    exam: this.exam
                });
                this.success = true;
                this.loading = false;
                setTimeout(() => {
                    this.specialty = undefined;
                    this.exam = undefined;
                }, 1000)
            },
            addDoctor() {
                this.selectedDoctor = undefined;
                this.createDoctorDialog = true
            },
            getSpecialties(item) {
                if (!item.specialties) return '';
                let especialidades = '';
                for (const key in item.specialties) {
                    especialidades += item.specialties[key].name + ', '
                }
                especialidades = especialidades.slice(0, especialidades.length - 2);
                return especialidades
            },

            editItem(item) {
                let doctor = this.doctors[item.cpf];
                this.selectedDoctor = doctor;
                this.editDoctorDialog = true
            },

            confirmDeletion(item) {
                this.selectedDoctor = item;
                this.confirmDeletionDialog = true
            },
            deactivateDoctor(item) {
                this.selectedDoctor = item;
                this.clinics = item.clinics;
                this.specialtiesDoctor = item.specialties.split(', ');
                this.confirmDeactivate = true;
            },
            async confirmDesactivateDoctor(item) {
                this.loading = true;
                for (let i in this.clinicsToDeactivate) {
                    let data = {
                        doctor: item,
                        specialties: this.specialtyToDeactivate,
                        clinic: this.clinicsToDeactivate[i],
                    };
                    await this.$store.dispatch('deactivateScheduleDoctor', data);
                }
                this.success = true;
                this.loading = false;
                this.cleanSpecialtyToDeactivate();
                setTimeout(() => {
                    this.confirmDeactivate = false
                }, 800)
            },
            async deleteItem(item) {
                let doctor = this.doctors[item.cpf];
                this.loading = true;
                await this.$store.dispatch('deleteConsultations', doctor);
                await this.$store.dispatch('deleteDoctor', doctor);
                this.success = true;
                this.loading = false;
                setTimeout(() => {
                    this.confirmDeletionDialog = false
                }, 800)
            },
        }
    }
</script>

<style scoped>
</style>
