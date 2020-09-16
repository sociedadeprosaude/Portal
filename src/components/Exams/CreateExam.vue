<template>
    <v-container fluid>
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
                                            v-model="editedExam.name"
                                            prepend-icon="description"
                                            :rules="rules.campoObrigatorio"
                                            class="ml-3 mr-3"
                                    />
                                </v-flex>
                                <v-flex xs12 sm12>
                                  <ApolloQuery
                                      :query="require('@/graphql/products/ReadProcucts.gql')"
                                      :variables="{ type:'EXAM', schedulable: true}"
                                  >
                                    <template slot-scope="{ result: { data } }">
                                      <v-select
                                          class="ml-3 mr-3"
                                          label="Tipo"
                                          prepend-icon="school"
                                          v-model="editedExam.type"
                                          :items="data.Product"
                                          item-text="name"
                                          return-object
                                          outlined
                                          chips
                                          color="pink"
                                          clearable
                                      >
                                        <template v-slot:selection="data">
                                          <v-chip
                                              :key="JSON.stringify(data.item)"
                                              :input-value="data.selected"
                                              :disabled="data.disabled"
                                              class="v-chip--select-multi"
                                              @click.stop="data.parent.selectedIndex = data.index"
                                              @input="data.parent.selectItem(data.item)"
                                              text-color="white"
                                              color="info"
                                          >{{ data.item.name }}
                                          </v-chip>
                                        </template>
                                      </v-select>
                                    </template>
                                  </ApolloQuery>
                                </v-flex>
                                <v-flex xs12 sm12>
                                    <v-textarea
                                            outlined
                                            label="Regras"
                                            v-model="editedExam.rules"
                                            class="ml-3 mr-3"
                                            prepend-icon="report_problem"
                                    />
                                </v-flex>
                                <v-flex xs12 sm12>
                                  <v-currency-field
                                      outlined
                                      clearable
                                      prefix="R$"
                                      prepend-icon="attach_money"
                                      v-model="editedExam.price"
                                      label="Preço"
                                      :rules="rules.campoObrigatorio"
                                  />
                                </v-flex>
                            </v-layout>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer/>
                          <ApolloMutation
                              :mutation="require('@/graphql/products/CreateProducts.gql')"
                              :variables="{price: editedExam.price,
                               rules: editedExam.rules,
                               type: editedExam.type,
                               name: editedExam.name,
                               schedulable: editedExam.schedulable }"
                              @done="close"
                          >
                            <template v-slot="{ mutate, loading, error }">
                              <v-btn
                                  v-if="!selectedExam"
                                  color="primary"
                                  :disabled="loading"
                                  @click.native="createProduct(mutate)"
                              >Adicionar</v-btn>
                              <p v-if="error">Ocorreu um erro: {{ error }}</p>
                            </template>
                          </ApolloMutation>

                          <ApolloMutation
                              :mutation="require('@/graphql/products/UpdateProducts.gql')"
                              :variables="{ id : editedExam.id, price : editedExam.price, name : editedExam.name}"
                              @done="close"
                          >
                            <template v-slot="{ mutate, loading, error }">
                              <v-btn v-if="selectedExam" color="primary" @click.native="updateProduct(mutate)">Editar</v-btn>
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
        props: ['registed', 'selectedExam'],

        data: () => ({
            validRegister: true,
            loading: false,
            success: false,

            editedExam: {
                id: '', name: '', rules: '', type: 'EXAM', price: 0, schedulable: false,
            },

            rules: {
                campoObrigatorio: [
                    v => !!v || 'Campo é Obrigatório',
                ],
            }
        }),

        mounted() {
            if(this.selectedExam){
              console.log(this.selectedExam)
                this.editedExam.id = this.selectedExam.id;
                this.editedExam.name = this.selectedExam.name;
                this.editedExam.price = this.selectedExam.price;
                this.editedExam.rules = this.selectedExam.rules;
                this.editedExam.type = this.selectedExam.type;
            }
        },

        computed: {
            formRegister() {
                return this.editedExam.name;
            },
            examTypes() {
                return this.$store.getters.examsTypes
            }
        },

        methods: {
            handleEnter(e) {
                if (e.key === 'Enter') {
                    if (this.registerExam) {
                        this.validateRegister()
                    } else {
                        this.searchExams(this.searchText)
                    }
                }
            },

            validateRegister() {
                this.loading = true;
                this.registerProduct()
            },

            async registerProduct() {
                const examData = {
                    id: '',
                    name: this.editedExam.name.toUpperCase().replace(/\//g, "-"),
                    rules: this.editedExam.rules,
                    type: this.editedExam.type ? this.editedExam.type.name : undefined,
                };
                await this.$store.dispatch('addExam', examData);
                this.success = true;
                this.loading = false;
                this.clear();
                this.close();
            },

            createProduct(mutate) {
              this.editedExam.name = this.editedExam.name.toUpperCase().replace(/\//g, "-")
/*              if(this.editedExam.type !== "EXAM"){
                this.editedExam.type = this.editedExam.type.name
                this.editedExam.schedulable = true
              }*/
              setTimeout(() => {
                mutate();
              }, 0);
            },

            updateProduct(mutate) {
              setTimeout(() => {
                mutate();
              }, 0);
            },

            clear() {
                this.editedExam.name = '';
                this.editedExam.type = "EXAM";
                this.editedExam.rules = '';
                this.editedExam.price = 0;
                this.editedExam.id = '';
            },

            close () {
                this.clear()
                this.$emit('close-dialog')
            }

        },
    }
</script>