<template>
    <v-container fluid>
        <v-layout row nowrap>
            <div style="width: 100%">
              <ApolloQuery
                  :query="require('@/graphql/products/ReadProcucts.gql')"
                  :variables="{ type:'EXAM', schedulable:true}"
              >
                <template slot-scope="{ result: { data } }">
                  <v-flex sm12 v-for="(examType, i) in data.Product" :key="i" class="mb-5">
                    <v-card>
                      <v-flex xs12 sm12>
                        <v-card color="primary">
                          <v-layout row wrap>
                            <v-flex sm10>
                              <p class="white--text text-left font-weight-bold pt-4 pb-3 pl-4">
                                {{examType.name}}
                              </p>
                            </v-flex>
                            <v-flex sm2 class="text-right mt-2">
                              <v-btn icon dark><v-icon small @click="selectExamType(examType)">edit</v-icon></v-btn>
                              <ApolloMutation
                                  :mutation="require('@/graphql/products/DeleteProducts.gql')"
                                  :variables="{ id: examType.id }"
                              >
                                <template v-slot="{ mutate, loading, error }">
                                  <v-progress-circular indeterminate color="primary" v-if="loading"></v-progress-circular>
                                  <v-btn icon dark><v-icon small @click.native="deleteProduct(mutate)">delete</v-icon></v-btn>
                                  <p v-if="error">Ocorreu um erro: {{ error }}</p>
                                </template>
                              </ApolloMutation>
                            </v-flex>
                          </v-layout>
                        </v-card>
                      </v-flex>
                    </v-card>
                  </v-flex>
                </template>
              </ApolloQuery>
            </div>
            <v-dialog v-model="editExamType">
              <createExamType :registed="registed" :selectedExamType="examType" @close-dialog="editExamType = false" />
            </v-dialog>
            <v-dialog v-model="alertDelete" persistent max-width="400">
                <v-card>
                    <v-card-title><strong>Deseja excluir este tipo de exame?</strong></v-card-title>
                    <v-card-text class="ml-n2">Este tipo de exame será excluído permanentemente.</v-card-text>
                    <v-card-actions>
                        <v-spacer/>
                        <v-btn color="error" text
                               @click="alertDelete = false, deleteExamType(examType)">EXCLUIR
                        </v-btn>
                        <v-btn color="primary" text @click="alertDelete = false">CANCELAR
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-layout>
    </v-container>
</template>
<script>
    import createExamType from "./CreateExamType"
    export default {
        components: {createExamType},
        data: () => ({
            editExamType: false,
            registed: true,
            examType: null,
            alertDelete: false,
        }),

        computed:{
            selectedExamType:{
                set(value){
                    this.examType = value
                },
                get(){
                    return this.examType
                }
            }
        },

        methods: {
          deleteProduct(mutate) {
            setTimeout(() => {
              mutate();
            }, 0);
            this.$router.push('/')
          },

            async selectExamType (examType) {
                this.examType = examType;
                this.editExamType = true;
            },
            openAlertDelete (examType) {
                this.examType = examType;
                this.alertDelete = true;
            },

            async deleteExamType(examType) {
                await this.$store.dispatch('deleteExamType', examType.name);
                this.$emit('clear-search')
            },
        }
    }
</script>