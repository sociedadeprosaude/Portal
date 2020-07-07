<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12>
                <v-expansion-panels inset >
                    <v-expansion-panel v-for="(intake,i) in intakes" :key="i">
                    <v-expansion-panel-header class="elevation-2 my-3">
                    <v-layout row wrap>
                        <v-flex xs3 class="align-center justify-center">
                            <p class="font-weight-black mt-5">
                                {{intake.intakeNumber}}
                            </p>
                        </v-flex>
                        <v-flex xs1>
                            <v-divider class="primary" vertical/>
                        </v-flex>
                        <v-flex xs4 class="text-center align-center justify-center">
                            <p class="mt-5"> PREÇO TOTAL: {{PriceIntake(intake)}}</p>
                        </v-flex>
                        <v-flex xs1>
                            <v-divider class="primary" vertical/>
                        </v-flex>
                        <v-flex xs3>
                            <p class="mt-5"> NUMERO DE EXAMES: {{intake.exams.length}}</p>
                        </v-flex>
                    </v-layout>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-card v-for="(exam,i) in intake.exams" v-bind:key="i" >
                            <v-layout row wrap>
                                <v-flex xs5 class="align-center justify-center">
                                    <p class="font-weight-black mt-5">
                                        {{exam.name}}
                                    </p>
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider class="primary" vertical/>
                                </v-flex>
                                <v-flex xs6 class="text-center align-center justify-center">
                                    <p class="mt-5"> PREÇO: {{exam.price}}</p>
                                </v-flex>
                            </v-layout>
                        </v-card>
                    </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
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
        props: ['clinic'],
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
        },
        mounted(){
            this.$store.dispatch('GetReceiptsClinic', this.clinic)

        },
        computed: {
            intakes(){
                console.log('ouutakes clinic: ', this.$store.getters.IntakesExamsClinics)
                return this.$store.getters.IntakesExamsClinics
            }
        }
    };
</script>
