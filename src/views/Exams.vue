<template>
    <v-content>
        <v-container>

            <v-layout align-left justify-left>
                <v-btn
                        @click="back"
                        color="primary"
                        rounded
                        class="mb-2 elevation-6"
                ><v-icon>close</v-icon>
                </v-btn>
            </v-layout>

            <v-container fluid class="center-card">
                <v-card xs12 sm12 class="round-card">
                    <v-card-title class="ml-2 mr-3" >
                        <p v-if="searchExam" class="titleExam font-italic font-weight-bold">EXAMES</p>
                        <p  v-if="registerExam" class="titleExam font-italic font-weight-bold">CADASTRAR NOVO EXAME</p>
                        <v-spacer></v-spacer>
                        <v-btn v-if="registerExam" color="primary" small dark fab
                               @click="registerExam= !registerExam, searchExam = !searchExam">
                            <v-icon>keyboard_arrow_up</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-text>
                        <v-flex xs12 v-if="searchExam">
                            <v-layout >
                                <v-flex xs11>
                                    <v-combobox v-model="searchData" :items="listExam" :disabled="selectedExam !== null"
                                                hide-selected hide-no-data :clearable="true" style="justify-content: center" :loading="isLoading"
                                                :search-input.sync="searchData" filled single-line full-width return-object
                                                @click:clear="clearSearch" shaped outlined item-text="name"
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
                                    <v-btn v-if="selectedExam" style="justify-content: center" text icon color="blue lighten-2"
                                           @click="clearSearch">
                                        <v-icon>close</v-icon>
                                    </v-btn>
                                    <v-btn v-else style="justify-content: center" text icon color="blue lighten-2"
                                           @click="registerExam = !registerExam, searchExam = !searchExam">
                                        <v-icon v-if="searchExam">add</v-icon>
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                            <v-card v-if="selectedExam" class="round-card">
                                <v-card-title>
                                    <h4 class="font-italic font-weight-bold primary--text">{{editedExam.name}}</h4>
                                </v-card-title>
                                <v-flex xs12 sm6>
                                    <v-select
                                            label="Especialidade"
                                            prepend-icon="school"
                                            v-model="editedExam.type"
                                            :items="specialties"
                                            item-text="name"
                                            return-object
                                            outlined
                                            rounded
                                            filled
                                            chips
                                            color="pink"
                                            clearable
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
                                            >{{ data.item.name }}</v-chip>
                                        </template>
                                    </v-select>
                                </v-flex>
                                <v-card-text>
                                    <v-layout wrap>
                                        <v-flex xs12 sm12>
                                            <v-textarea label=" Regras " v-model="editedExam.rules" outlined
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
                        <v-flex xs12 v-if="registerExam">
                            <v-card grid-list-x1 fluid class="mt-4">
                                <v-form v-model="validRegister" lazy-validation>
                                    <v-card-text>
                                        <v-layout wrap >
                                            <v-flex xs12 sm12>
                                                <v-text-field outlined required label="Nome" v-model="editedExam.name" prepend-icon="description"
                                                              :rules="rules.campoObrigatorio" class="ml-3 mr-3">
                                                </v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm12>
                                                <v-select
                                                        class="ml-3 mr-3"
                                                        label="Tipo"
                                                        prepend-icon="school"
                                                        v-model="editedExam.type"
                                                        :items="specialties"
                                                        item-text="name"
                                                        return-object
                                                        outlined
                                                        chips
                                                        color="pink"
                                                        clearable
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
                                                        >{{ data.item.name }}</v-chip>
                                                    </template>
                                                </v-select>
                                            </v-flex>
                                            <v-flex xs12 sm12>
                                                <v-textarea outlined label="Regras" v-model="editedExam.rules" class="ml-3 mr-3"
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
                                        <submit-button :loading="loading" :success="success" text="Cadastrar Exame" :disabled="!formRegister" @click="validateRegister()"
                                               class="ma-3"></submit-button>
                                        <v-dialog v-model="successRegister" hide-overlay max-width="500px">
                                            <v-card color="white">
                                                <v-card-title class="text-xs-center ma-1">
                                                    <h4>Exame cadastrado com sucesso!<v-icon right>how_to_reg</v-icon></h4>
                                                </v-card-title>
                                                <v-card-actions>
                                                    <v-spacer></v-spacer>
                                                    <v-btn color="primary" text @click="endRegister()">Finalizar</v-btn>
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
    import SubmitButton from "../components/SubmitButton";
    export default {
        components: {
            SubmitButton
        },
        data: () => ({
            loading: false,
            success: false,
            searchExam: true, registerExam: false, searchData: null, isLoading:false,
            validRegister: true, editData: false, parameter: 'name', success:false,

            editedExam: {
                id:'', name: '', rules: '', type: '',
            },

            defaultExam: {
                id:'', name: '', rules: '', type: '',
            },

            rules: {
                campoObrigatorio: [
                    v => !!v || 'Campo é Obrigatório',
                ],
            }
        }),

        computed: {
            specialties(){
                return this.$store.getters.specialties
            },
            listExam () {
                this.isLoading = false;
                return this.$store.getters.exam;
            },

            allExam () {
                return this.$store.getters.exams;
            },

            formRegister () {
                return this.editedExam.name;

            },

            selectedExam () {
                return this.$store.getters.selectedExam;
            },
            loader(){
                return this.$store.getters.statusLoaderEX
            },
            successRegister:{
                get(){
                    this.success = this.$store.getters.onSuccessRegisterEX
                    return this.success
                },
                set(val){
                    this.success = val
                }

            }

        },

        mounted() {
            this.$store.dispatch('getSpecialties')
        },

        watch: {
            searchData(){

                if (this.searchData){

                    this.isLoading = true;
                    const data = this.capitalize (this.searchData);
                    this.$store.dispatch('searchExam', data).then(() => {

                        if (this.listExam.length > 0) {

                            for (let key in this.listExam) {
                                if (this.searchData === this.listExam[key].name || this.searchData.name === this.listExam[key].name) {
                                    this.searchExam = true;
                                    this.registerExam = false;
                                    this.$store.dispatch('selectExam', {... this.$store.getters.exam[key]});
                                    this.editedExam.name = data;
                                    this.editedExam = Object.assign({}, this.selectedExam);
                                    //console.log(this.editedExam);

                                }
                            }
                        } else {

                          // setTimeout(this.alert, 500);
                        }
                    })
                } else {
                    this.$store.dispatch('selectExam', null);
                }
            },
        },

        methods: {

            alert() {
                if (this.selectedExam === null){
                    alert("Exame não cadastrado");
                    this.editedExam = Object.assign({}, this.defaultExam);
                    this.editedExam.name = this.searchData;
                }
            },

            clearSearch () {
                this.isLoading = false;
                this.searchData = null;
                this.editedExam = Object.assign({}, this.defaultExam);
                this.$store.dispatch('selectExam', null);

            },

            validateRegister () {
                this.loading = true
                setTimeout(() => this.registerProduct(), 1000);
                /* this.registerProduct();
                this.loader = true
                this.sucessRegister = true; */
            },

            async registerProduct () {
                const examData = {
                    id: '',
                    name: this.capitalize(this.editedExam.name),
                    rules: this.editedExam.rules,
                    type: this.editedExam.type,
                };
                await this.$store.dispatch('addExam', examData);
                this.success = true
                this.loading = false
            },

            endRegister () {

                this.editedExam = Object.assign({}, this.defaultExam);

                if (this.registerExam === true){

                    this.$store.dispatch('selectExam', null);
                    this.registerExam = false;
                    this.sucessRegister = false;
                    this.searchExam = true;
                    this.searchData = null;
                    this.editData = false;

                }
            },


            save(){
                Object.assign({}, this.editedExam);
                this.saveEditions();

            },

            saveEditions(){

                const examData = {
                    id: '',
                    name: this.capitalize(this.editedExam.name),
                    rules: this.editedExam.rules,
                    type: this.editedExam.type,
                };
                this.$store.dispatch('loadExam').then(() => {
                    this.$store.dispatch('updateDataExam', examData);
                });

            },

            capitalize(value){
                value = value.toString();
                return value.toUpperCase();
            },

            back(){
                this.$router.back()
            },

        },


    }
</script>

<style>
    .titleExam {

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
