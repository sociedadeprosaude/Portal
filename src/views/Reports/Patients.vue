<template>
  <v-container fluid v-if="skipPatient && Patients">
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
  data: vm => ({
    PatientFixed: '',
    skipPatient: false,
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
    loadPatients: {
      query: require("@/graphql/patients/GetPatients.gql"),
      update(data) {
        console.log('data: ', data.Patient)
        this.PatientFixed= data.Patient
        this.skipPatient = true
      },
      skip() {
        return this.skipPatient
      }
    },
  }
};
</script>