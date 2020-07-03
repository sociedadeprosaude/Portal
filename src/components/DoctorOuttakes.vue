<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12>
                    <v-card v-for="(intake,i) in intakes" :key="i">
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
                            <p class="mt-5"> CONSULTA: {{intake.consultations.name}}</p>
                        </v-flex>
                        <v-flex xs1>
                            <v-divider class="primary" vertical/>
                        </v-flex>
                        <v-flex xs2>
                            <p class="mt-5"> PREÇO: {{intake.consultations.price}}</p>
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
        props: ['doctor'],
        name: "DoctorOuttakes",
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
            closeDialog: function() {
                this.$emit('close-dialog')
            }
        },
        mounted(){
            this.$store.dispatch('GetReceiptsDoctor', this.doctor)

        },
        computed: {
            intakes(){
                return this.$store.getters.OuttakesConsultationDoctor
            }
        }
    };
</script>
