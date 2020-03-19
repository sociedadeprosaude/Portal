<template>
    <v-container fluid>
        <v-card class="elevation-3">
            <v-card-title class="headline grey lighten-2 justify-center align-center" primary-title>
                <v-btn style="display: none" text color="transparent" class="transparent"></v-btn><v-spacer></v-spacer>SOLICITAÇÃO DE EXAMES<v-spacer></v-spacer><v-btn color="error" @click="clear()">Fechar</v-btn>
            </v-card-title>
            <v-card-text>
                        <v-container grid-list-md>
                            <v-layout align-center justify-center wrap>
                                <v-flex xs11 v-if="!loadingExams">
                                    <v-combobox
                                            prepend-inner-icon="search"
                                            prepend-icon="assignment"
                                            :items="listExam"
                                            item-text="name"
                                            return-object
                                            label="Exames"
                                            outlined
                                            v-model="newExam"
                                            clearable
                                            chips
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
                                            >{{ data.item.name }}
                                            </v-chip>
                                        </template>
                                    </v-combobox>
                                    <v-spacer></v-spacer>
                                </v-flex>
                                <v-flex xs1>
                                    <v-btn v-on:click="addToList" :disabled="!addIsValid" color="success">
                                        <v-icon>add</v-icon>
                                    </v-btn>
                                </v-flex>
                                <v-flex xs12>
                                    <strong>EXAMES SELECIONADOS:</strong>
                                </v-flex>
                                <v-flex>
                                    <v-combobox
                                            :items="exams"
                                            item-text="name"
                                            return-object
                                            multiple
                                            v-model="exams"
                                            chips
                                            outlined
                                            hide-selected
                                    >
                                        <template v-slot:selection="data">
                                            <v-chip
                                                    close
                                                    @click="data.select"
                                                    @click:close="remove(data.item)"
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
                                    </v-combobox>
                                </v-flex>

                                <v-flex xs12 v-if="exams.length > 0">
                                    <h1>Exames Solicitados:</h1>
                                    <br>
                                    <ul v-for="(dados,i) in exams" :key="i">
                                        <li>
                                            {{dados.name}}
                                        </li>
                                    </ul>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-layout align-center justify-center>
                            <v-spacer></v-spacer>
                            <submit-button :loading="loading" :success="succes" text="SALVAR" :disabled="!formIsValid" @click="save(), closeDialog()"></submit-button>
                            <v-btn
                                    :disabled="!formIsValid"
                                    @click="save()"
                                    color="success"
                            >
                                SALVAR
                            </v-btn>
                        </v-layout>
                    </v-card-actions>
                </v-card>
    </v-container>
</template>

<script>
    var moment = require('moment');
    export default {
        props:['consultation'],
        data: () => ({
            medico: 'JACKSON KELVIN DE SOUZA',
            crm:'55874',
            paciente: 'JACKSON KELVIN DE SOUZA',
            moment: moment,
            dateFormatted: '',
            examsOptions: [],
            //================
            exams: [],
            newExam: null,
            loadingExams: false,
            loading: false,
            succes: false
            //==================
        }),
        computed: {
            formIsValid() {
                return this.exams.length > 0
            },
            addIsValid() {
                return this.newExam
            },
            deleteIsValid() {
                return this.exams.length > 0
            },
            listExam() {
                return this.$store.getters.exams;
            },
        },

        mounted() {
            this.paciente =  this.consultation.user.dependent ? this.consultation.user.dependent.name : this.consultation.user.name;
            this.loadExams();
            window.addEventListener('keydown', this.handleEnter);
        },
        beforeDestroy() {
            window.removeEventListener('keydown', this.handleEnter)
        },

        watch: {
            //
        },
        methods: {
            remove (item) {
                const index = this.exams.indexOf(item)
                if (index >= 0) this.exams.splice(index, 1)
            },
            clear() {
                this.exams = [];
                this.closeDialog()
            },
            closeDialog: function () {
                this.$emit('close-dialog')
            },
            //=================
            async loadExams() {
                this.loadingExams = true
                await this.$store.dispatch('loadExam');
                this.loadingExams = false
            },
            handleEnter(e) {
                if (e.key === 'Enter') {
                    this.addToList()
                }
            },
            addToList() {
                if (this.exams.indexOf(this.newExam) > -1) {
                    return
                }
                this.exams.push(this.newExam);
                this.newExam = null;
            },
            deleteFromList() {
                this.exams = [];
            },

            async save() {
                this.loading = true
                for (let i in this.exams) {
                    let examData = {
                        clinic: this.selectedClinic,
                        exam: this.exams[i].name,
                        rules: this.exams[i].rules,
                        obs: this.obs,
                        cost: this.cost,
                        sale: this.sale,
                    };
                    //console.log(examData)
                    // await this.$store.dispatch('addExamToClinic', examData);
                }
                this.loading = false;
                this.succes = true;
                setTimeout(() => {
                    this.clear();
                    this.succes = false
                }, 1000)
            },
        },
    }
</script>
<style scoped>
</style>