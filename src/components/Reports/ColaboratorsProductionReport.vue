<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        ajdshjsahkdasjhbsdajhbsadjb
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "ColaboratorsProductionReportComponent",
  props: [
    "transactions"
  ],
  mounted() {
    console.log('aa', this.transactions)
  }
};
</script>

<style scoped>
</style>
