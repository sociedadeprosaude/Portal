<template>
    <v-card width="500">
        <v-card-title class="headline grey lighten-2 mb-4" primary-title>
            <span class="headline">Dados da Clínica</span>
        </v-card-title>
        <v-card-text>
            <v-container class="grid-list-md">
                <v-layout wrap>
                    <v-flex xs6>
                        <v-text-field
                                v-model="clinic.name"
                                :label="'clinic.name' ? 'Nome da Clinica' : ''"
                                placeholder="Nome da Clinica"
                                outlined
                                clearable
                                hide-details
                        />
                    </v-flex>
                    <v-flex xs6>
                        <v-text-field
                                v-mask="mask.cnpj"
                                v-model="clinic.cnpj"
                                label="CNPJ"
                                placeholder="CNPJ"
                                outlined
                                clearable
                                hide-details
                        />
                    </v-flex>
                    <v-flex xs6>
                        <v-text-field
                                v-mask="mask.telephone"
                                v-model="clinic.telephone[0]"
                                label="Telefone"
                                placeholder="Telefone"
                                outlined
                                clearable
                                hide-details
                        />
                    </v-flex>
                    <v-flex xs6>
                        <v-text-field
                                v-model="ceps"
                                v-mask="mask.cep"
                                label="CEP"
                                placeholder="CEP"
                                outlined
                                clearable
                                hide-details
                        />
                    </v-flex>
                    <v-flex xs12>
                        <v-alert
                                v-model="alertCEP"
                                dense
                                outlined
                                dismissible
                                type="warning"
                        >O CEP não foi localizado
                        </v-alert>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field
                                v-model="clinic.address.street"
                                label="Logradouro"
                                placeholder="Logradouro"
                                outlined
                                hide-details
                                clearable
                        />
                    </v-flex>
                    <v-flex xs4>
                        <v-text-field
                                v-model="clinic.address.number"
                                label="Nº"
                                placeholder="ex.: 157"
                                outlined
                                hide-details
                                clearable
                        />
                    </v-flex>
                    <v-flex xs8>
                        <v-text-field
                                v-model="clinic.address.neighborhood"
                                label="Bairro"
                                placeholder="Bairro"
                                outlined
                                hide-details
                                clearable
                        />
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field
                                v-model="clinic.address.complement"
                                label="Complemento"
                                placeholder="Complemento"
                                outlined
                                hide-details
                                clearable
                        />
                    </v-flex>
                    <v-flex xs7>
                        <v-select
                                :items="stateOptions"
                                label="Estado"
                                placeholder="Estado"
                                v-model="clinic.address.state"
                                outlined
                                chips
                                hide-details
                                clearable
                        />
                    </v-flex>
                    <v-flex xs5>
                        <v-text-field
                                label="Cidade"
                                placeholder="Cidade"
                                v-model="clinic.address.city"
                                outlined
                                chips
                                hide-details
                                clearable
                        />
                    </v-flex>
                    <p class="text-justify">Horario de Funcionamento de Segunda-Feira a Sexta-Feira:</p>
                    <v-flex xs6>
                        <v-text-field
                                v-model="clinic.startWeek"
                                label="Abre as:"
                                placeholder="Ex.: 08:00"
                                outlined
                                v-mask="mask.time"
                                clearable
                                hide-details
                        />
                    </v-flex>
                    <v-spacer/>
                    <v-flex xs6>
                        <v-text-field
                                v-model="clinic.endWeek"
                                label="Fecha as:"
                                placeholder="Ex.: 18:00"
                                outlined
                                v-mask="mask.time"
                                clearable
                                hide-details
                        />
                    </v-flex>
                    <p class="text-justify">Horario de Funcionamento de Sábado:</p>
                    <v-flex xs6>
                        <v-text-field
                                v-model="clinic.startSaturday"
                                label="Abre as:"
                                placeholder="Ex.: 06:00"
                                outlined
                                v-mask="mask.time"
                                clearable
                                hide-details
                        />
                    </v-flex>
                    <v-spacer/>
                    <v-flex xs6>
                        <v-text-field
                                v-model="clinic.endSaturday"
                                label="Fecha as:"
                                placeholder="Ex.: 12:00"
                                outlined
                                v-mask="mask.time"
                                clearable
                                hide-details
                        />
                    </v-flex>
                  <v-flex xs12>
                    <v-textarea
                        filled
                        v-model="logo"
                        label="Link da logo da unidade pro-saúde (se for unidade pro-sáude)"
                    ></v-textarea>
                  </v-flex>
                  <v-flex>
                    <v-checkbox
                        v-model="property"
                        color="green"
                        :label="`Unidade pro-saúde ? : ${property.toString()}`"
                    ></v-checkbox>
                  </v-flex>
                </v-layout>
            </v-container>
        </v-card-text>
        <v-divider/>
        <v-card-actions>
            <v-btn rounded color="error" @click="closeDialog">Cancelar</v-btn>
            <v-spacer/>
          <ApolloMutation
              :mutation="require('@/graphql/clinics/CreateClinics.gql')"
              :variables="{
                name: clinic.name,
                cnpj: clinic.cnpj,
                telephone: clinic.telephone[0],
                logo: logo,
                property: property,
                opening_hours: opening_hours,
              }"
              @done="closeDialog"
          >
            <template v-slot="{ mutate, loading, error }">
              <v-btn
                  color="primary"
                  :disabled="loading"
                  @click.native="createClinic(mutate)"
              >Adicionar</v-btn>
              <p v-if="error">Ocorreu um erro: {{ error }}</p>
            </template>
          </ApolloMutation>

        </v-card-actions>
    </v-card>
