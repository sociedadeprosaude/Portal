<template>
    <v-container>
        <v-layout row wrap>

            <v-flex xs12 class="my-4">

                <v-data-table
                        :headers="headers"
                        :items="doctorsArray"
                        :search="search"
                        item-key="name"
                        class="elevation-1"
                >
                    <template v-slot:top>
                        <v-flex xs12 class="text-right pa-2">
                            <v-layout row wrap>
                                <v-btn rounded color="primary" dark class="mb-2" @click="$router.back()">
                                    <v-icon>close</v-icon>
                                </v-btn>
                                <v-spacer></v-spacer>
                                <v-btn rounded color="primary" dark class="mb-2 mx-2" @click="addSpecialtyDialog()">
                                    <v-icon>class</v-icon>
                                </v-btn>
                                <v-btn rounded color="primary" dark class="mb-2" @click="addDoctor()">
                                    ADICIONAR MEDICO
                                    <v-icon right>person_add</v-icon>
                                </v-btn>
                            </v-layout>
                        </v-flex>
                        <v-text-field append-icon="search" v-model="search" label="Pesquisa" class="mx-4"></v-text-field>
                    </template>

                    <template v-slot:item.action="{ item }">
                        <v-btn fab text class="warning mr-2" small>
                            <v-icon color="white" @click="editItem(item)">edit</v-icon>
                        </v-btn>

                        <v-btn fab text class="error mx-0" small>
                            <v-icon color="white" @click="confirmDeletion(item)">delete</v-icon>
                        </v-btn>
                    </template>

                    <template v-slot:no-results>
                        <v-alert :value="true" color="error" icon="warning">
                            Your search for "{{ search }}" found no results.
                        </v-alert>
                    </template>

                </v-data-table>
            </v-flex>
        </v-layout>

        <v-dialog v-model="createDoctorDialog" max-width="500px">
            <create-doctor-card @close="createDoctorDialog = false"></create-doctor-card>
        </v-dialog>
        <v-dialog v-model="editDoctorDialog" max-width="500px">
            <create-doctor-card :doctor="selectedDoctor" @close="editDoctorDialog = false"></create-doctor-card>
        </v-dialog>
        <v-dialog v-if="selectedDoctor" v-model="confirmDeletionDialog" max-width="500px">
            <v-card>
                <v-card-title>
                    Deletar o médico ?
                    <v-spacer></v-spacer>
                    <v-btn text @click="confirmDeletionDialog = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-layout row wrap class="align-center justify-center">
                        {{selectedDoctor.name}}
                    </v-layout>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <submit-button text="Apagar" :loading="loading" :success="success" @reset="success = false"
                                   @click="deleteItem(selectedDoctor)">
                    </submit-button>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="createSpecialtyDialog" max-width="500px">
            <v-card>
                <v-card-title>
                    Adicionar Especialidade Médica
                    <v-spacer></v-spacer>
                    <v-btn text @click="createSpecialtyDialog = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-layout row wrap class="align-center justify-center">
                        <strong>CADASTRADAS:</strong>
                        <v-flex>
                            <v-select
                                    :items="options"
                                    item-text="name"
                                    item-value="name"
                                    return-object
                                    multiple
                                    v-model="options"
                                    chips
                                    outlined
                                    rounded
                                    readonly
                            >
                                <template v-slot:selection="data">
                                    <v-chip
                                            :key="JSON.stringify(data.item)"
                                            :selected="data.selected"
                                            :disabled="data.disabled"
                                            class="v-chip--select-multi"
                                            @click.stop="data.parent.selectedIndex = data.index"
                                            @input="data.parent.selectItem(data.item)"
                                            text-color="white"
                                            color="info"
                                    >{{ data.item.name }}</v-chip>
                                </template>
                            </v-select>
                        </v-flex>
                        <v-divider></v-divider>
                        <v-flex xs12>
                            <v-text-field repend-icon="school" v-model="specialty" label="Especialidade" outlined rounded filled></v-text-field>
                        </v-flex>
                    </v-layout>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <submit-button text="Adicionar" :loading="loading" :success="success" @reset="success = false"
                                   @click="addSpecialty">
                    </submit-button>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>

