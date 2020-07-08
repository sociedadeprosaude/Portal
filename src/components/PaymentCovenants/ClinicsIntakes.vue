<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12>
                <v-card v-for="(intake,i) in outtakes" :key="i">
                    <v-layout row wrap class="primary">
                        <v-flex xs12>
                            <v-divider class="primary"></v-divider>
                        </v-flex>
                        <v-flex xs12 md4 class="align-center font-weight-bold justify-center">
                            <p class="white--text mt-5">
                                {{intake.intakeNumber}}
                            </p>
                        </v-flex>
                        <v-flex xs6 md3>
                            <p class="mt-5  body-2  white--text" > N° DE EXAMES: {{intake.exams.length}}</p>
                        </v-flex>
                        <v-flex xs6 md4 class="text-center align-center justify-center">
                            <p class="mt-5 white--text  body-2"> PREÇO TOTAL: {{PriceIntake(intake)}}</p>
                        </v-flex>
                        <v-flex xs12>
                            <v-divider class="primary"></v-divider>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap v-for="(exam,i) in intake.exams" v-bind:key="i" >
                        <v-flex md4 class="hidden-sm-and-down">
                            <v-spacer></v-spacer>
                        </v-flex>
                        <v-flex xs8 md3 class="align-center justify-center">
                            <p class="font-weight-black mt-5">
                                {{exam.name}}
                            </p>
                        </v-flex>
                        <v-flex xs4 md4 class="text-center align-center justify-center">
                            <p class="mt-5"> PREÇO: {{exam.price}}</p>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
            <v-flex xs12>
                <v-divider class="my-3"/>
            </v-flex>
            <v-spacer/>
            <v-flex xs11/>
            <v-flex xs12 v-if="loading">
                <v-progress-linear color="primary" indeterminate/>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import {mask} from "vue-the-mask";

    export default {
        props: ['clinic','outtakes'],
        name: "ClinicsIntakes",
        directives: {
            mask
        },
        data() {
            return {
                numberIntake:'',
                loading: false,
                successUpdateExams: false,
                dialogContestValue: false,
                ContestExam:[],
                NewValue: ''
            };
        },
        methods: {
            PriceIntake(intake){
                let price= 0;
                for(let exam of intake.exams){
                    price += exam.price
                }
                return price
            },

            closeDialog: function() {
                this.$emit('close-dialog')
            }
        }
    };
</script>
