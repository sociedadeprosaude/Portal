<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <v-text-field
          label="Solo"
          placeholder="Codigo do recibo"
          solo
          v-model="search"
        ></v-text-field>
      </v-flex>
      <v-flex xs2
              class="text-xs-center ma-3"
              :key="index"
              v-for="(code, index) in registeredBudgetCodes"
      >
        <v-card>
          <v-card-title>
            {{code}}
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: "RegisteredExams",
    data() {
      return {
        search: ''
      }
    },
    computed: {
      registeredBudgetCodes() {
        return this.$store.getters.registeredBudgetCodes.filter((a) => {
          return a.includes(this.search)
        })
      }
    },
    mounted() {
      this.$store.dispatch('getBudgets')
    }
  }
</script>

<style scoped>

</style>
