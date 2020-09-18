<template>
    <v-card>
        <v-card-title>
            Editar Especialidade Médica
            <v-spacer/>
            <v-btn text @click="close()">
                <v-icon>close</v-icon>
            </v-btn>
        </v-card-title>
        <v-divider/>
        <v-card-text>
            <v-layout row wrap class="align-center justify-center">
                <v-flex xs12 class="my-4 mx-2">
                  <v-chip large color="primary">{{name}}</v-chip>
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
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <ApolloMutation
              :mutation="require('@/graphql/products/UpdateProducts.gql')"
              :variables="{ id, price}"
              @done="close"
          >
            <template v-slot="{ mutate, loading, error }">
              <v-btn color="primary" @click.native="updateProduct(mutate)">Editar</v-btn>
              <p v-if="error">Ocorreu um erro: {{ error }}</p>
            </template>
          </ApolloMutation>
        </v-card-actions>
    </v-card>
</template>
<script>
    export default {
        props: ['specialty'],
        data: () => ({
            name: undefined,
            id: undefined,
            price: 0,
        }),
        mounted(){
            this.initialize()
        },
        methods: {
            close() {
              this.name = undefined;
              this.id = undefined;
              this.price = 0;
              this.$emit('close');
            },
            updateProduct(mutate) {
              setTimeout(() => {
                mutate();
              }, 0);
            },
            async initialize(){
              console.log('no comp:', this.specialty)
                if(this.specialty){
                  this.id = this.specialty.id
                  this.name = this.specialty.name
                  this.price = this.specialty.price
                }
            }
        },
    }
</script>