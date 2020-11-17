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
          <v-progress-circular v-if="loading" indeterminate color="primary"/>
          <v-btn v-else color="primary" @click="updateProduct()">Editar</v-btn>
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
          loading: false,
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
            async updateProduct() {
              this.loading = true;
              await this.$apollo.mutate({
                mutation: require('@/graphql/products/UpdateProducts.gql'),
                variables: {id: this.id,price:this.price},
              });
              this.loading = false;
              this.$router.push('/');
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