<template>
    <v-card class="pa-2">
        <v-card-text>
            <v-layout wrap row class="mt-4">
                <v-flex xs12>
                    <v-text-field prepend-icon="poll" outlined v-model="exam.name" readonly/>
                </v-flex>
                <v-flex xs6>
                    <v-currency-field
                            prepend-icon="attach_money"
                            outlined
                            clearable
                            label="Preço de Custo"
                            prefix="R$"
                            v-model="exam.cost"
                            hide-details>
                    </v-currency-field>
                </v-flex>
                <v-flex xs6>
                    <v-currency-field
                            prepend-icon="monetization_on"
                            outlined
                            label="Preço de Venda"
                            prefix="R$"
                            v-model="exam.price"
                            readonly
                            hide-details>
                    </v-currency-field>
                </v-flex>

                <v-flex class="mt-5 pl-8" xs12>
                    <ApolloQuery
                          :query="require('@/graphql/clinics/LoadAllClinics.gql')"
                      >
                        <template slot-scope="{ result: { data } }">
                          <v-combobox
                              prepend-inner-icon="search"
                              :items="data ? data.Clinic : []"
                              item-text="name"
                              return-object
                              label="Fornecedor do Exame"
                              outlined
                              v-model="provider"
                              clearable
                              chips
                              hide-details
                          >
                            <template v-slot:selection="data">
                              <v-chip
                                  :key="JSON.stringify(data.item)"
                                  :input-value="data.selected"
                                  :disabled="data.disabled"
                                  class="v-chip--select-multi"
                                  @click.stop="data.parent.selectedIndex = data.index"
                                  @input="data.parent.selectItem({},data.item)"
                                  text-color="white"
                                  color="info"
                              >{{ data.item.name }}
                              </v-chip>
                            </template>
                          </v-combobox>
                        </template>
                      </ApolloQuery>
                </v-flex>
            </v-layout>
            <v-divider class="primary mt-3"/>
            <v-card-actions>
                <v-layout class="align-center justify-center">
                    <v-btn color="error" @click="closeForm()">CANCELAR</v-btn>
                    <v-spacer/>
                  <div>
                    <v-progress-circular v-if="loading" indeterminate color="primary"/>
                    <v-btn v-else @click="editExam()" color="success">
                        SALVAR
                    </v-btn>
                  </div>
                </v-layout>
            </v-card-actions>
        </v-card-text>
    </v-card>
</template>
<script>
    import {uuid} from 'vue-uuid';
    export default {
        props: ['exam', 'clinic'],
        data: () => ({
          loading: false,
          provider: undefined,
          providerFound: undefined
        }),
        updated(){
          this.findProvider();
        },
        mounted(){
          this.findProvider();
        },
        methods: {
            findProvider(){
              if(this.exam && this.clinic){
                  const providerFound = this.clinic.providers.find(provider => provider.provides.id === this.exam.id);
                  this.provider = providerFound && Object.assign({},providerFound.providedByClinic);
                  this.providerFound = providerFound;
              }
            },
            async editExam() {
              this.loading = true
              let promises = []
              const updatePromise = this.$apollo.mutate({
                mutation: require('@/graphql/clinics/UpdateCostProductClinic.gql'),
                variables: {
                  id: this.exam.idcpc,
                  cost: this.exam.cost,
                },
              });
              promises.push(updatePromise);
              
              const actionFieldProvider = this.actionFieldProvider();
              if(actionFieldProvider) promises.push(actionFieldProvider); 

              await Promise.all(promises);
              this.providerFound = this.provider;

/*              let CostProductClinic = ''
              CostProductClinic = await this.$apollo.mutate({
                mutation: require('@/graphql/clinics/LoadCostProductClinic.gql'),
                variables: {
                  idProduct: this.exam.id,
                  idClinic: this.clinic.id,
                }
              })
              console.log('constProductClinics:', CostProductClinic)
              if(CostProductClinic.data.CostProductClinic.length === 0){
                CostProductClinic = await this.$apollo.mutate({
                  mutation: require('@/graphql/clinics/CreateCostProductClinic.gql'),
                  variables: {
                    cost: this.exam.cost,
                  }
                });
                console.log('CostProductClinic Criado: ', CostProductClinic)
                await this.$apollo.mutate({
                  mutation: require('@/graphql/clinics/AddCostProductClinicWith_clinicAndProduct.gql'),
                  variables: {
                    idClinic: this.clinic.id,
                    idProduct: this.exam.id,
                    idCostProductClinic: CostProductClinic.data.CreateCostProductClinic.id
                  }
                });
              }
              else{
                await this.$apollo.mutate({
                  mutation: require('@/graphql/clinics/UpdateCostProductClinic.gql'),
                  variables: {
                    ExamId: this.exam.id,
                    clinicID: this.clinic.id,
                    cost: this.exam.cost,
                  },
                });
              }*/
              this.loading = false
              this.closeForm();
              this.$emit('reload')
              //this.$router.push('/')
            },
            actionFieldProvider(){
              let promise = undefined;
              if(this.provider && !this.providerFound){
                console.log('Criar provider')
                const uuidProductProvider = uuid.v4();
                promise = this.$apollo.mutate({
                  mutation: require('@/graphql/clinics/CreateProductProvider.gql'),
                  variables: {
                    idProductProvider: uuidProductProvider,
                    provider: this.provider.id,
                    product: this.exam.id,
                    consumer: this.clinic.id
                  },
                });
              }else if(this.provider && this.providerFound && this.provider.id !== this.providerFound.providedByClinic.id){
                console.log('Atualizar Provider')
                promise = this.$apollo.mutate({
                  mutation: require('@/graphql/clinics/UpdateProductProviderClinic.gql'),
                  variables: {
                    idProductProvider: this.providerFound.id,
                    oldProvider: this.providerFound.providedByClinic.id,
                    newProvider: this.provider.id
                  },
                });
              }else if(!this.provider && this.providerFound){
                console.log('Remover Provider')
                promise = this.$apollo.mutate({
                  mutation: require('@/graphql/clinics/RemoveProductProvider.gql'),
                  variables: {
                    idProductProvider: this.providerFound.id
                  },
                });
              }


              return promise;
            },
            closeForm() {
                this.$emit('close-dialog')
            },

        }
    }
</script>