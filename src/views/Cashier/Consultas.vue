<template>
    <v-content>
        <v-container>
            <v-layout align-left justify-left>
                <v-btn
                        @click="back"
                        color="error"
                        rounded
                        class="mb-2 elevation-6"
                >
                    <v-icon left>arrow_back</v-icon>
                    VOLTAR
                </v-btn>
            </v-layout>

            <v-container fluid class="center-card">
                <v-card xs12 sm12 class="round-card">
                    <v-card-title class="ml-2 mr-3">
                        <p v-if="searchAppointment" class="titleAppointment font-italic font-weight-bold">CONSULTAS</p>
                        <p  v-if="registerAppointment" class="titleAppointment font-italic font-weight-bold">CADASTRAR NOVA CONSULTA</p>
                        <v-spacer></v-spacer>
                        <v-btn v-if="registerAppointment" color="primary" small dark fab
                               @click="registerAppointment= !registerAppointment, searchAppointment = !searchAppointment">
                            <v-icon>keyboard_arrow_up</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-text>
                        <v-flex xs12 v-if="searchAppointment">
                            <v-layout>
                                <v-flex xs11>
                                    <v-combobox v-model="searchData"  :items="listAppointment" :disabled="selectedAppointment !== null"
                                                hide-selected hide-no-data :clearable="true" style="justify-content: center" :loading="isLoading"
                                                :search-input.sync="searchData" filled single-line full-width return-object
                                                @click:clear="clearSearch" shaped outlined item-text="nome"
                                    >
                                        <template v-slot:no-data>
                                            <v-list-item>
                                                <v-list-item-content>
                                                    <v-list-item-title>
                                                        Sem resultado para "<strong>{{ searchData }}</strong>"
                                                    </v-list-item-title>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </template>
                                    </v-combobox>
                                </v-flex>

                                <v-flex xs1 class="text-center">
                                    <v-btn v-if="selectedAppointment" style="justify-content: center" text icon color="blue lighten-2"
                                           @click="clearSearch">
                                        <v-icon>close</v-icon>
                                    </v-btn>
                                    <v-btn v-else style="justify-content: center" text icon color="blue lighten-2"
                                           @click="registerAppointment = !registerAppointment, searchAppointment = !searchAppointment">
                                        <v-icon v-if="searchAppointment">add</v-icon>
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                            <v-card v-if="selectedAppointment" class="round-card">
                                <v-card-title>
                                    <h4 class="font-italic font-weight-bold primary--text">{{editedAppointment.nome}}</h4>
                                </v-card-title>
                                <v-card-text>
                                    <v-layout wrap>
                                        <v-flex xs12 sm12>
                                            <v-textarea label=" Regras " v-model="editedAppointment.regras" outlined
                                                        prepend-icon="report_problem" class="mt-5">
                                            </v-textarea>
                                        </v-flex>
                                    </v-layout>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" text @click="save">Salvar<v-icon right>done_all</v-icon></v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-flex>
                        <v-flex xs12 v-if="registerAppointment">
                            <v-card grid-list-x1 fluid class="mt-4">
                                <v-form v-model="validRegister" lazy-validation>
                                    <v-card-text>
                                        <v-layout wrap>
                                            <v-flex xs12 sm12>
                                                <v-text-field required label="Nome" v-model="editedAppointment.nome" class="ml-3 mr-3"
                                                              prepend-icon="description" :rules="rules.campoObrigatorio" >
                                                </v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm12>
                                                <v-textarea label="Regras" v-model="editedAppointment.regras" class="ml-3 mr-3"
                                                            prepend-icon="report_problem">
                                                </v-textarea>
                                            </v-flex>
                                        </v-layout>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-dialog  v-model="loader" hide-overlay persistent width="300">
                                            <v-card color="primary" dark>
                                            <v-card-text class="py-5">
                                                Salvando...
                                                <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                                            </v-card-text>
                                            </v-card>
                                        </v-dialog>
                                        <v-spacer></v-spacer>
                                        <v-btn rounded text color="primary" :disabled="!formRegister" @click="validateRegister()"
                                               class="ma-3"> Cadastrar Consulta </v-btn>
                                        <v-dialog v-model="successRegister" hide-overlay max-width="500px">
                                            <v-card color="white">
                                                <v-card-title class="text-xs-center ma-1">
                                                    <h4>Consulta cadastrado com sucesso!<v-icon right>how_to_reg</v-icon></h4>
                                                </v-card-title>
                                                <v-card-actions>
                                                    <v-spacer></v-spacer>
                                                    <v-btn color="primary" text @click="endRegister()" >Finalizar</v-btn>
                                                </v-card-actions>
                                            </v-card>
                                        </v-dialog>
                                    </v-card-actions>

                                </v-form>
                            </v-card>
                        </v-flex>
                    </v-card-text>
                </v-card>
            </v-container>

        </v-container>
    </v-content>
