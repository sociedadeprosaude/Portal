<template>
    <v-container>
        <v-layout column>
            <v-flex sm12>
                <DataDoctorToSearchConsultation/>
            </v-flex>
            <v-flex xs12 class="mt-4">
                <v-date-picker
                        class="mx-2"
                        v-model="date"
                        locale="pt-br"
                        :allowed-dates="allowedDates"
                />
            </v-flex>
            <v-flex sm12 class="text-center mt-8 ml-2"  >
                <CardPatient ref="patientCard" max-width="300px"/>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
    import DataDoctorToSearchConsultation from "../doctorsAgenda/DataDoctorToSearchConsultation"
    import CardPatient from "../Patient/DataPatient"

    let moment = require("moment/moment");

    export default {
        components: {DataDoctorToSearchConsultation, CardPatient},
        data: () => ({

            date: moment().format("YYYY-MM-DD"),

        }),

        async mounted()  {
             await this.$store.dispatch(
                "getSchedules",
                {
                    start_date: moment()
                        .subtract(5, "hours")
                        .format("YYYY-MM-DD HH:mm:ss"),
                    final_date: moment()
                        .add(this.daysToListen, "days")
                        .format("YYYY-MM-DD 23:59:59")
                }
            );
        },

        watch: {

            date (val) {
                if (val === this.consultations[0].date) this.$vuetify.goTo(0, this.options);
                else this.$vuetify.goTo("#group-" + val, this.options);
            },
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

            options() {
                return {
                    duration: 500,
                    offset: 80,
                    easing: "easeInQuint",
                };
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
                    if (this.doctor) {
                        if (this.doctor.cpf !== a.doctor.cpf) return  false;
                    }
                    if (this.specialty) {
                        if (this.specialty.name !== a.specialty.name) return false;
                    }
                    if (this.clinic) {
                        if (this.clinic !== a.clinic.name) return false;
                    }
                    return true;
                });
            }



        },

        methods: {

            allowedDates(val) {
                return (
                    Object.keys(this.consultationsDateFilter(this.consultations)).indexOf(val) !== -1
                );
            },

            consultationsDateFilter (consultations) {
                console.log('consultation : ', consultations)


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
                console.log('res: ', res)
                return res;
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


        }
    }

</script>