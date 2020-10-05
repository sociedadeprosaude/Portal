<template>
    <v-card width="500" v-if="clinic">
        <v-card-title class="headline grey lighten-2 mb-4" primary-title>
          <v-flex xs10> <span class="headline">Edição da Clínica</span></v-flex>
         <v-flex xs2><v-btn text class="transparent" @click="closeDialog"><v-icon>close</v-icon></v-btn></v-flex>
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
                                v-model="clinic.address.cep"
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
                                v-model="clinic.address.neighboor"
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
                                v-model="this.clinic.opening_hours[0].split('-')[0]"
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
                                v-model="this.clinic.opening_hours[0].split('-')[1]"
                                label="Fecha as:"
                                placeholder="Ex.: 18:00"
                                outlined
                                v-mask="mask.time"
                                clearable
                                hide-details
                        />
                    </v-flex>

                    <p class="text-justify">Horario de Funcionamento de Sábado:</p>

                    <v-flex xs6 >
                        <v-text-field
                                v-model="this.clinic.opening_hours[5].split('-')[0]"
                                label="Abre as:"
                                placeholder="Ex.: 06:00"
                                outlined
                                v-mask="mask.time"
                                clearable
                                hide-details
                        />
                    </v-flex>
                    <v-spacer/>
                    <v-flex xs6 >
                        <v-text-field
                                v-model="this.clinic.opening_hours[5].split('-')[1]"
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
                          v-model="this.clinic.logo"
                          label="Link da logo da unidade pro-saúde (se for unidade pro-sáude)"
                      ></v-textarea>
                    </v-flex>
                    <v-flex>
                      <v-checkbox
                          v-model="this.clinic.property"
                          color="green"
                          label="Unidade pro-saúde ?"
                      ></v-checkbox>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card-text>
        <v-divider/>
        <v-card-actions>
          <v-btn color="error" @click="deleteClinic"><v-icon>delete</v-icon></v-btn>
            <v-spacer/>
            <v-btn rounded color="success"  :to="{ name: 'RegisterNewUserClinic', params: {id: clinic.id } }">Gerar Link para Usuario
            </v-btn>
            <v-spacer/>
            <v-btn color="primary" @click="updateClinic()">Editar</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import {mask} from 'vue-the-mask';
    import axios from 'axios';
    export default {
        name: "EditClinic",
        props: ['clinic'],
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
            //ceps: '',
            alertCEP: false,
        }),
        mounted () {
            console.log("clinic apollo:", this.clinic);
            //this.ceps = this.clinic.address.cep;
        },
        watch: {
  /*          ceps(val) {
                if (val.length === 8) {
                    axios
                        .get('https://viacep.com.br/ws/' + val + '/json/')
                        .then((response) => {
                            if (response.data.erro) {
                                this.alertCEP = true
                            } else {
                                this.alertCEP = false;
                                this.street = response.data.logradouro;
                                this.neighboor = response.data.bairro;
                                this.city = response.data.localidade;
                                let array = this.stateOptions;
                                this.state = array.find(function (element) {
                                    if (element.includes(response.data.uf)) {
                                        return element;
                                    }
                                    return '';
                                });
                            }

                        })
                } else {
                    this.street = '';
                    this.neighboor = '';
                    this.state = '';
                    this.city = '';
                }
            },*/
        },
        methods: {
          closeDialog : function () {
            this.$emit('close-dialog');
          },
          async deleteClinic(){
            await this.$apollo.mutate({
              mutation: require('@/graphql/clinics/RemoveRelationsAddressClinic.gql'),
              variables: {
                idClinic: this.clinic.id,
                idAddress: this.clinic.address.id,
              }
            })
            await this.$apollo.mutate({
              mutation: require('@/graphql/clinics/DeleteClinics.gql'),
              variables: {
                id: this.clinic.id,
              },
            })
            await this.$apollo.mutate({
              mutation: require('@/graphql/address/DeleteAddress.gql'),
              variables: {
                id: this.clinic.address.id,
              },
            })
            this.$router.push('/')
          },
          async updateClinic() {
              let agenda = [];
              for (let i = 0; i < 7; i++) {
                if (i < 5) {
                  agenda.push(this.clinic.opening_hours[0].split('-')[0] + '-' + this.clinic.opening_hours[0].split('-')[1])
                } else if (i === 5) {
                  agenda.push(this.clinic.opening_hours[5].split('-')[0] + '-' + this.clinic.opening_hours[5].split('-')[1])
                }
              }
              this.clinic.opening_hours = agenda

              await this.$apollo.mutate({
                mutation: require('@/graphql/clinics/UpdateClinics.gql'),
                variables: {
                  id: this.clinic.id,
                  name: this.clinic.name,
                  cnpj: this.clinic.cnpj,
                  telephone: this.clinic.telephone[0],
                  logo: this.clinic.logo,
                  property: this.clinic.property,
                  opening_hours: this.clinic.opening_hours,
                },
              }).then(dataClinic => {
                //console.log("id clinic:", dataClinic.data.UpdateClinic)
                this.$apollo.mutate({
                  mutation: require('@/graphql/address/UpdateAddress.gql'),
                  variables: {
                    id: this.clinic.address.id,
                    number: this.clinic.address.number,
                    cep: this.clinic.address.cep,
                    city: this.clinic.address.city,
                    state: this.clinic.address.state,
                    street: this.clinic.address.street,
                    neighboor: this.clinic.address.neighboor,
                    complement: this.clinic.address.complement,
                    geopoint: this.clinic.address.geopoint,
                  },
                }).catch((error) => {
                  console.error('nao criando endereço: ', error)
                })
              }).catch((error) => {
                console.error('nao criando relaçao clinica e endrereço: ', error)
              })
              //this.closeDialog()
            this.$router.push('/')
            },
        },
    }
</script>
