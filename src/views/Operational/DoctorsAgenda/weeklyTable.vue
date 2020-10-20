<template>
  <v-container fluid>
    <v-layout row wrap class="align-center justify-center">
      <v-flex xs12>
        <v-card>
          <HeaderTable
            :specialties="specialties"
            :doctors="doctors"
            @specialtyFilter="specialty = $event"
            @doctorFilter="doctor=$event"
          ></HeaderTable>
          <WeekTable
            :items="doctorsMapping"
            @updateDay="updateDay($event)"
            @removeDay="removeDay($event)"
          ></WeekTable>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
let moment = require("moment");
import WeekTable from "../../../components/doctorsAgenda/WeeklyTable/WeekTable";
import HeaderTable from "../../../components/doctorsAgenda/WeeklyTable/HeaderTable";
export default {
  components: {
    HeaderTable,
    WeekTable
  },
  data: () => ({
    moment: moment,
    today: moment().format("YYYY-MM-DD"),
    dialogUpdate: false,
    search: undefined,
    dialogRemove: false,
    specialty: undefined,
    doctor: undefined
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
      var weeklyTable = [];
      var currentDate = moment("06:00", "hh:mm");
      new Array(23).fill().map((acc, index) => {
        weeklyTable.push({
          hour: currentDate.format("HH:mm"),
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: []
        });
        currentDate = currentDate.add(30, "minutes");
      });

      let schedules = this.$store.getters.AllSchedules.filter(schedule => {
        if (
          this.specialty &&
          schedule.specialty &&
          schedule.specialty.name != this.specialty.name
        )
          return false;
        if (this.doctor && schedule.doctor.name != this.doctor.name)
          return false;
        return true;
      });

      for (let schedule in schedules) {
        if (schedules[schedule].cancelations_schedules) {
          for (let canceled in schedules[schedule].cancelations_schedules) {
            if (
              this.today >
              schedules[schedule].cancelations_schedules[canceled].final_date
            ) {
              let deleted = schedules[schedule].cancelations_schedules.shift();
              this.$store.dispatch("copyCanceledSchedules", {
                schedule: schedules[schedule],
                cancelations_schedules: deleted
              });
              if (schedules[schedule].cancelations_schedules.length === 0) {
                delete schedules[schedule].cancelations_schedules;
              }
              this.$store.dispatch("updateCanceledSchedules", {
                cancelations_schedules:
                  schedules[schedule].cancelations_schedules,
                id: schedules[schedule].id,
                schedule: schedules[schedule]
              });
            }
          }
        }
      }

      for (let schedule in schedules) {
        let daysOfTheWeek = schedules[schedule].days;
        for (let dayOfTheWeek in daysOfTheWeek) {
          for (let weeklyItem in weeklyTable) {
            if (
              daysOfTheWeek[dayOfTheWeek].hour ===
                weeklyTable[weeklyItem].hour &&
              dayOfTheWeek === "1"
            ) {
              weeklyTable[weeklyItem].monday.push(schedules[schedule]);
            } else if (
              daysOfTheWeek[dayOfTheWeek].hour ===
                weeklyTable[weeklyItem].hour &&
              dayOfTheWeek === "2"
            ) {
              weeklyTable[weeklyItem].tuesday.push(schedules[schedule]);
            } else if (
              daysOfTheWeek[dayOfTheWeek].hour ===
                weeklyTable[weeklyItem].hour &&
              dayOfTheWeek === "3"
            ) {
              weeklyTable[weeklyItem].wednesday.push(schedules[schedule]);
            } else if (
              daysOfTheWeek[dayOfTheWeek].hour ===
                weeklyTable[weeklyItem].hour &&
              dayOfTheWeek === "4"
            ) {
              weeklyTable[weeklyItem].thursday.push(schedules[schedule]);
            } else if (
              daysOfTheWeek[dayOfTheWeek].hour ===
                weeklyTable[weeklyItem].hour &&
              dayOfTheWeek === "5"
            ) {
              weeklyTable[weeklyItem].friday.push(schedules[schedule]);
            } else if (
              daysOfTheWeek[dayOfTheWeek].hour ===
                weeklyTable[weeklyItem].hour &&
              dayOfTheWeek === "6"
            ) {
              weeklyTable[weeklyItem].saturday.push(schedules[schedule]);
            }
          }
        }
      }
      return weeklyTable;
    }
  },
  mounted() {
    this.$store.dispatch("getAllSchedules");
  },
  methods: {
    async removeDay(payload) {
      let copySchedule = Object.assign({}, payload.scheduleSelected);
      delete copySchedule.days[payload.dayScheduleSelected];
      await this.$store.dispatch("updateScheduleDays", {
        idSchedule: payload.scheduleSelected.id,
        days: copySchedule.days
      });
    },
    async updateDay(payload) {
      let copySchedule = Object.assign({}, payload.scheduleSelected);
      copySchedule.days[this.dayScheduleSelected] = payload.editDay;
      await this.$store.dispatch("updateScheduleDays", {
        idSchedule: payload.scheduleSelected.id,
        days: copySchedule.days
      });
    }
  }
};
</script>
