<template>
    <v-container>
        <v-layout row wrap>
            <v-flex v-if="!loadingClinics">
                <v-data-table
                        :headers="headers"
                        :search="search"
                        :items="clinics"
                        sort-by="cnpj"
                        class="elevation-6"
                        :items-per-page="-1"
                >
                    <template v-slot:top>
                        <v-flex xs12 class="text-right pa-2">
                            <v-spacer/>
                            <v-btn text dark color="primary" @click="selectClinic(null, -1), dataClinic = true">
                                <v-icon left>add</v-icon>
                                Nova Clinica
                            </v-btn>
                        </v-flex>
                        <v-toolbar flat color="white">
                            <template>
                                <v-flex>
                                    <v-text-field
                                            v-model="search"
                                            append-icon="search"
                                            label="Pesquisa"
                                            color="black"
                                            single-line
                                            hide-details
                                    />
                                </v-flex>
                            </template>
                        </v-toolbar>
                    </template>

                    <template v-slot:item.action="{ item }">
                        <v-tooltip left color="warning">
                            <template v-slot:activator="{ on }">
                                <v-btn v-on="on" @click="makePropForEditing(item), editingClinic=true" small dark fab
                                       color="warning" class="mr-2">
                                    <v-icon>edit</v-icon>
                                </v-btn>
                            </template>
                            <span>Editar Clinica</span>
                        </v-tooltip>

                        <v-tooltip top color="error">
                            <template v-slot:activator="{ on }">
                                <v-btn v-on="on" @click="confirmDeletion(item)" small dark fab color="error"
                                       class="mr-2">
                                    <v-icon>delete</v-icon>
                                </v-btn>
                            </template>
                            <span>Apagar Clinica</span>
                        </v-tooltip>
                        <v-tooltip top color="primary">
                            <template v-slot:activator="{ on }">
                                <v-btn v-on="on" small dark fab color="primary" class="mr-2"
                                       @click="selectClinic(item), Consultation = true">
                                    <v-icon>assignment</v-icon>
                                </v-btn>
                            </template>
                            <span>Adicionar Consultas</span>
                        </v-tooltip>

                        <v-tooltip top color="primary">
                            <template v-slot:activator="{ on }">
                                <v-btn v-on="on" small dark fab color="primary" class="mr-2"
                                       @click="selectClinic(item), Exam = true">
                                    <v-icon>poll</v-icon>
                                </v-btn>
                            </template>
                            <span>Adicionar Exames</span>
                        </v-tooltip>

                        <v-tooltip top color="error">
                            <template v-slot:activator="{ on }">
                                <v-btn v-on="on" small dark fab color="error" class="mr-2"
                                       @click="selectClinic(item), Product = true">
                                    <v-icon>assignment_late</v-icon>
                                </v-btn>
                            </template>
                            <span>Apagar Exames e Consultas</span>
                        </v-tooltip>

                        <v-tooltip right color="warning">
                            <template v-slot:activator="{ on }">
                                <v-btn v-on="on" small dark fab color="warning" class="mr-2"
                                       @click="selectClinic(item), Configuration = true ">
                                    <v-icon>assignment_turned_in</v-icon>
                                </v-btn>
                            </template>
                            <span>Editar Exames e Consultas</span>
                        </v-tooltip>

                    </template>

                    <template v-slot:no-results>
                        <v-alert :value="true" color="error" icon="warning">
                            Your search for "{{ search }}" found no results.
                        </v-alert>
                    </template>
                </v-data-table>
            </v-flex>
            <v-flex xs12 class="text-center" v-else>
                <v-progress-circular indeterminate class="primary--text"/>
            </v-flex>
        </v-layout>

        <v-overlay :value="loading">
            <v-progress-circular indeterminate class="primary--text"/>
        </v-overlay>

        <v-dialog v-model="dataClinic" width="500px" text hide-overlay>
            <RegisterNewClinic @close-dialog="dataClinic = false"/>
        </v-dialog>
        <v-dialog v-model="editingClinic" width="500px" text hide-overlay>
            <EditClinic :clinic="clinic" @close-dialog="editingClinic = false"/>
        </v-dialog>
        <v-dialog v-model="Product" width="850px" text hide-overlay>
            <Products @close-dialog="Product = false"/>
        </v-dialog>
        <v-dialog v-model="Configuration" width="800px" text hide-overlay>
            <Configurations @close-dialog="Configuration = false"/>
        </v-dialog>
        <v-dialog v-model="Consultation" width="500px" text hide-overlay>
            <Consultations @close-dialog="Consultation = false"/>
        </v-dialog>
        <v-dialog v-model="Exam" width="500px" text hide-overlay>
            <Exams @close-dialog="Exam = false"/>
        </v-dialog>

        <v-dialog v-if="selectedClin" v-model="areyoushure" max-width="350px">
            <v-card>
                <v-card-title class="headline">Apagar Clínica ?</v-card-title>
                <v-divider/>
                <v-card-text class="headline">
                    {{ selectedClin.name }}
                </v-card-text>
                <v-divider/>
                <v-card-actions>
                    <v-btn rounded color="error" @click="areyoushure = false">Cancelar</v-btn>
                    <v-spacer/>
                    <v-btn rounded color="success" @click="deleteItem(selectedClin)">Confirmar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-container>
</template>

<script>
    import {mask} from 'vue-the-mask';
    import Exams from "../../components/clinics/Exams";
    import Consultations from "../../components/clinics/Consultations";
    import Products from "../../components/clinics/Products";
    import Configurations from "../../components/clinics/Configurations";
    import RegisterNewClinic from "../../components/clinics/RegisterNewClinic";
    import SubmitButton from "../../components/SubmitButton";
    import EditClinic from "../../components/clinics/EditClinic";
    export default {
        components: {EditClinic, Configurations, Products, Consultations, Exams, SubmitButton, RegisterNewClinic},
        directives: {mask},
        data: () => ({
            Exam: false,
            Consultation: false,
            dataClinic: false,
            clinic: undefined,
            editingClinic: false,
            areyoushure: false,
            selectedClin: undefined,
            Product: false,
            Configuration: false,
            loading: false,
            search: '',
            headers: [
                {
                    text: 'Clinica',
                    value: 'name',
                    align: 'left',
                    sortable: false,
                },
                {text: 'CNPJ', value: 'cnpj', align: 'left', sortable: false},
                {text: 'Telefone', value: 'telephone', align: 'left', sortable: false},
                {text: 'Actions', value: 'action', align: 'center', sortable: false}
            ],

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

        computed: {
            loadingClinics() {
                return !this.$store.getters.clinicsLoaded
            },

            clinics() {
                return this.$store.getters.clinics;
            },

        },

        mounted() {
            this.loadClinic()
        },

        watch: {},

        methods: {

            async loadClinic() {
                this.loading = true;
                await this.$store.dispatch('getClinics');
                this.loading = false
            },


            makePropForEditing(item){
                this.clinic = this.clinics[this.clinics.indexOf(item)]
            },

            selectClinic(item, index) {
                if (!item) {
                    item = this.defaultItem;
                }
                this.$store.dispatch('putIndex', index);
                this.$store.dispatch('selectClinic', item);
            },

            confirmDeletion(item) {
                this.selectedClin = item;
                this.areyoushure = true
            },

            async deleteItem(item) {
                await this.$store.dispatch('deleteClinic', item);
                setTimeout(() => {
                    this.areyoushure = false
                }, 1000)
            },

        },
    }
</script>
