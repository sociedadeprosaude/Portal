<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12>
                    <v-card v-for="(outtake,i) in outtakes" :key="i">
                    <v-layout row wrap>
                        <v-flex xs1 class="align-center justify-center">
                            <p class="font-weight-black mt-5">
                                {{outtake._id}}
                            </p>
                        </v-flex>
                        <v-flex xs1>
                            <v-divider class="primary" vertical/>
                        </v-flex>
                        <v-flex xs4 class="text-center align-center justify-center">
                            <p class="mt-5"> CONSULTA: {{outtake.ProductTransaction[0].Consultation.Product.name}}</p>
                        </v-flex>
                      <v-flex xs1>
                        <v-divider class="primary" vertical/>
                      </v-flex>
                      <v-flex xs2 class="align-center justify-center">
                        <p class="font-weight-black mt-5">
                          {{date(outtake.date.formatted)}}
                        </p>
                      </v-flex>
                        <v-flex xs1>
                            <v-divider class="primary" vertical/>
                        </v-flex>
                        <v-flex xs2>
                            <p class="mt-5"> PREÇO: {{-outtake.value}}</p>
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
    import  moment from 'moment'

    export default {
        props: ['doctor','outtakes'],
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
            },
          date(dat){
              console.log('dat: ', dat)
             return moment(dat).format('DD/MM/YYYY')
          }
        },
        mounted(){
            this.$store.dispatch('GetReceiptsDoctor', this.doctor)

        },
        computed: {

            mostrarOuttakes(){
                console.log('outtakes: ', this.outtakes)
            }
        }
    };
</script>
