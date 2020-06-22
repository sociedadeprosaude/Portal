<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-flex sm12>
                <v-card class="pt-3 mb-4">
                    <v-layout row wrap>
                        <v-flex sm8>
                                <v-text-field outlined
                                              v-model="search"
                                              placeholder="Clinicas"
                                              class="mx-5"
                                              color="primary"
                                              id="search"
                                />
                        </v-flex>
                        <v-flex sm4 class="text-right pr-3 mt-2">
                            <v-btn outlined class="primary--text" @click="selectClinic(null, -1)">cadastrar clínica</v-btn>
                        </v-flex>
                    </v-layout>
                </v-card>

                <v-card>
                    <v-card-text >


                    </v-card-text>
                </v-card>
            </v-flex>
            <v-dialog v-model="dataClinic" width="500px" text hide-overlay>
                <RegisterNewClinic @close-dialog="dataClinic = false"/>
            </v-dialog>
        </v-layout>
    </v-container>
</template>
<script>

    import RegisterNewClinic from "../../components/clinics/RegisterNewClinic";

    export default {

        components: {RegisterNewClinic},

        data: () => ({
            search: '',
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

        },

        computed: {
            loadingClinics() {
                return !this.$store.getters.clinicsLoaded
            },
            clinics () {
                let clinics = this.$store.getters.clinics.filter( a => {
                    let response = true;
                    if (this.search) {
                        if (this.search !== a.name) response = false;
                    }
                    return response;
                });
                console.log(clinics);
            },
        },

        methods: {

            selectClinic(item, index) {
                if (!item) {
                    item = this.defaultItem;
                }
                this.$store.dispatch('putIndex', index);
                this.$store.dispatch('selectClinic', item);
                this.dataClinic = true;

            },
        }

    }
</script>