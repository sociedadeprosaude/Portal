<template>
    <v-container class="ma-0 pa-0">
        <v-layout row wrap>
            <v-flex xs12>
                <v-expand-transition mode="out-in">
                    <v-card class="primary_light white--text pa-2" :max-width="maxWidth" v-if="!addPatient">
                        <v-layout row wrap>
                            <v-flex v-if="!selectedPatient" xs8>
                                 <v-flex sm6 xs8 class="text-left mb-3">
                                        <span class="my-headline white--text hidden-xs-only">Buscar Associado</span>
                                        <span class="white--text font-weight-bold hidden-sm-and-up">Buscar Associado</span>
                                    </v-flex>
                                    <v-spacer/>
                            </v-flex>
                            <v-flex :class="!selectedPatient ? 'xs4' : 'xs12'">
                                <v-layout row wrap class="text-right">
                                    <v-spacer/>

                                    <v-flex xs1 class="text-right mx-3">
                                        <v-tooltip v-if="selectedPatient" top>
                                            <template v-slot:activator="{ on }">
                                                <v-btn
                                                    v-on="on"
                                                    to="/agenda/Declaration"
                                                    rounded text class="white--text transparent">
                                                <v-icon>print</v-icon>
                                            </v-btn>
                                            </template>
                                            <span>Declaração de Comparecimento</span>
                                        </v-tooltip>
                                    </v-flex>
                                    <v-flex xs1 class="text-right mx-3">
                                        <v-tooltip v-if="selectedPatient" top>
                                            <template v-slot:activator="{ on }">
                                                <v-btn
                                                    v-on="on"
                                                    to="/agenda/ConsultasPacientes"
                                                    rounded text class="white--text transparent">
                                                <v-icon>date_range</v-icon>
                                            </v-btn>
                                            </template>
                                            <span>Gerenciamento de Consultas do Paciente</span>
                                        </v-tooltip>

                                    </v-flex>
                                    <v-flex xs1 class="text-right mx-3">
                                        <v-tooltip v-if="selectedPatient" top>
                                            <template  v-slot:activator="{ on }">
                                                <v-btn
                                                    v-on="on"
                                                    to="/agenda/agendamento"
                                                    rounded text class="white--text transparent">
                                                <v-icon>calendar_today</v-icon>
                                            </v-btn>
                                            </template>
                                            <span>Agendamento de Consultas</span>
                                        </v-tooltip>
                                    </v-flex>
                                    <!-- <v-flex v-if="selectedPatient && selectedPatient.dependents" xs1 class="text-right mx-3">
                                        <v-tooltip  top>
                                            <template v-slot:activator="{ on }">
                                                <v-btn
                                                        v-on="on"
                                                        @click="listDependents()"
                                                        rounded text class="white--text transparent">
                                                    <v-icon>child_friendly</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>Selecionar dependentes</span>
                                        </v-tooltip>

                                    </v-flex> -->
                                    <v-flex xs1 class="text-right mx-3">
                                        <v-tooltip v-if="selectedPatient" top>
                                            <template v-slot:activator="{ on }">
                                                <v-btn
                                                        v-on="on"
                                                        @click="showUserCard(selectedPatient)"
                                                        rounded text class="white--text transparent">
                                                    <v-icon>credit_card</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>Cartão de Associado</span>
                                        </v-tooltip>

                                    </v-flex>
                                    <v-flex xs1 class="text-right mx-3">
                                        <v-tooltip v-if="selectedPatient" top>
                                            <template v-slot:activator="{ on }">
                                                <v-btn
                                                        v-on="on"
                                                        @click="patientTag = !patientTag"
                                                        rounded text class="white--text transparent">
                                                    <v-icon>credit_card</v-icon>
                                                    2
                                                </v-btn>
                                            </template>
                                            <span>Cartão de Associado</span>
                                        </v-tooltip>

                                    </v-flex>
                                    <v-flex xs1 class="text-right mx-3">
                                        <v-tooltip v-if="selectedPatient" top>
                                            <template v-slot:activator="{ on }">
                                               <v-btn
                                                    v-on="on"
                                                    @click="selectUser(undefined)"
                                                    rounded text class="white--text transparent">
                                                <v-icon>delete</v-icon>
                                            </v-btn>
                                            </template>
                                            <span>Deselecionar Dados do Paciente</span>
                                        </v-tooltip>

                                    </v-flex>

                                    <v-flex xs1 class="text-right mx-3">
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on }">
                                               <v-btn
                                                    v-on="on"
                                                    @click="addPatient = !addPatient"
                                                    rounded text class="white--text transparent">
                                                <v-icon>group_add</v-icon>
                                            </v-btn>
                                            </template>
                                            <span>Cadastrar Novo Paciente</span>
                                        </v-tooltip>

                                    </v-flex>
                                </v-layout>
                            </v-flex>

                            <v-flex class="mt-5" xs12>
                                <v-text-field
                                        outlined
                                        rounded
                                        filled
                                        prepend-icon="account_circle"
                                        v-model="name"
                                        :disabled="selectedPatient !== undefined"
                                        label="Nome">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field
                                        prepend-icon="credit_card"
                                        outlined
                                        rounded
                                        filled
                                        v-model="cpf"
                                        v-mask="mask.cpf"
                                        :disabled="selectedPatient !== undefined"
                                        label="CPF">
                                </v-text-field>
                            </v-flex>
                            <v-spacer/>
                            <v-flex xs12>
                                <v-text-field
                                        prepend-icon="credit_card"
                                        outlined
                                        rounded
                                        filled
                                        v-model="numAss"
                                        :disabled="selectedPatient !== undefined"
                                        label="Numero do Associado">
                                </v-text-field>
                            </v-flex>
                            <v-flex class="mt-5" xs12 v-if="selectedDependent">
                                <v-text-field
                                        outlined
                                        rounded
                                        filled
                                        prepend-icon="account_circle"
                                        v-model="dependentName"
                                        disabled
                                        label="Nome do dependente">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 class="text-right">
                                <span v-if="searchError">
                                    {{searchError}}
                                </span>

                                <submit-button class="mx-3 mb-3" @click="searchPatientOldDatabase()" :loading="loading"
                                               :success="success" text="Buscar antigo sistema">
                                </submit-button>
                                <submit-button class="mb-3" @click="searchPatient()" :loading="loading" :success="success"
                                               text="Buscar">
                                </submit-button>
                            </v-flex>
                            <v-divider/>
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
                            <v-flex xs12 v-if="foundUsers && foundUsers.length === 0">
                                <span class="my-sub-headline">Nenhum associado encontrado</span>
                            </v-flex>
                            <v-flex xs12>
                                <v-card v-for="(dependent,index) in foundDependents" :key="index" class="my-2" @click="selectDependent(dependent)">
                                    <v-layout row wrap class="align-center">
                                        <v-flex xs4>
                                            <span>{{dependent.name}}</span>
                                        </v-flex>
                                        <v-flex xs4>
                                            <span>Grau: {{dependent.dependentDegree}}</span>
                                        </v-flex>
                                        <v-flex xs4>
                                            <span>Data de Nascimento: {{dependent.birthDate}}</span>
                                        </v-flex>
                                    </v-layout>
                                </v-card>
                            </v-flex>

                        </v-layout>
                    </v-card>
                    <v-card class="primary_light white--text pa-2" v-else>
                        <v-layout row wrap>
                            <v-flex xs8 class="text-left mb-4" v-if="!formError">
                                <span class="my-headline white--text hidden-xs-only">Adicionar Associado</span>
                                <span class="white--text font-weight-bold hidden-sm-and-up">Adicionar Associado</span>
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
                            <v-row>
                                <v-col cols="12">
                                     <v-text-field
                                        outlined
                                        rounded
                                        filled
                                        placeholder="Campo obrigatório *"
                                        prepend-icon="account_circle"
                                        v-model="name"
                                        label="Nome">
                                </v-text-field>
                                </v-col>
                               
                            </v-row>
                            <v-flex sm12 xs12 class="px-3">
                                
                            </v-flex>
                            <v-flex sm4 xs12 class="px-3">
                                <v-text-field
                                        outlined
                                        rounded
                                        filled
                                        placeholder="Campo obrigatório *"
                                        v-model="birthDate"
                                        :rules="rules"
                                        v-mask="mask.date"
                                        prepend-icon="date_range"
                                        label="Data de Nascimento">
                                </v-text-field>
                            </v-flex>
                            <v-flex sm4 xs12 class="px-3">
                                <v-text-field
                                        outlined
                                        rounded
                                        filled
                                        :disabled="selectedPatient !== undefined"
                                        placeholder="Campo obrigatório *"
                                        v-mask="mask.cpf"
                                        v-model="cpf"
                                        label="CPF">
                                </v-text-field>
                            </v-flex>
                            <v-flex sm4 xs12 class="px-3">
                                <v-text-field
                                        outlined
                                        rounded
                                        filled
                                        :disabled="selectedPatient !== undefined"
                                        placeholder="Campo obrigatório *"
                                        type="number"
                                        v-model="rg"
                                        label="RG">
                                </v-text-field>
                            </v-flex>
                            <v-flex sm12 xs12 class="px-3">
                                <v-text-field
                                        outlined
                                        rounded
                                        filled
                                        v-model="email"
                                        prepend-icon="email"
                                        label="Email">
                                </v-text-field>
                            </v-flex>
                            <v-flex sm6 xs12 class="px-3">
                                <v-select outlined rounded filled label="Sexo" :items="['Feminino' , 'Masculino']"
                                          v-model="sex">
                                </v-select>
                            </v-flex>
                            <v-flex sm6 xs12>
                                <v-text-field
                                        outlined
                                        rounded
                                        filled
                                        disabled
                                        v-model="numAss"
                                        label="Nun. Associado">
                                </v-text-field>
                            </v-flex>
                            <v-flex sm12 xs12 class="px-3">
                                <v-layout row wrap class="align-center" v-for="(tel, index) in telephones" :key="index">
                                    <v-flex xs10>
                                        <v-text-field
                                                outlined
                                                rounded
                                                filled
                                                v-model="telephones[index]"
                                                placeholder="Campo obrigatório *"
                                                v-mask="mask.telephone"
                                                prepend-icon="phone"
                                                label="Telefones">
                                        </v-text-field>
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
                                <span class="my-sub-headline">Dependentes</span>
                                <v-btn
                                        @click="dependents.push({
                                            name: '',
                                            birthDate: ''
                                        })"
                                        text class="transparent">
                                    <v-icon>add_circle</v-icon>

                                </v-btn>
                                <v-layout row wrap justify v-for="(dependent, index) in dependents" :key="index">
                                    <v-flex xs12  class="text-right">
                                        <v-btn class="transparent" text @click="dependents.splice(index, 1)">
                                            <v-icon>remove_circle</v-icon>
                                        </v-btn>
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-text-field
                                                outlined
                                                rounded
                                                filled
                                                prepend-icon="account_circle"
                                                v-model="dependent.name"
                                                label="Nome">
                                        </v-text-field>
                                    </v-flex>

                                    <v-spacer/>
                                     <v-flex sm4 xs12 class="px-3">
                                        <v-text-field
                                                outlined
                                                rounded
                                                filled
                                                v-model="dependent.birthDate"
                                                v-mask="mask.date "
                                                :rules="rules"
                                                prepend-icon="date_range"
                                                label="Data de Nascimento">
                                        </v-text-field>
                                    </v-flex>
                                     <v-flex sm4 xs12 class="px-3">
                                        <v-select outlined rounded filled label="Sexo"
                                                  :items="['Feminino' , 'Masculino']"
                                                  v-model="dependent.sex">
                                        </v-select>
                                    </v-flex>
                                    <v-flex xs6 sm4 class="px-3">
                                        <v-select label="Grau de Dependência" outlined rounded filled
                                                  v-model="dependent.dependentDegree"
                                                  :items="degress" menu-props="auto">
                                        </v-select>
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
                                                    v-mask="mask.cep">
                                            </v-text-field>
                                            <v-btn v-if="!address.loading" @click="getAddressByCep(address)"
                                                   class="transparent" text>
                                                <v-icon>search</v-icon>
                                            </v-btn>
                                            <v-progress-circular indeterminate color="white"
                                                                 v-else>
                                            </v-progress-circular>
                                        </v-layout>
                                    </v-flex>
                                    <v-spacer/>
                                    <v-flex xs12 sm3>
                                        <v-select label="UF" hide-details single-line v-model="address.uf"
                                                  :items="states" menu-props="auto">
                                        </v-select>
                                    </v-flex>
                                    <v-spacer/>
                                    <v-flex xs12 sm3>
                                        <v-select v-if="address.uf" label="Cidade" class="mr-2" single-line
                                                  v-model="address.city" :items="cities[address.uf]" menu-props="auto"
                                                  hide-details>
                                        </v-select>
                                    </v-flex>

                                    <v-flex xs12 sm10 class="px-3">
                                        <v-text-field label="Logradouro" class="ml-2"
                                                      v-model="address.street">
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm2>
                                        <v-text-field label="Numero" class="mr-2"
                                                      v-model="address.number">
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm10 class="px-3">
                                        <v-text-field label="Complemento" class="ml-2"
                                                      v-model="address.complement">
                                        </v-text-field>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                            <v-flex xs12 class="text-right">

                                <submit-button :disabled="!(this.name !== '' && this.name && ((this.cpf !== '' && this.cpf) || (this.rg !== '' && this.rg)) && this.birthDate !== '' && this.birthDate
                                && this.dateValid(this.birthDate) && this.telephones !== [''])" :success="success"
                                               @click="registerPatient()" :loading="loading"
                                               text="Salvar">
                                </submit-button>

                            </v-flex>
                        </v-layout>
                    </v-card>
                </v-expand-transition>
            </v-flex>
        </v-layout>
        <v-dialog v-model="patientCard">
            <patient-card :user="selectedPatient"></patient-card>
        </v-dialog>
        <v-dialog v-model="patientTag">
            <patient-tag :user="selectedPatient"></patient-tag>
        </v-dialog>
    </v-container>
