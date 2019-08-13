<template>
  <v-container>
    <v-layout row wrap>
      <img class="ml-3" src="@/assets/logo-pro-saude.png" height="60px">
      <search-add-patient @select="selectPatient"></search-add-patient>
      <patient-prontuario :user="user"></patient-prontuario>
    </v-layout>
  </v-container>
</template>

<script>
  import SearchAddPatient from './SearchAddPatient'
  import PatientProntuario from './PatientProntuario'

  export default {
    name: "Home",
    components: {
      SearchAddPatient,
      PatientProntuario
    },
    data () {
      return {
        user: {}
      }
    },
    methods: {
      selectPatient (patient) {
        this.user = patient
      }
    },
  }
</script>

<style scoped>

</style>
