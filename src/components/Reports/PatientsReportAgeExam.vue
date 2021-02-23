<template>
  <v-container>
    <v-row>
      <v-col cols="4">
        <v-select
        v-model="selectedDate"
        :items="dates"
        label="Escolha uma data"
        >
        </v-select>
      </v-col>
      <v-col cols="4">
        <v-btn @click="ExportPatients(PatientsArray)">Exportar Pacientes</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <span class="my-sub-headline mb-4 mx-4">Relatório Pacientes por Consulta</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12"  v-for="(patientsForDay, index) in Patients" v-bind:key="index">
        <v-card>
        <v-card color="primary elevation-0">
          <v-row>
            <v-col cols="3">
              <h4 class="text-left white--text pl-1">N° de pacientes: {{patientsForDay.NumPatients}}</h4>
            </v-col>
            <v-col cols="6">
              <h3 class="text-center font-weight-bold ml-2 white--text">{{index |
                  dateFilter}} - {{daydate(index)}}</h3>            </v-col>
            <v-col cols="3">
              <v-btn  class="text-right" @click="PatientsFormatArray(PatientsForDate)">Exportar Pacientes</v-btn>
            </v-col>
          </v-row>
          </v-card>
          <v-row row wrap class="mt-2">
            <v-col cols="12" >
              <v-divider></v-divider>
            </v-col>
            <v-col cols="1" class="pa-0">
              <v-divider vertical></v-divider>
            </v-col>
            <v-col cols="2">Paciente</v-col>
            <v-col cols="1" class="pa-0">
              <v-divider vertical></v-divider>
            </v-col>
            <v-col cols="1">Idade</v-col>
            <v-col cols="1" class="pa-0">
              <v-divider vertical></v-divider>
            </v-col>
            <v-col cols="2" class="pa-0">Telefone</v-col>
            <v-col cols="1" class="pa-0">
              <v-divider vertical></v-divider>
            </v-col>
            <v-col cols="3" class="pa-0">Email</v-col>
            <v-col cols="1" class="pa-0">
              <v-divider vertical></v-divider>
            </v-col>
            <v-col cols="12">
              <v-divider></v-divider>
            </v-col>
          </v-row>
          <v-row row wrap class="mt-2" v-for="(patient, index) in patientsForDay.Patients" v-bind:key="index">
            <v-col cols="1" class="pa-0">
              <v-divider vertical></v-divider>
            </v-col>
            <v-col cols="2">{{patient.name}}</v-col>
            <v-col cols="1" class="pa-0">
              <v-divider vertical></v-divider>
            </v-col>
            <v-col cols="1">{{age(patient.birth_date)}}</v-col>
            <v-col cols="1" class="pa-0">
              <v-divider vertical></v-divider>
            </v-col>
            <v-col cols="2" class="pa-0">{{patient.telephones[0]}}</v-col>
            <v-col cols="1" class="pa-0">
              <v-divider vertical></v-divider>
            </v-col>
            <v-col cols="3" class="pa-0" v-if="patient.name">{{patient.email ? patient.email : 'Sem email'}}
            </v-col>
            <v-col cols="1" class="pa-0">
              <v-divider vertical></v-divider>
            </v-col>
            <v-col cols="12" >
              <v-divider></v-divider>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
const { Parser } = require('json2csv');
const fields= ['First Name' , 'Last Name' , 'Mobile Phone' ] ;
import moment from 'moment'
export default {
  props: [
      "PatientsForDate",
      "dates",
      "PatientsArray"
  ],
  data: () => ({
    patientSelected: '',
    selectedDate: '',
    semanaOptions: [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado"
    ],
  }),
  methods:{
    age(birth_date){
      let now = moment().format('YYYY')
      let idade = parseInt(now) - parseInt(moment(birth_date.formatted).format("YYYY"))
      return idade
    },
    PatientsFormatArray(patients){
      let PatientsArray= []
      patients.Budgets.map(e =>{
        PatientsArray.push({
          Nome: e.name,
          Telefone: e.telephones[0],
        })
      })
      this.ExportPatients(PatientsArray)
    },
    ExportPatients(patientsArray){
      const json2csvParser = new Parser({ fields});
      let formattedPatients = patientsArray.map(p => {
        return {
          'First Name': p.Nome.trim().split(' ')[0],
          'Last Name': p.Nome.trim().split(' ').slice(1, p.Nome.split(' ').length).join(' '),
          'Mobile Phone': p.Telefone.replaceAll(' ', '').replace('(', '').replace(')', '').replace('-', '')
        }
      })
      formattedPatients = formattedPatients.filter(p => p['Last Name'].length > 0)
      const csv = json2csvParser.parse(formattedPatients);
      var pom = document.createElement('a');
      var csvContent=csv;
      var blob = new Blob([csvContent], { type: 'text/csv;charset=UTF-16LE;'  });
      var url = URL.createObjectURL(blob);
      pom.href = url;
      pom.setAttribute('download', 'pacientes.csv');
      pom.click();
    },
    Products(budget){
      if(budget.id === this.patientSelected.id){
        this.patientSelected= {}
      }
      else{
        this.patientSelected = budget
      }
    },
    daydate(date) {
      let dateMoment = moment(date);
      return this.semanaOptions[dateMoment.day()];
    },
    print(dat){
      console.log('objet:', dat)
    }
  },
  computed:{
    Patients(){
      let Patients = {}
      let date = moment(this.selectedDate, 'DD/MM/YYYY').format('YYYY-MM-DD')
      if(this.selectedDate !== ''){
        Patients[date] =  this.PatientsForDate[date]
        return Patients[date]
      }
      return this.PatientsForDate
    }
  }
};
</script>