</template>

<script>
    import {mask} from 'vue-the-mask';
    import axios from 'axios';
    import SubmitButton from "../../components/SubmitButton";

    export default {
        components: {SubmitButton},
        directives: {mask},
        data: () => ({

            selectedClin: undefined,
            Product: false,
            loading: false,
            success: false,
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
            ceps: '',
            logo: null,
            checkbox: true,
            property: false,
            opening_hours: null,
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

            formIsValid() {
                return this.clinic.name && this.clinic.telephone[0]
            },

            clinic() {
                return this.$store.getters.selectedClinic;
            },

            indexClinic () {
                return this.$store.getters.indexClinic;
            },
            clinics() {
                return this.$store.getters.clinics;
            },

        },

        watch: {
            ceps(val) {
                if (val.length === 8) {
                    axios
                        .get('https://viacep.com.br/ws/' + val + '/json/')
                        .then((response) => {
                            if (response.data.erro) {
                                this.alertCEP = true
                            } else {
                                this.alertCEP = false;
                                this.clinic.address.street = response.data.logradouro;
                                this.clinic.address.neighborhood = response.data.bairro;
                                this.clinic.address.city = response.data.localidade;
                                let array = this.stateOptions;
                                this.clinic.state = array.find(function (element) {
                                    if (element.includes(response.data.uf)) {
                                        return element;
                                    }
                                    return '';
                                });
                            }

                        })
                } else {
                    this.clinic.address.street = '';
                    this.clinic.address.neighborhood = '';
                    this.clinic.address.state = '';
                    this.clinic.address.city = '';
                }
            },


        },

         async beforeUpdate () {
             let clinic = await this.$store.getters.clinic;
             let indexClinic  = await this.$store.getters.indexClinic;
             this.addDataToClinicExist(clinic, indexClinic);
        },

        methods: {
            createClinic(mutate) {
              this.clinic.name = this.clinic.name.toUpperCase()
              let agenda = [];
              for (let i = 0; i < 7; i++) {
                if (i < 5) {
                  agenda.push(this.clinic.startWeek + '-' + this.clinic.endWeek)
                } else if (i === 5) {
                  agenda.push(this.clinic.startSaturday + '-' + this.clinic.endSaturday)
                }
              }
              this.opening_hours = agenda
              console.log(typeof (this.clinic.cnpj))
              setTimeout(() => {
                mutate();
              }, 0);
            },
            closeDialog : function () {
                this.$emit('close-dialog');
                this.clearData();
            },

            clearData() {
                this.$store.dispatch('selectClinic', this.defaultItem);
                this.$store.dispatch('putIndex', null);
            },

            addDataToClinicExist (clinic, indexClinic) {
                if (indexClinic !== -1 && indexClinic !==null){
                    this.cep = this.clinic.address.cep;
                    this.clinic.address.neighborhood = this.clinic.address.neighboor;
                    this.clinic.startWeek = this.clinic.agenda[0].split('-')[0];
                    this.clinic.endWeek = this.clinic.agenda[0].split('-')[1];
                    this.clinic.startSaturday = this.clinic.agenda[5].length > 0 ? this.clinic.agenda[5].split('-')[0] : '';
                    this.clinic.endSaturday = this.clinic.agenda[5].length > 0 ? this.clinic.agenda[5].split('-')[1] : ''

                } else {
                    this.cep = '';
                }
            },

            async save() {
                this.loading = true;
                if (this.indexClinic > -1) {
                    Object.assign(this.clinics[this.indexClinic], this.clinic);
                } else {
                    this.clinics.push(this.clinic);
                }

                let clinicData = {
                    address: {
                        neighboor: this.clinic.address.neighborhood,
                        cep: this.ceps,
                        city: this.clinic.address.city,
                        complement: this.clinic.address.complement,
                        state: this.clinic.address.state,
                        street: this.clinic.address.street,
                        number: this.clinic.address.number,
                    },
                    id: this.clinic.id,
                    name: this.clinic.name.toUpperCase(),
                    cnpj: this.clinic.cnpj,
                    telephone: this.clinic.telephone,
                };

                let agenda = [];
                for (let i = 0; i < 7; i++) {
                    if (i < 5) {
                        agenda.push(this.clinic.startWeek + '-' + this.clinic.endWeek)
                    } else if (i === 5) {
                        agenda.push(this.clinic.startSaturday + '-' + this.clinic.endSaturday)
                    }
                }
                clinicData.agenda = agenda;

                await this.$store.dispatch('addClinic', clinicData);
                await this.$store.dispatch('getClinics');
                this.success = true;
                this.loading = false;
                setTimeout(() => {
                    this.closeDialog()
                }, 1000)
            },
        },
    }
</script>
