<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12 class="my-4">
                <v-expand-transition mode="out-in">
                    <v-card class="primary_light white--text pa-2" :max-width="maxWidth" v-if="!addPatient">
                        <v-layout row wrap>
                            <v-flex xs6 class="text-left mb-4">
                                <span class="my-headline white--text">Buscar Associado</span>
                            </v-flex>
                            <v-flex xs2 class="text-right">
                                <v-btn
                                        v-if="selectedPatient"
                                        @click="showUserCard(selectedPatient)"
                                        rounded text class="white--text transparent">
                                    <v-icon>credit_card</v-icon>
                                </v-btn>
                            </v-flex>
                            <v-flex xs2 class="text-right">
                                <v-btn
                                        v-if="selectedPatient"
                                        @click="selectUser(undefined)"
                                        rounded text class="white--text transparent">
                                    <v-icon>delete</v-icon>
                                </v-btn>
                            </v-flex>
                            <v-flex xs2 class="text-right">
                                <v-btn
                                        @click="addPatient = !addPatient"
                                        rounded text class="white--text transparent">
                                    <v-icon>group_add</v-icon>
                                </v-btn>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field
                                        outlined
                                        rounded
                                        filled
                                        prepend-icon="account_circle"
                                        v-model="name"
                                        :disabled="selectedPatient !== undefined"
                                        label="Nome"></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field
                                        prepend-icon="credit_card"
                                        outlined
                                        rounded
                                        filled
                                        v-model="cpf"
                                        :disabled="selectedPatient !== undefined"
                                        label="CPF"></v-text-field>
                            </v-flex>
                            <v-spacer></v-spacer>
                            <v-flex xs12>
                                <v-text-field
                                        prepend-icon="credit_card"
                                        outlined
                                        rounded
                                        filled
                                        v-model="numAss"
                                        :disabled="selectedPatient !== undefined"
                                        label="Numero do Associado"></v-text-field>
                            </v-flex>
                            <v-flex xs12 class="text-right">
                                <submit-button @click="searchPatient()" :loading="loading" :success="success"
                                               text="Buscar"></submit-button>
                            </v-flex>
                            <v-divider></v-divider>
                            <v-flex xs12>
                                <v-card v-for="user in foundUsers" :key="user.cpf" class="my-2" @click="selectUser(user)">
                                    <v-layout row wrap class="align-center">
                                        <v-flex xs4>
                                            <span>{{user.name}}</span>
                                        </v-flex>
                                        <v-flex xs4>
                                            <span>CPF: {{user.cpf}}</span>
                                        </v-flex>
                                        <v-flex xs4 v-if="user.association_number">
                                            <span>Numero de Associado: {{user.association_number}}</span>
                                        </v-flex>
                                        <v-flex xs4 v-if="user.crm">
                                            <span>CRM: {{user.crm}}</span>
                                        </v-flex>
                                    </v-layout>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-card>
                    <v-card class="primary_light white--text pa-2" v-else>
                        <v-layout row wrap>
                            <v-flex xs8 class="text-left mb-4" v-if="!formError">
                                <span class="my-headline white--text">Adicionar Associado</span>
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
                                        outlined
                                        rounded
                                        filled
                                        prepend-icon="account_circle"
                                        v-model="name"
                                        label="Nome"></v-text-field>
                            </v-flex>
                            <v-flex sm3 xs12 class="px-3">
                                <v-text-field
                                        outlined
                                        rounded
                                        filled
                                        v-model="birthDate"
                                        v-mask="mask.date"
                                        prepend-icon="date_range"
                                        label="Data de Nascimento"></v-text-field>
                            </v-flex>
                            <v-flex sm3 xs12 class="px-3">
                                <v-text-field
                                        outlined
                                        rounded
                                        filled
                                        v-mask="mask.cpf"
                                        v-model="cpf"
                                        label="CPF"></v-text-field>
                            </v-flex>
                            <v-flex sm4 xs12 class="px-3">
                                <v-text-field
                                        outlined
                                        rounded
                                        filled
                                        v-model="email"
                                        prepend-icon="email"
                                        label="Email"></v-text-field>
                            </v-flex>
                            <v-flex sm3 xs12 class="px-3">
                                <v-select outlined rounded filled label="Sexo" :items="['Feminino' , 'Masculino']" v-model="sex"></v-select>
                            </v-flex>
                            <v-flex sm4 xs12>
                                <v-text-field
                                        outlined
                                        rounded
                                        filled
                                        v-model="numAss"
                                        label="Nun. Associado"></v-text-field>
                            </v-flex>
                            <v-flex sm4 xs12 class="px-3">
                                <v-layout row wrap class="align-center" v-for="(tel, index) in telephones" :key="index">
                                    <v-flex xs10>
                                        <v-text-field
                                                outlined
                                                rounded
                                                filled
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
                                            <v-btn v-if="!address.loading" @click="getAddressByCep(address)"
                                                   class="transparent" text>
                                                <v-icon>search</v-icon>
                                            </v-btn>
                                            <v-progress-circular indeterminate color="white"
                                                                 v-else></v-progress-circular>
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
                                <submit-button :success="success" @click="registerPatient()" :loading="loading"
                                               text="Salvar"></submit-button>
                            </v-flex>
                        </v-layout>
                    </v-card>
                </v-expand-transition>
            </v-flex>
        </v-layout>
        <v-dialog v-model="patientCard">
            <patient-card :user="selectedPatient"></patient-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import {mask} from 'vue-the-mask'
    import SubmitButton from "./SubmitButton";
    import PatientCard from "./PatientCard";
    var moment = require("moment")
    export default {
        directives: {
            mask,
        },
        props: {
            maxWidth: {
                default: '100%'
            }
        },
        components: {
            SubmitButton,
            PatientCard
        },
        computed: {
          selectedPatient() {
              let user = this.$store.getters.selectedPatient
              if (user) {
                  this.name = user.name
                  this.cpf = user.cpf
                  this.numAss = user.association_number
              }
              return this.$store.getters.selectedPatient
          }
        },
        data() {
            return {
                patientCard: false,
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
                cities: {'AC': [], 'AL': [], 'AM': ['Iranduba', 'Manaus', 'Parintins']},
                foundUsers: [],
                success: false,
            }
        },
        methods: {
            showUserCard(user) {
                this.patientCard = !this.patientCard
            },
            validateFiedls() {
                if (!this.name || this.name.length === 0) {
                    this.formError = 'Nome não pode ser vazio'
                    return false
                }
                if (!this.cpf || this.cpf.length === 0) {
                    this.formError = 'CPF não pode ser vazio'
                    return false
                }
                if (!this.birthDate) {
                    this.formError = 'Preencha a data de nascimento'
                    return false
                }
                if (this.telephones[0].length === 0) {
                    this.formError = 'Preencha um telefone'
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
            async registerPatient() {
                if (!this.validateFiedls()) {
                    return
                }
                this.loading = true
                let patient = {
                    name: this.name.toUpperCase(),
                    cpf: this.cpf.replace(/\./g, '').replace('-', ''),
                    email: this.email,
                    association_number: this.numAss,
                    birth_date: moment(this.birthDate,"DD/MM/YYYY").format("YYYY-MM-DD"),
                    sex: this.sex,
                    telephones: this.telephones,
                    addresses: this.addresses,
                    type: 'PATIENT'
                }
                await this.$store.dispatch('addUser', patient)
                this.success = true
                this.loading = false
            },
            async selectUser(user) {
                if (user) {
                    let intakes = await this.$store.dispatch('getUserIntakes', user)
                    if (intakes) {
                        user.intakes = intakes
                    }
                    let budgets = await this.$store.dispatch('getUserBudgets', user)
                    if (budgets) {
                        user.budgets = budgets
                    }
                }
                else {
                    this.cpf= undefined
                    this.name= undefined
                    this.numAss= undefined
                }
                this.$store.commit('setSelectedPatient', user)
                this.foundUsers = []
            },
            async searchPatient() {
                this.loading = true
                let users = await this.$store.dispatch('searchUser', {
                    name: this.name,
                    cpf: this.cpf,
                    association_number: this.numAss,
                    type: 'patient'
                })
                this.foundUsers = users
                this.loading = false
            },
            handleEnter(e) {
                if (e.key === 'Enter') {
                    this.searchPatient()
                }
            }
        },
        mounted() {
           window.addEventListener('keydown', this.handleEnter)
        },
        beforeDestroy() {
            window.removeEventListener('keydown', this.handleEnter)
        }
    }
</script>

<style>
</style>
