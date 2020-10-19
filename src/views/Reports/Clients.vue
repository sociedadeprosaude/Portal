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
      :clientsServed="clientsServed"
      :newClients="newClients"
      :ageClientsServed="ageClientsServed"
      :genderClientsServed="genderClientsServed"
      :geopoints="geopoints"
      :generateDatasetServed="generateDatasetServed"
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
    overlay:false
  }),
  components: {
    Clients,
  },
  mounted() {
    this.date = moment().subtract(7,'days').format('YYYY-MM-DD')
    this.initializeData()
    this.$store.dispatch('loadUsersGeopoints')
  },
  computed: {
    dateFormatted() {
      return this.date ? moment(this.date, "YYYY-MM-DD").format("DD/MM/YYYY") : "";
    },
    dateFormatted2() {
      return this.date2 ? moment(this.date2, "YYYY-MM").format("MMMM/YYYY") : "";
    },
    clientsServed() {
      return this.$store.getters.getClientsServed;
    },
    newClients() {
      return this.$store.getters.getNewClients;
    },
    ageClientsServed() {
      let data = this.$store.getters.getAgeClientsServed;
      return this.$store.getters.getAgeClientsServed;
    },
    genderClientsServed() {
      return this.$store.getters.getGenderClientsServed;
    },
    /* usersServed(){
      let complements = this.$store.getters.getUsersServed.map((user)=>[user.addresses[0].street,user.addresses[0].complement].join(" "));
      return complements.reduce((a,b)=>{
        if(a.indexOf(b) == -1)
          a.push(b)
        return a
      },[])
    } */
    geopoints() {
      return this.$store.getters.getGeopoints;
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
      let promise1 = this.$store.dispatch('loadClientsServed',{
        initialDate:this.date,
        finalDate:moment().format("YYYY-MM-DD 23:59:00"),
      })
      let promise2 = this.$store.dispatch('loadNewClients',{
        initialDate:this.date,
        finalDate:moment().format("YYYY-MM-DD 23:59:00"),
      })

      Promise.all([promise1,promise2]).then(()=>{
        this.overlay = false
      });
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
  },
};
</script>

<style>
</style>