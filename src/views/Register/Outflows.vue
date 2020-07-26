<template>
  <v-container>
    <v-layout column>
      <v-flex xs12 sm12>
        <RegisterOutflows/>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>

import RegisterOutflows from "../../components/cashier/RegisterOutflows";

export default {
  components: { RegisterOutflows },
};
</script>
