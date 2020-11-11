<template>
  <v-container fluid v-if="bairrosPrint.length !== 0">
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <MiniStatistic icon="mdi-counter" :title="Patient.length.toString()" sub-title="Nº Pacientes" color="blue" />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <MiniStatistic icon="mdi-counter" :title="NumPatientsNotAddress.toString()" sub-title="Nº Pacientes sem endereço" color="blue" />
      </v-col> <v-col cols="12" sm="6" md="3">
      <MiniStatistic icon="mdi-counter" :title="NumPatientsAddress.toString()" sub-title="Nº Pacientes com endereço" color="blue" />
    </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <h1>Bairro</h1>
        <v-card>
          <v-card-text>
            <div v-for="(item,i) in bairrosPrint" :key="i">
              <v-row>
                <v-col>
                  <span class="ml-auto font-weight-bold">{{item.name}}</span>
                </v-col>
                <v-col>
                  <span class="ml-auto font-weight-bold">Pacientes: {{item.patients}}</span>
                </v-col>
              </v-row>
              <v-divider />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <!--<v-col cols="12" md="6">
        <h1>Bairros</h1>
        <v-card elevation="0">
          <pie-chart
              :chart-data="BairrosDataset"
          ></pie-chart>
        </v-card>
      </v-col> -->
    </v-row>
  </v-container>
  <v-container v-else >
    <p>Carregando Bairros, isso pode demorar um pouco</p>
    <v-progress-circular indeterminate size="64">
    </v-progress-circular>
  </v-container>
</template>

<script>
import PieChart from "@/components/Charts/PieChart";
import MiniStatistic from "@/components/MiniStatistic";
import moment from 'moment'
export default {
  components: {
    MiniStatistic,
    PieChart
  },
  props: [
      "Patient",
      "NumPatientsNotAddress",
      "NumPatientsAddress",
      "Bairros",
  ],
  data: vm => ({
    bairrosLocale: [],
    bairrosPrint: ''
  }),
  mounted() {
    this.Bairro(this.Bairros)
    },
  computed:{
    BairrosDataset() {
      return {
        labels: Object.keys(this.bairrosLocale),
        datasets: [
          {
            data: Object.keys(this.bairrosPrint).map(
                key => this.bairrosPrint[key].patients
            )
          }
        ]
      };
    },
  },
  methods:{
    date(date){
      return moment(date).format('DD/MM/YYYY')
    },
    async Bairro(Bairros){
      let Bairro= []
      let mostrar = []
      await Bairros.then(
          function (result){
            console.log('result: ',result)
            let j=0
            for(let i in result){
              mostrar[j] = {
                patients: result[i].patients,
                name: result[i].name
              }
                Bairro[i]={
                  patients: result[i].patients,
                  name: result[i].name
              }
              j++
            }
          }
      )
      this.bairrosLocale = Bairro
      this.bairrosPrint= mostrar
      this.bairrosPrint.sort(function(a,b) {
        return b.patients - a.patients
      })

      console.log('bairrosLocale: ', this.bairrosLocale)
      console.log('Print: ', mostrar)
      return
    },
    print(item){
      console.log('item: ', item)
      for(let ite in  item ){
        console.log('1- ', item[ite])
      }

    }
  }
};
</script>