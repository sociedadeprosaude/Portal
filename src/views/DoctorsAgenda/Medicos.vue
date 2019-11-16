<template>
    <div>
        <v-toolbar flat color="white">
            <template>
                <v-container>
                    <v-flex>
                        <v-text-field
                                v-model="search"
                                append-icon="search"
                                label="Pesquisa"
                                single-line
                                hide-details
                        ></v-text-field>
                    </v-flex>
                </v-container>
            </template>
            <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on }">
                    <v-btn round color="primary" dark class="mb-2" v-on="on">
                        ADICIONAR
                        <v-icon right>person_add</v-icon>
                    </v-btn>
                </template>
                <v-card>
                    <v-card-title class="headline grey lighten-2" primary-title>
                        <span>{{ formTitle }}</span>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12>
                                    <v-text-field
                                            clearable
                                            :rules="rulesform"
                                            prepend-icon="person"
                                            v-model="editedItem.nome"
                                            label="Nome do Médico(a)"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6>
                                    <v-text-field
                                            clearable
                                            :mask="maskCRM"
                                            :rules="rulesform"
                                            prepend-icon="credit_card"
                                            v-model="editedItem.crm"
                                            label="Número do CRM"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex>
                                    <v-select
                                            :rules="rulesform"
                                            prepend-icon="school"
                                            :items="options"
                                            label="Especialidade(s)"
                                            multiple
                                            outline
                                            v-model="editedItem.especialidades"
                                            clearable
                                            chips
                                    ></v-select>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-btn color="error" round @click="close">
                            Cancelar
                            <v-icon right>clear</v-icon>
                        </v-btn>
                        <v-dialog
                                v-model="loader"
                                hide-overlay
                                persistent
                                width="300"
                        >
                            <v-card color="primary" dark>
                                <v-card-text>
                                    Aguarde...
                                    <v-progress-linear
                                            indeterminate
                                            color="white"
                                            class="mb-0"
                                    ></v-progress-linear>
                                </v-card-text>
                            </v-card>
                        </v-dialog>
                        <v-spacer></v-spacer>
                        <v-btn
                                :disabled="!formIsValid, loader"
                                :loading="loader"
                                color="success"
                                round
                                @click="save"
                        >
                            Salvar
                            <v-icon right>done</v-icon>
                            <template v-slot:loader>
                                <span>Aguarde...</span>
                            </template>
                        </v-btn>

                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-toolbar>

        <v-data-table
                :headers="headers"
                :items="items"
                :search="search"
                :pagination.sync="pagination"
                class="elevation-1"
        >
            <template v-slot:items="state">
                <td>{{ state.item.nome }}</td>
                <td class="text-xs-right">{{ state.item.crm }}</td>
                <!---<td class="text-xs-right">{{(state.item.especialidades)}}</td>--->
                <td class="text-xs-right">{{getSpecialties(state.item)}}</td>
                <td class="justify-center layout px-0">
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <v-btn @click="editItem(state.item)" dark icon color="orange" v-on="on">
                                <v-icon>
                                edit
                                </v-icon>
                            </v-btn>
                        </template>
                        <span>Editar</span>
                    </v-tooltip>

                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <v-btn
                                    dark
                                    icon
                                    :loading="loader"
                                    color="red"
                                    v-on="on"
                                    @click="deleteItem(state.item)"
                            >
                                <v-icon>
                                    delete
                                </v-icon>
                                <template v-slot:loader>
                                    <span>...</span>
                                </template>
                            </v-btn>
                        </template>
                        <span>Apagar</span>
                    </v-tooltip>
                </td>
            </template>

            <template v-slot:no-results>
                <v-alert :value="true" color="error" icon="warning">
                    Your search for "{{ search }}" found no results.
                </v-alert>
            </template>

        </v-data-table>

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

    </div>

</template>

