<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12>
                <!--                <v-card class="pa-3">-->
                <!--                    <v-flex xs12 class="text-right">-->
                <!--                        <v-btn rounded color="primary" dark class="mb-2" @click="addDoctor()">-->
                <!--                            ADICIONAR MEDICO-->
                <!--                            <v-icon right>person_add</v-icon>-->
                <!--                        </v-btn>-->
                <!--                    </v-flex>-->
                <!--                    <v-text-field-->
                <!--                            v-model="search"-->
                <!--                            label="Pesquisa"-->
                <!--                            single-line-->
                <!--                            hide-details-->
                <!--                    ></v-text-field>-->
                <!--                </v-card>-->
            </v-flex>

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
                                <v-btn rounded color="primary" dark class="mb-2" @click="addDoctor()">
                                    ADICIONAR MEDICO
                                    <v-icon right>person_add</v-icon>
                                </v-btn>
                            </v-layout>
                        </v-flex>
                        <v-text-field append-icon="search"
                                      v-model="search" label="Pesquisa" class="mx-4"></v-text-field>
                    </template>
                    <template v-slot:item.action="{ item }">
                        <v-icon
                                small
                                class="mr-2"
                                @click="editItem(item)"
                        >
                            edit
                        </v-icon>
                        <v-icon
                                small
                                @click="confirmDeletion(item)"
                        >
                            delete
                        </v-icon>
                    </template>
                    <!--                    <template>-->
                    <!--                        <td>-->
                    <!--                            <span>{{ state.item.name }}</span>-->
                    <!--                        </td>-->
                    <!--                        <td>{{ state.item.crm }}</td>-->
                    <!--                        <td>{{getSpecialties(state.item)}}</td>-->
                    <!--                      <td class="justify-center layout px-0">-->
                    <!--                        <v-btn icon class="mx-0">-->
                    <!--                          <v-icon color="teal">add</v-icon>-->
                    <!--                        </v-btn>-->
                    <!--                        <v-btn icon class="mx-0">-->
                    <!--                          <v-icon color="teal">edit</v-icon>-->
                    <!--                        </v-btn>-->
                    <!--                        <v-btn icon class="mx-0">-->
                    <!--                          <v-icon color="pink">delete</v-icon>-->
                    <!--                        </v-btn>-->
                    <!--                      </td>-->


                    <!--                        <v-tooltip top>-->
                    <!--                            <template v-slot:activator="{ on }">-->
                    <!--                                <v-btn @click="editItem(state.item)" dark icon color="orange" v-on="on">-->
                    <!--                                    <v-icon>-->
                    <!--                                        edit-->
                    <!--                                    </v-icon>-->
                    <!--                                </v-btn>-->
                    <!--                            </template>-->
                    <!--                            <span>Editar</span>-->
                    <!--                        </v-tooltip>-->

                    <!--                        <v-tooltip top>-->
                    <!--                            <template v-slot:activator="{ on }">-->
                    <!--                                <v-btn-->
                    <!--                                        dark-->
                    <!--                                        icon-->
                    <!--                                        :loading="loader"-->
                    <!--                                        color="red"-->
                    <!--                                        v-on="on"-->
                    <!--                                        @click="deleteItem(state.item)"-->
                    <!--                                >-->
                    <!--                                    <v-icon>-->
                    <!--                                        delete-->
                    <!--                                    </v-icon>-->
                    <!--                                    <template v-slot:loader>-->
                    <!--                                        <span>...</span>-->
                    <!--                                    </template>-->
                    <!--                                </v-btn>-->
                    <!--                            </template>-->
                    <!--                            <span>Apagar</span>-->
                    <!--                        </v-tooltip>-->
                    <!--                    </template>-->

                    <template v-slot:no-results>
                        <v-alert :value="true" color="error" icon="warning">
                            Your search for "{{ search }}" found no results.
                        </v-alert>
                    </template>

                </v-data-table>
            </v-flex>

            <v-snackbar
                    v-model="snackbar"
                    :bottom="y === 'bottom'"
                    :left="x === 'left'"
                    color="success"
                    :multi-line="mode === 'multi-line'"
                    :right="x === 'right'"
                    :top="y === 'top'"
                    :vertical="mode === 'vertical'"
            >
                {{this.mensagem}}
                <v-spacer></v-spacer>
                <v-icon dark>done_outline</v-icon>
            </v-snackbar>
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
                    Deletar o médico?
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
            selectedDoctor: undefined,
            loading: false,
            success: false,
            search: '',
            y: 'top',
            x: null,
            mode: '',
            pagination: {
                rowsPerPage: -1,
            },
            maskCRM: '######',
            rulesform: [
                aux => !!aux || 'Preencher o Campo é Obrigatório.'
            ],
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
            loader() {
                return this.$store.getters.statusLoaderDoc
            },
            snackbar: {
                get() {
                    let snack = this.$store.getters.onSnackbarDoc;
                    if (snack) {
                        this.dialog = false
                    }
                    return snack;
                },
                set(value) {

                }
            },
            mensagem() {
                return this.$store.getters.onMensagem;
            }
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
            this.$store.dispatch('getDoctors')

            //this.$store.dispatch('setLoader',{loader:false,view:"Medicos"})
        },

        methods: {
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
