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
                            <v-layout row wrap>

                                <v-spacer/>
                                <v-btn text dark color="primary"  @click="selectClinic(this.clinicSelected), dataClinic = true">

                                    teste
                                </v-btn>

                                <v-dialog v-model="dialog" persistent width="500px">
                                    <template v-slot:activator="{ on }">
                                        <v-btn text color="primary" dark class="mb-2 " v-on="on" @click="newClinic()">
                                            <v-icon left>add</v-icon>
                                            Nova Clinica
                                        </v-btn>
                                    </template>
                                    <v-card>
                                        <v-card-title class="headline grey lighten-2" primary-title>
                                            <span class="headline">{{ formTitle }}</span>
                                        </v-card-title>

                                        <v-card-text>
                                            <v-container grid-list-md>
                                                <v-layout wrap>

                                                    <v-flex xs6>
                                                        <v-text-field
                                                                v-model="editedItem.name"
                                                                label="Nome da Clinica"
                                                                placeholder="Nome da Clinica"
                                                                outlined
                                                                clearable
                                                                hide-details
                                                        ></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs6>
                                                        <v-text-field
                                                                v-mask="mask.cnpj"
                                                                v-model="editedItem.cnpj"
                                                                label="CNPJ"
                                                                placeholder="CNPJ"
                                                                outlined
                                                                clearable
                                                                hide-details
                                                        ></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs6>
                                                        <v-text-field
                                                                v-mask="mask.telephone"
                                                                v-model="editedItem.telephone[0]"
                                                                label="Telefone"
                                                                placeholder="Telefone"
                                                                outlined
                                                                clearable
                                                                hide-details
                                                        ></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs6>
                                                        <v-text-field
                                                                v-model="cep"
                                                                v-mask="mask.cep"
                                                                label="CEP"
                                                                placeholder="CEP"
                                                                outlined
                                                                clearable
                                                                hide-details
                                                        ></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12>
                                                        <v-alert
                                                                v-model="alertCEP"
                                                                dense
                                                                outlined
                                                                dismissible
                                                                type="warning"
                                                        >
                                                            O CEP não foi localizado
                                                        </v-alert>
                                                    </v-flex>
                                                    <v-flex xs12>
                                                        <v-text-field
                                                                v-model="editedItem.address.street"
                                                                label="Logradouro"
                                                                placeholder="Logradouro"
                                                                outlined
                                                                hide-details
                                                                clearable
                                                        ></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs4>
                                                        <v-text-field
                                                                v-model="editedItem.address.number"
                                                                label="Nº"
                                                                placeholder="ex.: 157"
                                                                outlined
                                                                hide-details
                                                                clearable
                                                        ></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs8>
                                                        <v-text-field
                                                                v-model="editedItem.address.neighborhood"
                                                                label="Bairro"
                                                                placeholder="Bairro"
                                                                outlined
                                                                hide-details
                                                                clearable
                                                        ></v-text-field>
                                                    </v-flex>

                                                    <v-flex xs12>
                                                        <v-text-field
                                                                v-model="editedItem.address.complement"
                                                                label="Complemento"
                                                                placeholder="Complemento"
                                                                outlined
                                                                hide-details
                                                                clearable
                                                        ></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs7>
                                                        <v-select
                                                                :items="stateOptions"
                                                                label="Estado"
                                                                placeholder="Estado"
                                                                v-model="editedItem.address.state"
                                                                outlined
                                                                chips
                                                                hide-details
                                                                clearable
                                                        ></v-select>
                                                    </v-flex>
                                                    <v-flex xs5>
                                                        <v-text-field
                                                                label="Cidade"
                                                                placeholder="Cidade"
                                                                v-model="editedItem.address.city"
                                                                outlined
                                                                chips
                                                                hide-details
                                                                clearable
                                                        ></v-text-field>
                                                    </v-flex>
                                                    <p class="text-justify">Horario de Funcionamento de Segunda-Feira a
                                                        Sexta-Feira:</p>
                                                    <v-flex xs6>
                                                        <v-text-field
                                                                v-model="editedItem.startWeek"
                                                                label="Abre as:"
                                                                placeholder="Ex.: 08:00"
                                                                outlined
                                                                v-mask="mask.time"
                                                                clearable
                                                                hide-details
                                                        ></v-text-field>
                                                    </v-flex>
                                                    <v-spacer></v-spacer>
                                                    <v-flex xs6>
                                                        <v-text-field
                                                                v-model="editedItem.endWeek"
                                                                label="Fecha as:"
                                                                placeholder="Ex.: 18:00"
                                                                outlined
                                                                v-mask="mask.time"
                                                                clearable
                                                                hide-details
                                                        ></v-text-field>
                                                    </v-flex>
                                                    <p class="text-justify">Horario de Funcionamento de Sábado:</p>
                                                    <v-flex xs6>
                                                        <v-text-field
                                                                v-model="editedItem.startSaturday"
                                                                label="Abre as:"
                                                                placeholder="Ex.: 06:00"
                                                                outlined
                                                                v-mask="mask.time"
                                                                clearable
                                                                hide-details
                                                        ></v-text-field>
                                                    </v-flex>
                                                    <v-spacer></v-spacer>
                                                    <v-flex xs6>
                                                        <v-text-field
                                                                v-model="editedItem.endSaturday"
                                                                label="Fecha as:"
                                                                placeholder="Ex.: 12:00"
                                                                outlined
                                                                v-mask="mask.time"
                                                                clearable
                                                                hide-details
                                                        ></v-text-field>
                                                    </v-flex>
                                                </v-layout>
                                            </v-container>
                                        </v-card-text>
                                        <v-divider></v-divider>
                                        <v-card-actions>
                                            <v-btn rounded color="error" @click="close">Cancelar</v-btn>
                                            <v-spacer></v-spacer>
                                            <submit-button
                                                    color="success"
                                                    @click="save"
                                                    :disabled="!formIsValid"
                                                    text="Salvar"
                                                    :loading="loading"
                                                    :success="success"
                                            ></submit-button>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>

                            </v-layout>
                        </v-flex>
                        <v-toolbar flat color="white">
                            <v-spacer/>
                            <template>
                                <v-container>
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
                                </v-container>
                            </template>
                        </v-toolbar>
                    </template>

                    <template v-slot:item.action="{ item }">

                        <v-tooltip left color="warning">
                            <template v-slot:activator="{ on }">
                                <v-btn v-on="on" @click="editItem(item)" small dark fab color="warning" class="mr-2"><v-icon>edit</v-icon></v-btn>
                            </template>
                            <span>Editar Clinica</span>
                        </v-tooltip>

                        <v-tooltip top color="error">
                            <template v-slot:activator="{ on }">
                                <!--<v-btn v-on="on" @click="deleteItem(item)" small dark fab color="error" class="mr-2"><v-icon>delete</v-icon></v-btn>-->
                                <v-btn v-on="on" @click="confirmDeletion(item)" small dark fab color="error" class="mr-2"><v-icon>delete</v-icon></v-btn>
                            </template>
                            <span>Apagar Clinica</span>
                        </v-tooltip>
