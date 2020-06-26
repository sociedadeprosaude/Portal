<template>
    <v-container>
        <v-layout row wrap v-if="patient">
            <v-flex xs12>
                <v-card color="primary">
                    <v-layout row wrap class="py-2 px-3">
                        <v-spacer/>
                        <v-flex xs6>
                            <p class="white--text font-weight-bold text-left"> N° de Consultas: {{NumberConsultations}}</p>
                        </v-flex>
                        <v-spacer/>
                        <v-flex xs6>
                            <p class="white--text font-weight-bold text-left"> N° de Retorno: {{NumberReturns}}</p>
                        </v-flex>
                        <v-spacer></v-spacer>
                    </v-layout>
                </v-card>
            </v-flex>
           <v-flex xs12 v-for="(consultation,index) in consultations" :key="index">
                <v-card>
                    <v-layout row wrap>
                        <v-flex xs12 class="mt-4 mb-3">
                            <p class="text-left primary--text font-weight-bold ml-2">{{consultation.date |
                                dateFilter}} - {{daydate(consultation.date)}}</p>
                            <v-divider class="primary"/>
                        </v-flex>
                        <v-flex sm4 v-for="(item,index) in consultation.consultations" :key="index" class="mt-3 mb-2">
                            <v-card outlined class="borderCard mx-2 mr-2 grey_light" @click="ConsultationSelect(item)">
                                <v-layout row wrap class="mt-2">
                                    <v-flex xs4>
                                        <v-icon large>person</v-icon>
                                        <br>
                                        <v-icon small class="mt-1">donut_large</v-icon>
                                    </v-flex>
                                    <v-flex xs8 class="mb-3">
                                        <v-flex xs12>
                                            <h4 class="text-left font-weight-bold">{{item.specialty ? item.specialty.name: item.exam.name}}</h4>
                                            <h5 class="text-left mt-1">{{item.date.substring(11,16)}}</h5>
                                            <h5 class="text-left">{{item.doctor.name}}</h5>
                                        </v-flex>
                                    </v-flex>
                                </v-layout>

                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import moment from 'moment/moment'
    export default {
        name: "CardPatientManagementConsultations",
        props: ['patient', 'NumberConsultations','NumberReturns'],
        data: () => ({
            semanaOptions: [
                "Domingo",
                "Segunda-feira",
                "Terça-feira",
                "Quarta-feira",
                "Quinta-feira",
                "Sexta-feira",
                "Sábado"
            ],
            clinics:[],
            selectedDoctor:[],
        }),
        computed: {
            consultations(){
                let consultations= {};
                for(let i=0; i<this.patient.consultations.length; i++){
                    if(!consultations[this.patient.consultations[i].date]){
                        consultations[this.patient.consultations[i].date] = {
                            consultations: [],
                            date: this.patient.consultations[i].date.substring(0,10)
                        }
                    }
                    consultations[this.patient.consultations[i].date].consultations.push(this.patient.consultations[i])

                }
                return consultations
            }
        },
        mounted() {
        },
        watch: {
        },
        methods:{

            daydate(date) {
                let dateMoment = moment(date);
                return this.semanaOptions[dateMoment.day()];
            },
            ConsultationSelect: function (item) {
                this.$emit('consultationSelect', item)
            },
        }
    }
</script>
<style scoped>
    .borderCard {
        border-radius: 50%;
        border: #808080 solid;
    }

</style>
