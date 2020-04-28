<template>
  <v-container>
    <v-layout column>
      <v-flex xs12 sm12>
        <RegisterOutflows/>
      </v-flex>
      <outtakesCategories />
    </v-layout>

  </v-container>
</template>

<script>

import RegisterOutflows from "../../components/cashier/RegisterOutflows";
import outtakesCategories from "@/components/DialogOuttakeCategories";

export default {
  components: { RegisterOutflows, outtakesCategories },
};
</script>
