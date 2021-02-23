<template>
  <v-container>
    <v-row class="pa-0 ma-0">
        <span class="display-1 font-weight-medium">Relatórios de Atendimento</span>
    </v-row>
    <Clients
      :dataset="dataset"
      :menu="menu"
      :clientsServed="attendances"
      :clientsServedByHour="attendancesByHour"
      :newClients="newClients"
      :ageClientsServed="ages"
      :genresClientsServed="genres"
      :geopoints="geopoints"
      :clientsServedByWeekDay="attendancesByWeekDay"
      :generateDatasetServed="generateDatasetServed"
      :generateDatasetServedByHour="generateDatasetServedByHour"
      :generateDatasetNewClients="generateDatasetNewClients"
      :generateDatasetClientsAge="generateDatasetClientsAge"
      :generateDatasetClientsWeekDay="generateDatasetServedByWeekDay"
      :options="options"
      @changeDateReport="date=$event"
    />
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
import Clients from "@/components/Reports/Clients";
import moment from "moment";
export default {
  data: () => ({
    dataset: null,
    date: '',
    menu: false,
    menu2:false,
    overlay:false,
    attendances:undefined,
    attendancesByHour:undefined,
    genres:undefined,
    ages:undefined,
    geopoints:undefined,
    newClients: undefined,
    attendancesByWeekDay: undefined,
    weekdays:['Domingo','Segunda','Terça-feira','Quarta-feita','Quinta-feira','Sexta','Sábado']
  }),
  components: {
    Clients,
  },
  mounted() {
    this.date = moment().subtract(7,'days').format('YYYY-MM-DD')
  },
  computed: {
    genresClientsServed() {
      let genresObj = this.genres;
      genresObj.male = (genresObj.male/genresObj.total)/100;
      genresObj.feminine = (genresObj.feminine/genresObj.total)/100;
      genresObj.others = (genresObj.others/genresObj.total)/100;
      return genresObj;
    },
  },
  watch:{
    date(value){
      if(value)
        this.initializeData()
    }
  },
  methods: {
    initializeData(){
      this.overlay = true
    },
    generateDatasetServed(dataset) {
      return {
        labels: Object.keys(dataset),
        datasets: [
          {
            //lineTension:0,

            label: "Clientes Atendidos",
            backgroundColor: "#81C784",
            borderColor: "#fff",
            data: Object.values(dataset),
          },
        ],
      };
    },
    generateDatasetServedByHour(dataset) {
      return {
        labels: Object.keys(dataset).map((hour) => `${hour} horas`),
        datasets: [
          {
            //lineTension:0,

            label: "Clientes Atendidos por Hora",
            backgroundColor: "#81C784",
            borderColor: "#fff",
            data: Object.values(dataset),
          },
        ],
      };
    },

    generateDatasetServedByWeekDay(dataset) {
      return {
        labels: Object.keys(dataset),
        datasets: [
          {
            //lineTension:0,

            label: "Dia da semana com fluxo de atendimento",
            backgroundColor: "#81C784",
            borderColor: "#fff",
            data: Object.values(dataset),
          },
        ],
      };
    },
    generateDatasetNewClients(dataset) {
      return {
        labels: Object.keys(dataset),
        datasets: [
          {
            label: "Novos clientes",
            backgroundColor: "#81C784",
            borderColor: "#fff",
            data: Object.values(dataset),
          },
        ],
      };
    },
    generateDatasetClientsAge(dataset) {
      return {
        labels: Object.keys(dataset),
        datasets: [
          {
            label: "Idade dos clientes",
            backgroundColor: "#0288D1",
            borderColor: "#fff",
            data: Object.values(dataset),
          },
        ],
      };
    },
    options() {
      return {
        legend: {
          display: true,
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false,
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                display: false,
              },
            },
          ],
        },
        tooltips: {
          enabled: true,
          callbacks: {
            title: (items) => "R$ " + items[0],
            label: (items, data) => data,
          },
        },
      };
    },
    formatGenresObject(genresPatients){
      this.genres = {male: 0, feminine:0, others:0, total:0}
      for (const key in genresPatients) {
          const genre = genresPatients[key];
          if (genre.sex === 'Masculino'){
              this.genres.male = genre.count;
          }
          else if(genre.sex === 'Feminino'){
            this.genres.feminine = genre.count;
          }else
            this.genres.others = genre.count;
            
          this.genres.total += genre.count;
      }

      this.genres.male = (this.genres.male/this.genres.total) * 100;
      this.genres.feminine = (this.genres.feminine/this.genres.total) * 100;
      this.genres.others = (this.genres.others/this.genres.total) * 100;
    },
    formartAgesObject(agesPatients){
      this.ages = agesPatients.reduce((obj, agePatient)=>{
        if(agePatient.age >= 0 && agePatient.age <= 120)
          obj[agePatient.age] = agePatient.count;

        return obj
      },{});
    },
    formartGeopoints(attendances){
      this.geopoints = []
        for (const key in attendances) {
          const attendance = attendances[key];
          for (const key2 in attendance.geopoints) {
            const geopoint = attendance.geopoints[key2];
            const foundIndex = this.geopoints.findIndex((value) => value.latitude === geopoint.latitude && value.longitude === geopoint.longitude)
            if(foundIndex === -1) this.geopoints.push({...geopoint, count: 1});
            else this.geopoints[foundIndex].count += 1;
          }
        }
    },
    reduceAttendancesByHour(attendances){
      let attendancesByHour = attendances.reduce((obj, attendance)=>{
        let hour = attendance.hour.split(':');
        obj[`${hour[0]}:${hour[1]}`] = attendance.count;

        return obj
      },{});

      return attendancesByHour;
    },

    reduceAttendancesByWeekDay(attendances){
      let attendancesByWeekDay = attendances.reduce((obj, attendance)=>{
        obj[this.weekdays[attendance.weekday]] = attendance.count;

        return obj
      },{});

      return attendancesByWeekDay;
    },
    reduceAttendances(attendances){
      return attendances.reduce((obj, attendance)=>{
          const date = moment(attendance.date.formatted).format('DD/MM/YYYY')
          obj[date] = attendance.count
          return obj
      },{})
    }
  },
  apollo:{
    loadAttendanceCount:{
      query: require("@/graphql/patients/LoadAttendanceCount.gql"),
      variables(){
        return {
          start_date:this.date,
          final_date:`${moment().format('YYYY-MM-DD')}`
        }
      },
      update(data){
        this.attendances = this.reduceAttendances(data.attendanceCount);
        this.attendancesByHour = this.reduceAttendancesByHour(data.attendanceCountHours);
        this.attendancesByWeekDay = this.reduceAttendancesByWeekDay(data.attendanceCountWeekDay);
        this.newClients = this.reduceAttendances(data.createdPatientCount);
        this.formatGenresObject(data.attendanceCountGenres);
        this.formartAgesObject(data.attendanceCountAges);
        this.formartGeopoints(data.attendanceCountGeopoint)

        this.overlay = false
      }
    }
  }
};
</script>

<style>
</style>