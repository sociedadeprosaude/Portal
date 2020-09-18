<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-flex xs12 class="text-center" v-if="loadingClinics">
                <v-progress-circular indeterminate class="primary--text"/>
            </v-flex>
            <v-flex sm12 v-else>
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
                                    <ListClinics :clinics="new Array(clinic)" :loading="loading"/>
                                </v-flex>
                              </div>
                            </div>
                          </div>
                        </template>
                      </ApolloQuery>
                      </v-flex>

                        <v-flex sm4 class="text-right pr-3 mt-2">
                            <v-btn outlined class="primary--text" @click="selectClinic(null, -1)">cadastrar clínica</v-btn>
                        </v-flex>
                    </v-layout>
                </v-card>

                <v-card>
                    <v-card-text>
                      <h1>APOLLO</h1>
                      <ApolloQuery
                          :query="require('@/graphql/clinics/LoadAllClinics.gql')"
                      >
                        <template slot-scope="{ result: { data } }">
                          <ListClinics :clinics="data.Clinic" :loading="loading"/>
                        </template>
                      </ApolloQuery>

                      <h1>FIREBASE</h1>
                        <ListClinics :clinics="clinics" :loading="loading"/>
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
            loading: false,
            dataClinic: false,

            defaultItem: {
                name: '',
                cnpj: '',
                telephone: [''],
                address: {
                    street: '',
                    number: '',
                    neighborhood: '',
                    cep: '',
                    complement: '',
                    state: '',
                    city: '',
                },
                startWeek: '',
                endWeek: '',
                startSaturday: '',
                endSaturday: ''
            },

        }),

        mounted() {
            this.loadClinics();
        },

        computed: {
            loadingClinics() {
                return !this.$store.getters.clinicsLoaded
            },

            clinics () {
                return this.$store.getters.clinics.filter(a => a.name >= this.search.toUpperCase());
            },

        },

        mounted() {
            this.loadClinic()
        },

        methods: {

            async loadClinic() {
                this.loading = true;
                await this.$store.dispatch('getClinics');
                this.loading = false;
                console.log(this.$store.getters.clinics)
            },

            selectClinic(item, index) {
                if (!item) {
                    item = this.defaultItem;
                }
                this.$store.dispatch('putIndex', index);
                this.$store.dispatch('selectClinic', item);
                this.dataClinic = true;
            },

            finishRegister () {
                this.dataClinic = false;
                this.loadClinics();
            }
        }

    }
</script>