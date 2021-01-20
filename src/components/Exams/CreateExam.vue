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
                              <!--<span>{{ editedExam.type }}</span>-->
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
                          <div>
                            <v-progress-circular v-if="loading && !selectedExam" indeterminate color="primary"></v-progress-circular>
                            <v-btn
                                v-if="!selectedExam && !loading"
                                color="primary"
                                @click="createProduct()"
                            >Adicionar</v-btn>
                          </div>

                          <div>
                            <v-progress-circular v-if="loading && selectedExam" indeterminate color="primary"></v-progress-circular>
                            <v-btn v-if="selectedExam && !loading" color="primary" @click="updateProduct()">Editar</v-btn>
                          </div>
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



            rules: {
                campoObrigatorio: [
                    v => !!v || 'Campo é Obrigatório',
                ],
            }
        }),

        mounted() {
            if(this.selectedExam){
              console.log('exame selected: ',this.selectedExam)
                this.editedExam.id = this.selectedExam.id;
                this.editedExam.name = this.selectedExam.name;
                this.editedExam.price = this.selectedExam.price;
                this.editedExam.rules = this.selectedExam.rules;
                this.editedExam.type = this.selectedExam.type;
            }
        },
      computed:{
          editedExam(){
            if(this.selectedExam){
              return {id: this.selectedExam.id, name: this.selectedExam.name, price:this.selectedExam.price, rules: this.selectedExam.rules, type: this.selectedExam.type}
            }
            else{
              return {id: '', name: '', price:'', rules: '', type: ''}
            }
          }
      },

/*      apollo: {
        LoadProcuctSpecific: {
          query: require("@/graphql/products/LoadProcuctSpecific.gql"),
          variables () {
            return {
              id: this.editedExam.id,
            }
          },
          update(data){
            //this.sectors = Object.assign(data.Clinic[0].has_sectors)
            console.log('reativo:', data.Product[0])
/!*            this.editedExam.id = this.selectedExam.id;
            this.editedExam.name = this.selectedExam.name;
            this.editedExam.price = this.selectedExam.price;
            this.editedExam.rules = this.selectedExam.rules;
            this.editedExam.type = this.selectedExam.type;*!/
          },
        }
      },*/

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

           async createProduct() {
             this.loading = true
             this.editedExam.name = this.editedExam.name.toUpperCase().replace(/\//g, "-")
             if ( this.editedExam.type === "EXAM") {
               await this.$apollo.mutate({
                 mutation: require('@/graphql/products/CreateProducts.gql'),
                 variables: {
                   name: this.editedExam.name,
                   price: this.editedExam.price,
                   rules: this.editedExam.rules,
                   type: this.editedExam.type,
                   schedulable: this.editedExam.schedulable
                 },
               });
             } else {
               let other = this.editedExam.type
               this.editedExam.type = "EXAM"
               console.log('true', other)
               const dataProduct = await this.$apollo.mutate({
                 mutation: require('@/graphql/products/CreateProducts.gql'),
                 variables: {
                   name: this.editedExam.name,
                   price: this.editedExam.price,
                   rules: this.editedExam.rules,
                   type: this.editedExam.type,
                   schedulable: this.editedExam.schedulable
                 },
               });
               const idProduct = dataProduct.data.CreateProduct.id
               await this.$apollo.mutate({
                 mutation: require('@/graphql/products/AddProductWith_other.gql'),
                 variables: {
                   idSchedulableTrue: other.id,
                   idSchedulableFalse: idProduct,
                 },
               });
             }
             this.loading = false
             this.clear();
             this.close();
             this.$emit('reload')
             //this.$router.push('/')
           },

          async updateProduct() {
            this.loading = true
            if (this.editedExam.type === "EXAM") {
              await this.$apollo.mutate({
                mutation: require('@/graphql/products/UpdateProducts.gql'),
                variables: {
                  id : this.editedExam.id,
                  price : this.editedExam.price,
                  name : this.editedExam.name,
                  rules: this.editedExam.rules,
                },
              });
            } else {
              let other = this.editedExam.type
              this.editedExam.type = "EXAM"
              console.log('agendavel:', other)
              await this.$apollo.mutate({
                mutation: require('@/graphql/products/UpdateProducts.gql'),
                variables: {
                  id : this.editedExam.id,
                  price : this.editedExam.price,
                  name : this.editedExam.name,
                  rules: this.editedExam.rules,
                },
              });
              if(other.with_other.length > 0){
                for (let item in other.with_other){
                  if(other.with_other[item].name !== this.editedExam.name){
                    //console.log('make conection')
                    await this.$apollo.mutate({
                      mutation: require('@/graphql/products/AddProductWith_other.gql'),
                      variables: {
                        idSchedulableTrue: other.id,
                        idSchedulableFalse: this.editedExam.id,
                      },
                    });
                  } else {
                    //console.log('ja tem concetioon')
                  }
                }
              }
              else{
                //console.log('make conection')
                await this.$apollo.mutate({
                  mutation: require('@/graphql/products/AddProductWith_other.gql'),
                  variables: {
                    idSchedulableTrue: other.id,
                    idSchedulableFalse: this.editedExam.id,
                  },
                });
              }
            }
            this.loading = false
            //this.$apollo.queries.LoadProcuctSpecific.refresh();
            //this.clear();
            //this.$router.push('/')
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