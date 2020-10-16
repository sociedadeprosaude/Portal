<template>
  <v-container fluid>
    <v-layout row wrap class="align-center justify-center">
      <v-flex xs12>
        <v-card>
          <HeaderTable
            :doctors="doctors"
            @specialtyFilter="product = $event"
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
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
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
    product: undefined,
    doctor: undefined,
    schedules: [],
    overlay:true
  }),
  watch:{
    product(value){
      
    }
  },
  computed: {
    doctors() {
      let doctors = [];
      if(this.product)
        doctors = this.product.doctors
      return doctors;
    },
    doctorsMapping() {
      let schedules = Object.assign([],this.schedules);
      
      if(this.product){
        schedules = schedules.filter(schedule=> schedule.product && schedule.product.id === this.product.id)
      }

      if(this.doctor){
        schedules = schedules.filter(schedule=> schedule.doctor && schedule.doctor.id === this.doctor.id)
      }

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
      console.log(payload)
      let variables = {
          idDay: payload.editDay.id,
          vacancy: Number(payload.editDay.vacancy),
      }

      /*if(payload.editDay.expiration_date){
        variables.expiration_date = {
          formatted:payload.editDay.expiration_date
        }
      } */

      await this.$apollo.mutate({
        mutation: require('@/graphql/schedules/UpdateDaySchedule.gql'),
        variables:variables
      })
    }
  },
  apollo: {
    loadSchedules: {
      query: require("@/graphql/schedules/LoadSchedules.gql"),
      update(data) {
        this.schedules = data.Schedule 
        /* if(this.filterExams) 
          this.schedules = data.Schedule.filter(schedule => schedule.product && schedule.product.type === 'EXAM')
        else
          this.schedules = data.Schedule.filter(schedule => schedule.product && schedule.product.type === 'SPECIALTY')
        */
        
        this.overlay = false
  
      }
    }
  }
};
</script>
