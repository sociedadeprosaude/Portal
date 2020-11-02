<template>
  <v-container fluid v-if="consultation">
    <v-layout row wrap class="align-center justify-center">
      <v-card>
        <v-card-title class="headline grey lighten-2">Privacy Policy</v-card-title>
        <v-card-text>{{consultation}}</v-card-text>
        <v-divider></v-divider>
        <!--        <v-card-actions>
                  <v-btn
                      color="primary"
                      text
                      @click="dialog = false"
                  >
                    I accept
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                      color="primary"
                      text
                      @click="dialog = false"
                  >
                    I accept
                  </v-btn>
                </v-card-actions>-->
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  props: ['consultation'],
  name: "GerenateTicketAndChooseType",
  data () {
    return {
      //
    }
  },
  mounted() {
    console.log('componente:', this.consultation)
  }
}
</script>