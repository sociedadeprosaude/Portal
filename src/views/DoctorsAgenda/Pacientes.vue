<template class="align-center">
    <v-container fab class="mt-0 pa-0">
        <v-card xs12 sm6 offset-sm3>
            <v-card-title>
                <v-icon left v-if="!cadastro"> search </v-icon><h2 v-if="!cadastro">Buscar Paciente</h2>
                <v-spacer></v-spacer>
                <v-icon left v-if="cadastro"> group_add </v-icon><h2 v-if="cadastro">Cadastrar Paciente</h2>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                    <template v-slot:activator = " { on }">
                        <v-btn round color="primary" small fab v-on="on" class="ma-3 mr-0"
                               :loading="loading"
                               :disabled ="loading"
                               @click="cadastro = !cadastro,  buscarPaciente = null, newCad = !newCad, this.editedPaciente = this.defaultPaciente">
                            <v-icon v-if="cadastro">keyboard_arrow_up</v-icon><v-icon v-else>add</v-icon>
                        </v-btn>
                    </template>
                    <span v-if="!cadastro">Cadastrar</span><span v-else>Voltar</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator = " { on } " >
                        <v-btn small fab v-show="!cadastro" v-on="on" round color = "grey light" class="text-xs-left mr-2 ml-0"
                               :disabled = "loading"
                               :loading="loading"
                               @click="buscarPaciente = null">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </template>
                    <span>Limpar dados</span>
                </v-tooltip>
            </v-card-title>
            <v-flex xs12 d-flex>
                <v-radio-group v-model="parameter" row  style="justify-content: center" >
                    <v-radio label="CPF" color="primary" value="cpf"></v-radio>
                    <v-radio label="RG" color="success" value="rg"></v-radio>
                    <v-radio label="Número do Associado" color="cyan" value="cartaoId"></v-radio>
                    <v-radio label="Nome do Associado" color="black" value="nome"></v-radio>
                </v-radio-group>
            </v-flex>
            <v-flex xs12>
                <v-expand-transition>
                    <v-combobox class=" ml-3 pa-0" return-object full-width single-line hide-no-data hide-no-selected clearable
                                v-model="buscarPaciente"
                                :items="pacientesOptions"
                                item-value="nome"
                                item-text="nome"
                                :disabled = "isLoading"
                                @input="comparar(),loader"
                                :loading="loading"
                                :placeholder="parameter"
                                prepend-icon="account_circle">
                    </v-combobox>
                </v-expand-transition>
                <br>

                <v-dialog v-model="loader" hide-overlay
                          persistent >
                    <v-progress-linear
                            v-model="value"
                            indeterminate

                    ></v-progress-linear>
                </v-dialog>

                <v-divider></v-divider>
                <v-flex xs12 v-if="busca && buscarPaciente">
                    <v-card class="mr-4 ml-4 mt-3 pa-3 blue lighten-5"  >
                        <v-card-title>
                            <v-flex xs12 sm9>
                                <h2 class="primary--text">{{buscarPaciente.nome}}
                                    <v-dialog v-model="EditarDados" max-width="600px">
                                        <template v-slot:activator="{on}">
                                            <v-btn flat icon color="blue lighten-2" v-on="on" @click="editPaciente(buscarPaciente), EditarDados = true"><v-icon>edit</v-icon></v-btn>
                                        </template>
                                        <v-card>
                                            <v-card-title><span class="headline primary--text">{{editedPaciente.nome}}</span></v-card-title>
                                            <v-card-text>
                                                <v-container grid-list-md>
                                                    <v-layout wrap>
                                                        <v-flex xs12 sm9><v-text-field label="Nome" v-model="editedPaciente.nome"></v-text-field></v-flex>
                                                        <v-flex xs12 sm3><v-text-field label="CPF" v-model="editedPaciente.cpf" :mask="mask.maskCpf"></v-text-field></v-flex>
                                                        <v-flex xs12 sm3><v-select label="Sexo" :items = "['feminino' , 'masculino']" v-model="editedPaciente.sexo"></v-select></v-flex>
                                                        <v-spacer></v-spacer>
                                                        <v-flex xs12 sm4><v-text-field label="Data de Nascimento" v-model="editedPaciente.dataNascimento"></v-text-field></v-flex>
                                                        <v-spacer></v-spacer>
                                                        <v-flex xs12 sm3><v-text-field label="RG" v-model="editedPaciente.rg" :mask="mask.maskRG"></v-text-field></v-flex>
                                                        <v-flex xs12 sm8><v-text-field label="Email" v-model="editedPaciente.email"></v-text-field></v-flex>
                                                        <v-flex xs12 sm4><v-text-field label="Telefone" v-model="editedPaciente.telefone" :mask="mask.maskTelefone"
                                                                                       :append-outer-icon ="expand ? 'remove_circle_outline' : 'add_circle_outline'"
                                                                                       @click:append-outer="expand = !expand">

                                                        </v-text-field>
                                                        </v-flex>
                                                        <v-layout row fill-height v-show="expand">
                                                            <v-flex xs12 sm4><v-text-field label="Telefone" v-model="editedPaciente.telefone1" :mask="mask.maskTelefone" prepend-icon="phone"></v-text-field></v-flex>
                                                            <v-flex xs12 sm4><v-text-field label="Telefone" v-model="editedPaciente.telefone2" :mask="mask.maskTelefone"></v-text-field></v-flex>
                                                            <v-flex xs12 sm4><v-text-field label = "Telefone" v-model="editedPaciente.telefone3" :mask = "mask.maskTelefone"></v-text-field></v-flex>
                                                        </v-layout>
                                                        <v-flex xs12 sm3><v-text-field label="CEP" v-model="editedPaciente.cep" :mask="mask.maskCEP"></v-text-field></v-flex>
                                                        <v-flex xs12 sm3><v-combobox label="UF" v-model="editedPaciente.uf" :items = "listasDados.estados" menu-props="auto"></v-combobox></v-flex>
                                                        <v-flex xs12 sm6><v-combobox label="Cidade" v-model="editedPaciente.cidade" :items = "listasDados.cidades" menu-props = "auto"></v-combobox></v-flex>
                                                        <v-flex xs12 sm10><v-text-field label="Logradouro" v-model="editedPaciente.logradouro"></v-text-field></v-flex>
                                                        <v-flex xs12 sm2><v-text-field label="Numero" v-model="editedPaciente.numero"></v-text-field></v-flex>
                                                        <v-flex xs12 sm6><v-switch v-model="existeDependente" :label="'Dependentes'" :append-icon="'group'"></v-switch>
                                                            <v-btn flat icon color="blue lighten-2" @click="dialogAddDependente = true"><v-icon>add</v-icon></v-btn>
                                                            <v-dialog persistent v-model="dialogAddDependente">
                                                                <v-card color="white">
                                                                    <v-card-title><h3 class="text-xs-center">Adicionar Dependente<v-icon right>group</v-icon></h3></v-card-title>
                                                                    <v-card-text>
                                                                        <v-form ref="dependentes" v-model="validDependente" lazy-validation>
                                                                            <v-container grid-list-x1 fluid>
                                                                                <v-layout wrap justify>

                                                                                    <v-flex xs12 sm8>
                                                                                        <v-text-field required label="Responsável*" v-model = "this.editedPaciente.nome" :counter="50" class="ml-3" maxlength="50"
                                                                                                      :rules="rules.nomeRules && rules.CampoObrigatorio"></v-text-field>
                                                                                    </v-flex>
                                                                                    <v-spacer></v-spacer>
                                                                                    <v-flex xs12 sm3>
                                                                                        <v-select required label = "Grau de Dependência*" v-model = "dependente.grau" class = "mr-3"
                                                                                                  :rules = "[v => !!v || 'Selecione um valor']" :items = "listasDados.grausDependentes"></v-select>
                                                                                    </v-flex>

                                                                                    <v-flex xs12 sm8>
                                                                                        <v-text-field required label="Nome*" v-model = "dependente.nome" :counter="50" class="ml-3"
                                                                                                      :rules="rules.nomeRules && rules.CampoObrigatorio" maxlength="50"></v-text-field>
                                                                                    </v-flex>
                                                                                    <v-spacer></v-spacer>
                                                                                    <v-flex xs12 sm3>
                                                                                        <v-select required label = "Sexo*" v-model = "dependente.sexo" :items = "['feminino' , 'masculino']"
                                                                                                  class = "mr-3" :rules = "[v => !!v || 'Selecione um valor']"></v-select>
                                                                                    </v-flex>

                                                                                    <v-flex xs12 sm3>
                                                                                        <v-menu ref = "menu" v-model = "menu" :close-on-content-click = "false" :nudge-right="40" lazy offset-y
                                                                                                full-width transition="scale-transition" min-width="290px">
                                                                                            <template v-slot:activator="{ on }">
                                                                                                <v-text-field required label="Data de Nascimento*" v-model="dependente.dataNascimento" class="ml-3" :mask="mask.data"
                                                                                                              prepend-icon = "date_range" v-on="on" :rules = "rules.CampoObrigatorio"></v-text-field>
                                                                                            </template>
                                                                                            <v-date-picker ref="picker" locale="pt-br" v-model="dependente.dataNascimento" :max="new Date().toISOString().substr(0, 10)" @input="menu = false"></v-date-picker>
                                                                                        </v-menu>
                                                                                    </v-flex>
                                                                                    <v-spacer></v-spacer>
                                                                                    <v-flex xs12 sm3>
                                                                                        <v-text-field label="RG" v-model="dependente.rg" :mask = "mask.maskRG" :counter="8"></v-text-field>
                                                                                    </v-flex>
                                                                                    <v-flex xs12 sm4>
                                                                                        <v-text-field label="CPF" class = "mr-3" v-model="dependente.cpf" :mask = "mask.maskCpf" :counter= "11"></v-text-field>
                                                                                    </v-flex>

                                                                                </v-layout>
                                                                            </v-container>
                                                                        </v-form>
                                                                    </v-card-text>
                                                                    <v-card-actions>
                                                                        <v-spacer></v-spacer>
                                                                        <v-btn color="primary" flat @click="validarDependente(),dialogAddDependente=false, dialogCadastro=true">Adicionar Dependente</v-btn>
                                                                        <v-btn color="primary" flat @click="dialogAddDependente=false">Fechar</v-btn>
                                                                    </v-card-actions>
                                                                </v-card>
                                                            </v-dialog>
                                                        </v-flex>
                                                        <v-layout row fill-height v-if="existeDependente">
                                                            <v-list two-line subheader>
                                                                <template v-for="(item) in editedPaciente.dependentes">
                                                                    <v-list-tile :key="item.nome" ripple @click="editPaciente(item), EditarDados = true">
                                                                        <v-list-tile-avatar>
                                                                            <v-icon class="primary--text">person</v-icon>
                                                                        </v-list-tile-avatar>
                                                                        <v-list-tile-content>
                                                                            <v-list-tile-title class="text--primary">{{item.nome}}</v-list-tile-title>
                                                                            <v-list-tile-sub-title>{{item.grau}}</v-list-tile-sub-title>
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
                                                <v-btn color="blue darken-1" flat @click="cancelar">Fechar</v-btn>
                                                <v-btn color="blue darken-1" flat @click="salvar">Salvar</v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>
                                </h2>
                            </v-flex>
                            <v-spacer></v-spacer>
                            <v-flex xs12 sm2 class="text-sm-right"><h4> ID: </h4></v-flex>
                        </v-card-title>

                    </v-card>
                </v-flex>
                <v-flex xs12 v-if="(cadastro && buscarPaciente) || (cadastro && newCad)">
                    <v-card class="mr-4 ml-4 mt-3" grid-list-x1 fluid>
                        <v-form ref="form" v-model="valid" lazy-validation>
                            <v-layout wrap justify>

                                <v-flex xs12 sm8>
                                    <v-text-field required label="Nome*" v-model = "editedPaciente.nome" class="ml-3" maxlength="50"
                                                  :counter="50" :rules="rules.nomeRules && rules.CampoObrigatorio"></v-text-field>
                                </v-flex>
                                <v-spacer></v-spacer>
                                <v-flex xs12 sm3>
                                    <v-select required label = "Sexo*" v-model = "editedPaciente.sexo" class = "mr-3"
                                              :items = "['feminino' , 'masculino']" :rules = "[v => !!v || 'Selecione um valor']"></v-select>
                                </v-flex>

                                <v-flex xs12 sm3>
                                    <v-menu ref="menu" v-model="menuData" :close-on-content-click="false"
                                            :nudge-right="40" lazy transition="scale-transition" offset-y
                                            full-width min-width="290px">
                                        <template v-slot:activator="{on}">
                                            <v-text-field  class="ml-3" v-model="editedPaciente.dataNascimento" label="Data Nascimento" prepend-icon="event" readonly v-on="on"></v-text-field>
                                        </template>
                                        <v-date-picker ref="picker" v-model="editedPaciente.dataNascimento" :max="new Date().toISOString().substr(0,10)" @input="menuData = false" locale="pt-br"></v-date-picker>
                                    </v-menu>
                                </v-flex>
                                <v-spacer></v-spacer>
                                <v-flex xs12 sm3>
                                    <v-text-field label="RG" v-model="editedPaciente.rg" :mask = "mask.maskRG" :counter="8"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm4>
                                    <v-text-field label="CPF" class = "mr-3" v-model="editedPaciente.cpf" :mask = "mask.maskCpf" :counter= "11"></v-text-field>
                                </v-flex>

                                <v-flex xs12 sm8>
                                    <v-text-field  label = "Email" class="ml-3" v-model="editedPaciente.email" prepend-icon = "email"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm4>
                                    <v-text-field required label = "Telefone*" class="ml-2 mr-3" v-model="editedPaciente.telefone" prepend-icon = "phone"
                                                  :mask = "mask.maskTelefone" :counter= "11" :rules = "rules.CampoObrigatorio"
                                                  :append-outer-icon ="expand ? 'remove_circle_outline' : 'add_circle_outline'"
                                                  @click:append-outer="expand = !expand"></v-text-field>
                                </v-flex>
                                <v-expand-transition>
                                    <v-layout row fill-height v-show="expand" class="mr-3 ml-3 text-xs-center">
                                        <v-flex xs12 sm3>
                                            <v-text-field label="Telefone" class="ma-3" v-model="editedPaciente.telefone1" prepend-icon="phone" :mask="mask.maskTelefone" :counter="11"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm3>
                                            <v-text-field label="Telefone" class="ma-3" v-model="editedPaciente.telefone2" prepend-icon="phone" :mask="mask.maskTelefone" :counter="11"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm3>
                                            <v-text-field label="Telefone" class="ma-3" v-model="editedPaciente.telefone3" prepend-icon="phone" :mask="mask.maskTelefone" :counter="11"></v-text-field>
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
                                                        <v-text-field label = "CEP" class="ml-3" v-model="editedPaciente.cep" :mask = "mask.maskCEP" :counter= "8"></v-text-field>
                                                    </v-flex>
                                                    <v-spacer></v-spacer>
                                                    <v-flex xs12 sm3>
                                                        <v-select label="UF" hide-details single-line v-model="editedPaciente.uf" :items="listasDados.estados" menu-props="auto"></v-select>
                                                    </v-flex>
                                                    <v-flex xs12 sm4>
                                                        <v-select label="Cidade" class="mr-2" single-line v-model="editedPaciente.cidade" :items="listasDados.cidades" menu-props="auto" hide-details></v-select>
                                                    </v-flex>

                                                    <v-flex xs12 sm10>
                                                        <v-text-field label = "Logradouro" class="ml-2" v-model="editedPaciente.logradouro"></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12 sm2>
                                                        <v-text-field label = "Numero" class="mr-2" v-model="editedPaciente.numero"></v-text-field>
                                                    </v-flex>
                                                </v-layout>
                                            </v-container>
                                        </v-form>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>

                                <v-spacer></v-spacer><v-btn round color="primary" dark class="ml-3 mt-4  text-xs-right" :disabled="!valid" @click="validate()">Adicionar Paciente</v-btn>
                                <v-dialog v-model="dialogCadastro" hide-overlay max-width="500px">
                                    <v-card color="white">
                                        <v-card-title><h3 class="text-xs-center">Paciente cadastrado com sucesso<v-icon right>how_to_reg</v-icon></h3></v-card-title>
                                        <v-card-text>
                                            <div>
                                                <h4>Adicionar dependentes ao paciente cadastrado?
                                                    <v-btn flat icon color="blue lighten-2" @click="dialogAddDependente = true"><v-icon>add</v-icon></v-btn>
                                                </h4>
                                            </div>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer></v-spacer><v-btn color="primary" flat @click="dialogCadastro=false, cancelar()" router-link to="/" >Finalizar</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                                <v-dialog persistent v-model="dialogAddDependente">
                                    <v-card color="white">
                                        <v-card-title><h3 class="text-xs-center">Adicionar Dependente<v-icon right>group</v-icon></h3></v-card-title>
                                        <v-card-text>
                                            <v-form ref="dependentes" v-model="validDependente" lazy-validation>
                                                <v-container grid-list-x1 fluid>
                                                    <v-layout wrap justify>

                                                        <v-flex xs12 sm8>
                                                            <v-text-field required label="Responsável*" v-model = "this.editedPaciente.nome" :counter="50" class="ml-3" maxlength="50"
                                                                          :rules="rules.nomeRules && rules.CampoObrigatorio"></v-text-field>
                                                        </v-flex>
                                                        <v-spacer></v-spacer>
                                                        <v-flex xs12 sm3>
                                                            <v-select required label = "Grau de Dependência*" v-model = "dependente.grau" class = "mr-3"
                                                                      :rules = "[v => !!v || 'Selecione um valor']" :items = "listasDados.grausDependentes"></v-select>
                                                        </v-flex>

                                                        <v-flex xs12 sm8>
                                                            <v-text-field required label="Nome*" v-model = "dependente.nome" :counter="50" class="ml-3"
                                                                          :rules="rules.nomeRules && rules.CampoObrigatorio" maxlength="50"></v-text-field>
                                                        </v-flex>
                                                        <v-spacer></v-spacer>
                                                        <v-flex xs12 sm3>
                                                            <v-select required label = "Sexo*" v-model = "dependente.sexo" :items = "['feminino' , 'masculino']"
                                                                      class = "mr-3" :rules = "[v => !!v || 'Selecione um valor']"></v-select>
                                                        </v-flex>

                                                        <v-flex xs12 sm3>
                                                            <v-menu ref = "menu" v-model = "menu" :close-on-content-click = "false" :nudge-right="40" lazy offset-y
                                                                    full-width transition="scale-transition" min-width="290px">
                                                                <template v-slot:activator="{ on }">
                                                                    <v-text-field required label="Data de Nascimento*" v-model="dependente.dataNascimento" class="ml-3" :mask="mask.data"
                                                                                  prepend-icon = "date_range" v-on="on" :rules = "rules.CampoObrigatorio"></v-text-field>
                                                                </template>
                                                                <v-date-picker ref="picker" locale="pt-br" v-model="dependente.dataNascimento" :max="new Date().toISOString().substr(0, 10)" @input="menu = false"></v-date-picker>
                                                            </v-menu>
                                                        </v-flex>
                                                        <v-spacer></v-spacer>
                                                        <v-flex xs12 sm3>
                                                            <v-text-field label="RG" v-model="dependente.rg" :mask = "mask.maskRG" :counter="8"></v-text-field>
                                                        </v-flex>
                                                        <v-flex xs12 sm4>
                                                            <v-text-field label="CPF" class = "mr-3" v-model="dependente.cpf" :mask = "mask.maskCpf" :counter= "11"></v-text-field>
                                                        </v-flex>

                                                    </v-layout>
                                                </v-container>
                                            </v-form>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="primary" flat @click="validarDependente(),dialogAddDependente=false">Adicionar Dependente</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>

                            </v-layout>
                        </v-form>
                    </v-card>
                </v-flex>
            </v-flex>
        </v-card>
    </v-container>