<script>
    export default {
        data: () => ({
            search: '',
            y: 'top',
            x: null,
            mode: '',
            pagination: {
                rowsPerPage: -1,
            },
            maskCRM: '######',
            rulesform:[
                aux => !! aux || 'Preencher o Campo é Obrigatório.'
            ],
            dialog: false,
            options: [
                'Clinico Geral',
                'Cirurgião Geral',
                'Cardiologia',
                'Dermatologia',
                'Endocrinologia',
                'Fonoaudiologia',
                'Gastrenterologia',
                'Ginecologia',
                'Infectologia',
                'Mastologia',
                'Neurologia',
                'Neuropediatria',
                'Nutricionista',
                'Oncologia',
                'Obstetrícia',
                'Ortopedia',
                'Otorrinolaringologia',
                'Peneumologia',
                'Psiquiatria',
                'Psicologia',
                'Proctologia',
                'Pediatria',
                'Reumatologia',
                'Urologia'
            ],
            headers: [
                {
                    text: 'Nome',
                    align: 'left',
                    value: 'nome'
                },
                { text: 'CRM', value: 'crm', sortable: false, align: 'right' },
                { text: 'Especialidades', value: 'especialidades', sortable: false, align: 'center' },
                { text: 'Ações', value: 'acoes', sortable: false, align: 'center' }
            ],
            desserts: [],
            editedIndex: -1,
            editedItem: {
                nome: '',
                crm: '',
                especialidades: [],
            },
            defaultItem: {
                nome: '',
                crm: '',
                especialidades: [],
            }
        }),

        computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'Cadastro de Médicos' : 'Editar'
            },
            items(){
                return this.$store.getters.dados
            },
            formIsValid () {
                console.log(this.editedItem.especialidades)
                return this.editedItem.nome && this.editedItem.crm && this.editedItem.especialidades.length > 0
            },
            loader(){
                return this.$store.getters.statusLoaderDoc
            },
            snackbar: {
              get() {
                  let snack = this.$store.getters.onSnackbarDoc;
                  if(snack){
                      this.dialog = false
                  }
                  return snack;
              },
                set (value) {

                }
            },
            mensagem(){
                return this.$store.getters.onMensagem;
            }
        },

        watch: {
            dialog (val) {
                val || this.close()
            }
        },

        created () {
            this.initialize()
        },

        mounted(){
            this.$store.dispatch('loadDados')
            this.$store.dispatch('stopSnack',false)
            //this.$store.dispatch('setLoader',{loader:false,view:"Medicos"})
        },

        methods: {
            getSpecialties (item) {
                if (!item.especialidades) return  ''
                let especialidades = ''
                for (const key in item.especialidades) {
                    especialidades += item.especialidades[key] + ', '
                }
                //Remo os ultimos dois caracteres do objeto, no caso um espaço e vírgula.
                especialidades = especialidades.slice(0, especialidades.length - 2)
                return especialidades
            },
            initialize () {
                this.desserts = []
            },

            createMedico () {
                const medicoData = {
                    nome: (this.editedItem.nome).toUpperCase(),
                    crm: this.editedItem.crm,
                    especialidades: this.editedItem.especialidades
                };
                this.$store.dispatch('setLoader',{loader:true,view:"Medicos"}).then(() => {
                    setTimeout(() => (this.$store.dispatch('createMedicos', medicoData)), 500)
                })
            },

            editItem (item) {
                this.editedIndex = this.desserts.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialog = true
            },

            deleteItem (item) {
                let del = {
                    key: item.key
                };
                this.$store.dispatch('setLoader',{loader:true,view:"Medicos"}).then(() => {
                    setTimeout(() => (this.$store.dispatch('deleteMedicos', del.key)), 1000)
                })

            },

            close () {
                this.dialog = false;
                setTimeout(() => {
                    this.editedItem = Object.assign({}, this.defaultItem);
                    this.editedIndex = -1
                }, 300)
            },

            save () {
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