<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-flex sm12>
                <v-card class="pt-3 mb-4">
                    <v-layout row wrap>
                        <v-flex sm8>
                            <v-text-field outlined
                                          placeholder="Exames"
                                          class="mx-5"
                                          color="primary"
                                          v-model="search"
                                          :loading="loading"
                                          id="search"
                            />
                        </v-flex>
                        <v-flex sm4 class="text-right pr-3 mt-2">
                            <v-btn outlined class="primary--text" @click="newExam = true">cadastrar exame</v-btn>
                        </v-flex>
                    </v-layout>
                </v-card>

                <v-card>
                    <v-card-text v-if="exams.length !== 0">
                        <listExams :exams="exams" :loading="loading" @clear-search="search = ''"/>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-dialog v-model="newExam"><createExam :registed="registed" @close-dialog="newExam = false"/></v-dialog>
        </v-layout>
    </v-container>
</template>
<script>
    import listExams from "../../components/Exams/listExams"
    import createExam from "../../components/Exams/CreateExam"

    export default {

        components: {listExams, createExam},

        data: () => ({
            search: '',
            loading: undefined,
            newExam: false,
            registed: false,
        }),

        mounted() {
            let self = this;
            window.addEventListener('keyup', function (e) {
                if (e.target.id === 'search') {
                    clearTimeout(self.typingTimer);
                    self.typingTimer = setTimeout(() => {
                            self.loading = true;
                            self.$store.dispatch("loadSelectedExams", self.search.toUpperCase()).then(() => {
                                self.loading = false
                            });
                    }, 300);
                }
            });
            window.addEventListener('keydown', function (e) {
                if (e.target.id === 'search') {
                    clearTimeout(self.typingTimer)
                }
            })
        },

        computed: {
            exams() {
                return this.$store.getters.examsSelected;
            },
        },

    }
</script>