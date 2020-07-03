<template>
  <v-container>
    <v-row class="mt-2">
      <h1>Clientes</h1>
    </v-row>
    <v-row>
      <v-col>
        <v-card elevation="0">
          <v-row v-if="clientsServed">
            <v-col>
              <line-chart :chart-data="generateDatasetServed(clientsServed)" :options="options"  ></line-chart>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <h1>Novos Clientes</h1>
    </v-row>
    <v-row>
      <v-col>
        <v-card elevation="0">
          <v-row v-if="newClients">
            <v-col>
              <line-chart :chart-data="generateDatasetNewClients(newClients)" :options="options"  ></line-chart>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <h1>Idade dos visitantes</h1>
    </v-row>
    <v-row>
      <v-col>
        <v-card elevation="0">
          <v-row v-if="ageClientsServed">
            <v-col>
              <line-chart :chart-data="generateDatasetClientsAge(ageClientsServed)" :options="options"  ></line-chart>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LineChart from "@/components/Charts/LineChart";
import moment from 'moment';
export default {
    data: ()=>({
        dataset:null
    }),
    components:{
        LineChart
    },
    mounted(){
       console.log('minha idade',moment().diff(moment('1996-09-13'),'years')) 
    },
    computed:{
        clientsServed(){
            return this.$store.getters.getClientsServed
        },
        newClients(){
            return this.$store.getters.getNewClients
        },
        ageClientsServed(){
            let data = this.$store.getters.getAgeClientsServed
            console.log('ages',data)
            return this.$store.getters.getAgeClientsServed
        }
    },
    methods:{
        generateDatasetServed(dataset) {
            return {
                labels: Object.keys(dataset),
                datasets: [{
                    label: 'Novos clientes',
                    backgroundColor: '#81C784',
                    borderColor: '#fff',
                    data: Object.values(dataset)
                }]
            }
        },
        generateDatasetNewClients(dataset) {
            return {
                labels: Object.keys(dataset),
                datasets: [{
                    label: 'Novos clientes',
                    backgroundColor: '#81C784',
                    borderColor: '#fff',
                    data: Object.values(dataset)
                }]
            }
        },
        generateDatasetClientsAge(dataset) {
            console.log('labes->',Object.keys(dataset))
            console.log('values->',Object.values(dataset))
            return {
                labels: Object.keys(dataset),
                datasets: [{
                    label: 'Idade dos clientes',
                    backgroundColor: '#81C784',
                    borderColor: '#fff',
                    data: Object.values(dataset)
                }]
            }
        },
        options() {
            return {
                legend: {
                    display: true
                },
                scales: {
                    xAxes: [{
                        gridLines: {
                            display:false
                        }
                    }],
                    yAxes: [{
                        gridLines: {
                            display:false
                        }   
                    }]
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
}
</script>

<style>

</style>