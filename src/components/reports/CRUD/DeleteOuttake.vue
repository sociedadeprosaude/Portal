<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on }">
        <v-icon v-on="on" color="red lighten-2">delete</v-icon>
      </template>
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>Deletar permanentemente esta saída?</v-card-title>
        <v-container>
          <p class="text-left">{{item.category}}/{{item.subCategory}}</p>
          <p>{{item.info}}</p>
        </v-container>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialog = false">Não</v-btn>
          <v-btn :loading="loading" color="red darken-1" text @click="removeOuttake()">Sim</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: ["item", "cb"],
  data() {
    return {
      dialog: false,
      loading: false
    };
  },
  methods: {
    async removeOuttake() {
      this.loading = true;
      await this.$store.dispatch("deleteOuttake", { id: this.item.idOuttake });
      this.dialog = false;
      this.loading = false;
      //callback, que no caso é pesquisar denovo os outtakes
      this.cb();
    }
  }
};
</script>