<template>
    <v-container fluid>
        <v-layout v-if="exams" row nowrap>
            <v-flex xs12 v-if="loading">
                <v-progress-circular class="primary--text" indeterminate/>
            </v-flex>
            <v-flex xs12 v-if="exams.length === 0 && loading === false">
                <p>Não há resultado para a pesquisa realizada</p>
            </v-flex>
            <div v-if="exams.length !== 0" style="width: 100%">
                <v-flex sm12 v-for="(exam, i) in exams" :key="i" class="mb-5">
                    <v-card>
                        <v-flex xs12 sm12>
                            <v-card color="primary">
                                <v-layout row wrap>
                                    <v-flex sm10>
                                        <p class="white--text text-left font-weight-bold pt-4 pb-3 pl-4">
                                            {{exam.name}}
                                        </p>
                                    </v-flex>
                                    <v-flex sm2 class="text-right mt-2">
                                        <v-btn icon dark><v-icon small @click="selectExam(exam)">edit</v-icon></v-btn>
                                        <v-btn icon dark><v-icon small @click="openAlertDelete(exam)">delete</v-icon></v-btn>
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-flex>
                        <v-flex xs12 sm12 class="mt-4 mb-3">
                            <v-divider class="primary"/>
                        </v-flex>
                        <v-flex sm3 v-for="(item, i) in exam.clinics" :key="i" class="mt-3 mb-2">
                            <v-card outlined class="borderCard mx-2 mr-2 pb-3 grey_light">
                                <v-layout row wrap class="mt-2">
                                    <v-flex xs12 class="ml-3">
                                        <h4 class="text-left font-weight-bold"><v-icon left>info</v-icon>{{item.name}}</h4>
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-flex>
                    </v-card>
                </v-flex>
            </div>
            <v-dialog v-model="editExam"><createExam :registed="registed" :selectedExam="exam" @close-dialog="editExam = false" /></v-dialog>
            <v-dialog v-model="alertDelete" persistent max-width="350">
                <v-card>
                    <v-card-title><strong>Deseja excluir este exame?</strong></v-card-title>
                    <v-card-text class="ml-n2">Este exame será excluído permanentemente.</v-card-text>
                    <v-card-actions>
                        <v-spacer/>
                        <v-btn color="error" text
                               @click="alertDelete = false, deleteExam(exam)">EXCLUIR
                        </v-btn>
                        <v-btn color="primary" text @click="alertDelete = false">CANCELAR
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-layout>
    </v-container>
</template>
<script>
    import createExam from "./CreateExam"

    export default {
        props: ['exams', 'loading'],

        components: {createExam},

        data: () => ({
            editExam: false,
            registed: true,
            exam: null,
            alertDelete: false,
        }),

        methods: {
            async selectExam (exam) {
                this.exam = exam;
                this.editExam = true;
            },
            openAlertDelete (exam) {
                this.exam = exam;
                this.alertDelete = true;
            },

            async deleteExam(exam) {
                await this.$store.dispatch('deleteExam', exam.name);
                this.$emit('clear-search')
            },
        }
    }
</script>