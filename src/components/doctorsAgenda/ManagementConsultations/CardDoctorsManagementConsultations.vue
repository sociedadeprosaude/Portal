<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12 v-for="(consultation, i) in ConsultationsByDoctors(consultations)">
                <v-card>
                    <v-layout row wrap>
                        <v-flex xs12 >
                            <v-card color="indigo darken-4">
                                <v-layout row wrap>
                                    <v-flex xs2>
                                        <v-btn @click="printConsultation(consultation)">
                                        </v-btn>
                                    </v-flex>
                                    <v-flex xs10>
                                        <v-spacer></v-spacer>
                                    </v-flex>
                                    <v-flex xs5>
                                        <p class="white--text text-left">{{consultation.doctor.name}}</p>
                                    </v-flex>
                                    <v-flex xs3>
                                        <v-spacer></v-spacer>
                                    </v-flex>
                                    <v-flex xs4>
                                        <p class="white--text"> N° de Consultas: {{consultation.numConsultations}}</p>
                                    </v-flex>
                                    <v-flex xs5>
                                        <p class="white--text text-left"> CRM: {{consultation.doctor.crm}}</p>
                                    </v-flex>
                                    <v-flex xs3>
                                        <v-spacer></v-spacer>
                                    </v-flex>
                                    <v-flex xs4>
                                        <p class="white--text"> N° de Retorno: {{consultation.numRegress}}</p>
                                    </v-flex>
                                    <v-flex xs5>
                                        <p class="white--text text-left"> CPF: {{consultation.doctor.cpf}}</p>
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-flex>
                        <v-flex xs12>
                            <p class="text-left" v-if="ConsultationsByDoctors(consultations).length != 0">{{date |
                                dateFilter}} - {{daydate(date)}}</p>
                        </v-flex>
                        <v-flex xs12>
                            <v-divider></v-divider>
                        </v-flex>
                        <v-flex sm4  v-for="item in consultation.consultations">
                            <v-card outlined class="borderCard">
                                <v-layout row wrap>
                                    <v-flex xs12>
                                        <p class="text-left">{{item.user.name}}</p>
                                    </v-flex>
                                    <v-flex xs12>
                                        <p class="text-left">{{item.date.substring(11,16)}}</p>
                                    </v-flex>
                                    <v-flex xs12>
                                        <p class="text-left">Agendado em: {{item.date.substring(0,10)}}</p>
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
        name: "CardDoctorsManagementConsultations",
        props: ['especialtie','date'],
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
        }),
        computed: {
            consultations() {
                return this.$store.getters.consultations.filter((a) => {
                    return this.especialtie && this.date ? this.especialtie.name === a.specialty.name && this.date === a.date.split(' ')[0] && a.user : false
                });
            },
        },
        mounted() {
            this.initialConfig()

        },
        watch: {

        },
        methods: {
            ConsultationsByDoctors(consultations) {
                let res = {}
                for (let cons in consultations) {
                    let targetDate = consultations[cons].doctor.cpf
                    if (!res[targetDate]) {
                        res[targetDate] = {
                            doctor: consultations[cons].doctor,
                            numConsultations: 0,
                            numRegress: 0,
                            consultations: []
                        }
                    }
                    if (consultations[cons].type == 'Consulta') res[targetDate].numConsultations += 1
                    else res[targetDate].numRegress += 1
                    res[targetDate].consultations.push(consultations[cons])
                }
                return res
            },
            async initialConfig() {
                await this.$store.dispatch('listenConsultations',
                    {
                        start_date: moment().subtract(10, 'days').format('YYYY-MM-DD'),
                        final_date: moment().add(10, 'days').format('YYYY-MM-DD 23:59:59')
                    })
            },
            daydate(date) {
                var dateMoment = moment(date);
                return this.semanaOptions[dateMoment.day()];
            },
            printConsultation(consultation){
                console.log('consultation', consultation)
            }
        },
    }
</script>
<style scoped>
    .borderCard{
        border-radius: 50%;
    }
</style>
