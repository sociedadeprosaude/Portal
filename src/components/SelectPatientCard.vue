<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12 class="my-4">
                <v-expand-transition mode="out-in">
                    <v-card class="primary_dark pa-2" :max-width="maxWidth" v-if="!addPatient">
                        <v-layout row wrap>
                            <v-flex xs8 class="text-left">
                                <span class="my-headline white--text">Buscar Paciente</span>
                            </v-flex>
                            <v-flex xs4 class="text-right">
                                <v-btn
                                        @click="addPatient = !addPatient"
                                        rounded text class="white--text transparent">
                                    <v-icon>group_add</v-icon>
                                </v-btn>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field
                                        prepend-icon="account_circle"
                                        v-model="name"
                                        label="Nome"></v-text-field>
                            </v-flex>
                            <v-flex sm5 xs12>
                                <v-text-field
                                        v-model="cpf"
                                        label="CPF"></v-text-field>
                            </v-flex>
                            <v-spacer></v-spacer>
                            <v-flex sm5 xs12>
                                <v-text-field
                                        v-model="numAss"
                                        label="Nun. Associado"></v-text-field>
                            </v-flex>
                            <v-flex xs12 class="text-right">
                                <v-btn @click="searchPatient()" v-if="!loading">Buscar</v-btn>
                                <v-progress-circular indeterminate color="white" v-else></v-progress-circular>
                            </v-flex>
                        </v-layout>
                    </v-card>
                    <v-card class="primary_dark pa-2" v-else>
                        <v-layout row wrap>
                            <v-flex xs8 class="text-left" v-if="!formError">
                                <span class="my-headline white--text">Adicionar Paciente</span>
                            </v-flex>
                            <v-flex xs8 class="text-left" v-else>
                                <span class="my-headline red--text">{{formError}}</span>
                            </v-flex>
                            <v-flex xs4 class="text-right">
                                <v-btn
                                        @click="addPatient = !addPatient"
                                        rounded text class="white--text transparent">
                                    <v-icon>remove</v-icon>
                                </v-btn>
                            </v-flex>
                            <v-flex sm6 xs12 class="px-3">
                                <v-text-field
                                        prepend-icon="account_circle"
                                        v-model="name"
                                        label="Nome"></v-text-field>
                            </v-flex>
                            <v-flex sm3 xs12 class="px-3">
                                <v-text-field
                                        v-model="birthDate"
                                        v-mask="mask.date"
                                        prepend-icon="date_range"
                                        label="Data de Nascimento"></v-text-field>
                            </v-flex>
                            <v-flex sm3 xs12 class="px-3">
                                <v-text-field
                                        v-mask="mask.cpf"
                                        v-model="cpf"
                                        label="CPF"></v-text-field>
                            </v-flex>
                            <v-flex sm4 xs12 class="px-3">
                                <v-text-field
                                        v-model="email"
                                        prepend-icon="email"
                                        label="Email"></v-text-field>
                            </v-flex>
                            <v-flex sm3 xs12 class="px-3">
                                <v-select label="Sexo" :items="['Feminino' , 'Masculino']" v-model="sex"></v-select>
                            </v-flex>
                            <v-flex sm4 xs12>
                                <v-text-field
                                        v-model="numAss"
                                        label="Nun. Associado"></v-text-field>
                            </v-flex>
                            <v-flex sm4 xs12 class="px-3">
                                <v-layout row wrap class="align-center" v-for="(tel, index) in telephones" :key="index">
                                    <v-flex xs10>
                                        <v-text-field
                                                v-model="telephones[index]"
                                                v-mask="mask.telephone"
                                                prepend-icon="phone"
                                                label="Telefones"></v-text-field>
                                    </v-flex>
                                    <v-flex xs2>
                                        <v-btn
                                                @click="index === 0 ? telephones.push('') : telephones.splice(index, 1)"
                                                text class="transparent">
                                            <v-icon v-if="index === 0">add_circle</v-icon>
                                            <v-icon v-else>remove_circle</v-icon>

                                        </v-btn>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                            <v-flex xs12 class="px-3 text-left">
                                <span class="my-sub-headline">Endereços</span>
                                <v-btn
                                        @click="addresses.push({
                                        uf: 'Amazonas',
                                        city: 'Manaus'
                                        })"
                                        text class="transparent">
                                    <v-icon>add_circle</v-icon>

                                </v-btn>
                                <v-layout wrap justify v-for="(address, index) in addresses" :key="index">
                                    <v-flex xs12 class="text-right">
                                        <v-btn class="transparent" text @click="addresses.splice(index, 1)">
                                            <v-icon>remove_circle</v-icon>
                                        </v-btn>
                                    </v-flex>
                                    <v-flex xs12 sm4>
                                        <v-layout row wrap class="align-center">
                                            <v-text-field
                                                    :error="address.cepError"
                                                    label="CEP" class="ml-3" v-model="address.cep"
                                                          v-mask="mask.cep"></v-text-field>
                                            <v-btn v-if="!address.loading" @click="getAddressByCep(address)" class="transparent" text>
                                                <v-icon>search</v-icon>
                                            </v-btn>
                                            <v-progress-circular indeterminate color="white" v-else></v-progress-circular>
                                        </v-layout>
                                    </v-flex>
                                    <v-spacer></v-spacer>
                                    <v-flex xs12 sm3>
                                        <v-select label="UF" hide-details single-line v-model="address.uf"
                                                  :items="states" menu-props="auto"></v-select>
                                    </v-flex>
                                    <v-spacer></v-spacer>
                                    <v-flex xs12 sm3>
                                        <v-select v-if="address.uf" label="Cidade" class="mr-2" single-line
                                                  v-model="address.city" :items="cities[address.uf]" menu-props="auto"
                                                  hide-details></v-select>
                                    </v-flex>

                                    <v-flex xs12 sm10 class="px-3">
                                        <v-text-field label="Logradouro" class="ml-2"
                                                      v-model="address.street"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm2>
                                        <v-text-field label="Numero" class="mr-2"
                                                      v-model="address.number"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm10 class="px-3">
                                        <v-text-field label="Complemento" class="ml-2"
                                                      v-model="address.complement"></v-text-field>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                            <v-flex xs12 class="text-right">
                                <v-btn @click="registerPatient()" v-if="!loading">Salvar</v-btn>
                                <v-progress-circular indeterminate color="white" v-else></v-progress-circular>
                            </v-flex>
                        </v-layout>
                    </v-card>
                </v-expand-transition>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import {mask} from 'vue-the-mask'

    export default {
        directives: {
            mask,
        },
        props: {
          maxWidth: {
              default: '400px'
          }
        },
        data() {
            return {
                addPatient: false,
                name: undefined,
                cpf: undefined,
                numAss: undefined,
                birthDate: undefined,
                email: undefined,
                sex: undefined,
                telephones: [''],
                addresses: [],
                loading: false,
                formError: undefined,
                mask: {
                    maskRG: '#######-#',
                    cpf: '###.###.###-##',
                    date: '##/##/####',
                    telephone: '(##) #####-####',
                    cep: '##.###-###',
                },
                states: ['AC', 'AL', 'AM'],
                cities: {'AC': [], 'AL': [], 'AM': ['Iranduba', 'Manaus', 'Parintins']}
            }
        },
        methods: {
            validateFiedls() {
                if (!this.name || this.name.length === 0) {
                    this.formError = 'Nome não pode ser vazio'
                    return false
                }
                if (!this.cpf || this.cpf.length === 0) {
                    this.formError = 'CPF não pode ser vazio'
                    return false
                }
                return true
            },
            async getAddressByCep(address) {
                address.loading = true
                let resp = await this.$store.dispatch('getAddressByCep', address.cep.replace('.', '').replace('-', ''))
                if (resp.erro) {
                    address.cepError = true
                    return
                }
                address.street = resp.logradouro
                address.complement = resp.complemento
                address.city = resp.localidade
                address.uf = resp.uf
                address.loading = false
            },
            registerPatient() {
                if (!this.validateFiedls()) return
                this.loading = true
                let patient = {
                    name: this.name.toUpperCase(),
                    cpf: this.cpf.replace(/\./g,'').replace('-', ''),
                    email: this.email,
                    association_number: this.numAss,
                    birth_date: this.birthDate,
                    sex: this.sex,
                    telephones: this.telephones,
                    addresses: this.addresses,
                    type: 'patient'
                }
                this.$store.dispatch('addUser', patient)
                this.loading = false
            },
            async searchPatient() {
                let users = await this.$store.dispatch('searchUser', {
                    name: this.name,
                    cpf: this.cpf,
                    associate_number: this.numAss,
                    type: 'patient'
                })
            }
        }
    }
</script>

<style>
</style>
