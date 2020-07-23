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
                            <v-divider class="primary" vertical/>

                            <v-flex xs2 class="text-center align-center justify-center">
                                <p class="mt-5">
                                    <span class="font-weight-bold">PREÇO ATUAL: </span>
                                    <span class="font-italic" >{{exam.price}}</span>

                                </p>
                            </v-flex>

                            <v-divider class="primary" vertical/>

                            <v-flex xs3 class="text-center align-center justify-center">
                                <p class="mt-5">
                                    <span class="font-weight-bold">PREÇO REQUERIDO:</span>
                                    <span class="font-italic" > {{exam.NewValue}}</span>
                                </p>
                            </v-flex>

                            <v-divider class="primary" vertical/>
                            <v-spacer/>

                            <v-flex xs3 class="text-right mt-4">
                                <v-btn class="mx-2" icon small rounded color="success" @click="updateExamInContestValue (exam, intake)">
                                    <v-icon>done</v-icon>
                                </v-btn>
                                <v-btn class="mx-2" icon small rounded color="error" @click="deleteExamInContestValue(exam, intake)">
                                    <v-icon>delete</v-icon>
                                </v-btn>
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
        directives: {mask},
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
        computed: { intakes() { return this.$store.getters.contestValue } },
        mounted() { this.$store.dispatch('getContestValue'); }
    };
</script>
