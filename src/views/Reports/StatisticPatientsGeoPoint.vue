<template>
  <v-container fluid v-if="skipPatient">
    <statistics-budget
      :NumPatientsNotAddress="NumPatientsNotAddress"
      :NumPatientsAddress="NumPatientsAddress"
      :Patient="Patients"
      :neighborhood="Neighborhoods"
    />
  </v-container>
  <v-progress-circular v-else indeterminate size="64"></v-progress-circular>
 
</template>

<script>
import statisticsBudget from "@/components/Reports/statsPatientsGeopoint";
import moment from "moment";
import axios from "axios";
export default {
  components: { statisticsBudget },
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
    NumPatientsNotAddress(){
      return this.Patients.filter(e => !e.addresses[0]).length
    },
    NumPatientsAddress(){
      return this.Patients.filter(e => e.addresses[0]).length
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