</template>

<script>
    import {mask} from 'vue-the-mask'
    import SubmitButton from "./SubmitButton";
    import PatientCard from "./PatientCard";
    import PatientTag from "./PatientTag";

    let moment = require("moment");
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
            PatientCard,
            PatientTag
        },
        computed: {
          selectedPatient() {
              let user = this.$store.getters.selectedPatient;
              if (user) {
                  this.name = user.name;
                  this.cpf = user.cpf
                  //this.numAss = user.association_number
              }
              return this.$store.getters.selectedPatient
          },
          selectedDependent(){
            let dependent = this.$store.getters.selectedDependent;
            if(dependent){
                this.dependentName = dependent.name
            }
            return dependent
          }
        },
        data() {
            return {
                patientCard: false,
                patientTag: false,
                addPatient: false,
                name: undefined,
                dependentName:undefined,
                cpf: undefined,
                rg: undefined,
                numAss: undefined,
                birthDate: undefined,
                email: undefined,
                sex: undefined,
                telephones: [''],
                addresses: [],
                dependents:[],
                degress: ['Filho(a)', 'Neto(a)', ],
                loading: false,
                formError: undefined,
                searchError: undefined,
                mask: {
                    maskRG: '#######-#',
                    cpf: '###.###.###-##',
                    date:  '##/##/####',
                    telephone: '(##) #####-####',
                    cep: '##.###-###',
                },
                rules: [
                    value => {
                        const rule = this.dateValid(value);
                        return rule || 'Data inválida'
                    }
                ],
                states: ['AC', 'AL', 'AM'],
                cities: {'AC': [], 'AL': [], 'AM': ['Iranduba', 'Manaus', 'Parintins', 'AUTAZES']},
                foundUsers: undefined,
                foundDependents:undefined,
                success: false,
            }
        },
        watch: {
            cpf(val) {
                if(this.selectedPatient && val !== this.selectedPatient.cpf)
                    this.cpf = this.selectedPatient.cpf;
            },
            addPatient(val) {
                if (val) {
                    if (this.selectedPatient) {
                        this.fillFormUser(this.selectedPatient)
                    }
                }
            }
        },
        methods: {
            dateValid(value){
                if(value)
                    return value.length < 10 || moment(value,'DD/MM/YYYY').isValid();
                return true
            },
            showSecondUserCard(user) {
                this.patientTag = !this.patientTag
            },
            showUserCard(user) {
                this.patientCard = !this.patientCard
            },
            validateFiedls() {
                if (!this.name || this.name.length === 0) {
                    this.formError = 'Nome não pode ser vazio';
                    return false
                }
                if ((!this.cpf || this.cpf.length === 0) && (!this.rg || this.rg.length === 0)) {
                    this.formError = 'É preciso preencher o CPF ou o RG';
                    return false
                }
                if (!this.birthDate) {
                    this.formError = 'Preencha a data de nascimento';
                    return false
                }
                if (this.telephones[0].length === 0) {
                    this.formError = 'Preencha um telefone';
                    return false
                }
                return true
            },
            async getAddressByCep(address) {
                address.loading = true;
                let resp;
                try {
                    resp = await this.$store.dispatch('getAddressByCep', address.cep.replace('.', '').replace('-', ''));
                    if (resp.erro) {
                        address.cepError = true;
                        return
                    }
                } catch (e) {
                    address.loading = false;
                    return
                }

                address.street = resp.logradouro;
                address.complement = resp.complemento;
                address.city = resp.localidade;
                address.uf = resp.uf;
                address.loading = false
            },
            async registerPatient() {
                if (!this.validateFiedls()) {
                    return
                }
                this.loading = true;
                var copyDependents = [];
                for (let add in this.addresses) {
                    delete this.addresses[add].loading
                }

                for(let dependent in this.dependents){
                    var birthDate = moment( this.dependents[dependent].birthDate,"DD/MM/YYYY").format("YYYY-MM-DD");

                   copyDependents.push(Object.assign({birthDate:birthDate}, {name:this.dependents[dependent].name,sex:this.dependents[dependent].sex,dependentDegree:this.dependents[dependent].dependentDegree}))

                }
                let patient = {
                    name: this.name.toUpperCase(),
                    cpf: this.cpf ? this.cpf.replace(/\./g, '').replace('-', '') : undefined,
                    email: this.email,
                    rg: this.rg ? this.rg.replace(/\./g, '').replace('-', '').replace('.', '') : undefined,
                    association_number: this.numAss,
                    birth_date: moment(this.birthDate,"DD/MM/YYYY").format("YYYY-MM-DD"),
                    sex: this.sex,
                    telephones: this.telephones,
                    addresses: this.addresses,
                    dependents:copyDependents,
                    type: 'PATIENT'
                };
                let foundPatient;
                let identifier;
                if (patient.cpf) {
                    foundPatient = await this.$store.dispatch('getPatient', patient.cpf);
                    identifier = {
                        name: 'cpf',
                        value: patient.cpf
                    }
                } else {
                    foundPatient = await this.$store.dispatch('getPatient', 'RG' + patient.rg);
                    identifier = {
                        name: 'rg',
                        value: patient.rg
                    }
                }
                if (foundPatient) {
                    let dialog = {
                        header: `Já existe um associado com o ${identifier.name} ${identifier.value}, substituir?`,
                        body: `${foundPatient.name}, ${identifier.name}: ${identifier.value}, Num. Ass: ${foundPatient.association_number}`,
                        show: true,
                        functionToRun: () => this.addUserToFirestore(patient)
                    };
                    this.$store.commit('setSystemDialog', dialog);
                    return
                }

                this.addUserToFirestore(patient)
            },
            async addUserToFirestore(patient) {
                await this.$store.dispatch('addUser', patient);
                this.success = true;
                this.loading = false;
                this.selectUser(patient);
                // this.fillFormUser(patient)
                setTimeout(() => {
                    this.success = false
                }, 1000)
            },
            selectDependent(dependent){
                this.$store.dispatch('setSelectedDependent',dependent);
                this.dependentName = dependent.name;
                this.foundDependents = undefined
            },
            async selectUser(user) {
                if (user) {
                    let intakes = await this.$store.dispatch('getUserIntakes', user);
                    if (intakes) {
                        user.intakes = intakes
                    }
                    let budgets = await this.$store.dispatch('getUserBudgets', user);
                    if (budgets) {
                        user.budgets = budgets
                    }
                    this.fillFormUser(user)
                }
                else {
                    this.cpf= undefined;
                    this.name= undefined;
                    this.numAss= undefined;
                    this.rg = undefined;
                    this.birth_date = undefined;
                    this.email = undefined;
                    this.telephones = [''];
                    this.addresses = [];
                    this.dependents = [];
                    this.dependentName = undefined;
                    this.$emit('removed')
                }
                this.$store.commit('setSelectedPatient', user);
                this.$store.commit('clearSelectedDependent');
                this.foundUsers = undefined;
                this.addPatient = false
            },

            async listDependents() {
                this.loading = true;
                this.foundDependents = this.selectedPatient.dependents;
                this.loading = false
            },

            async searchPatient() {
                this.loading = true;
                let users = await this.$store.dispatch('searchUser', {
                    name: this.name,
                    cpf: this.cpf,
                    association_number: this.numAss,
                    type: 'patient'
                });
                this.foundUsers = users;
                this.loading = false
            },

            fillFormUser(user) {
                this.name = user.name;
                this.cpf = user.cpf;
                this.email = user.email;
                this.rg = user.rg;
                this.numAss = user.association_number;
                this.birthDate = moment(user.birth_date).format('DD-MM-YYYY');
                this.sex = user.sex;
                this.dependents = user.dependents ? user.dependents : [];
                this.telephones = user.telephones ? user.telephones : [''];
                for (let add in user.addresses) {
                    delete user.addresses[add].loading
                }
                this.addresses = user.addresses;
                if(user.dependents){
                    for(let index in user.dependents){
                        var patt = new RegExp(/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/);
                        var date  = user.dependents[index].birthDate;
                        if(!patt.test(date))
                            date = moment(date,"YYYY-MM-DD").format("DD/MM/YYYY");
                        user.dependents[index].birthDate = date
                    }
                     this.dependents = user.dependents
                }else{
                     this.dependents = []
                }

            },
            fillFormOldUser(oldUser) {
                this.name = oldUser.nome;
                this.numAss = parseInt(oldUser.sequencia);
                this.birthDate = moment(oldUser.nasc).format('DD-MM-YYYY');
                this.sex = oldUser.sexo === 'M' ? 'Masculino' : 'Feminino';
                this.telephones = [''];
                if (oldUser.telefone.length > 0) {
                    this.telephones.push(oldUser.telefone)
                }
                if (oldUser['telefone02'].length > 0) {
                    this.telephones.push(oldUser['telefone02'])
                }
                if (oldUser['telefone03'].length > 0) {
                    this.telephones.push(oldUser['telefone03'])
                }
                if (oldUser['telefone04'].length > 0) {
                    this.telephones.push(oldUser['telefone04'])
                }
                if (this.telephones.length === 0) {
                    this.telephones = ['']
                }
                let address = {};
                address.street = oldUser.rua;
                address.complement = oldUser.complemento;
                address.city = oldUser.cid;
                address.uf = oldUser.uf;
                address.cep = oldUser.cep;
                address.number = oldUser.number;
                this.addresses.push(address)
            },
            async searchPatientOldDatabase() {
                this.loading = true;
                let oldUser = await this.$store.dispatch('searchUserFromOldDatabase', this.numAss);
                if(oldUser) {
                    this.addPatient = true;
                    this.fillFormOldUser(oldUser)
                }
                this.searchError = 'Nenhum associado encontrado';
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
