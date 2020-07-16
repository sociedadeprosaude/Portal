<template>
        <v-container fluid>
            <v-layout row wrap class="align-center justify-center">
                <v-flex xs12>
                    <v-card>
                        <HeaderTable :specialties="specialties" :doctors="doctors"></HeaderTable>
                        <WeekTable :headers="headers" :items="doctorsMapping"></WeekTable>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
</template>

<script>
    let moment = require('moment');
    import WeekTable from '../../../components/WeeklyTable/WeekTable'
    import HeaderTable from '../../../components/WeeklyTable/HeaderTable'
    export default {
        components:{
            HeaderTable,
            WeekTable
        },
        data: () => ({
            moment: moment,
            //today: '2020-05-16',
            //today: '2020-05-30',
            today: moment().format("YYYY-MM-DD"),
            dialogUpdate:false,
            editDay:{},
            search: undefined,
            headers: [
                {text: 'Hora', value: 'hour', align: 'center', sortable: true},
                {text: 'Segunda', value: 'monday', align: 'center', sortable: false},
                {text: 'Terça', value: 'tuesday', align: 'center', sortable: false},
                {text: 'Quarta', value: 'wednesday', align: 'center', sortable: false},
                {text: 'Quinta', value: 'thursday', align: 'center', sortable: false},
                {text: 'Sexta', value: 'friday', align: 'center', sortable: false},
                {text: 'Sabado', value: 'saturday', align: 'center', sortable: false},
            ],
            dialogRemove:false,
            loading:false,
            scheduleSelected:undefined,
            dayScheduleSelected:undefined,
            specialty:undefined,
            doctor:undefined
        }),
        computed: {
            specialties() {
                let espArray = Object.values(this.$store.getters.specialties);
                /* espArray = espArray.filter(specialty => {
                    if (!this.doctor) {
                    return true;
                    }
                    var find = false;
                    specialty.doctors.forEach(doctor => {
                    if (doctor.cpf === this.doctor.cpf) {
                        find = true;
                        return true;
                    }
                    });

                    return find;
                }); */
                return espArray;
            },

            doctors() {
                let doctors = Object.values(this.$store.getters.doctors);
                /* if (this.specialty) {
                    doctors = doctors.filter(a => {
                    for (let spe in a.specialties) {
                        if (a.specialties[spe].name === this.specialty.name) {
                        return true;
                        }
                    }
                    return false;
                    });
                } */
                return doctors;
            },
            doctorsMapping() {
                var weeklyTable = []
                var currentDate = moment('06:00','hh:mm');
                new Array(23).fill().map((acc, index) => {
                    weeklyTable.push({
                        hour: currentDate.format('HH:mm'),
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    })
                    currentDate = currentDate.add(30, 'minutes');
                })

                let schedules = this.$store.getters.AllSchedules.filter((schedule)=>{
                    if(this.specialty && schedule.specialty && schedule.specialty.name != this.specialty.name)
                        return false
                    if(this.doctor && schedule.doctor.name != this.doctor.name)
                        return false
                    return true
                })

                for (let schedule in schedules) {
                    if(schedules[schedule].cancelations_schedules){
                        for(let canceled in schedules[schedule].cancelations_schedules) {
                            if(this.today > schedules[schedule].cancelations_schedules[canceled].final_date){
                                let deleted = schedules[schedule].cancelations_schedules.shift()
                                this.$store.dispatch('copyCanceledSchedules', {
                                    schedule: schedules[schedule],
                                    cancelations_schedules: deleted,
                                });
                                if( schedules[schedule].cancelations_schedules.length === 0){
                                    delete schedules[schedule].cancelations_schedules
                                }
                                this.$store.dispatch('updateCanceledSchedules', {
                                    cancelations_schedules: schedules[schedule].cancelations_schedules,
                                    id: schedules[schedule].id,
                                    schedule: schedules[schedule],
                                });
                            }
                        }
                    }
                }

                for (let schedule in schedules) {
                    let daysOfTheWeek = schedules[schedule].days
                    for (let dayOfTheWeek in daysOfTheWeek) {
                        for (let weeklyItem in weeklyTable) {
                            if (daysOfTheWeek[dayOfTheWeek].hour === weeklyTable[weeklyItem].hour && dayOfTheWeek === '1') {
                                weeklyTable[weeklyItem].monday.push(schedules[schedule])
                            } else if (daysOfTheWeek[dayOfTheWeek].hour === weeklyTable[weeklyItem].hour && dayOfTheWeek === '2') {
                                weeklyTable[weeklyItem].tuesday.push(schedules[schedule])
                            } else if (daysOfTheWeek[dayOfTheWeek].hour === weeklyTable[weeklyItem].hour && dayOfTheWeek === '3') {
                                weeklyTable[weeklyItem].wednesday.push(schedules[schedule])
                            } else if (daysOfTheWeek[dayOfTheWeek].hour === weeklyTable[weeklyItem].hour && dayOfTheWeek === '4') {
                                weeklyTable[weeklyItem].thursday.push(schedules[schedule])
                            } else if (daysOfTheWeek[dayOfTheWeek].hour === weeklyTable[weeklyItem].hour && dayOfTheWeek === '5') {
                                weeklyTable[weeklyItem].friday.push(schedules[schedule])
                            } else if (daysOfTheWeek[dayOfTheWeek].hour === weeklyTable[weeklyItem].hour && dayOfTheWeek === '6') {
                                weeklyTable[weeklyItem].saturday.push(schedules[schedule])
                            }
                        }
                    }
                }
                return weeklyTable
            },
        },
        mounted() {
            this.$store.dispatch('getAllSchedules');
        },
        methods:{
            openDialoaUpdateDay(schedule,day){
                this.scheduleSelected = schedule
                this.dayScheduleSelected = day
                this.editDay = schedule.days[day]
                this.dialogUpdate = true
            },
            openDialogDelete(schedule,day){
                this.dialogRemove = true
                this.scheduleSelected = schedule
                this.dayScheduleSelected = day
            },
            async removeDay() {
                this.loading = true;
                let copySchedule = Object.assign({}, this.scheduleSelected);
                delete copySchedule.days[this.dayScheduleSelected];
                await this.$store.dispatch("updateScheduleDays", {
                    idSchedule: this.scheduleSelected.id,
                    days: copySchedule.days
                });
                this.loading = false;
                this.dialogRemove = false;
            },
            async updateDay(){
                this.loading = true;
                let copySchedule = Object.assign({}, this.scheduleSelected);
                copySchedule.days[this.dayScheduleSelected] = this.editDay;
                await this.$store.dispatch("updateScheduleDays", {
                    idSchedule: this.scheduleSelected.id,
                    days: copySchedule.days
                });
                this.editDay = {}
                this.loading = false
                this.dialogUpdate = false;
            }
        }
    }
</script>
