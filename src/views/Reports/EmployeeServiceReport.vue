<template>
  <v-content>
    <v-container>
      <v-layout>
        <table-tickets-report :collaborators="collaborators"></table-tickets-report>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import TableTicketsReport from "@/components/Reports/TableTicketsReport";
export default {
  components: {TableTicketsReport},
  data: () => ({
    collaborators: undefined,
  }),
  apollo: {
    LoadColaborators: {
      query: require("@/graphql/colaborators/LoadColaborators.gql"),
      update(data){
        this.collaborators = Object.assign(data.Colaborator)
        console.log('reativo:', this.collaborators)
      },
    }
  },
  computed:{
    //
  },
  watch:{
    //
  },
  methods: {
    //
  }
};
</script>
<style scoped>
</style>