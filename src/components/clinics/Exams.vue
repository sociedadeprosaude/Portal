<template>
    <v-card width="500">
        <v-card-title class="headline grey lighten-2" primary-title>
            <span class="headline">Cadastro de Exames</span>
            <v-spacer></v-spacer>
            <v-btn small color="error" @click="closeDialog()"><v-icon>close</v-icon></v-btn>
        </v-card-title>
        <v-card-text>
            <v-container grid-list-md>
                <v-layout align-center justify-center wrap>
                    <v-flex xs12>
                        <v-text-field
                                prepend-icon="business"
                                label="Clinicas"
                                outlined
                                readonly
                                v-model="clinic.name"
                                hide-details
                        />
                    </v-flex>
                    <v-flex xs12>
                      <ApolloQuery
                          :query="require('@/graphql/products/ReadProcucts.gql')"
                          :variables="{ type:'EXAM', schedulable:false}"
                      >
                        <template slot-scope="{ result: { data } }">
                          <v-combobox
                              prepend-inner-icon="search"
                              prepend-icon="poll"
                              :items="data.Product"
                              item-text="name"
                              return-object
                              label="Exames"
                              outlined
                              v-model="newExam"
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
                    <v-flex>
                        <v-flex xs12>
                            <v-btn v-on:click="addToList" :disabled="!addIsValid" color="success">
                                <v-icon>add</v-icon>
                                adicionar na lista de exames
                            </v-btn>
                        </v-flex>
                        <v-flex>
                            <v-btn v-on:click="deleteFromList" :disabled="!deleteIsValid" color="error">
                                <v-icon>delete_forever</v-icon>
                                Limpar lista de exames
                            </v-btn>
                        </v-flex>
                    </v-flex>
                    <v-flex xs12>
                        <strong>EXAMES SELECIONADOS:</strong>
                    </v-flex>
                    <v-flex>
                      <v-select
                          :items="exams"
                          item-text="name"
                          return-object
                          multiple
                          v-model="exams"
                          chips
                          outlined
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
                      {{exams}}
                    </v-flex>

                    <v-flex xs12>
                        <v-currency-field
                                prepend-icon="attach_money"
                                outlined
                                clearable
                                label="Preço de Custo"
                                prefix="R$"
                                v-model="cost"
                                hide-details
                        ></v-currency-field>
                    </v-flex>
<!--                    <v-flex xs6>
                        <v-currency-field
                                prepend-icon="monetization_on"
                                outlined
                                clearable
                                label="Preço de Venda"
                                prefix="R$"
                                v-model="sale"
                                hide-details
                        ></v-currency-field>
                    </v-flex>-->
<!--                    <v-flex xs12>
                        <v-textarea
                                outlined
                                v-model="obs"
                                label="Observação:"
                                counter
                                clearable
                                maxlength="280"
                                full-width
                                single-line
                                hide-details
                        ></v-textarea>
                    </v-flex>-->
                </v-layout>
            </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-layout align-center justify-center>
              <v-spacer />
              <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
              <v-btn v-else color="primary" @click="Create()">ADICIONAR</v-btn>
            </v-layout>
        </v-card-actions>
    </v-card>
</template>

<script>
    export default {
      props: ['clinic'],
        data: () => ({
            cost: 0,
            exams: [],
            newExam: null,
            loading: false,
        }),
        computed: {
            addIsValid() {
                return this.newExam
            },
            deleteIsValid() {
                return this.exams.length > 0
            },
        },
        mounted() {
            window.addEventListener('keydown', this.handleEnter)
        },
        beforeDestroy() {
            window.removeEventListener('keydown', this.handleEnter)
        },
        methods: {
            handleEnter(e) {
                if (e.key === 'Enter') {
                    this.addToList()
                }
            },
            addToList() {
                if (this.exams.indexOf(this.newExam) > -1) {
                    return
                }
                this.exams.push(this.newExam);
                this.newExam = null;
            },
            deleteFromList() {
                this.exams = [];
            },
          async Create(){
            this.loading = true
            for(let product in this.exams) {
              const dataCostProductClinic = await this.$apollo.mutate({
                mutation: require('@/graphql/clinics/CreateCostProductClinic.gql'),
                variables: {
                  cost: this.cost,
                },
              });
              const idCostProductClinic = dataCostProductClinic.data.CreateCostProductClinic.id
              const dataRelations = await this.$apollo.mutate({
                mutation: require('@/graphql/clinics/AddCostProductClinicWith_clinicAndProduct.gql'),
                variables: {
                  idClinic: this.clinic.id,
                  idCostProductClinic: idCostProductClinic,
                  idProduct: this.exams[product].id,
                },
              });
              console.log('relations:', dataRelations.data)
            }
            this.loading = false
            this.$router.push('/')
          },

          closeDialog: function() {
            this.$emit('close-dialog')
          }
        }
    }
</script>
