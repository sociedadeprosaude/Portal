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
          if(this.PatientFixed.length === 0){
            this.PatientFixed = data.Patient
          }
          else{
            for(let i=0; i<data.Patient.length; i++){
              this.PatientFixed.push(data.Patient[i])
            }
          }
          if(this.PatientsLength <= this.PatientFixed.length){
          this.skipPatient = true
          this.LoadPatients= true
        }
          if(this.PatientsLength > this.PatientFixed.length){
            this.offset += this.first
            this.$apollo.queries.Patients.refresh();
          }
          else{
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