</template>

<script>
    import CreateDoctorCard from "../components/CreateDoctorCard";
    import SubmitButton from "../components/SubmitButton";
    export default {
        components: {
            SubmitButton,
            CreateDoctorCard
        },
        data: () => ({
            createDoctorDialog: false,
            editDoctorDialog: false,
            confirmDeletionDialog: false,
            createSpecialtyDialog: false,
            selectedDoctor: undefined,
            specialty: undefined,
            loading: false,
            success: false,
            search: '',
            dialog: false,
            headers: [
                {
                    text: 'Nome',
                    align: 'left',
                    value: 'name',
                    filterable: true
                },
                {text: 'CRM', value: 'crm', sortable: false, align: 'right'},
                {text: 'Especialidades', value: 'specialties', sortable: false, align: 'center'},
                {text: 'Ações', value: 'action', sortable: false, align: 'center'}
            ],
        }),

        computed: {
            options() {
                let specialties = this.$store.getters.specialties
                return specialties
            },
            doctors() {
                return this.$store.getters.doctors
            },
            doctorsArray() {
                let array = []
                for (let doc in this.doctors) {
                    let holder = {
                        ...this.doctors[doc],
                        specialties: this.getSpecialties(this.doctors[doc]),
                        // acoes: 'edit'
                    }
                    array.push(holder)
                }
                return array
            },
        },

        watch: {
            dialog(val) {
                val || this.close()
            }
        },

        created() {
            this.initialize()
        },

        mounted() {
            this.$store.dispatch('getClinics')
            this.$store.dispatch('getDoctors')
            this.$store.dispatch('getSpecialties')
        },

        methods: {
            addSpecialtyDialog() {
                this.createSpecialtyDialog = true
            },
            async addSpecialty() {
                this.loading = true
                this.$store.dispatch('addSpecialty', {
                    name: this.specialty.toUpperCase()
                })
                this.success = true
                this.loading = false
                setTimeout(() => {
                    this.specialty = undefined
                    this.createSpecialtyDialog = false
                }, 1000)
            },
            addDoctor() {
                this.selectedDoctor = undefined
                this.createDoctorDialog = true
            },
            getSpecialties(item) {
                if (!item.specialties) return ''
                let especialidades = ''
                for (const key in item.specialties) {
                    especialidades += item.specialties[key].name + ', '
                }
                //Remo os ultimos dois caracteres do objeto, no caso um espaço e vírgula.
                especialidades = especialidades.slice(0, especialidades.length - 2)
                return especialidades
            },
            initialize() {
                this.desserts = []
            },

            editItem(item) {
                let doctor = this.doctors[item.cpf]
                this.selectedDoctor = doctor
                this.editDoctorDialog = true
                // this.editedIndex = this.desserts.indexOf(item)
                // this.editedItem = Object.assign({}, item)
                // this.dialog = true
            },

            confirmDeletion(item) {
                this.selectedDoctor = item
                this.confirmDeletionDialog = true
            },
            async deleteItem(item) {
                let doctor = this.doctors[item.cpf]
                this.loading = true
                await this.$store.dispatch('deleteUser', doctor)
                await this.$store.dispatch('getDoctors')
                this.success = true
                this.loading = false
                setTimeout(() => {
                    this.confirmDeletionDialog = false
                }, 800)

            },

            close() {
                this.dialog = false;
                setTimeout(() => {
                    this.editedItem = Object.assign({}, this.defaultItem);
                    this.editedIndex = -1
                }, 300)
            },

            save() {
                if (this.editedIndex > -1) {
                    Object.assign(this.desserts[this.editedIndex], this.editedItem)
                } else {
                    this.desserts.push(this.editedItem)
                }

                this.createMedico();
                this.close()
            }
        }
    }
</script>

<style scoped>
</style>
