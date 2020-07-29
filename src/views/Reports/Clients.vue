<template>
  <v-container>
    <Clients
      :dataset="dataset"
      :date="date"
      :menu="menu"
      :dateFormatted="dateFormatted"
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
  </v-container>
</template>

<script>
import Clients from "@/components/Reports/Clients";
import moment from "moment";
export default {
  data: () => ({
    dataset: null,
    date: new Date().toISOString().substr(0, 7),
    menu: false,
  }),
  components: {
    Clients,
  },
  mounted() {
    //this.$store.dispatch('setGeopointsClients')
  },
  computed: {
    dateFormatted() {
      return this.date ? moment(this.date, "YYYY-MM").format("MMMM/YYYY") : "";
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
  methods: {
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