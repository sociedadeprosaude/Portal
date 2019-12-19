<template>
    <v-container>
        <v-card xs12 sm6>
                <v-card-title>
                    <v-icon left v-if="searchUser"> search </v-icon><h2 v-if="searchUser">Buscar Paciente</h2>
                    <v-icon left v-if="registerUser"> group_add </v-icon><h2 v-if="registerUser">Cadastrar Paciente</h2>
                    <v-spacer></v-spacer>
                    <v-tooltip bottom>
                        <template v-slot:activator = "{ on }">
                            <v-btn color="primary" small fab v-on="on"
                                   @click="registerUser = !registerUser, searchUser = !searchUser">
                                <v-icon v-if="registerUser">keyboard_arrow_up</v-icon><v-icon v-else>add</v-icon>
                            </v-btn>
                        </template>
                        <span v-if="registerUser">Retornar</span><span v-else>Cadastrar</span>
                    </v-tooltip>
                </v-card-title>
                <v-flex xs12 v-if="searchUser">
                    <v-radio-group v-model="parameter" row  style="justify-content: center">
                        <v-radio label="CPF" value="cpf"></v-radio>
                        <v-radio label="Número do Associado" value="id"></v-radio>
                        <v-radio label="Nome do Associado" value="nome"></v-radio>
                    </v-radio-group>
                    <br>
                    <v-layout row wrap>
                        <v-flex xs11>
                            <v-combobox style="justify-content: center" class=" ml-3" v-model="searchData" :items="listPatient"
                                        :loading="isLoading" :search-input.sync="searchData" :placeholder="parameter"
                                        hide-no-data :clearable="true" single-line prepend-icon="account_circle" full-width
                                        :item-text="parameter" :item-value="parameter" return-object @click:clear="clearSearch"
                            ></v-combobox>
                        </v-flex>
                        <v-flex xs1>
                            <v-dialog v-model="editData" v-if="selectedPatient" max-width="600px">
                                <template v-slot:activator="{on}">
                                    <v-btn flat  class="ml-3" icon color="blue lighten-2" @click="editPatient()">
                                        <v-icon>edit</v-icon>
                                    </v-btn>
                                </template>
                                <v-card>
                                    <span class="headline primary--text ml-4">{{editedPatient.nome}}</span>
                                    <v-card-text>
                                        <v-container grid-list-md>
                                            <v-layout wrap>
                                                <v-flex xs12 sm9><v-text-field label="Nome" v-model="editedPatient.nome"></v-text-field></v-flex>
                                                <v-flex xs12 sm3><v-text-field label="CPF" v-model="editedPatient.cpf" :mask="mask.maskCpf"></v-text-field></v-flex>
                                                <v-flex xs12 sm3><v-select label="Sexo" :items = "['FEMININO' , 'MASCULINO']" v-model="editedPatient.sexo"></v-select></v-flex>
                                                <v-spacer></v-spacer>
                                                <v-flex xs12 sm4><v-text-field prepend-icon="event" label="Data de Nascimento*" v-model="editedPatient.dataNascimento" :mask="mask.maskDateOfBirth" :rules = "rules.CampoObrigatorio"></v-text-field></v-flex>
                                                <v-spacer></v-spacer>
                                                <v-flex xs12 sm8><v-text-field label="Email" v-model="email"></v-text-field></v-flex>
                                                <v-flex xs12 sm4><v-text-field label="Telefone" v-model="editedPatient.telefone" :mask="mask.maskTelefone"
                                                                               :append-outer-icon ="expand ? 'remove_circle_outline' : 'add_circle_outline'"
                                                                               @click:append-outer="expand = !expand">

                                                </v-text-field>
                                                </v-flex>
                                                <v-layout row fill-height v-show="expand">
                                                    <v-flex xs12 sm4><v-text-field label="Telefone" v-model="editedPatient.telefone1" :mask="mask.maskTelefone" prepend-icon="phone"></v-text-field></v-flex>
                                                    <v-flex xs12 sm4><v-text-field label="Telefone" v-model="editedPatient.telefone2" :mask="mask.maskTelefone"></v-text-field></v-flex>
                                                    <v-flex xs12 sm4><v-text-field label = "Telefone" v-model="editedPatient.telefone3" :mask = "mask.maskTelefone"></v-text-field></v-flex>
                                                </v-layout>
                                                <v-flex xs12 sm3><v-text-field label="CEP" v-model="cep" :mask="mask.maskCEP"></v-text-field></v-flex>
                                                <v-flex xs12 sm3><v-combobox label="UF" v-model="editedPatient.uf" :items = "dataList.estados" menu-props="auto"></v-combobox></v-flex>
                                                <v-flex xs12 sm6><v-combobox label="Cidade" v-model="editedPatient.cidade" :items = "dataList.cidades" menu-props = "auto"></v-combobox></v-flex>
                                                <v-flex xs12 sm10><v-text-field label="Logradouro" v-model="editedPatient.logradouro"></v-text-field></v-flex>
                                                <v-flex xs12 sm2><v-text-field label="Numero" v-model="editedPatient.numero"></v-text-field></v-flex>
                                                <v-flex xs12 sm12><v-text-field label="Complemento" v-model="editedPatient.complemento"></v-text-field></v-flex>
                                                <v-flex xs12 sm6>
                                                    <v-layout row wrap>
                                                    <v-switch v-model="existeDependente" :label="'Dependentes'" :append-icon="'group'"></v-switch>
                                                    <v-btn flat icon color="blue lighten-2" class="mt-2" @click="addDependents = true"><v-icon>add</v-icon></v-btn>
                                                    <v-dialog persistent v-model="addDependents">
                                                        <v-card color="white" grid-list-x1 fluid>
                                                            <v-card-title>
                                                                <h3 class="text-xs-center">Adicionar Dependente<v-icon right>group</v-icon></h3>
                                                            </v-card-title>
                                                            <v-card-text>
                                                                <v-form v-model="validDependents" lazy-validation>
                                                                    <v-layout wrap justify>
                                                                        <v-flex xs12 sm8>
                                                                            <v-text-field required label="Responsável*" v-model = "this.editedPatient.nome"
                                                                                          :rules="rules.nomeRules && rules.CampoObrigatorio"
                                                                                          class="ml-3" prepend-icon="group"></v-text-field>
                                                                        </v-flex>
                                                                        <v-spacer></v-spacer>
                                                                        <v-flex xs12 sm3>
                                                                            <!-- <v-select required label = "Grau de Dependência*" v-model = "dependents.grau"
                                                                                      :rules = "[v => !!v || 'Selecione um valor']" :items = "['filho(a)', 'neto(a)']"
                                                                                      class = "mr-3">
                                                                            </v-select> -->
                                                                            <v-select required label = "Grau de Dependência*" v-model = "dependents.grau"
                                                                                       :items = "['filho(a)', 'neto(a)']"
                                                                                      class = "mr-3">
                                                                            </v-select>
                                                                        </v-flex>
                                                                        <v-flex xs12 sm8>
                                                                            <!-- <v-text-field required label="Nome*" v-model = "dependents.nome" :counter="50" maxlength="50"
                                                                                          :rules="rules.nomeRules && rules.CampoObrigatorio" class="ml-3" prepend-icon="person"></v-text-field> -->
                                                                            <v-text-field required label="Nome*" v-model = "dependents.nome" :counter="50" maxlength="50"
                                                                                          class="ml-3" prepend-icon="person"></v-text-field>
                                                                        </v-flex>
                                                                        <v-spacer></v-spacer>
                                                                        <v-flex xs12 sm3>
                                                                            <!-- <v-select v-model = "dependents.sexo" :items = "['FEMININO' , 'MASCULINO']"
                                                                                      class = "mr-3" required label = "Sexo*" :rules = "[v => !!v || 'Selecione um valor']">
                                                                            </v-select> -->
                                                                            <v-select v-model = "dependents.sexo" :items = "['FEMININO' , 'MASCULINO']"
                                                                                      class = "mr-3" required label = "Sexo*" >
                                                                            </v-select>
                                                                        </v-flex>

                                                                        <!-- <v-flex xs12 sm2><v-text-field prepend-icon="event" label="Data de Nascimento*" v-model="dependents.dataNascimento" :mask="mask.maskDateOfBirth" :rules = "rules.CampoObrigatorio"></v-text-field></v-flex> -->
                                                                        <v-flex xs12 sm2><v-text-field prepend-icon="event" label="Data de Nascimento*" v-model="dependents.dataNascimento" :mask="mask.maskDateOfBirth" ></v-text-field></v-flex>

                                                                        <v-spacer></v-spacer>
                                                                        <v-flex xs12 sm3>
                                                                            <v-text-field label="CPF" v-model="dependents.cpf" :mask = "mask.maskCpf" :counter= "11" class = "mr-3"></v-text-field>
                                                                        </v-flex>
                                                                    </v-layout>
                                                                </v-form>
                                                            </v-card-text>
                                                            <v-card-actions>
                                                                <v-spacer></v-spacer>
                                                                <v-btn color="primary" flat :disabled="!formDependents" @click="validateDependents">Adicionar Dependente</v-btn>
                                                                <v-btn color="primary" flat @click="clearDataDependents">Cancelar</v-btn>
                                                            </v-card-actions>
                                                        </v-card>
                                                    </v-dialog>
                                                    </v-layout>
                                                </v-flex>
                                                <v-layout row fill-height v-if="existeDependente">
                                                    <v-list two-line subheader>
                                                        <template v-for="(dependents) in editedPatient.dependentes">
                                                            <v-list-tile :key="dependents.nome" ripple @click="editPatient(dependents)">
                                                                <v-list-tile-avatar>
                                                                    <v-icon class="primary--text">person</v-icon>
                                                                </v-list-tile-avatar>
                                                                <v-list-tile-content>
                                                                    <v-list-tile-title class="text--primary">{{dependents.nome}}</v-list-tile-title>
                                                                    <v-list-tile-sub-title>{{dependents.grau}}</v-list-tile-sub-title>
                                                                </v-list-tile-content>
                                                            </v-list-tile>
                                                        </template>
                                                    </v-list>
                                                </v-layout>
                                            </v-layout>
                                        </v-container>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="blue darken-1" flat @click="cancel">Fechar</v-btn>
                                        <v-btn color="blue darken-1" flat @click="save">Salvar</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-flex>
                    </v-layout>
                </v-flex>
                <v-flex xs12 v-if="registerUser">
                    <v-card grid-list-x1 fluid>
                        <v-form v-model="validRegister" lazy-validation>
                            <v-layout wrap justify>
                                <v-flex xs12 sm8>
                                    <v-text-field required label="Nome" v-model="editedPatient.nome" maxlength="50" :counter="50"
                                                  :rules="rules.nomeRules && rules.CampoObrigatorio" class="ml-3" prepend-icon="person"></v-text-field>
                                </v-flex>
                                <v-spacer></v-spacer>
                                <v-flex xs12 sm3>
                                    <v-select required label = "Sexo*" v-model = "editedPatient.sexo" :items = "['FEMININO' , 'MASCULINO']"
                                              :rules = "[v => !!v || 'Selecione um valor']" class = "mr-3"></v-select>
                                </v-flex>

                                <v-flex xs12 sm3><v-text-field class="ml-3" prepend-icon="event" label="Data de Nascimento*" v-model="editedPatient.dataNascimento" :mask="mask.maskDateOfBirth" :rules = "rules.CampoObrigatorio"></v-text-field></v-flex>

                                <v-spacer></v-spacer>
                                <v-flex xs12 sm3>
                                    <v-text-field label="CPF" v-model="editedPatient.cpf" :mask = "mask.maskCpf" :counter= "11" class = "mr-3"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm8>
                                    <v-text-field  label = "Email" v-model="email" :rules="rules.emailRules" prepend-icon = "email" class="ml-3"></v-text-field>
                                </v-flex>
                                <v-spacer></v-spacer>
                                <v-flex xs12 sm3 class="mr-3">
                                    <v-text-field required label = "Telefone*" v-model="editedPatient.telefone" prepend-icon = "phone"
                                                  :mask = "mask.maskTelefone" :counter= "11" :rules = "rules.CampoObrigatorio"
                                                  :append-outer-icon ="expand ? 'remove_circle_outline' : 'add_circle_outline'"
                                                  @click:append-outer="expand = !expand"></v-text-field>
                                </v-flex>
                                <v-expand-transition>
                                    <v-layout row fill-height v-show="expand" class="mr-3 ml-3 text-xs-center">
                                        <v-flex xs12 sm3>
                                            <v-text-field label="Telefone" class="ma-3" v-model="editedPatient.telefone1" prepend-icon="phone" :mask="mask.maskTelefone" :counter="11"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm3>
                                            <v-text-field label="Telefone" class="ma-3" v-model="editedPatient.telefone2" prepend-icon="phone" :mask="mask.maskTelefone" :counter="11"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm3>
                                            <v-text-field label="Telefone" class="ma-3" v-model="editedPatient.telefone3" prepend-icon="phone" :mask="mask.maskTelefone" :counter="11"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-expand-transition>
                                <v-expansion-panel class="mr-3 ml-3 mt-4">
                                    <v-expansion-panel-content>
                                        <template v-slot:header><div class="font-weight-bold"><h3><v-icon left>home</v-icon>Endereço</h3></div></template>
                                        <v-form>
                                            <v-container grid-list-x1 fluid>
                                                <v-layout wrap justify>

                                                    <v-flex xs12 sm3>
                                                        <v-text-field label = "CEP" class="ml-3" v-model="cep" :mask = "mask.maskCEP" :counter= "8"></v-text-field>
                                                    </v-flex>
                                                    <v-spacer></v-spacer>
                                                    <v-flex xs12 sm3>
                                                        <!-- <v-select label="UF" hide-details single-line v-model="editedPatient.uf" :items="dataList.estados" menu-props="auto"></v-select> -->
                                                        <v-text-field label="UF" readonly v-model="editedPatient.uf"></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12 sm4>
                                                        <!-- <v-select label="Cidade" class="mr-2" single-line v-model="editedPatient.cidade" :items="dataList.cidades" menu-props="auto" hide-details></v-select> -->
                                                        <v-text-field label="Cidade" class="mr-2" readonly v-model="editedPatient.cidade"></v-text-field>
                                                    </v-flex>

                                                    <v-flex xs12 sm10>
                                                        <v-text-field label = "Logradouro" class="ml-2" v-model="editedPatient.logradouro"></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12 sm2>
                                                        <v-text-field label = "Numero" class="mr-2" v-model="editedPatient.numero"></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12 sm12>
                                                        <v-text-field label="Complemento" class="ml-2 mr-2" v-model="editedPatient.complemento"></v-text-field>
                                                    </v-flex>
                                                </v-layout>
                                            </v-container>
                                        </v-form>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>

                                <v-spacer></v-spacer>
                                <v-btn round flat color="primary" :disabled="!formRegister" @click="validateRegister()" class="ma-3">Cadastrar Paciente</v-btn>

                                <v-dialog v-model="sucessRegister" hide-overlay max-width="500px">
                                    <v-card color="white">
                                        <v-card-title class="text-xs-center ma-1">
                                            <h3>Paciente cadastrado com sucesso!<v-icon right>how_to_reg</v-icon></h3>
                                        </v-card-title>
                                        <v-card-text class="text-xs-center">
                                            <div>
                                                <h4 class="text--primary">Adicionar dependentes ao paciente cadastrado?
                                                    <v-btn flat icon color="blue lighten-2" @click="addDependents = true">
                                                        <v-icon>add</v-icon>
                                                    </v-btn>
                                                </h4>
                                            </div>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="primary" flat @click="endRegister()" router-link to="/" >Finalizar</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                                <v-dialog persistent v-model="addDependents">
                                    <v-card color="white" grid-list-x1 fluid>
                                        <v-card-title>
                                            <h3 class="text-xs-center">Adicionar Dependente<v-icon right>group</v-icon></h3>
                                        </v-card-title>
                                        <v-card-text>
                                            <v-form v-model="validDependents" lazy-validation>
                                                <v-layout wrap justify>
                                                    <v-flex xs12 sm8>
                                                        <v-text-field required label="Responsável*" v-model = "this.editedPatient.nome"
                                                                      :rules="rules.nomeRules && rules.CampoObrigatorio"
                                                                      class="ml-3" prepend-icon="group"></v-text-field>
                                                    </v-flex>
                                                    <v-spacer></v-spacer>
                                                    <v-flex xs12 sm3>
                                                        <v-select required label = "Grau de Dependência*" v-model = "dependents.grau"
                                                                  :rules = "[v => !!v || 'Selecione um valor']" :items = "['filho(a)', 'neto(a)']"
                                                                  class = "mr-3">
                                                        </v-select>
                                                    </v-flex>
                                                    <v-flex xs12 sm8>
                                                        <v-text-field required label="Nome*" v-model = "dependents.nome" :counter="50" maxlength="50"
                                                                      :rules="rules.nomeRules && rules.CampoObrigatorio" class="ml-3" prepend-icon="person"></v-text-field>
                                                    </v-flex>
                                                    <v-spacer></v-spacer>
                                                    <v-flex xs12 sm3>
                                                        <v-select v-model = "dependents.sexo" :items = "['FEMININO' , 'MASCULINO']"
                                                                  class = "mr-3" required label = "Sexo*" :rules = "[v => !!v || 'Selecione um valor']">
                                                        </v-select>
                                                    </v-flex>

                                                    <v-flex xs12 sm3><v-text-field class="ml-3" prepend-icon="event" label="Data de Nascimento*" v-model="dependents.dataNascimento" :mask="mask.maskDateOfBirth" :rules = "rules.CampoObrigatorio"></v-text-field></v-flex>

                                                    <v-spacer></v-spacer>
                                                    <v-flex xs12 sm3>
                                                        <v-text-field label="CPF" v-model="dependents.cpf" :mask = "mask.maskCpf" :counter= "11" class = "mr-3"></v-text-field>
                                                    </v-flex>
                                                </v-layout>
                                            </v-form>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="primary" flat :disabled="!formDependents" @click="validateDependents">Adicionar Dependente</v-btn>
                                            <v-btn color="primary" flat @click="clearDataDependents">Cancelar</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </v-layout>
                        </v-form>
                    </v-card>
                </v-flex>
            </v-card>
    </v-container>
