<template>
    <v-container>

        <v-layout row wrap>
            <v-flex xs12 class="text-left">
                <v-btn
                        @click="back"
                        color="primary"
                        rounded
                        class="mb-2 elevation-6"
                >
                    <v-icon>close</v-icon>
                </v-btn>
            </v-flex>
            <v-flex xs12>
                <v-card class="round-card">
                    <v-card-title class="ml-2 mr-3">
                        <p v-if="searchExam" class="titleExam font-italic font-weight-bold">EXAMES</p>
                        <p v-if="registerExam" class="titleExam font-italic font-weight-bold">CADASTRAR NOVO EXAME</p>
                        <v-spacer></v-spacer>
                        <v-btn v-if="registerExam" color="primary" small dark fab
                               @click="registerExam= !registerExam, searchExam = !searchExam">
                            <v-icon>keyboard_arrow_up</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-text>
                        <v-flex xs12 v-if="searchExam">
                            <v-layout>
                                <v-flex xs11>
                                    <v-text-field
                                            v-model="searchText"
                                            label="Exame"
                                    ></v-text-field>
                                    <!--                                    <v-combobox v-model="searchData" :items="listExam"-->
                                    <!--                                                hide-selected hide-no-data :clearable="true" style="justify-content: center" :loading="isLoading"-->
                                    <!--                                                :search-input.sync="searchData" filled single-line full-width return-object-->
                                    <!--                                                @click:clear="clearSearch" shaped outlined item-text="name"-->
                                    <!--                                    >-->
                                    <!--                                        <template v-slot:no-data>-->
                                    <!--                                            <v-list-item>-->
                                    <!--                                                <v-list-item-content>-->
                                    <!--                                                    <v-list-item-title>-->
                                    <!--                                                        Sem resultado para "<strong>{{ searchData }}</strong>"-->
                                    <!--                                                    </v-list-item-title>-->
                                    <!--                                                </v-list-item-content>-->
                                    <!--                                            </v-list-item>-->
                                    <!--                                        </template>-->
                                    <!--                                    </v-combobox>-->
                                </v-flex>
                                <v-flex xs1 class="text-center">
                                    <v-btn v-if="selectedExam" style="justify-content: center" text icon
                                           color="blue lighten-2"
                                           @click="clearSearch">
                                        <v-icon>close</v-icon>
                                    </v-btn>
                                    <v-btn v-else style="justify-content: center" text icon color="blue lighten-2"
                                           @click="registerExam = !registerExam, searchExam = !searchExam, registed = false">
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
                                            >{{ data.item.name }}
                                            </v-chip>
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
                            </v-card>
                        </v-flex>
                        <v-flex xs12 v-if="registerExam">
                            <v-card grid-list-x1 fluid class="mt-4">
                                <v-form v-model="validRegister" lazy-validation>
                                    <v-card-text>
                                        <v-layout wrap>
                                            <v-flex xs12 sm12>
                                                <v-text-field outlined required label="Nome" v-model="editedExam.name"
                                                              prepend-icon="description"
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
                                                        >{{ data.item.name }}
                                                        </v-chip>
                                                    </template>
                                                </v-select>
                                            </v-flex>
                                            <v-flex xs12 sm12>
                                                <v-textarea outlined label="Regras" v-model="editedExam.rules"
                                                            class="ml-3 mr-3"
                                                            prepend-icon="report_problem">
                                                </v-textarea>
                                            </v-flex>
                                        </v-layout>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <submit-button :loading="loading" :success="success" text="Cadastrar Exame"
                                                       :disabled="!formRegister" @click="validateRegister()"
                                                       class="ma-3">
                                        </submit-button>
                                        <v-btn color="error" fab small v-if="registed"
                                               :disabled="loading"
                                               @click="alertDelete = true">
                                            <v-icon>delete</v-icon>
                                        </v-btn>
                                        <v-dialog v-model="alertDelete" persistent max-width="350">
                                            <v-card>
                                                <v-card-title><strong>Deseja excluir este exame?</strong></v-card-title>
                                                <v-card-text>Este exame será excluído permanentemente.</v-card-text>
                                                <v-card-actions>
                                                    <v-spacer></v-spacer>
                                                    <v-btn color="error" text
                                                           @click="alertDelete = false, deleteExam()">EXCLUIR
                                                    </v-btn>
                                                    <v-btn color="primary" text @click="alertDelete = false">CANCELAR
                                                    </v-btn>
                                                </v-card-actions>
                                            </v-card>
                                        </v-dialog>

                                    </v-card-actions>
                                </v-form>
                            </v-card>
                        </v-flex>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs12 v-if="loading" class="my-4">
                <v-progress-circular indeterminate class="primary--text"></v-progress-circular>
            </v-flex>
            <v-flex xs2 v-for="exam in exams" :key="exam.name" class="mt-4">
                <v-card class="ma-3 pa-3 white" @click="editExam(exam)" ripple>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <span class="font-weight-bold">{{exam.name}}</span>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>

    </v-container>
