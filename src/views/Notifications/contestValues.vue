<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12 v-for="intake in intakes">
                <v-flex xs12 v-for="exam in intake.exams">
                    <v-card class="elevation-2 my-3">
                        <v-layout row wrap>
                            <v-flex xs3 class="align-center justify-center">
                                <p class="font-weight-black mt-5">
                                    {{exam.name}}
                                </p>
                            </v-flex>
                            <v-flex xs1>
                                <v-divider class="primary" vertical/>
                            </v-flex>
                            <v-flex xs1 class="text-center align-center justify-center">
                                <p class="mt-5"> PREÇO ATUAL: {{exam.price}}</p>
                            </v-flex>
                            <v-flex xs1>
                                <v-divider class="primary" vertical/>
                            </v-flex>
                            <v-flex xs2 class="text-center align-center justify-center">
                                <p class="mt-5"> PREÇO REQUERIDO: {{exam.NewValue}}</p>
                            </v-flex>
                            <v-flex xs1>
                                <v-divider class="primary" vertical/>
                            </v-flex>
                            <v-flex xs1>
                                <v-btn class="mt-4" rounded color="success" @click="updateExamInContestValue (exam, intake)">Alterar</v-btn>
                            </v-flex>
                            <v-flex xs1>
                                <v-divider class="primary" vertical/>
                            </v-flex>
                            <v-flex xs1>
                                <v-btn class="mt-4" rounded color="error" @click="deleteExamInContestValue(exam, intake)">Cancelar</v-btn>
                            </v-flex>
                        </v-layout>
                    </v-card>
                </v-flex>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import {mask} from "vue-the-mask";

    export default {
        name: "contestValues",
        directives: {
            mask
        },
        data() {
            return {
                listUpdatedExams: []

            };
        },
        methods: {

            async deleteExamInContestValue(exam, intake) {
                this.listUpdatedExams = intake.exams;
                if (this.listUpdatedExams.length === 1) {
                    this.listUpdatedExams = [];
                } else {
                    this.listUpdatedExams.splice(this.listUpdatedExams.indexOf(exam), 1);
                }

                let data = {
                    intake: intake,
                    exams: this.listUpdatedExams,
                };
                await this.$store.dispatch('updateContestValue', data);
                await this.$store.dispatch('getContestValue');
            },

            async updateExamInContestValue (exam, intake){
                let data = {
                    exam: exam,
                    newValue: exam.NewValue,
                    intakeId: intake.numberIntake,
                    clinic: intake.clinic,
                };
                await this.$store.dispatch('updateNewValueExam', data);
                this.deleteExamInContestValue(exam, intake);
            }
        },
        computed: {
            intakes(){
                return this.$store.getters.contestValue
            }
        },
        mounted() {
            this.$store.dispatch('getContestValue');
        }
    };
</script>
