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
    import SubmitButton from "../SubmitButton";

    export default {
        props: ['specialty'],
        components: {SubmitButton},

        data: () => ({
            loading: false,
            success: false,
            exam: undefined,
            name:undefined,
            id: undefined,
            price:0,
            typeOptions:[
                { text:'sim', value: true },
                { text:'não', value: false }
            ],
        }),

        computed: {
            specialties() {
                return this.$store.getters.specialties
            },
        },
        mounted(){
            this.initialize()
        },
        methods: {
            close() {
                this.$emit('close');
            },
          updateProduct(mutate) {
            setTimeout(() => {
              mutate();
            }, 0);
          },
            async editSpecialty() {
                this.loading = true;
                await this.$store.dispatch('editSpecialty', {
                    name: this.name.toUpperCase(),
                    price:Number(this.price)
                });
                this.success = true;
                this.loading = false;
                setTimeout(() => {
                    this.close();
                }, 1000)
            },
            initialize(){
                if(this.specialty){
                  this.id = this.specialty.id
                  this.name = this.specialty.name
                  this.price = this.specialty.price
                }
            }
        },
        watch:{
            specialty(value){
                if(value)
                    this.initialize()
            }
        }
    }
</script>