<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12>
                <v-card>
                    <v-card-title class="headline grey lighten-2" primary-title>
                        <span class="headline">Dados da Clínica</span>
                    </v-card-title>
                    <v-card-text grid-list-md>
                        <v-layout wrap>
                            <v-flex xs6>
                                <v-text-field
                                        v-model="clinic.name"
                                        label="Nome da Clinica"
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
                                        v-model="cep"
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
                                >O CEP não foi localizado</v-alert>
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
                                        :items="states"
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
                                        :items="cities[address.state]"
                                        v-if="clinic.address.uf"
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
                        </v-layout>
                    </v-card-text>
                    <v-divider/>
                    <v-card-actions>
                        <v-btn rounded color="error" @click="close">Cancelar</v-btn>
                        <v-spacer/>
                            <submit-button
                                    color="success"
                                    @click="save"
                                    :disabled="!formIsValid"
                                    text="Salvar"
                                    :loading="loading"
                                    :success="success"
                            />
                        </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
    import SubmitButton from "../../components/SubmitButton";
    import {mask} from 'vue-the-mask';
    import axios from 'axios';

    export default {

        name: "RegisterNewClinic",
        components: {SubmitButton},
        directives: {mask},

        data: () => ({
            loading: false,
            success: false,
            cep: '',
            alertCEP: false,
            states: ['AM'],
            cities: {'AC': [], 'AL': [], 'AM': []},
            mask: {
                cnpj: '##.###.###/####-##',
                telephone: '(##) #####-####',
                cep: '########',
                time: '##:##',
            },

        }),

        mounted() {
            window.addEventListener('keydown', this.handleEnter);
            axios.get('http://servicodados.ibge.gov.br/api/v1/localidades/estados/13/municipios')
                .then((response)=>{

                    response.data.forEach(city => {
                        this.cities['AM'].push(city.nome)
                    });
                })
        },

        computed:{
            clinic () {
                return this.$store.getters.selectedClinic;
            },
            clinics() {
                return this.$store.getters.clinics;
            },
            newClinic () {
                return !this.clinic.name;
            },
            formIsValid() {
                return this.clinic.name && this.clinic.telephone[0]
            },
        },

        watch: {
            cep(val) {
                if (val.length === 8) {
                    axios
                        .get('https://viacep.com.br/ws/' + val + '/json/')
                        .then((response) => {
                            if (response.data.erro) {
                                this.alertCEP = true
                            } else {
                                this.alertCEP = false;
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
            async save() {
                let clinic = await this.formatDataClinic();
                await this.$store.dispatch('addClinic', clinic);
                await this.$store.dispatch('getClinics');
                this.success = true;
                this.loading = false;
                setTimeout(() => {
                    this.close()
                }, 1000)
            },

            formatDataClinic () {
                this.loading = true;
                if (this.newClinic) {
                    this.clinics.push(this.clinic);
                }
                return {
                    address: {
                        neighboor: this.clinic.address.neighborhood,
                        cep: this.cep,
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
                    agenda: this.formatScheduleClinic(),
                };

            },

            formatScheduleClinic () {
                let schedule = [];
                for (let i = 0; i < 7; i++) {
                    if (i < 5) {
                        schedule.push(this.clinic.startWeek + '-' + this.clinic.endWeek)
                    } else if (i === 5) {
                        schedule.push(this.clinic.startSaturday + '-' + this.clinic.endSaturday)
                    }
                }
                return schedule;

            },

            close: function() {
                this.$store.dispatch('selectClinic', null);
                this.$emit('close-dialog')
            }
        }
    }
</script>