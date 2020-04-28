<template>
    <v-container grid-list-md>
        <v-layout  wrap>
            <v-flex xs12>
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
                                <v-flex xs12>
                                    <p class="text-justify">Horario de Funcionamento de Segunda-Feira a
                                        Sexta-Feira:</p>
                                </v-flex>
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
                                <v-flex xs12>
                                    <p class="text-justify">Horario de Funcionamento de Sábado:</p>
                                </v-flex>
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
                </v-card>            </v-flex>
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
            mask: {
                cnpj: '##.###.###/####-##',
                telephone: '(##) #####-####',
                cep: '########',
                time: '##:##',
            },
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
            formIsValid() {
                return this.editedItem.name && this.editedItem.telephone[0]
            },
            formTitle() {
                return this.editedIndex === -1 ? 'Formulario de Cadastro de Clinicas' : 'Formulario de Cadastro de Clinicas'
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
            newClinic(){
                this.$store.dispatch('selectClinic', this.defaultItem);
                this.editedItem = Object.assign({}, this.defaultItem);
            },
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
                return {
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
                    agenda: this.formatScheduleClinic(),
                };

            },

            formatScheduleClinic () {
                let schedule = [];
                for (let i = 0; i < 7; i++) {
                    if (i < 5) {
                        schedule.push(this.editedItem.startWeek + '-' + this.editedItem.endWeek)
                    } else if (i === 5) {
                        schedule.push(this.editedItem.startSaturday + '-' + this.editedItem.endSaturday)
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