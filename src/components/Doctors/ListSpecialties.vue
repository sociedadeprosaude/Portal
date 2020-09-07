<template>
    <v-container fluid>
        <v-layout v-if="specialties" row nowrap>
            <v-flex xs12 v-if="loading">
                <v-progress-circular class="primary--text" indeterminate/>
            </v-flex>
            <v-flex xs12 v-if="specialties.length === 0 && loading === false">
                <p>Não há resultado para a pesquisa realizada</p>
            </v-flex>
          <!--v-if="specialties.length !== 0"-->
            <div style="width: 100%">
              <v-flex xs12 sm12 class="mb-5">
                <!-- Apollo Query -->
                <ApolloQuery
                    :query="require('@/graphql/products/ReadProcucts.gql')"
                    :variables="{ type:'SPECIALTY', schedulable:false}"
                >
                  <template slot-scope="{ result: { data } }">
                    <v-flex xs12 sm12 class="mb-5" v-for="(specialty,i) in data.Product" :key="i">
                      <v-card>
                        <v-flex xs12 sm12>
                          <v-card color="primary">
                            <v-layout row wrap>
                              <v-flex sm10>
                                <p class="white--text text-left font-weight-bold pt-4 pb-3 pl-4">
                                  {{specialty.name}}
                                </p>
                              </v-flex>
                              <v-flex sm2 class="text-right mt-2">
                                <v-btn icon dark><v-icon small @click="editSpecialty(specialty)">edit</v-icon></v-btn>
                                <v-btn icon dark><v-icon small>delete</v-icon></v-btn>
                              </v-flex>
                            </v-layout>
                          </v-card>
                        </v-flex>
                      </v-card>
                    </v-flex>
                  </template>
                </ApolloQuery>
              </v-flex>
            </div>
        </v-layout>
        <v-dialog v-model="editingSpecialty" max-width="500px">
            <EditSpecialty :specialty="specialty" @close="closeDialogs"/>
        </v-dialog>
    </v-container>
</template>
<script>
    import EditSpecialty from "./EditSpecialty"

    export default {
        props: ['specialties', 'loading'],
        components: {EditSpecialty},

        data: () => ({
            specialty: undefined,
            editingSpecialty: false,
        }),

        methods: {
            editSpecialty (specialty) {
                this.specialty = specialty;
                this.editingSpecialty = true;
            },
            closeDialogs () {
                this.specialty = undefined;
                this.editingSpecialty = false;
            }
        }
    }
</script>