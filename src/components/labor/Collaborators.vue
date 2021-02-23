<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 class="px-3 my-3">
        <v-expansion-panels inset>
          <v-expansion-panel v-for="(user, i) in collaborators" :key="i">
            <v-expansion-panel-header>
              <v-flex xs4>
                <span>{{ user.name.toUpperCase() }}</span>
              </v-flex>
              <v-flex xs4>
                <span>{{ user.email }}</span>
              </v-flex>
              <v-flex xs2>
                <span>R$ {{ user.salary }}</span>
              </v-flex>
              <v-flex>
                <span>{{ user.advances ? user.advances.length : 0 }}</span>
              </v-flex>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-divider/>
                </v-flex>
                <v-flex xs12 class="mt-2 mb-2">
                  <span class="mr-3">CPF: {{ user.cpf }}</span>
                  <span v-if="user.telephones">Telefone: {{ user.telephones[0] }}</span>
                </v-flex>
                <v-flex xs12>
                  <span v-if="user.bankData" class="mr-3">Banco: {{ user.bankData.bank.name }}</span>
                  <span v-if="user.bankData" class="mr-3">Agência: {{ user.bankData.branchBank }}</span>
                  <span v-if="user.bankData">Conta Corrente: {{ user.bankData.accountBank }}</span>
                </v-flex>

                <v-flex xs12>
                  <v-divider/>
                </v-flex>
                <v-flex xs10 class="text-left mb-2 mt-3">
                  <v-btn rounded text class="primary mx-1" @click="setSalary(user)">Salario</v-btn>
                  <v-btn rounded text class="primary mx-1" @click="setAdvance(user)">Adiantamento</v-btn>
                </v-flex>
                <v-flex xs2 class="mt-3">
                  <v-btn rounded text class="white--text red mx-1" :loading="loading" @click="deleteUser(user)">Apagar</v-btn>
                </v-flex>
                <v-divider class="primary"/>
                <v-flex xs12 v-if="loggedUser.group === 'admin'">
                  <v-layout row wrap>
                    <v-flex xs12>
                      <span class="my-headline text-left mt-2">Unidade(s)</span>
                    </v-flex>
                    <v-flex xs3 class="my-2" v-for="unit in units" :key="unit.name">
                      <v-btn
                          @click="setUserUnit(unit, user)"
                          rounded
                          :class="[user.clinic ? user.clinic.id === unit.id ? 'primary' : '' : '']">
                        <img width="124px" :src="unit.logo">
                      </v-btn>
                    </v-flex>
                    <v-flex xs12>
                      <v-divider class="primary"/>
                    </v-flex>
                    <v-flex xs12 v-if="user.advances">
                      <v-layout row wrap>
                        <v-flex xs12>
                          <span class="my-headline text-left mt-2">Adiantamentos</span>
                        </v-flex>
                        <v-flex xs3 class="my-2" v-for="advance in user.advances" :key="advance.date">
                          <v-card class="pa-3">
                            <v-layout row wrap>
                              <v-flex xs12 class="mb-3">
                                <span>{{ advance.date | dateFilter }}</span>
                              </v-flex>
                              <v-flex xs12 class="text-center">
                                <span class="font-weight-bold">R$ {{ advance.value }}</span>
                                <span class="font-weight-bold"> |  Parcelas:{{ advance.parcel }}</span>
                              </v-flex>
                            </v-layout>
                          </v-card>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-flex xs12>
                      <v-divider class="primary"/>
                    </v-flex>
                    <v-flex xs12>
                      <span class="my-headline text-left mt-2">Grupos</span>
                    </v-flex>

                    <v-flex xs3 class="my-2" v-for="group in groups" :key="group">
                      <v-btn
                          @click="setGroup(user, group)"
                          rounded
                          :color="user.group ? user.group === group ? 'primary' : '' : ''">
                        {{ group }}
                      </v-btn>
                    </v-flex>

                    <v-dialog v-model="dialog" width="700">
                      <v-container fluid>
                        <v-card>
                          <v-card-title class="headline grey lighten-2 mb-4" primary-title>
                            <v-btn style="display: none" text color="transparent" class="transparent"/>
                            <v-spacer/>
                            CRIAR e EDITAR PERMISSÕES
                            <v-spacer/>
                            <v-btn class="transparent elevation-0" @click="dialog = false">
                              <v-icon>close</v-icon>
                            </v-btn>
                          </v-card-title>
                          <v-card-text>
                            <v-layout row wrap>
                              <v-flex xs6>
                                <span style="color: #003B8F">Todas as Permissões do Portal:</span>
                                <v-treeview
                                    return-object
                                    open-all
                                    dense
                                    selectable
                                    v-model="selectedPermissions"
                                    :items="permissions"
                                ></v-treeview>
                              </v-flex>

                              <v-flex xs6>
                                <template v-if="!selectedPermissions.length">
                                  <span style="color: red">Nenhuma permissão selecionada.</span>
                                </template>
                                <template v-else>
                                  <span style="color: #003B8F">Permissões Selecionadas:</span>
                                  <div v-for="(node,i) in selectedPermissions" :key="i">
                                    {{ node.name }}
                                  </div>
                                </template>
                              </v-flex>
                            </v-layout>
                          </v-card-text>
                          <v-divider></v-divider>
                          <v-card-actions>
                            <v-flex xs12 class="text-center mb-2 mt-3">
                              <v-btn rounded text class="primary mx-1" @click="userGroups(user)">
                                Salvar
                              </v-btn>
                            </v-flex>
                          </v-card-actions>
                        </v-card>
                      </v-container>
                    </v-dialog>

                    <v-flex xs12>
                      <v-divider class="primary"/>
                    </v-flex>

                    <v-layout row wrap>
                      <v-flex xs12>
                        <span class="my-headline text-left mt-2">Permissões</span>
                      </v-flex>

                      <v-flex xs12 class="text-center mb-2 mt-3">
                        <v-btn rounded text class="primary mx-1" @click="dialog = true">Criar e Editar Permissões
                        </v-btn>
                      </v-flex>
                      <v-layout row wrap class="align-center justify-center">
                        <v-flex xs6 v-if="user.permissions" class="text-center">
                          <span style="color: #003B8F">Permissões Salvas do Usuário:</span>
                          <div v-for="(node,i) in user.permissions" :key="i">
                            {{ node }}
                          </div>
                        </v-flex>
                      </v-layout>
                    </v-layout>
                  </v-layout>
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
          <v-btn v-if="!loading" class="primary" @click="setSalary(selecteduser)">
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
  props: ['collaborators','loading'],

  data: () => ({
    selectedPermissions: [{name:'Home'}],
    dialog: false,
    havePermissions: false,
    registerSalary: false,
    registerAdvance: false,
    value: undefined,
    selectedUser: undefined,
    parcels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    parcel: 1,
    months: [],
    date: moment().format('YYYY-MM-DD'),
  }),

  computed: {
    loggedUser() {
      return this.$store.getters.user
    },
    permissions() {
      return this.$store.getters.permissions
    },
    units() {
      return this.$store.getters.units
    },

    groups() {
      return ['admin', 'colaborador', 'gerente', 'doctor']
    }

  },
  methods: {

    async userGroups(user) {
      this.selectedPermissions = this.selectedPermissions.map(value => value.name)
      user.permissions = this.selectedPermissions

      await this.$apollo.mutate({
          mutation: require('@/graphql/colaborators/SetColaboratorPermissions.gql'),
          variables:{
            idColaborator:user.id,
            permissions: this.selectedPermissions
          },
      });

      this.dialog = false
    },

    async setGroup(user, group) {
      user.group = user.group === group ? null : group
      await this.$apollo.mutate({
          mutation: require('@/graphql/colaborators/setColaboratorGroup.gql'),
          variables:{
            idColaborator:user.id,
            group: user.group
          },
      });
    },

    async setSalary(user) {
      if (user) this.selecteduser = user;
      if (!this.registerSalary) {
        this.value = user.salary;
        this.registerSalary = true;
        return
      }
      this.loading = true;
      await this.$apollo.mutate({
          mutation: require('@/graphql/colaborators/setColaboratorSalary.gql'),
          variables:{
            idColaborator:this.selecteduser.id,
            salary: this.value
          },
      });

      this.selecteduser.salary = this.value
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

      for (let i = 0; i < this.parcel; i++) {
        if (parseInt(moment(this.date).format('DD')) > 19) {
          this.months[i] = moment(this.date).add(i, 'months').format('YYYY-MM').toString()
        } else {
          this.months[i] = moment(this.date).add((i - 1), 'months').format('YYYY-MM').toString()
        }
      }

      this.selecteduser.advances.push({
        date: moment().format('YYYY-MM-DD hh:mm:ss'),
        value: this.value,
        valueParcel: this.value / this.parcel,
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
      const nameMutation = user.clinic && user.clinic.id === unit.id ? 'RemoveRelationColaboratorClinic' : 'AddRelationColaboratorClinic'
      user.clinic = user.clinic && user.clinic.id === unit.id ? null : unit

      await this.$apollo.mutate({
          mutation: require(`@/graphql/colaborators/${nameMutation}.gql`),
          variables:{
            idColaborator:user.id,
            idClinic: unit.id
          },
      });
    },

    async deleteUser(user) {
      /* await this.$store.dispatch('deleteUser', {user: user})
      this.$router.go() */
      this.loading = true
      await this.$apollo.mutate({
          mutation: require(`@/graphql/colaborators/DeleteColaborator.gql`),
          variables:{
            idColaborator:user.id,
          },
      });
      this.loading = false
      const indexColaborator = this.collaborators.findIndex((value) => value.id === user.id)
      this.collaborators.splice(indexColaborator,1)
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
