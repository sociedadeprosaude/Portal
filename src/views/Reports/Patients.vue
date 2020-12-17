<template>
  <v-container fluid v-if="skipPatient && Patients && LoadPatients">
    <Patients
      :Patients="Patients"
    />
  </v-container>
  <v-container v-else >
    <p v-if="skipPatient">Carregando Pacientes</p>
    <p v-else>Carregando Pacientes</p>
    <v-progress-circular indeterminate size="64">
    </v-progress-circular>
  </v-container>
 
</template>

<script>
import Patients from "@/components/Reports/Patients";

export default {
  components: { Patients },
  data: () => ({
    PatientFixed: [],
    offset:0,
    first:15000,
    skipPatient: true,
    PatientsLength: 0,
    skipPatientLength: false,
    LoadPatients: false
  }),
  computed: {
    Patients(){
      return this.PatientFixed
    },
    selectedUnit() {
      return this.$store.getters.selectedUnit
    }
  },
  apollo: {
    Patients:{
      query: require("@/graphql/patients/GetPatients.gql"),
      variables() {
        return {
          offset: this.offset,
          first: this.first
          }
        },
        update(data){
        console.log('data: ', data.Patient)
        console.log('data tamanho: ', data.Patient.length)
        console.log('offset: ', this.offset)
          if(this.PatientFixed.length === 0){
            this.PatientFixed = data.Patient
          }
          else{
            for(let i=0; i<data.Patient.length; i++){
              this.PatientFixed.push(data.Patient[i])
            }
          }
          if(this.PatientsLength <= this.PatientFixed.length){
          console.log('chamei todos')
          console.log('tamanho :', data.Patient.length)
            console.log('patients: ', this.PatientFixed)
          this.skipPatient = true
          this.LoadPatients= true
        }
          if(this.PatientsLength > this.PatientFixed.length){
            console.log('ainda não chamei todos')
            this.offset += this.first
            this.$apollo.queries.Patients.refresh();
          }
          else{
            console.log('ainda não chamei todos')
            this.offset += this.first
            this.$apollo.queries.Patients.refresh();
          }
      },
      skip() {
        return this.skipPatient
      }
    },
     loadPatientsLength: {
      query: require("@/graphql/patients/GetPatientsId.gql"),
      update(data) {
        console.log('tamanho: ', data.Patient.length)
        this.PatientsLength= data.Patient.length
        this.skipPatient= false
        this.skipPatientLength = true
      },
      skip() {
        return this.skipPatientLength
      }
    },
  },
};
</script>