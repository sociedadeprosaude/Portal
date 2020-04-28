<template>
    <v-content>
        <v-container fluid>
            <v-card class="elevation-3">
                <v-card-title class="headline grey lighten-2 justify-center align-center" primary-title>
                    <v-btn style="display: none" text color="transparent" class="transparent"></v-btn><v-spacer></v-spacer>SOLICITAÇÃO DE EXAMES<v-spacer></v-spacer><v-btn color="error" @click="clear()">Fechar</v-btn>
                </v-card-title>
                <v-card-text>
                    <v-container fluid>
                        <v-layout row wrap class="align-center justify-center">
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
                            </v-flex>
                            <v-flex xs1>
                                <v-btn v-on:click="addToList" :disabled="!addIsValid" color="success">
                                    <v-icon>add</v-icon>
                                </v-btn>
                            </v-flex>

                            <v-flex xs12><p style="color: white">.</p></v-flex>
                            <v-flex xs12><p style="color: white">.</p></v-flex>

                            <transition name="fade">
                                <v-flex xs12 v-if="exams.length > 0">
                                    <strong>EXAMES SELECIONADOS:</strong>
                                </v-flex>
                            </transition>

                            <transition name="fade">
                                <v-flex xs11 v-if="exams.length > 0">
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
                            </transition>

                            <transition name="fade">
                                <v-flex xs1 v-if="exams.length > 0">
                                    <v-btn v-on:click="deleteFromList" :disabled="!deleteIsValid" color="error">
                                        <v-icon>delete_forever</v-icon>
                                    </v-btn>
                                </v-flex>
                            </transition>

                            <transition name="fade">
                                <v-flex xs12 v-if="exams.length > 0">
                                    <h1>Exames Solicitados:</h1>
                                    <br>
                                    <transition-group name="slide-up">
                                        <ul v-for="(dados,i) in exams" :key="i">
                                            <li>
                                                {{dados.name}}
                                            </li>
                                        </ul>
                                    </transition-group>
                                </v-flex>
                            </transition>

                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" :disabled="!formIsValid" @click="documentDialog = true"><v-icon left>print</v-icon>GERAR PDF <v-icon right>fa fa-print</v-icon></v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-container>

        <v-dialog v-model="documentDialog">
            <solicitations-p-d-f @close-dialog="documentDialog = false" :consultation="consultation" :exams="exams"></solicitations-p-d-f>
        </v-dialog>

    </v-content>
</template>

<script>
    import SolicitationsPDF from "./printing/solicitationsPDF";
    export default {
        components: {SolicitationsPDF},
        props:['consultation'],
        data: () => ({
            documentDialog: false,
            exams: [],
            newExam: undefined,
            loadingExams: false,
            loading: false,
            succes: false
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
        },
        methods: {
            remove (item) {
                const index = this.exams.indexOf(item)
                if (index >= 0) this.exams.splice(index, 1)
            },
            clear() {
                this.newExam = undefined
                this.exams = [];
                this.closeDialog()
            },
            closeDialog: function () {
                this.$emit('close-dialog')
            },
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
                this.newExam = undefined;
            },
            deleteFromList() {
                this.exams = [];
            },
        },
    }
</script>
<style scoped>
    ul {
        list-style-type: none;
    }
</style>