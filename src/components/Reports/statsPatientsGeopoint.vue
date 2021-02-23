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
        <h1>Pacientes por Bairro</h1>
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
                <v-col>
                  <v-btn class="pa-0 " icon rounded  @click="selectedLocale= item.name , shower=50"> <v-icon>arrow_drop_down</v-icon></v-btn>
                </v-col>
              </v-row>
              <v-row v-if="selectedLocale === item.name">
                <v-col cols="12">
                <apollo-query :query="require('@/graphql/patients/GetPatientsCite-Neighboor.gql')"
                :variables="{city:item.name.split('-')[0], neighboor: item.name.split('-')[1]}"
                >
                  <template slot-scope="{ result: { data,error } }">
                    <v-row v-if="data">
                      <v-col>
                        <span class="ml-auto font-weight-bold">Nome</span>
                      </v-col>
                      <v-col>
                        <span class="ml-auto font-weight-bold">Email</span>
                      </v-col>
                      <v-col>
                        <span class="ml-auto font-weight-bold">Telefone</span>
                      </v-col>
                    </v-row>
                    <v-col v-if="data">
                      <v-row v-for="(patient,index) in PatientFilter(data)" v-bind:key="index">
                        <v-col>
                          <span class="ml-auto font-weight-bold">{{patient.name}}</span>
                        </v-col>
                        <v-col>
                          <span class="ml-auto font-weight-bold">{{patient.email ? patient.email : 'Sem email'}}</span>
                        </v-col>
                        <v-col>
                          <span class="ml-auto font-weight-bold">{{patient.telephones[0]}}</span>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-row v-if="error">{{error}}</v-row>
                  </template>
                </apollo-query>
                </v-col>
              </v-row>
              <v-row v-if="selectedLocale === item.name">
                <v-col cols="12">
                  <v-btn @click="shower = shower + 50">Carregar mais 50</v-btn>
                </v-col>
              </v-row>
              <v-divider />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else >
    <p>Carregando Bairros, isso pode demorar um pouco</p>
    <v-progress-circular indeterminate size="64">
    </v-progress-circular>
  </v-container>
</template>

<script>
import MiniStatistic from "@/components/MiniStatistic";
import moment from 'moment'
export default {
  components: {
    MiniStatistic
  },
  props: [
      "Patient",
      "NumPatientsNotAddress",
      "NumPatientsAddress",
      "Bairros",
  ],
  data: () => ({
    bairrosLocale: [],
    bairrosPrint: '',
    selectedLocale: '',
    shower: 50
  }),
  mounted() {
    this.Bairro(this.Bairros)
    },
  methods:{
    PatientFilter(data){
      if(data.Patient){
        if(data.Patient.length < this.shower){
          return data.Patient
        }
        else{
          return data.Patient.slice(0,this.shower)
        }
      }
      return []
    },
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