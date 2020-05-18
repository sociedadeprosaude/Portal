<template>
    <v-container>
        <v-layout row wrap v-if="especialtie">
            <v-flex xs12 v-for="(consultation, i) in ConsultationsByDoctors(consultations)">
                <v-card>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-card color="primary">
                                <v-layout row wrap class="py-2 px-3">
                                    <v-flex xs5>
                                        <p class="white--text text-left font-weight-bold">
                                            <v-icon dark left large>account_circle</v-icon>
                                            {{consultation.doctor.name}}
                                        </p>
                                    </v-flex>
                                    <v-spacer/>
                                    <v-flex xs3>
                                        <p class="white--text font-weight-bold text-left"> N° de Consultas: {{consultation.numConsultations}}</p>
                                    </v-flex>
                                    <v-flex xs5>
                                        <p class="white--text text-left font-weight-bold"> CRM: {{consultation.doctor.crm}}</p>
                                    </v-flex>
                                    <v-spacer/>
                                    <v-flex xs3>
                                        <p class="white--text font-weight-bold text-left"> N° de Retorno: {{consultation.numRegress}}</p>
                                    </v-flex>
                                    <v-flex xs5>
                                        <p class="white--text text-left font-weight-bold"> CPF: {{consultation.doctor.cpf}}</p>
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-flex>
                        <v-flex xs12 class="mt-4 mb-3">
                            <p class="text-left primary--text font-weight-bold ml-2" v-if="ConsultationsByDoctors(consultations).length !== 0">{{date |
                                dateFilter}} - {{daydate(date)}}</p>
                            <v-divider class="primary"/>
                        </v-flex>
                        <v-flex sm4 v-for="item in consultation.consultations" class="mt-3 mb-2">
                            <v-card outlined class="borderCard mx-2 mr-2 grey_light" @click="patientSelect(item)">
                                <v-layout row wrap class="mt-2">
                                    <v-flex xs4>
                                        <v-icon large>person</v-icon>
                                        <br>
                                        <v-icon small class="mt-1">donut_large</v-icon>
                                    </v-flex>
                                    <v-flex xs8 class="mb-3">
                                        <v-flex xs12>
                                            <h4 class="text-left font-weight-bold">{{item.user.name}}</h4>
                                            <h5 class="text-left mt-1">{{item.date.substring(11,16)}}</h5>
                                            <h5 class="text-left">Agendado em: {{item.date.substring(0,10)}}</h5>
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
        name: "CardDoctorsManagementConsultations",
        props: ['especialtie', 'date'],
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
            patientSelected: []
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
        watch: {},
        methods: {
            ConsultationsByDoctors(consultations) {
                let res = {};
                for (let cons in consultations) {
                    let targetDate = consultations[cons].doctor.cpf;
                    if (!res[targetDate]) {
                        res[targetDate] = {
                            doctor: consultations[cons].doctor,
                            numConsultations: 0,
                            numRegress: 0,
                            consultations: []
                        }
                    }
                    if (consultations[cons].type === 'Consulta') res[targetDate].numConsultations += 1;
                    else res[targetDate].numRegress += 1;
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
            patientSelect: function (item) {
                this.$emit('patientSelect', item.user);
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