</template>

<script>
    export default {
        data: () => ({

            searchAppointment: true, registerAppointment: false, searchData: null, isLoading:false,
            validRegister: true, editData: false, noData: true, success:false,

            editedAppointment: {
                id: '', nome: '', regras:'',
            },

            defaultAppointment: {
                id: '', nome: '', regras: '',
            },

            rules: {
                campoObrigatorio: [
                    v => !!v || 'Campo é Obrigatório',
                ],
            },

        }),

        computed: {

            listAppointment () {
                this.isLoading = false;
                return this.$store.getters.appointment;
            },

            formRegister () {
                return this.editedAppointment.nome;
            },

            selectedAppointment () {
                return this.$store.getters.selectedAppointment;
            },

            loader(){
                return this.$store.getters.statusLoaderCO
            },

            successRegister:{
                get(){
                    this.success = this.$store.getters.onSuccessRegisterCO
                    return this.success
                },
                set(val){
                    this.success = val
                }
                
            }

        },

        watch: {

            searchData () {
                if (this.searchData){
                    this.isLoading = true;
                    let data = this.capitalize(this.searchData);
                    this.$store.dispatch('searchAppointment', data).then(() => {

                        if (this.listAppointment.length > 0) {
                            for (let key in this.listAppointment) {
                                if (this.searchData === this.listAppointment[key] || this.searchData === this.listAppointment[key].nome) {
                                    this.searchAppointment = true;
                                    this.registerAppointment = false;
                                    this.$store.dispatch('selectAppointment', {... this.$store.getters.appointment[key]});
                                    this.editedAppointment = Object.assign({} , this.selectedAppointment);
                                    this.editedAppointment.nome = data;

                                }
                            }
                        } else {
                           // setTimeout(this.alert, 500);

                        }
                    })

                } else {
                    this.$store.dispatch('selectAppointment', null);
                }

            },

        },

        methods: {
            alert() {

                if (this.selectedAppointment === null){
                    alert("Consulta não cadastrada");
                    this.editedAppointment= Object.assign({}, this.defaultAppointment);
                    this.editedAppointment.nome = this.searchData;
                }
            },

            clearSearch () {
                this.isLoading = false;
                this.searchData = null;
                this.editedAppointment = Object.assign({}, this.defaultAppointment);
                this.$store.dispatch('selectAppointment', null);

            },

            validateRegister () {
                this.$store.dispatch("setLoader", {
                    loader: true,
                    view: "Consultas"
                });
                setTimeout(() => this.registerProduct(), 1000);
                /* this.registerProduct();
                this.sucessRegister = true; */
            },

            registerProduct () {
                const appointmentData = {
                    id: '',
                    nome: this.capitalize(this.editedAppointment.nome),
                    regras: this.editedAppointment.regras,
                };
                this.$store.dispatch('createAppointment', appointmentData);
            },

            endRegister () {

                this.editedAppointment = Object.assign({}, this.defaultAppointment);
                if (this.registerAppointment === true){

                    this.$store.dispatch('selectAppointment', null);
                    this.registerAppointment = false;
                    this.sucessRegister = false;
                    this.searchAppointment = true;
                    this.searchData = null;
                    this.editData = false;

                }
            },


            save(){
                Object.assign({}, this.editedAppointment);
                this.saveEditions();
            },

            saveEditions(){

                const appointmentData = {
                    id: '',
                    nome: this.capitalize(this.editedAppointment.nome),
                    regras: this.editedAppointment.regras,
                };
                this.$store.dispatch('loadAppointment').then(() => {
                    this.$store.dispatch('updateDataAppointment', appointmentData);
                });

            },

            capitalize(value){
                value = value.toString();
                return value.toUpperCase();
            },

            back(){
                this.$router.push('/Cadastrar')
            },
        },
    }
</script>
<style scoped>

    .titleAppointment {

        color: #757575;
        font-size: 20px;
    }

    .round-card {
        border-radius: 20px;

    }

    .center-card {
        height: 100%;
        justify-content: center;
        align-content: center;
        align-items: center;

    }
</style>