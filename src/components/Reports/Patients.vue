<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="12">
        <h1>Pacientes</h1>
        <v-card>
          <v-row>
            <v-col cols="4">
              <v-text-field v-model="FilterName" outlined
                            label="Filtro Nome" clearable
                            @input="PatientFilter()"
              >
              </v-text-field>
            </v-col>
            <v-col>
              <v-btn @click="ExportPatients(patients)">Exportar Pacientes</v-btn>
            </v-col>
            <v-col cols="12" class="mb-0">
              <v-divider color="black"></v-divider>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3">
              <span class="ml-auto font-weight-bold">Nome</span>
            </v-col>
            <v-divider vertical color="black" class="ma-0 mb-n4"></v-divider>
            <v-col cols="2">
              <span class="ml-auto font-weight-bold">Telefone</span>
            </v-col>
            <v-divider vertical color="black" class="ma-0 mb-n4"></v-divider>
            <v-col cols="2">
              <span class="ml-auto font-weight-bold">Email</span>
            </v-col>
            <v-divider vertical color="black" class="ma-0 mb-n4"></v-divider>
            <v-col cols="2">
              <span class="ml-auto font-weight-bold">Última vez atendido</span>
            </v-col>
            <v-divider vertical color="black" class="ma-0 mb-n4"></v-divider>
            <v-col cols="2">
              <span class="ml-auto font-weight-bold">Data que foi cadastrado</span>
            </v-col>
            <v-col cols="12">
              <v-divider color="black"></v-divider>
            </v-col>
          </v-row>
          <div>
            <v-row v-for="(patient,i) in PatientsLocale" :key="i">
              <v-col cols="3">
                <span class="ml-auto">{{ patient.name }}</span>
              </v-col>
              <v-divider vertical color="black" class="ma-0 mt-n4 mb-n4"></v-divider>
              <v-col cols="2">
                <span class="ml-auto ">{{ patient.telephones[0] }}</span>
              </v-col>
              <v-divider vertical color="black" class="ma-0 mt-n4 mb-n4"></v-divider>
              <v-col cols="2">
                <span class="ml-auto ">{{ patient.email ? patient.email : 'Sem email' }}</span>
              </v-col>
              <v-divider vertical color="black" class="ma-0 mt-n4 mb-n4"></v-divider>
              <v-col cols="2">
                <span class="ml-auto ">{{ AttendenceDate(patient.attedanceHistory[0]) }}</span>
              </v-col>
              <v-divider vertical color="black" class="ma-0 mt-n4 mb-n4"></v-divider>
              <v-col cols="2">
                <span class="ml-auto">{{ date(patient.created_at.formatted) }}</span>
              </v-col>
              <v-col cols="12">
                <v-divider color="black"></v-divider>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-btn @click="shower = shower + 50">Carregar mais 50</v-btn>
              </v-col>
            </v-row>
            <v-divider/>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PieChart from "@/components/Charts/PieChart";
import MiniStatistic from "@/components/MiniStatistic";
const { Parser } = require('json2csv');
const fields= ['Nome' , 'Telefone' , 'Data' ] ;
import moment from 'moment'

export default {
  components: {
    MiniStatistic,
    PieChart
  },
  props: [
    "Patients",
  ],
  data: vm => ({
    FilterName:'',
    shower: 50,
    PatientsLocale: []
  }),
  mounted() {
    this.PatientFilter()
  },
  methods: {
    PatientsFormatArray(budgets){
      let PatientsArray= []
      console.log('budgets: ', budgets)
      this.Patients.map(e =>{
        PatientsArray.push({
          Nome: e.name? e.name :'error',
          Telefone: e.telephones[0] ? e.telephones[0] :'error',
          Data: moment(e.date.formatted,'YYYY-MM-DDTHH:mm:ss').format('DD/MM/YYYY')
        })
      })
      this.ExportPatients(PatientsArray)
    },
    ExportPatients(PatientsArray){
      console.log('patientsArray: ', PatientsArray)
      const json2csvParser = new Parser({ fields});
      const csv = json2csvParser.parse(PatientsArray);
      console.log('csv: ', csv)

      var pom = document.createElement('a');
      var csvContent=csv;
      var blob = new Blob([csvContent], { type: 'text/csv;charset=UTF-16LE;'  });
      var url = URL.createObjectURL(blob);
      pom.href = url;
      pom.setAttribute('download', 'foo.csv');
      pom.click();
    },
    PatientFilter() {
      console.log('chamando')
      if (this.Patients) {
        console.log('filtro nome: ', this.FilterName)
        if(this.FilterName){
          console.log('filtro nome: ', this.FilterName)
          this.PatientsLocale= this.Patients.filter(a => a.name.includes(this.FilterName)).slice(0, this.shower)
          return this.PatientsLocale
        }
        if (this.Patients.length < this.shower) {
          return this.PatientsLocale
        } else {
          this.PatientsLocale = this.Patients.slice(0, this.shower)
          return this.PatientsLocale
        }
      }
      return []
    },
    date(date) {
      if(date){
        return moment(date).format('DD/MM/YYYY')
      }
      return 'Data Invalida'
    },
    AttendenceDate(attedanceHistory) {
      if(attedanceHistory) {
        let date = attedanceHistory.date ? attedanceHistory.date : null
        if (date) {
          return moment(date).format('DD/MM/YYYY')
        }
      }
      return  'Não Atendido'
    },
    print(item) {
      console.log('item: ', item)
      for (let ite in  item ){
        console.log('1- ', item[ite])
      }

    }
  }
};
</script>