</template>

<script>
    import SubmitButton from "../components/SubmitButton";

    export default {
        components: {
            SubmitButton
        },
        data: () => ({
            exams: [],
            loading: false,
            success: false,
            searchText: undefined,
            searchExam: true, registerExam: false, searchData: null,
            validRegister: true, editData: false, parameter: 'name', registed: false,

            alertDelete: false,

            editedExam: {
                id: '', name: '', rules: '', type: '',
            },

            defaultExam: {
                id: '', name: '', rules: '', type: '',
            },

            rules: {
                campoObrigatorio: [
                    v => !!v || 'Campo é Obrigatório',
                ],
            }
        }),

        computed: {
            specialties() {
                let specialties = this.$store.getters.specialties.slice()
                for (let spec in specialties) {
                    delete specialties[spec].doctors
                }
                return specialties
            },

            formRegister() {
                return this.editedExam.name;

            },

            selectedExam() {
                return this.$store.getters.selectedExam;
            },

        },

        mounted() {
            this.$store.dispatch('getSpecialties')
            window.addEventListener('keydown', this.handleEnter)
            this.searchExams()
        },
        beforeDestroy() {
            window.removeEventListener('keydown', this.handleEnter)
        },


        methods: {
            handleEnter(e) {
                if (e.key === 'Enter') {
                    if (this.registerExam) {
                        this.validateRegister()
                    } else {
                        this.searchExams(this.searchText)
                    }
                }
            },
            async searchExams(searchText) {
                this.loading = true;
                this.loading = true;
                const data = searchText ? this.capitalize(searchText) : undefined;
                this.exams = await this.$store.dispatch('searchExam', data);
                this.loading = false
            },

            alert() {
                if (this.selectedExam === null) {
                    alert("Exame não cadastrado");
                    this.editedExam = Object.assign({}, this.defaultExam);
                    this.editedExam.name = this.searchData;
                }
            },

            clearSearch() {
                this.isLoading = false;
                this.searchData = null;
                this.editedExam = Object.assign({}, this.defaultExam);
                this.$store.dispatch('selectExam', null);

            },

            validateRegister() {
                this.loading = true;
                this.registerProduct()
                /* this.registerProduct();
                this.loader = true
                this.sucessRegister = true; */
            },

            async registerProduct() {
                const examData = {
                    id: '',
                    name: this.capitalize(this.editedExam.name).replace(/\//g, "-"),
                    rules: this.editedExam.rules,
                    type: this.editedExam.type ? this.editedExam.type.name : undefined,
                };
                await this.$store.dispatch('addExam', examData);
                this.success = true
                this.loading = false
                this.searchExams()
                setTimeout(() => {
                    this.editedExam = {
                        id: '', name: '', rules: '', type: '',
                    }
                    this.success = false
                }, 1000)
            },

            endRegister() {

                this.editedExam = Object.assign({}, this.defaultExam);

                if (this.registerExam === true) {

                    this.$store.dispatch('selectExam', null);
                    this.registerExam = false;
                    this.sucessRegister = false;
                    this.searchExam = true;
                    this.searchData = null;
                    this.editData = false;
                    this.registed = false;

                }
            },

            capitalize(value) {
                value = value.toString();
                return value.toUpperCase();
            },

            back() {
                this.$router.back()
            },

            editExam(exam) {
                this.editedExam = Object.assign({}, exam);
                this.registerExam = true;
                this.searchExam = false;
                this.registed = true;
            },

            async deleteExam() {
                this.loading = true
                await this.$store.dispatch('deleteExam', this.editedExam.name)
                this.loading = false
                this.editedExam = {
                    id: '', name: '', rules: '', type: '',
                }
                this.registed = false
                this.searchExams()
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
