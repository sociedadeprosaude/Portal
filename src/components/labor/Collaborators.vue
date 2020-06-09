<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12 class="px-3 my-3">
                <v-expansion-panels inset>
                    <v-expansion-panel v-for="(user, i) in collaborators" :key="i">
                        <v-expansion-panel-header>
                            <v-flex xs4>
                                <span>{{user.name.toUpperCase()}}</span>
                            </v-flex>
                            <v-flex xs4>
                                <span>{{user.email}}</span>
                            </v-flex>
                            <v-flex xs2>
                                <span>R$ {{user.salary}}</span>
                            </v-flex>
                            <v-flex>
                                <span>{{user.advances ? user.advances.length : 0}}</span>
                            </v-flex>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-layout row wrap>
                                <v-flex xs12><v-divider/></v-flex>
                                <v-flex xs12 class="mt-2 mb-2">
                                    <span class="mr-3">CPF: {{user.cpf}}</span>
                                    <span v-if="user.telephones">Telefone: {{user.telephones[0]}}</span>
                                </v-flex>
                                <v-flex xs12>
                                    <span v-if="user.bankData" class="mr-3">Banco: {{user.bankData.bank.name}}</span>
                                    <span v-if="user.bankData" class="mr-3">Agência: {{user.bankData.branchBank}}</span>
                                    <span v-if="user.bankData">Conta Corrente: {{user.bankData.accountBank}}</span>
                                </v-flex>

                                <v-flex xs12><v-divider/></v-flex>
                                <v-flex xs10 class="text-left mb-2 mt-3">
                                    <v-btn rounded text class="primary mx-1" @click="setSalary(user)">Salario</v-btn>
                                    <v-btn rounded text class="primary mx-1" @click="setAdvance(user)">Adiantamento</v-btn>
                                </v-flex>
                                <v-flex xs2 class="mt-3">
                                    <v-btn rounded text class="red mx-1" @click="deleteUser(user)">Apagar</v-btn>
                                </v-flex>
                                <v-divider class="primary"/>
                                <v-flex xs12>
                                    <span class="my-headline text-left mt-2">Unidade(s)</span>
                                </v-flex>
                                <v-flex xs3 class="my-2" v-for="unit in units" :key="unit.name">
                                    <v-btn
                                            @click="setUserUnit(unit, user)"
                                            rounded
                                            :class="[user.clinic ? user.clinic.name === unit.name ? 'primary' : '' : '']">
                                        <img width="124px" :src="unit.logo">
                                    </v-btn>
                                </v-flex>
                                <v-flex xs12><v-divider class="primary"/></v-flex>
                                <v-flex xs12 v-if="user.advances">
                                    <v-layout row wrap>
                                        <v-flex xs12>
                                            <span class="my-headline text-left mt-2">Adiantamentos</span>
                                        </v-flex>
                                        <v-flex xs3 class="my-2" v-for="advance in user.advances" :key="advance.date">
                                            <v-card class="pa-3">
                                                <v-layout row wrap>
                                                    <v-flex xs12 class="mb-3">
                                                      <span>{{advance.date | dateFilter}}</span>
                                                    </v-flex>
                                                    <v-flex xs12 class="text-center">
                                                        <span class="font-weight-bold">R$ {{advance.value}}</span>
                                                        <span class="font-weight-bold"> |  Parcelas:{{advance.parcel}}</span>
                                                    </v-flex>
                                                </v-layout>
                                            </v-card>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs12><v-divider class="primary"/></v-flex>
                                <v-flex xs12>
                                    <span class="my-headline text-left mt-2">Grupos</span>
                                </v-flex>

                                <v-flex xs4>
                                    <v-treeview
                                            return-object
                                            open-all
                                            dense
                                            selectable
                                            v-model="selection"
                                            :items="items"
                                    ></v-treeview>
                                </v-flex>

                                <v-col class="pa-6" cols="6">
                                    <template v-if="!selection.length">
                                        No nodes selected.
                                    </template>
                                    <template v-else>
                                        <div v-for="(node,i) in selection" :key="i">
                                            {{ node.name }}
                                        </div>
                                    </template>
                                </v-col>

                                {{selection}}

                                <v-flex xs3 class="my-2" v-for="group in groups" :key="group">
                                    <v-btn
                                            @click="setGroup(user, group)"
                                            rounded
                                            :color="user.group ? user.group === group ? 'primary' : '' : ''">
                                        {{group}}
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-flex>
        </v-layout>
        <v-dialog v-model="registerSalary" max-width="300px">
            <v-card>
                <v-card-title>Salário</v-card-title>
                <v-card-text>
                    <v-currency-field v-model="value" label="valor"/>
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn v-if="!loading" class="primary" @click="setSalary(selectedUser)">
                        Salvar
                    </v-btn>
                    <v-progress-circular indeterminate v-else class="primary--text"/>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="registerAdvance" max-width="300px">
            <v-card>
                <v-card-title>Adiantamento</v-card-title>
                <v-card-text>
                    <v-currency-field v-model="value" label="valor"/>
                    <v-flex>
                        <v-select :items="parcels" v-model="parcel" label="Parcelas" filled/>
                    </v-flex>
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn v-if="!loading" class="primary" @click="setAdvance(selectedUser)">
                        Adicionar
                    </v-btn>
                    <v-progress-circular indeterminate v-else class="primary--text"/>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import moment from "moment";

    export default {

        name: "Collaborators",
        props: ['collaborators'],

        data: () => ({
            selection: [],
            items: [
                {
                    id: 0,
                    name: 'All :',
                    children: [
                        {
                            id: 1,
                            name: 'Operacional :',
                            children: [
                                {
                                    id: 2,
                                    name: 'Agenda',
                                    children: [
                                        {id: 21, name: 'Agendamento'},
                                        {id: 22, name: 'GerenciamentoConsultas'},
                                        {id: 23, name: 'ConsultasPacientes'},
                                        {id: 24, name: 'ConsultasCanceladas'},
                                        {id: 25, name: 'Cids'},
                                        {id: 26, name: 'DeletarConsultas'},
                                        {id: 27, name: 'Declaration'},
                                    ],
                                },
                                {id: 3, name: 'Caixa'},
                                {id: 4, name: 'Senhas'},
                                {id: 5, name: 'Tabela Semanal'},
                            ],
                        },
                        {
                            id: 6,
                            name: 'Cadastro e Registros :',
                            children: [
                                {
                                    id: 7,
                                    name: 'Agenda',
                                    children: [
                                        {id: 71, name: 'Agendamento'},
                                        {id: 72, name: 'GerenciamentoConsultas'},
                                        {id: 73, name: 'ConsultasPacientes'},
                                        {id: 74, name: 'ConsultasCanceladas'},
                                        {id: 75, name: 'Cids'},
                                        {id: 76, name: 'DeletarConsultas'},
                                        {id: 77, name: 'Declaration'},
                                    ],
                                },
                                {id: 8, name: 'Caixa'},
                                {id: 9, name: 'Senhas'},
                                {id: 10, name: 'Tabela Semanal'},
                            ],
                        },
                    ]
                }
            ],
            loading: true,
            registerSalary: false,
            registerAdvance: false,
            value: undefined,
            selectedUser: undefined,
            parcels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            parcel: 1,
            months:[],
            date: moment().format('YYYY-MM-DD'),
        }),

        mounted() {
            this.getInitialInfo()
        },

        computed: {

            units() {
                return this.$store.getters.units
            },

            groups() {
                return ['admin', 'colaborador', 'gerente', 'doctor']
            }

        },

        methods: {

            async getInitialInfo() {
                await this.$store.dispatch('getColaborators');
                this.loading = false
            },

            setGroup(user, group) {
                if (user.group === group) {
                    this.$store.dispatch('updateUserField', {user: user, field: 'group', value: 'delete'})
                } else {
                    this.$store.dispatch('updateUserField', {user: user, field: 'group', value: group})
                }
                this.$store.dispatch('getColaborators');
            },

            async setSalary(user) {
                if (user) this.selecteduser = user;
                if (!this.registerSalary) {
                    this.value = user.salary;
                    this.registerSalary = true;
                    return
                }
                this.loading = true;
                await this.$store.dispatch('updateUserField', {
                    user: this.selecteduser,
                    field: 'salary',
                    value: this.value
                });
                await this.getInitialInfo();
                this.clearValuesForm();
            },

            async setAdvance(user) {
                if (user) this.selecteduser = user;
                if (!this.registerAdvance) {
                    this.registerAdvance = true;
                    return
                }
                this.loading = true;
                if (!this.selecteduser.advances) this.selecteduser.advances = [];

                for (let i = 0; i < this.parcel; i++ ) {
                    if( parseInt(moment(this.date).format('DD')) > 19){
                        this.months[i]= moment(this.date).add(i,'months').format('YYYY-MM').toString()
                    } else {
                        this.months[i]= moment(this.date).add((i- 1),'months').format('YYYY-MM').toString()
                    }
                }

                this.selecteduser.advances.push({
                    date: moment().format('YYYY-MM-DD hh:mm:ss'),
                    value: this.value,
                    valueParcel:  this.value/this.parcel,
                    parcel: this.parcel,
                    months: this.months
                });
                await this.$store.dispatch('updateUserField', {
                    user: this.selecteduser,
                    field: 'advances',
                    value: this.selecteduser.advances
                });
                await this.getInitialInfo();
                this.clearValuesForm();
            },

            async setUserUnit(unit, user) {
                await this.$store.dispatch('updateUserField', {
                    user: user,
                    field: 'clinic',
                    value: unit
                });
                await this.getInitialInfo()
            },

            async deleteUser(user){
                await this.$store.dispatch('deleteUser',{user: user})
            },

            clearValuesForm() {
                this.registerSalary = false;
                this.registerAdvance = false;
                this.value = undefined;
                this.selectedUser = undefined;
            },

        },
    }
</script>