<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-flex sm12>
                <v-card class="pt-3 mb-4">
                    <v-layout row wrap>
                      <v-flex sm8>
                      <ApolloQuery
                          :query="require('@/graphql/clinics/LoadAllClinics.gql')"
                      >
                        <template slot-scope="{ result: { data } }">
                        <v-flex sm12>
                                <v-text-field outlined
                                              v-model="search"
                                              placeholder="Clinicas"
                                              class="mx-5"
                                              color="primary"
                                              id="search"
                                />
                        </v-flex>
                          <div v-if="search">
                            <div v-for="(clinic,i) in data.Clinic" :key="i">
                              <div v-if="clinic.name === (search.toUpperCase()) ">
                                <v-flex x12>
                                  {{clinic.name}}
                                    <ListClinics :clinics="new Array(clinic)"/>
                                </v-flex>
                              </div>
                            </div>
                          </div>
                        </template>
                      </ApolloQuery>
                      </v-flex>
                        <v-flex sm4 class="text-right pr-3 mt-2">
                            <v-btn outlined class="primary--text" @click="dataClinic = true">cadastrar clínica</v-btn>
                        </v-flex>
                    </v-layout>
                </v-card>

                <v-card>
                  <v-card-text>
                    <ApolloQuery
                        :query="require('@/graphql/clinics/LoadAllClinics.gql')"
                    >
                      <template slot-scope="{ result: { data } }">
                        <ListClinics :clinics="data.Clinic"/>
                      </template>
                    </ApolloQuery>
                  </v-card-text>
                </v-card>
            </v-flex>
            <v-dialog v-model="dataClinic" width="500px" text hide-overlay>
                <RegisterNewClinic @close-dialog="finishRegister()"/>
            </v-dialog>
        </v-layout>
    </v-container>
</template>

<script>
    import RegisterNewClinic from "../../components/clinics/RegisterNewClinic";
    import ListClinics from "../../components/clinics/ListClinics"
    export default {
        components: {RegisterNewClinic, ListClinics},
        data: () => ({
            search: '',
            dataClinic: false,
        }),
        methods: {
            finishRegister(){
              this.dataClinic = false;
            },
        }

    }
</script>