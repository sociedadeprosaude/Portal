<template>
  <v-container>
    <v-row class="pa-0 ma-0">
      <v-col class="ma-0" cols="5">
        <span class="display-1 font-weight-medium">Relatórios a partir de</span>
      </v-col>
      <v-col class="pa-0" cols="2">
        <v-menu
        v-model="menu2"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="dateFormatted"
            prepend-icon="event"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="date" @input="menu2 = false"></v-date-picker>
      </v-menu>
      </v-col>
    </v-row>
    <Clients
      :dataset="dataset"
      :date="date2"
      :menu="menu"
      :dateFormatted="dateFormatted2"
      :clientsServed="attendances"
      :clientsServedByHour="attendancesByHour"
      :newClients="newClients"
      :ageClientsServed="ages"
      :genresClientsServed="genres"
      :geopoints="geopoints"
      :generateDatasetServed="generateDatasetServed"
      :generateDatasetServedByHour="generateDatasetServedByHour"
      :generateDatasetNewClients="generateDatasetNewClients"
      :generateDatasetClientsAge="generateDatasetClientsAge"
      :options="options"

       @change-date="(value)=>date=value"
       @change-menu="(value)=>menu=value"
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
    date2: new Date().toISOString().substr(0, 7),
    menu: false,
    menu2:false,
    overlay:false,
    attendances:undefined,
    attendancesByHour:undefined,
    genres:undefined,
    ages:undefined,
    geopoints:undefined,
    newClients: undefined
  }),
  components: {
    Clients,
  },
  mounted() {
    this.date = moment().subtract(7,'days').format('YYYY-MM-DD')
    /* this.initializeData()
    this.$store.dispatch('loadUsersGeopoints') */
  },
  computed: {
    dateFormatted() {
      return this.date ? moment(this.date, "YYYY-MM-DD").format("DD/MM/YYYY") : "";
    },
    dateFormatted2() {
      return this.date2 ? moment(this.date2, "YYYY-MM").format("MMMM/YYYY") : "";
    },
    /* clientsServed:{
      set(value){
        this.attendances = value
      },
      get(){
        return this.attendances
      }
    }, */
    /* newClients() {
      return this.$store.getters.getNewClients;
    }, */
    /* ageClientsServed() {
      let data = this.$store.getters.getAgeClientsServed;
      return this.$store.getters.getAgeClientsServed;
    }, */
    genresClientsServed() {
      let genresObj = this.genres;
      genresObj.male = (genresObj.male/genresObj.total)/100;
      genresObj.feminine = (genresObj.feminine/genresObj.total)/100;
      genresObj.others = (genresObj.others/genresObj.total)/100;
      return genresObj;
    },
    /* usersServed(){
      let complements = this.$store.getters.getUsersServed.map((user)=>[user.addresses[0].street,user.addresses[0].complement].join(" "));
      return complements.reduce((a,b)=>{
        if(a.indexOf(b) == -1)
          a.push(b)
        return a
      },[])
    } */
    /* geopoints() {
      return this.$store.getters.getGeopoints;
    }, */
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
      /* let promise1 = this.$store.dispatch('loadClientsServed',{
        initialDate:this.date,
        finalDate:moment().format("YYYY-MM-DD 23:59:00"),
      })
      let promise2 = this.$store.dispatch('loadNewClients',{
        initialDate:this.date,
        finalDate:moment().format("YYYY-MM-DD 23:59:00"),
      })

      Promise.all([promise1,promise2]).then(()=>{
        this.overlay = false
      }); */
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
            title: (items, data) => "R$ " + items[0],
            label: (items, data) => data,
          },
        },
      };
    },
    formatGenresObject(attendances){
      this.genres = {male: 0, feminine:0, others:0, total:0}
        for (const key in attendances) {
          const attendance = attendances[key];
          for (const key2 in attendance.genres) {
            if (attendance.genres[key2] === 'Masculino'){
              this.genres.male += 1;
            }
            else if(attendance.genres[key2] === 'Feminino'){
              this.genres.feminine += 1;
            }else
              this.genres.others += 1;
            
            this.genres.total += 1;
          }
        }

      
    },
    formartAgesObject(attendances){
      this.ages = {}
        for (const key in attendances) {
          const attendance = attendances[key];
          for (const key2 in attendance.patients_birth_date) {
            const birth_date = moment(attendance.patients_birth_date[key2].formatted,'YYYY-MM-DD');
            const differance = moment().diff(birth_date,'years').toString();
            if(!this.ages[differance]) this.ages[differance] = 0
            this.ages[differance] += 1;
          }
        }
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
        console.log('geopoints', this.geopoints)
    },
    reduceAttendancesByHour(attendances){
      /* return attendances.reduce((obj, attendance)=>{
          const date = moment(attendance.date.formatted).format('DD/MM/YYYY')
          obj[date] = attendance.count
          return obj
      },{}); */
      let attendancesByHour = {};
      for (const key in attendances) {
        for (const key2 in attendances[key].times) {
          
          if(!attendancesByHour[attendances[key].times[key2].hour]) attendancesByHour[attendances[key].times[key2].hour] = 0;
          attendancesByHour[attendances[key].times[key2].hour] += 1;

          console.log(attendancesByHour[attendances[key].times[key2].hour])
        }
      }

      console.log(attendancesByHour)

      return attendancesByHour;
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
        this.attendancesByHour = this.reduceAttendancesByHour(data.attendanceCount);
        this.newClients = this.reduceAttendances(data.createdPatientCount);
        this.formatGenresObject(data.attendanceCount);
        this.formartAgesObject(data.attendanceCount);
        this.formartGeopoints(data.attendanceCountGeopoint)

        this.overlay = false
      }
    }
  }
};
</script>

<style>
</style>