</template>

<script>
    import axios from 'axios';
    export default {
        data: () => ({
            searchUser: true, registerUser: false, parameter: 'nome', searchData: null, isLoading: false, value: '',
            menuData: false, validRegister: true, validDependents: true, sucessRegister: false, addDependents: false,
            menu: false, existeDependente: false, editData: false,

            editedPatient:{
                nome:'', sexo:'', dataNascimento: '', cpf: '', email:'', telefone:'', telefone1:'',
                telefone2:'', telefone3:'', uf:'', cidade:'', logradouro:'', numero:'', complemento: '',
                dependentes: [], id: '', dataNascimentoResponsavel:'', nomeResponsavel:'', grauResponsavel: '',
            },
            defaultPatient: {
                nome:'', sexo:'', dataNascimento: null, cpf: '', email:'', telefone:'', telefone1:'',
                telefone2:'', telefone3:'', uf:'', cidade:'', logradouro:'', numero:'', complemento: '',
                dependentes: [], id: '', dataNascimentoResponsavel:'', nomeResponsavel:'', grauResponsavel: '',
            },
            defaultDependent:{
                nome:'', sexo: '', dataNascimento: null, cpf: '',  grauResponsavel: '',
                nomeResponsavel: '', dataNascimentoResponsavel:'', id: '', grau:''
            },
            dependents:{
                nome:'', sexo: '', dataNascimento: null, cpf: '',  grauResponsavel: '',
                nomeResponsavel: '', dataNascimentoResponsavel:'', id: '', grau:''
            },

            expand: false, dataList: {
                estados: [ 'Acre (AC)',
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
                'Tocantins (TO)'],
                cidades: ['Iranduba', 'Manaus', 'Parintins'],
            },
            mask:{
                maskCpf: '###.###.###-##',
                maskTelefone: '(##) #####-####',
                maskCEP: '##.###-###',
                maskDateOfBirth: '##/##/####'
            },
            rules: {
                nomeRules: [
                    v => (v && v.length <= 50) || 'Nome deve ter no máximo 50 caracteres'
                ],
                CampoObrigatorio:[
                    v=> !!v || 'Campo é obrigatório',
                ],
               emailRules: [],
            },
            email:'',
            cep:'',

        }),

        computed: {
            listPatient(){
                this.isLoading = false;
                return this.$store.getters.patient;
            },

            formRegister () {
                return this.editedPatient.nome && this.editedPatient.sexo && this.editedPatient.telefone;
            },

            formDependents() {
                return this.editedPatient.nome && this.dependents.grau && this.dependents.nome && this.dependents.sexo;
            },

            selectedPatient() {
                var patient = this.$store.getters.selectedPatient
                if(this.searchData == null && patient != null){
                    this.searchData = patient.nome
                }
                return patient;
            },

        },

        mounted(){
            if(this.selectedPatient != null){
                this.searchData = this.selectedPatient.nome
            }
        },

        watch: {
            email(val) { 
                if (val !== '') {
                    
                    this.rules.emailRules = [ val => (val.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) || 'Endereço de email inválido']
                } else if (val === '') {
                    this.rules.emailRules = []
                }
            },
            searchData(){
                if (this.searchData){
                    
                    this.isLoading = true;
                    const data = {
                        search: this.capitalize(this.searchData),
                        parametro: this.parameter,
                    };
                    this.$store.dispatch('searchPatient', data).then(() => {
                        if (this.listPatient.length > 0) {
                            for(let key in this.listPatient){
                                if (this.searchData === this.listPatient[key] || this.searchData === this.listPatient[key].nome || this.searchData === this.listPatient[key].cpf ){
                                    this.searchUser = true;
                                    this.registerUser = false;
                                    this.$store.dispatch('selecionarPaciente', {... this.$store.getters.patient[key]});
                                }
                            }
                        } else {

                            this.editedPatient = Object.assign({}, this.defaultPatient);
                            if (this.parameter === 'nome') {this.editedPatient.nome = this.searchData}
                            if (this.parameter === 'cpf') {this.editedPatient.cpf= this.searchData}
                            if (this.parameter === 'id') {this.editedPatient.cartaoId = this.searchData}
                        }
                    })
                } else {
                    this.$store.dispatch('selecionarPaciente', null);
                }
            },
            menuData (val) {
                val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'));
            },
            cep(val){
                //console.log(val)
                if(val.length == 8){
                    axios
                    .get('https://viacep.com.br/ws/'+ val + '/json/')
                    .then((response) => {
                        this.editedPatient.logradouro = response.data.logradouro + ', ' + response.data.bairro;
                        //this.editedPatient. = response.data.bairro;
                        this.editedPatient.cidade = response.data.localidade;
                        var array = this.dataList.estados;
                        /* console.log(
                            array.find(function(element) { 
                                                    if(element.includes('AM')){
                                                        return element; 
                                                    }
                                                      
                                                    return '';
                                                })
                        ) */
                        var uf = response.data.uf
                        this.editedPatient.uf = array.find(function(element) { 
                                                    if(element.includes(uf)){
                                                        return element; 
                                                    }
                                                    return '';
                                                }); 
                    })
                }else{
                    this.editedPatient.logradouro = '';
                    this.editedPatient.cidade = '';
                    this.editedPatient.uf=''
                }
            },
        },

        methods: {
            clearSearch () {
                this.isLoading = false;
                this.searchData = null;
            },

            capitalize(value){
                value = value.toString();
                return value.toUpperCase();
            },

            validateRegister(){

                this.registerPatient();
                this.sucessRegister = true;

            },

            registerPatient () {

                const  patientData = {
                    nome: this.capitalize(this.editedPatient.nome),
                    sexo: this.editedPatient.sexo,
                    dataNascimento: this.editedPatient.dataNascimento,
                    cpf: this.editedPatient.cpf,
                    email: this.email,
                    telefone: this.editedPatient.telefone,
                    telefone1:this.editedPatient.telefone1,
                    telefone2: this.editedPatient.telefone2,
                    telefone3: this.editedPatient.telefone3,
                    cep: this.cep,
                    uf: this.editedPatient.uf,
                    cidade: this.editedPatient.cidade,
                    logradouro: this.editedPatient.logradouro,
                    numero: this.editedPatient.numero,
                    complemento: this.editedPatient.complemento,
                    dependentes: '',
                    id: '',

                    dataNascimentoResponsavel: '',
                    nomeResponsavel: '',
                    grauResponsavel: '',
                };
                this.$store.dispatch('createPatient', patientData);
            },

            validateDependents() {

                this.registerDependents();
                this.clearDataDependents();

            },

            registerDependents (){

                const dependentsData = {

                    nome: this.capitalize(this.dependents.nome),
                    sexo: this.dependents.sexo,
                    dataNascimento: this.dependents.dataNascimento,
                    cpf: this.dependents.cpf,
                    id: '',
                    grauResponsavel: this.dependents.grauResponsavel,
                    grauDependencia: this.dependents.grau,
                    nomeResponsavel: this.capitalize(this.editedPatient.nome), dataNascimentoResponsavel: this.editedPatient.dataNascimento,
                    email: this.email, telefone: this.editedPatient.telefone, telefone1: this.editedPatient.telefone1,
                    telefone2: this.editedPatient.telefone2, telefone3: this.editedPatient.telefone3, cep: this.editedPatient.cep,
                    uf: this.editedPatient.uf, cidade: this.editedPatient.cidade, logradouro: this.editedPatient.logradouro,
                    complemento: this.editedPatient.complemento, numero: this.editedPatient.numero,

                };
                this.$store.dispatch('createPatientDependent', {...dependentsData,keyResponsavel:this.$store.getters.selectedPatient.key}).then(() => {
                    
                });

            },

            clearDataDependents(){

                this.addDependents = false;
                this.dependents = this.defaultDependent;

            },

            endRegister(){
                setTimeout(() => {
                    this.editedPatient = Object.assign({}, this.defaultPaciente);
                }, 300);
                if (this.registerUser === true){

                    this.registerUser = false;
                    this.sucessRegister = false;
                    this.searchUser = true;
                    this.searchData = null;

                }
            },

            editPatient(){

                let patient = this.selectedPatient;
                this.editedPatient = Object.assign(patient);
                this.editData = true;

                if (!this.editedPatient.dependentes){
                    this.existeDependente = false

                } else {
                    this.existeDependente = true

                }

            },

            cancel(){

                this.editData = false;
                setTimeout(() => {
                    this.editedPatient = Object.assign({}, this.defaultPaciente);
                }, 300);

            },
            save(){
                Object.assign({}, this.editedPaciente);
                this.saveEditions();
                this.cancel();
            },

            saveEditions(){
                const patientData = {
                    nome: this.capitalize(this.editedPatient.nome),
                    sexo: this.editedPatient.sexo,
                    dataNascimento: this.editedPatient.dataNascimento,
                    cpf: this.editedPatient.cpf,
                    email: this.email,
                    telefone: this.editedPatient.telefone,
                    telefone1:this.editedPatient.telefone1,
                    telefone2: this.editedPatient.telefone2,
                    telefone3: this.editedPatient.telefone3,
                    cep: this.editedPatient.cep,
                    uf: this.editedPatient.uf,
                    cidade: this.editedPatient.cidade,
                    logradouro: this.editedPatient.logradouro,
                    numero: this.editedPatient.numero,
                    complemento: this.editedPatient.complemento,
                    dependentes: '',
                    id: this.editedPatient.id,

                    dataNascimentoResponsavel: this.editedPatient.dataNascimentoResponsavel,
                    nomeResponsavel:this.editedPatient.nomeResponsavel,
                    grauResponsavel:this.editedPatient.grauResponsavel

                };

                this.$store.dispatch('loadPacientes').then(() => {
                    this.$store.dispatch('updateDataPatients', patientData);
                });

            },
        }
    }
</script>
