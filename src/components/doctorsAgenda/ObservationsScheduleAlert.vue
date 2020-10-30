<template>
  <div class="text-right">
    <v-dialog
      v-model="dialog"
      scrollable
      max-width="600"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>error_outline</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="headline justify-center">
          <h1 class="headline primary--text">Observações da Agenda</h1>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
            <v-list v-if="observations.length > 0">
                <v-list-item-group>
                    <template  v-for="(observation,index) in observations">
                    <v-list-item :key="index">
                        <template >
                        <v-list-item-content class="text-left">
                            <v-list-item-title v-text="observation"></v-list-item-title>
                        </v-list-item-content>
                        </template>
                    </v-list-item>

                    <v-divider
                        v-if="index < observations.length - 1"
                        :key="`divider-${index}`"
                    ></v-divider>
                    </template>
                </v-list-item-group>
            </v-list>
            <span v-else>Não há observações para a agenda!</span>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  export default {
    props:['observations'],
    data () {
      return {
        dialog: false,
      }
    },
  }
</script>