<template>
  <v-container>
    <Clients
      :dataset="dataset"
      :clientsServed="clientsServed"
      :newClients="newClients"
      :ageClientsServed="ageClientsServed"
      :genderClientsServed="genderClientsServed"
      :generateDatasetServed="generateDatasetServed"
      :generateDatasetNewClients="generateDatasetNewClients"
      :generateDatasetClientsAge="generateDatasetClientsAge"
      :options="options"
    />
  </v-container>
</template>

<script>
import Clients from "@/components/Reports/Clients";
import moment from "moment";
export default {
  data: () => ({
    dataset: null
  }),
  components: {
    Clients
  },
  mounted() {},
  computed: {
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
    }
  },
  methods: {
    generateDatasetServed(dataset) {
      return {
        labels: Object.keys(dataset),
        datasets: [
          {
            label: "Novos clientes",
            backgroundColor: "#81C784",
            borderColor: "#fff",
            data: Object.values(dataset)
          }
        ]
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
            data: Object.values(dataset)
          }
        ]
      };
    },
    generateDatasetClientsAge(dataset) {
      console.log("labes->", Object.keys(dataset));
      console.log("values->", Object.values(dataset));
      return {
        labels: Object.keys(dataset),
        datasets: [
          {
            label: "Idade dos clientes",
            backgroundColor: "#0288D1",
            borderColor: "#fff",
            data: Object.values(dataset)
          }
        ]
      };
    },
    options() {
      return {
        legend: {
          display: true
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false
              }
            }
          ],
          yAxes: [
            {
              gridLines: {
                display: false
              }
            }
          ]
        },
        tooltips: {
          enabled: true,
          callbacks: {
            title: (items, data) => "R$ " + items[0],
            label: (items, data) => data
          }
        }
      };
    }
  }
};
</script>

<style>
</style>