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
import moment from "moment";
import axios from "axios";
export default {
  components: { Patients },
  data: vm => ({
    PatientFixed: '',
    skipPatient: false,
  }),

  mounted() {
  },
  methods: {

  },
  computed: {

    Patients(){
      return this.PatientFixed
    },
    selectedUnit() {
      return this.$store.getters.selectedUnit
    }
  },
  apollo: {
    loadTransactions: {
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