<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on }">
        <v-icon v-on="on">mdi-information-outline</v-icon>
      </template>
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>Informações</v-card-title>
         <v-container>
          <p class="text-left">{{item.category}}/{{item.subCategory}}</p>
          <v-divider></v-divider>
          <p class="mt-2">Valor: {{item.cost}}</p>
          <p>Criado em: {{item.created_at}}</p>
          <p>Previsto para ser pago: {{item.toPayIn}}</p>
          <p v-if="item.status">Pago em:{{item.paidIn}}</p>
        
          <v-divider></v-divider>
          <p class="mt-2">{{item.info}}</p>
        </v-container>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialog = false">fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: ["item"],
  data() {
    return {
      dialog: false
    };
  }
};
</script>