</template>

<script>
    export default {
        data: () => ({
            buscarPaciente: null, cadastro:false, busca: false, newCad: false, isLoading:false,
            parameter:'',
            value:'',
            parameterOptions:
                [
                    { text: 'CPF', value: 'cpf'},
                    { text: 'RG', value: 'rg'},
                    { text: 'Numero do associado', value: 'cartaoId'},
                    { text: 'Nome do associado', value: 'nome'}
                ],

            loading: false, search: null, valid: true, validDependente: true, expand: false,menuData:false, date: null, menu: false,
            dialogSave: false, EditarDados: false,dialogAddDependente:false, dialogCadastro:false,dialogNovoProntuario: false,
            file:'file', existeDependente: false, desserts: [], editedIndex: -1,

            nome: '', sexo: '', dataNascimento: '',rg: '', cpf: '', email: '', telefone: '', telefone1:'', telefone2: '',
            telefone3: '', cep:'', uf: '', cidade: '', logradouro: '', numero:'', cartaoId:'',dataNascimentoResponsavel:'', responsavel:'', grau: '',

            dependente:{nome:'', sexo:'', dataNascimento: null, rg: '', cpf: '',  grau: '', responsavel: '', dataNascimentoResponsavel:'', cartaoId:''},

            rules: {
                nomeRules: [
                    v => (v && v.length <= 50) || 'Nome deve ter no máximo 50 caracteres'
                ],
                CampoObrigatorio:[
                    v=> !!v || 'Campo é obrigatório',
                ],
            },

            mask:{
                maskRG: '#######-#',
                maskCpf: '###.###.###-##',
                maskTelefone: '(##) #####-####',
                maskCEP: '##.###-###',
            },

            listasDados:{
                estados: ['Acre','Alagoas', 'Amazonas', 'São Paulo', 'Rio de Janeiro', 'Rondonia', 'Roraima'],
                cidades: ['Iranduba', 'Manaus', 'Parintins'],
                idades:['1', '2','3','4','5','6','7','8','9','9','10','11','12','13','14','15','16'],
                grausDependentes: ['filho(a)', 'neto(a)', ],
            },

            editedPaciente:{
                nome:'', sexo:'', dataNascimento: '', rg: '', cpf: '', email:'', telefone:'', telefone1:'', telefone2:'', telefone3:'',
                cep:'', uf:'', cidade:'', logradouro:'', numero:'', dependentes: [], cartaoId: '', dataNascimentoResponsavel:'', responsavel:'', grau:'',
            },

            defaultPaciente: {  nome:'', sexo:'', dataNascimento: '', rg: '', cpf: '', email:'', telefone:'', telefone1:'',
                telefone2:'', telefone3:'', cep:'', uf:'', cidade:'', logradouro:'', numero:'', dependentes: [], cartaoId: '',
                dataNascimentoResponsavel:'', responsavel:'', grau:'',
            }
        }),

        computed: {

            pacientesOptions(){
                if (this.buscarPaciente === null || this.buscarPaciente === '' || this.buscarPaciente === undefined) {

                    return this.items;

                } else {

                    const data = {
                        search: this.buscarPaciente,
                        parametro: this.parameter,
                    };

                    this.$store.dispatch('searchPatient', data);
                    return this.$store.getters.patient

                }
            },

            loader(){
                return this.$store.getters.statusLoaderPatient
            },
        },

        watch: {


            buscarPaciente(val){
                if(!val){
                     this.$store.dispatch('selecionarPaciente', null)
                }
            },
            menuData (val) {
                val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
            },

            menu(val) {
                console.log('menu');
                val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
            },

            dialogSave(val) {
                if (!val) return
                setTimeout(() => (this.dialogSave = false), 2000)
            },
        },

        methods: {

            comparar(){

                if(this.buscarPaciente !== null ){
                    if (this.buscarPaciente === '' || this.buscarPaciente === undefined){
                        this.busca = false;
                        this.editedPaciente = Object.assign({}, this.defaultPaciente);
                        this.cadastro = true;

                    } else {
                        let tamanho = this.pacientesOptions.length;
                        if (tamanho !== 0){
                            for(let key in this.pacientesOptions){

                                if (this.buscarPaciente === this.pacientesOptions[key] || this.buscarPaciente === this.pacientesOptions[key].nome ){
                                    this.busca = true;
                                    this.cadastro = false;

                                    this.$store.dispatch('selecionarPaciente', {... this.$store.getters.patient[key]});
                                    return true
                                }
                            }
                        } else {
                            this.busca = false;
                            this.editedPaciente = Object.assign({}, this.defaultPaciente);
                            if (this.parameter === 'nome') {this.editedPaciente.nome = this.buscarPaciente};
                            if (this.parameter === 'cpf') {this.editedPaciente.cpf= this.buscarPaciente};
                            if (this.parameter === 'rg') {this.editedPaciente.rg = this.buscarPaciente};
                            if (this.parameter === 'cartaoId') {this.editedPaciente.cartaoId = this.buscarPaciente};
                            this.cadastro = true;

                        }

                    }
                }

            },

            savePaciente(){
                const pacienteData = {
                    nome: this.buscarPaciente,
                    sexo: this.editedPaciente.sexo,
                    dataNascimento: this.editedPaciente.dataNascimento,
                    rg: this.editedPaciente.rg,
                    cpf: this.editedPaciente.cpf,
                    email: this.editedPaciente.email,
                    telefone: this.editedPaciente.telefone,
                    telefone1:this.editedPaciente.telefone1,
                    telefone2: this.editedPaciente.telefone2,
                    telefone3: this.editedPaciente.telefone3,
                    cep: this.editedPaciente.cep,
                    uf: this.editedPaciente.uf,
                    cidade: this.editedPaciente.cidade,
                    logradouro: this.editedPaciente.logradouro,
                    numero: this.editedPaciente.numero,
                    dependentes: '',

                    cartaoId: this.cartaoId,

                    dataNascimentoResponsavel: this.editedPaciente.dataNascimentoResponsavel,
                    responsavel:this.editedPaciente.responsavel,
                    grau:this.editedPaciente.grau,

                }

                this.$store.dispatch('createPatient', pacienteData)
            },

            salvarAlteracoes(){

                const pacientesData = {
                    nome: this.editedPaciente.nome,
                    sexo:this.editedPaciente.sexo,
                    dataNascimento: this.editedPaciente.dataNascimento,
                    rg: this.editedPaciente.rg,
                    cpf: this.editedPaciente.cpf,
                    email: this.editedPaciente.email,
                    telefone: this.editedPaciente.telefone,
                    telefone1: this.editedPaciente.telefone1, telefone2: this.editedPaciente.telefone2, telefone3: this.editedPaciente.telefone3,
                    cep: this.editedPaciente.cep,
                    uf: this.editedPaciente.uf,
                    cidade: this.editedPaciente.cidade,
                    logradouro: this.editedPaciente.logradouro,
                    numero: this.editedPaciente.numero,
                    dependentes: this.editedPaciente.dependentes,

                    cartaoId: this.editedPaciente.cartaoId,

                    dataNascimentoResponsavel: this.editedPaciente.dataNascimentoResponsavel,
                    responsavel:this.editedPaciente.responsavel,
                    grau:this.editedPaciente.grau,

                }

                this.$store.dispatch('updateDataPatients', pacientesData);

            },

            editPaciente (item){

                this.$store.dispatch('searchPatient').then(() => {

                    this.editedPaciente = Object.assign(item);

                    if (this.editedPaciente.dependentes === undefined){
                        this.existeDependente = false

                    } else {
                        this.existeDependente = true

                    }
                })
            },

            cancelar(){

                this.EditarDados = false;
                setTimeout(() => {
                    this.editedPaciente = Object.assign({}, this.defaultPaciente);
                    this.editedIndex = -1
                }, 300);
                if (this.cadastro === true){
                        this.cadastro = false;
                        this.buscarPaciente = null;

                }
            },

            salvar(){
                if (this.editedIndex > -1) {
                    Object.assign(this.desserts[this.editedIndex], this.editedPaciente)
                } else {
                    this.desserts.push(this.editedPaciente)
                }

                this.salvarAlteracoes()
                this.cancelar()
            },

            validate () {
                if (this.$refs.form.validate()) {
                    this.savePaciente();
                    this.dialogCadastro = true;
                }
            },

            validarDependente(){
                if (this.$refs.dependentes.validate()){
                    this.addDependente();
                    this.reset()
                }
            },

            reset(){
                this.dependente.grau = ''
                this.dependente.nome = ''
                this.dependente.sexo = ''
                this.dependente.dataNascimento= ''
                this.dependente.cpf = ''
                this.dependente.rg = ''
            }, //limpar campos dependentes

            addDependente(){

                const dependenteData = {
                    nome: this.dependente.nome,
                    sexo:this.dependente.sexo,
                    dataNascimento: this.dependente.dataNascimento,
                    rg: this.dependente.rg,
                    cpf: this.dependente.cpf,
                    cartaoId: this.dependente.cartaoId,
                    grau: this.dependente.grau,

                    responsavel: this.editedPaciente.nome, dataNascimentoResponsavel: this.editedPaciente.dataNascimento,email: this.editedPaciente.email,
                    telefone: this.editedPaciente.telefone, telefone1: this.editedPaciente.telefone1, telefone2: this.editedPaciente.telefone2, telefone3: this.editedPaciente.telefone3,
                    cep: this.editedPaciente.cep, uf: this.editedPaciente.uf, cidade: this.editedPaciente.cidade, logradouro: this.editedPaciente.logradouro, numero: this.editedPaciente.numero,
                }
                this.$store.dispatch('createPatient', dependenteData).then(() => {

                    this.$store.dispatch('addDependent',dependenteData)
                })

            },


        }
    }
</script>