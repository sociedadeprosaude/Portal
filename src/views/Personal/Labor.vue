<template>
  <v-container>
    <v-layout row wrap v-if="!loading">
      <v-flex xs12>
        <span class="my-headline">Colaboradores</span>
      </v-flex>
      <Collaborators :loading="loading" :collaborators="colaborators"/>

      <!-- <v-flex xs12>
        <span v-if="user.group === 'admin'" class="my-headline">Médicos</span>
      </v-flex>
      <Doctors v-if="user.group === 'admin'"/>

      <v-flex xs12>
        <span class="my-headline">Pagamentos</span>
      </v-flex> -->
      <!-- <paymeny-report :colaborators="collaborators"/> -->
    </v-layout>

    <v-layout row wrap v-else>
      <v-flex xs12 class="text-center">
        <v-progress-circular size="64" indeterminate color="primary"/>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import PaymenyReport from "../../components/labor/PaymenyReport";
import Collaborators from "../../components/labor/Collaborators";
import Doctors from "../../components/labor/Doctors";


export default {
  name: "Home",
  components: {
    PaymenyReport,
    Collaborators,
    Doctors
  },
  data: () => ({
    loading: true,
    colaborators:[]
  }),
  async mounted() {
    //await this.$store.dispatch('getColaborators');
    this.loading = false
  },
  computed: {
    user() {
      return this.$store.getters.user
    },
    unit() {
      return this.$store.getters.user.clinic
    },
    /* collaborators() {
      if (this.user.group === 'admin') return this.$store.getters.colaborators
      return this.$store.getters.colaborators.filter(c => {
        return !c.clinic || c.clinic.name === this.unit.name
      })
    }, */
  },
  apollo:{
    loadColaborators:{
      query:require("@/graphql/colaborators/LoadColaborators.gql"),
      update(data){
        this.colaborators = data.Colaborator
        if (this.user.group === 'admin')
          this.colaborators = data.Colaborator
        else
          this.colaborators = data.Colaborator.filter(c => !c.clinic || c.clinic.id === this.unit.id)
        this.loading = false
      }
    }
  }

}
</script>
