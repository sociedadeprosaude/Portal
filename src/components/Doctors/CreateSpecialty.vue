<template>
  <v-card>
    <v-card-title class="headline grey lighten-2" primary-title>
      <span>Cadastro de Especialidade</span>
      <v-spacer />
      <v-btn text rounded @click="close()">
        <v-icon>clear</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout row wrap class="align-center justify-center">
          <v-flex xs12>
            <v-text-field
              repend-icon="school"
              v-model="specialty"
              label="Especialidade"
              outlined
              rounded
              filled
            />
          </v-flex>
          <v-flex xs12>
            <v-currency-field
              outlined
              rounded
              filled
              clearable
              prefix="R$"
              v-model="price"
              label="Preço de Venda"
            />
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-progress-circular v-if="loading" indeterminate color="primary"/>
      <v-btn v-else color="primary" @click="createProduct()">Adicionar</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  data: () => ({
    specialty: undefined,
    price:0,
    rules: null,
    type:"SPECIALTY",
    schedulable: false,
    loading: false,
  }),
  methods: {
    close() {
      this.specialty = undefined;
      this.price = 0;
      this.rules = null;
      this.type = "SPECIALTY";
      this.schedulable = false;
      this.$emit("close");
    },
    async createProduct() {
      this.loading = true;
      await this.$apollo.mutate({
        mutation: require('@/graphql/products/CreateProducts.gql'),
        variables: {name: this.specialty.toUpperCase(),type: this.type, price: this.price, schedulable: this.schedulable, rules: this.rules},
      });
      this.loading = false;
      this.$emit('reload')
      this.$emit("close")
      //this.$router.push('/');
    },
  }
};
</script>
