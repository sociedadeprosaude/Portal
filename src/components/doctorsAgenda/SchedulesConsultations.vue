<template>
    <v-container>
        <v-layout row wrap style="width:100%"
                  class="align-center justify-center py-0"
                  v-for="(scheduleGroup, i) in consultationsByDate(schedules)"
                  :key="i">
            <v-flex xs12 class="align-start justify-start">
                <div v-bind:id="'group-' + i" class="text-left">
                    <span class="my-sub-headline primary--text">{{i | dateFilter}} - {{dayDate(i)}}</span>
                    <v-divider class="primary"/>
                </div>
            </v-flex>
            <v-container fluid grid-list-sm class="py-0 my-3 mx-2">
                <v-layout row wrap>
                    <v-flex v-for="(schedule, j) in scheduleGroup" :key="j" sm12 xs12 class="px-2 py-2">
                        <v-card class="pa-4" style="border-radius:20px; height: 100%">
                            <v-layout>
                                <v-layout row wrap>
                                    <v-flex xs12 class="text-left">
                                        <v-layout row wrap>
                                            <span class="subheading font-weight-bold">{{schedule.doctor.name}}</span>
                                            <span class="font-weight-bold mx-2">-</span>
                                            <span class="font-weight-bold subheading">
                                                    {{schedule.specialty.name}}
                                            </span>
                                            <v-spacer/>
                                            <v-chip color="primary_dark" class="mb-2" small text-color="white">{{schedule.clinic.name}}</v-chip>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex xs12 class="mb-1">
                                        <v-divider/>
                                    </v-flex>
                                    <v-flex class="my-0" xs12>
                                        <v-layout row wrap class="text-left font-weight-bold">
                                            <v-flex xs12>
                                                <v-chip small class="mx-2" color="primary_dark" text-color="white">{{schedule.date.split(' ')[1]}}
                                                </v-chip>
                                                <v-chip small color="primary_dark" text-color="white">
                                                    Vagas :
                                                    {{schedule.vacancy}}
                                                </v-chip>
                                                <v-chip small class="mx-2" color="primary_dark" text-color="white">
                                                    Consultas :
                                                    {{schedule.qtd_consultations ? schedule.qtd_consultations : 0}}
                                                </v-chip>
                                                <v-chip class="mx-2" small color="primary_dark" text-color="white">
                                                    Retornos :
                                                    {{schedule.qtd_returns ? schedule.qtd_returns : 0}}
                                                </v-chip>
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex xs12 class="text-right">
                                        <v-fade-transition>
                                            <v-btn v-if="isOnline"
                                                   rounded
                                                   small
                                                   color="primary_dark white--text"
                                                   class="mx-0"
                                                   :disabled="schedule.vacancy === 0"
                                                   @click="scheduleAppointment(schedule)"
                                            >Agendar
                                            </v-btn>
                                            <v-btn v-else
                                                   rounded
                                                   small
                                                   color="grey"
                                                   class="mx-0"
                                            >Sem conexão
                                            </v-btn>
                                        </v-fade-transition>
                                    </v-flex>
                                </v-layout>
                            </v-layout>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-layout>
    </v-container>
</template>
<script>

    let moment = require("moment/moment");

    export default {
        props:['Consultations'],
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

        watch: {
            doctor () {
                return this.$store.getters.doctorSelected
            },

            clinic () {
                return this.$store.getters.selectedClinic
            },

            specialty () {
                return this.$store.getters.selectedSpecialty
            },

        },

        computed: {

            doctor () {
                return this.$store.getters.doctorSelected;
            },

            clinic () {
                return this.$store.getters.selectedClinic
            },

            specialty () {
                return this.$store.getters.selectedSpecialty
            },

            isOnline() {
                return this.$store.getters.isOnline
            },

            schedules() {
                let schedules = this.$store.getters.schedules.filter(a => {
                    let response = true;
                    if (this.doctor) {
                        if (this.doctor.cpf !== a.doctor.cpf) response = false;
                    }
                    if (this.specialty) {
                        if (this.specialty.name !== a.specialty.name) response = false;
                    }
                    if (this.clinic) {
                        if (this.clinic !== a.clinic.name) response = false;
                    }
                    return response;
                });
                return this.consultationsOfSchedules(schedules);
            },

            consultations () {
                return this.$store.getters.consultations.filter(a => {
                    let response = true;
                    if (this.doctor) {
                        if (this.doctor.cpf !== a.doctor.cpf) response = false;
                    }
                    if (this.specialty) {
                        if (this.specialty.name !== a.specialty.name) response = false;
                    }
                    if (this.clinic) {
                        if (this.clinic !== a.clinic.name) response = false;
                    }
                    return response;
                });
            }
        },

        methods: {



            dayDate(date) {
                let dateMoment = moment(date);
                return this.semanaOptions[dateMoment.day()];
            },

            datesOfInterval(payload) {
                let weekDays = payload.weekDays;
                let startDate = moment();
                let dates = [];
                weekDays = weekDays.map((day)=>{ return Number(day)});
                let day = startDate;
                for (let i = 0; i < 3; i++) {
                    if (weekDays.indexOf(day.weekday()) > -1 ) {
                        dates.push(day.format('YYYY-MM-DD'))
                    }
                    day = startDate.add(1, 'days');
                }
                return dates
            },

            consultationsOfSchedules(schedules){
                let consultations = [];
                schedules.forEach((schedule)=>{
                    let keys = Object.keys(schedule.days);
                    let dates = this.datesOfInterval({weekDays:keys});

                    dates.forEach((date)=>{
                        let hourConsultation = schedule.days[moment(date).weekday()].hour;
                        if(schedule.cancelations_schedules.indexOf(date) === -1 && schedule.cancelations_schedules.indexOf(date + ' ' +hourConsultation) === -1){
                            let scheduleObj = {
                                clinic: schedule.clinic,
                                doctor: schedule.doctor,
                                date: date + ' ' + hourConsultation,
                                routine_id : schedule.routine_id,
                                specialty: schedule.specialty,
                                vacancy: schedule.days[moment(date).weekday()].vacancy,
                                id_schedule: schedule.id,

                            };
                            let obj = {...scheduleObj,...this.numberVacancyAndReturns(scheduleObj)}
                            obj.vacancy = obj.vacancy - obj.qtd_consultations - obj.qtd_returns
                            consultations.push(obj)
                        }
                    })
                });
                return consultations
            },

            numberVacancyAndReturns(schedule) {
                let consultations = this.consultations;
                return consultations.reduce((obj,item)=>{

                    if (schedule.clinic.name === item.clinic.name && schedule.specialty.name === item.specialty.name
                        && schedule.doctor.cpf === item.doctor.cpf && schedule.date === item.date  && item.user){
                        if (item.type === 'Consulta') {
                            obj.qtd_consultations = obj.qtd_consultations +  1
                        } else
                            obj.qtd_returns += 1
                    }
                    return obj
                },{qtd_consultations:0,qtd_returns:0})
            },

            consultationsByDate(consultations) {
                let res = {};
                consultations.sort((a,b)=>{
                    return a.date > b.date ? 1 : a.date < b.date ? -1 : 0
                });
                for (let cons in consultations) {
                    let targetDate = consultations[cons].date.split(" ")[0];
                    if (!res[targetDate]) {
                        res[targetDate] = [];
                    }
                    res[targetDate].push(consultations[cons]);
                }
                return res;
            },
        }
    }

</script>