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
      <ApolloMutation
          :mutation="require('@/graphql/products/CreateProducts.gql')"
          :variables="{name: specialty,type,price,schedulable,rules}"
          @done="close"
      >
        <template v-slot="{ mutate, loading, error }">
          <v-btn
              color="primary"
              :disabled="loading"
              @click.native="createProduct(mutate)"
          >Adicionar</v-btn>
          <p v-if="error">Ocorreu um erro: {{ error }}</p>
        </template>
      </ApolloMutation>
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
  }),
  methods: {
    close() {
      this.$router.push('/')
      this.specialty = undefined;
      this.price = 0;
      this.rules = null;
      this.type = "SPECIALTY";
      this.schedulable = false;
      this.$emit("close");
    },
    createProduct(mutate) {
      this.specialty = this.specialty.toUpperCase()
      setTimeout(() => {
        mutate();
      }, 0);
    },
  }
};
</script>