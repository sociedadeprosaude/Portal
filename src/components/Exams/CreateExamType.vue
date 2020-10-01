<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12>
                <v-card grid-list-x1 fluid class="mt-4">
                    <v-form v-model="validRegister" lazy-validation>
                        <v-card-text>
                            <v-layout wrap>
                                <v-flex xs12 sm12>
                                    <v-text-field
                                            outlined
                                            required
                                            label="Nome"
                                            v-model="name"
                                            prepend-icon="description"
                                            class="ml-3 mr-3"
                                    />
                                </v-flex>
                            </v-layout>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer/>
                          <ApolloMutation
                              :mutation="require('@/graphql/products/CreateProducts.gql')"
                              :variables="{price: price,
                               rules: rules,
                               type: type,
                               name: name,
                               schedulable: schedulable}"
                              @done="close"
                          >
                            <template v-slot="{ mutate, loading, error }">
                              <v-btn
                                  v-if="!selectedExamType"
                                  color="primary"
                                  :disabled="loading"
                                  @click.native="createProduct(mutate)"
                              >Adicionar</v-btn>
                              <p v-if="error">Ocorreu um erro: {{ error }}</p>
                            </template>
                          </ApolloMutation>

                          <ApolloMutation
                              :mutation="require('@/graphql/products/UpdateProducts.gql')"
                              :variables="{ id : id, price : price, name: name}"
                              @done="close"
                          >
                            <template v-slot="{ mutate, loading, error }">
                              <v-btn v-if="selectedExamType" color="primary" @click.native="updateProduct(mutate)">Editar</v-btn>
                              <p v-if="error">Ocorreu um erro: {{ error }}</p>
                            </template>
                          </ApolloMutation>
                        </v-card-actions>
                    </v-form>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
    export default {
        props: ['registed','selectedExamType'],

        data: () => ({
            validRegister: true,
            loading: false,
            success: false,
            price: 0,
            type: "EXAM",
            rules: null,
            name: '',
            schedulable: true,
            id: '',
        }),

        mounted() {
            if(this.selectedExamType){
                this.id = this.selectedExamType.id
                this.name = this.selectedExamType.name;
                this.scheduleable = this.selectedExamType.scheduleable;
                this.price = this.selectedExamType.price;
                this.type = this.selectedExamType.type;
                this.rules = this.selectedExamType.rules;
            }
        },
        watch:{
           selectedExamType(value){
               if(value){
                   this.editedExamType.id = this.selectedExamType.id;
                   this.editedExamType.name = this.selectedExamType.name;
                   this.editedExamType.scheduleable = this.selectedExamType.scheduleable;
               }
           } 
        },
        computed: {
            formRegister() {
                return this.editedExamType.name;
            },
        },

        methods: {
            handleEnter(e) {
                if (e.key === 'Enter') {
                    if (this.registerExamType) {
                        this.validateRegister()
                    } else {
                        this.searchExamTypes(this.searchText)
                    }
                }
            },

            validateRegister() {
                this.loading = true;
                this.registerProduct()
            },

            async registerProduct() {
                const examTypeData = {
                    id:this.editedExamType.id,
                    name: this.editedExamType.name.toUpperCase().replace(/\//g, "-"),
                    scheduleable:this.editedExamType.scheduleable
                };
                if(this.registed){
                    await this.$store.dispatch('editExamType', examTypeData);
                }
                    
                else{
                    await this.$store.dispatch('addExamType', examTypeData);
                    this.clear()
                }
                   
                this.success = true;
                this.loading = false;
                this.close();

            },

            createProduct(mutate) {
              this.name = this.name.toUpperCase().replace(/\//g, "-")
              setTimeout(() => {
                mutate();
              }, 0);
              this.$router.push('/')
            },

            updateProduct(mutate) {
              this.name = this.name.toUpperCase().replace(/\//g, "-")
              setTimeout(() => {
                mutate();
              }, 0);
              this.$router.push('/')
            },

            clear() {
                this.name = '';
            },
            close () {
              this.clear()
                this.$emit('close-dialog')
            }

        },
    }
</script>