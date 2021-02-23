<template>
  <v-container class="align-start">
    <v-layout column>
      <v-flex sm12>
        <DataDoctorToSearchConsultation 
          @selectExamTypeCheck="filterExams=$event"
          @selectExamType="selectedProduct=$event"
          @selectSpecialty="selectedProduct=$event"
          @selectDoctor="selectedDoctor=$event"
          @selectClinic="selectedClinic=$event"
        />
      </v-flex>
      <v-flex xs12 class="justify-start text-left">
        <v-tooltip right color="white">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" icon fab small @click="showCalendar = !showCalendar" color="background" dark>
              <v-icon v-if="showCalendar">close</v-icon>
              <v-icon v-else>date_range</v-icon>
            </v-btn>
          </template>
          <span style="color: #003B8F; font-weight: bold">Calendário</span>
        </v-tooltip>
      </v-flex>
      <v-flex class="mt-4" sm12>
        <CardPatient ref="patientCard"/>
      </v-flex>
      <v-flex sm12 class="mt-4">
        <FavoriteRoom/>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import DataDoctorToSearchConsultation from "../doctorsAgenda/DataDoctorToSearchConsultation"
import CardPatient from "../Patient/DataPatient"
import FavoriteRoom from "../tickets/FavoriteRoom"

let moment = require("moment/moment");

export default {
  components: {DataDoctorToSearchConsultation, CardPatient, FavoriteRoom},
  props: ['daysToListen'],

  data: () => ({
    showCalendar: false,
    date: moment().format("YYYY-MM-DD"),
    consultationsListenerUnsubscriber: undefined,
    schedules:[],
    filterExams:false,
    selectedProduct:undefined,
    selectedDoctor:undefined,
    selectedClinic:undefined
  }),

  async mounted() {
    this.showCalendar = true;
    this.showCalendar = false;
  },


  watch: {

    date(val) {
      if (val === this.schedules[0].date) this.$vuetify.goTo(0, this.options);
      else this.$vuetify.goTo("#group-" + val, this.options);
    },

    changeData: {
      handler: function() {
        this.$emit('loading',true)
        this.$apollo.queries.loadSchedules.refresh()
      },
      deep: true
    },

    daysToListen(){
      this.consultationsByDate(this.schedules)
    },

  },

  computed: {

    changeData() {
      const { selectedProduct, selectedDoctor, selectedClinic, filterExams} = this
      
      return {
        selectedProduct,
        selectedDoctor, 
        selectedClinic, 
        filterExams
      }
    },    

    options() {
      return {
        duration: 500,
        offset: 80,
        easing: "easeInQuint",
      };
    },

    selectedPatient() {
      return this.$store.getters.selectedPatient;
    },

  },

  methods: {

    async listenConsultations() {
     
    },

    allowedDates(val) {
      return (
          Object.keys(this.consultationsByDate(this.schedules)).indexOf(val) !== -1
      );
    },

    consultationsByDate(schedules) {
      let consultations = this.consultationsOfSchedules(schedules)
      let res = {};
      consultations.sort((a, b) => {
        return a.date > b.date ? 1 : a.date < b.date ? -1 : 0
      });
      for (let cons in consultations) {
        let targetDate = consultations[cons].date.split(" ")[0];
        if (!res[targetDate]) {
          res[targetDate] = [];
        }
        res[targetDate].push(consultations[cons]);
      }
      this.$emit('GetConsultations', res);
      return res;
    },

    consultationsOfSchedules(schedules) {
      let consultations = [];
      schedules.forEach((schedule) => {
        //let keys = Object.keys(schedule.days);
        if (schedule.days && schedule.product && schedule.doctor) {
          let dates = this.datesOfInterval({days: schedule.days});
          dates.forEach((date) => {
            let findDay = schedule.days.find(day => Number(day.day) == moment(date).weekday())
            let hourConsultation = findDay.hour;
            if (!this.dateIsInCancledPeriod(schedule,date)) {
              let scheduleObj = {
                clinic: schedule.clinic,
                doctor: schedule.doctor,
                date: date + ' ' + hourConsultation,
                interval: schedule.interval,
                routine_id: schedule.routine_id,
                vacancy: findDay.vacancy,
                id_schedule: schedule.id,
                product:schedule.product,
                observations:schedule.observations
              };
              
              const consultationsOfDay = schedule.consultations.filter(consultation => {
                
                //console.log(moment.parseZone(consultation.date.formatted, 'YYYY-MM-DD HH:mmZ').isSame(moment(scheduleObj.date)))
                return moment(consultation.date.formatted,'YYYY-MM-DD HH:mmZ').utc().format('YYYY-MM-DD HH:mm') === scheduleObj.date
              })
              const qtd_returns = consultationsOfDay.filter(consultation => consultation.type === "Retorno").length
              const qtd_consultations = consultationsOfDay.length - qtd_returns;
              const obj = {...scheduleObj,qtd_consultations, qtd_returns};
              obj.vacancy = obj.vacancy - obj.qtd_consultations - obj.qtd_returns;
              consultations.push(obj)
            }
          })
        }
      });
      return consultations
    },

    datesOfInterval(payload) {
      let days = payload.days
      let weekDays //= Object.keys(days);
      let startDate = moment();
      let dates = [];
      weekDays = days.map((day) => {
        return Number(day.day)
      });
      let day = startDate;
      for (let i = 0; i < this.daysToListen; i++) {
        let expiration_date = days[day.weekday().toString()] ? days[day.weekday().toString()].expiration_date.formatted : undefined
        if (weekDays.indexOf(day.weekday()) > -1 && (!expiration_date || day.isSameOrBefore(moment(expiration_date, 'YYYY-MM-DD')))) {
          dates.push(day.format('YYYY-MM-DD'))
        }
        day = startDate.add(1, 'days');
      }
      return dates
    },
    dateIsInCancledPeriod(schedule,date){
      const foundCanceledPeriod = schedule.canceled_periods.find((period)=>{
        return moment(date).isSameOrAfter(period.start_date.formatted) && moment(date).isSameOrBefore(period.final_date.formatted)
      });

      return foundCanceledPeriod;
    }
  },
  apollo: {
    loadSchedules: {
      query: require("@/graphql/schedules/LoadSchedules.gql"),
      update(data) {
        if(this.filterExams) 
          this.schedules = data.Schedule.filter(schedule => schedule.product && schedule.product.type === 'EXAM')
        else
          this.schedules = data.Schedule.filter(schedule => schedule.product && schedule.product.type === 'SPECIALTY')

        if(this.selectedProduct)
          this.schedules = this.schedules.filter(schedule=> schedule.product && schedule.product.id === this.selectedProduct.id)
        
        if(this.selectedDoctor)
          this.schedules = this.schedules.filter(schedule=> schedule.doctor && schedule.doctor.id === this.selectedDoctor.id)

        if(this.selectedClinic)
          this.schedules = this.schedules.filter(schedule=> schedule.clinic && schedule.clinic.id === this.selectedClinic.id)
        this.consultationsByDate(this.schedules)
        this.$emit('loading',false)
      }
    },
  }
}

</script>