<!--                        <v-btn small dark fab color="primary_light" class="mr-2" @click="fixExamsWithouClinics(item)"><v-icon>assignment</v-icon></v-btn>-->
                        <v-tooltip top color="primary">
                            <template v-slot:activator="{ on }">
                                <v-btn v-on="on" small dark fab color="primary" class="mr-2" @click="selectClinic(item), Consultation = true"><v-icon>assignment</v-icon></v-btn>
                            </template>
                            <span>Adicionar Consultas</span>
                        </v-tooltip>

                        <v-tooltip top color="primary">
                            <template v-slot:activator="{ on }">
                                <v-btn v-on="on" small dark fab color="primary" class="mr-2" @click="selectClinic(item), Exam = true"><v-icon>poll</v-icon></v-btn>
                            </template>
                            <span>Adicionar Exames</span>
                        </v-tooltip>

                        <v-tooltip top color="error">
                            <template v-slot:activator="{ on }">
                                <v-btn v-on="on" small dark fab color="error" class="mr-2" @click="selectClinic(item), Product = true"><v-icon>assignment_late</v-icon></v-btn>
                            </template>
                            <span>Apagar Exames e Consultas</span>
                        </v-tooltip>

                        <v-tooltip right color="warning">
                            <template v-slot:activator="{ on }">
                                <v-btn v-on="on" small dark fab color="warning" class="mr-2" @click="selectClinic(item), Configuration = true "><v-icon>assignment_turned_in</v-icon></v-btn>
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
                <v-progress-circular indeterminate class="primary--text"></v-progress-circular>
            </v-flex>
        </v-layout>
        <v-overlay :value="loading">
            <v-progress-circular indeterminate class="primary--text"></v-progress-circular>
        </v-overlay>



        <v-dialog v-model="dataClinic" text hide-overlay><RegisterNewClinic @close-dialog="dataClinic = false"></RegisterNewClinic></v-dialog>
        <v-dialog v-model="Product" width="850px" text hide-overlay><Products @close-dialog="Product = false"></Products></v-dialog>
        <v-dialog v-model="Configuration" width="800px" text hide-overlay><Configurations @close-dialog="Configuration = false"></Configurations></v-dialog>
        <v-dialog v-model="Consultation" width="500px" text hide-overlay><Consultations @close-dialog="Consultation = false"></Consultations></v-dialog>
        <v-dialog v-model="Exam" width="500px" text hide-overlay><Exams @close-dialog="Exam = false"></Exams></v-dialog>

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
    import axios from 'axios';
    import Exams from "../../components/clinics/Exams";
    import Consultations from "../../components/clinics/Consultations";
    import Products from "../../components/clinics/Products";
    import Configurations from "../../components/clinics/Configurations";
    import SubmitButton from "../../components/SubmitButton";
    import RegisterNewClinic from "../../components/clinics/RegisterNewClinic";

    export default {
        components: {Configurations, Products, Consultations, Exams, SubmitButton, RegisterNewClinic},
        directives: {mask},
        data: () => ({
            Exam: false,
            dataClinic: false,
            Consultation: false,
            areyoushure: false,
            selectedClin: undefined,
            dialog: false,
            Product: false,
            Configuration: false,
            loading: false,
            success: false,
            search: '',
            mask: {
                cnpj: '##.###.###/####-##',
                telephone: '(##) #####-####',
                cep: '########',
                time: '##:##',
            },
            stateOptions: [
                'Acre (AC)',
                'Alagoas (AL)',
                'Amapá (AP)',
                'Amazonas (AM)',
                'Bahia (BA)',
                'Ceará (CE)',
                'Distrito Federal (DF)',
                'Espírito Santo (ES)',
                'Goiás (GO)',
                'Maranhão (MA)',
                'Mato Grosso (MT)',
                'Mato Grosso do Sul (MS)',
                'Minas Gerais (MG)',
                'Pará (PA)',
                'Paraíba (PB)',
                'Paraná (PR)',
                'Pernambuco (PE)',
                'Piauí (PI)',
                'Rio de Janeiro (RJ)',
                'Rio Grande do Norte (RN)',
                'Rio Grande do Sul (RS)',
                'Rondônia (RO)',
                'Roraima (RR)',
                'Santa Catarina (SC)',
                'São Paulo (SP)',
                'Sergipe (SE)',
                'Tocantins (TO)'
            ],
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

            editedIndex: -1,
            editedItem: {
                name: '',
                cnpj: '',
                telephone: [],
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
            cep: '',
            alertCEP: false,
            defaultItem: {
                name: '',
                cnpj: '',
                telephone: [],
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

            formIsValid() {
                return this.editedItem.name && this.editedItem.telephone[0]
            },

            formTitle() {
                return this.editedIndex === -1 ? 'Formulario de Cadastro de Clinicas' : 'Formulario de Cadastro de Clinicas'
            },

            clinics() {
                return this.$store.getters.clinics;
            },

            clinicSelected () {
                let clinic = this.$store.getters.selectedClinic;
                if (clinic) {
                    return clinic;
                } else {
                    return this.defaultItem;
                }

            },


        },

        mounted() {
            this.loadClinics()
        },

        watch: {

            dialog(val) {
                val || this.close()
            },

            cep(val) {
                if (val.length === 8) {
                    axios
                        .get('https://viacep.com.br/ws/' + val + '/json/')
                        .then((response) => {
                            if (response.data.erro) {
                                this.alertCEP = true
                            } else {
                                this.alertCEP = false
                                this.editedItem.address.street = response.data.logradouro;
                                this.editedItem.address.neighborhood = response.data.bairro;
                                this.editedItem.address.city = response.data.localidade;
                                var array = this.stateOptions;
                                /* console.log(
                                    array.find(function(element) {
                                        if(element.includes('AM')){
                                            return element;
                                        }

                                        return '';
                                    })
                                ); */
                                this.editedItem.state = array.find(function (element) {
                                    if (element.includes(response.data.uf)) {
                                        return element;
                                    }
                                    return '';
                                });
                            }

                        })
                } else {
                    this.editedItem.address.street = '';
                    this.editedItem.address.neighborhood = '';
                    this.editedItem.address.state = '';
                    this.editedItem.address.city = '';
                }
            },

        },

        methods: {


            async loadClinics() {
              this.loading = true;
              await this.$store.dispatch('getClinics');
              this.loading = false
            },

            selectClinic(item) {
                console.log(item)
                if (!item) {
                    console.log('if');
                    this.$store.dispatch('selectClinic', this.defaultItem);
                }
                this.editedIndex = this.clinics.indexOf(item);
                this.editedItem = Object.assign({}, item);
                this.$store.dispatch('selectClinic', item);
            },

            editItem(item) {
                this.editedIndex = this.clinics.indexOf(item);
                this.editedItem = Object.assign({}, item);
                this.cep = this.editedItem.address.cep;
                this.editedItem.startWeek = this.editedItem.agenda[0].split('-')[0]
                this.editedItem.endWeek = this.editedItem.agenda[0].split('-')[1]
                this.editedItem.startSaturday = this.editedItem.agenda[5].length > 0 ? this.editedItem.agenda[5].split('-')[0] : ''
                this.editedItem.endSaturday = this.editedItem.agenda[5].length > 0 ? this.editedItem.agenda[5].split('-')[1] : ''

                // this.complement = this.editedItem.address.complement
                // this.number = this.editedItem.address.number
                this.dialog = true;
            },

            confirmDeletion (item) {
                this.selectedClin = item
                this.areyoushure =  true
            },

            async deleteItem(item) {
                const index = this.clinics.indexOf(item);
                /*confirm('Are you sure you want to delete this item?')*/
/*                this.loading = true*/
                await this.$store.dispatch('deleteClinic', item)
                // await this.$store.dispatch('getClinics')
/*                this.success = true
                this.loading = false*/
                setTimeout(() => { this.areyoushure = false }, 1000)
            },

            close() {
                this.dialog = false;
                setTimeout(() => {
                    this.editedItem = Object.assign({}, this.defaultItem);
                    this.editedIndex = -1
                }, 300)
            },


            newClinic () {
                this.$store.dispatch('selectClinic', this.defaultItem);
                this.editedItem = Object.assign({}, this.defaultItem);
            },

            async save() {
                this.loading = true;
                if (this.editedIndex > -1) {
                    Object.assign(this.clinics[this.editedIndex], this.editedItem);
                } else {
                    this.clinics.push(this.editedItem);
                }

                let clinicData = {
                    address: {
                        neighboor: this.editedItem.address.neighborhood,
                        cep: this.cep,
                        city: this.editedItem.address.city,
                        complement: this.editedItem.address.complement,
                        state: this.editedItem.address.state,
                        street: this.editedItem.address.street,
                        number: this.editedItem.address.number,
                    },
                    id: this.editedItem.id,
                    name: this.editedItem.name.toUpperCase(),
                    cnpj: this.editedItem.cnpj,
                    telephone: this.editedItem.telephone,
                }

                let agenda = []
                for (let i = 0; i < 7; i++) {
                    if (i < 5) {
                        agenda.push(this.editedItem.startWeek + '-' + this.editedItem.endWeek)
                    } else if (i === 5) {
                        agenda.push(this.editedItem.startSaturday + '-' + this.editedItem.endSaturday)
                    }
                }
                clinicData.agenda = agenda

                await this.$store.dispatch('addClinic', clinicData)
                await this.$store.dispatch('getClinics')
                this.success = true
                this.loading = false
                setTimeout(() => {
                    this.close()
                }, 1000)
            },
        },
    }
</script>
