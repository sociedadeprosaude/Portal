<template>
  <v-container fluid>
    <v-layout row wrap align-center justify-center>
      <v-flex xs8 sm4>
        <img src="../../assets/logo-pro-saude.png" height="100px" class="mb-5 mt-5">
        <v-card>
          <v-card-title>
            <h2>Minha Conta</h2>
          </v-card-title>
          <v-card-text>
            <v-flex xs12 mb-2>
              <span>Nome: {{user.name}}</span>
            </v-flex>
            <v-flex xs12 mb-2>
              <span>Nome de Usuário: {{user.username}}</span>
            </v-flex>
            <v-flex xs12 mb-2>
              <span>Email: {{user.email}}</span>
            </v-flex>
          </v-card-text>

          <v-card-actions>
            <v-tooltip bottom>
              <v-btn slot="activator" flat class="primary_dark--text" @click.native="changePassword">
                Alterar Senha
              </v-btn>
              <span>Ainda não disponível</span>
            </v-tooltip>
            <v-btn flat class="primary_dark--text" @click.native="dialog = true">
              Adicionar Usuário
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>

    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Adicionar Usuário</v-card-title>
        <v-card-text>

          <v-text-field
            slot="activator"
            v-model="name"
            persistent-hint
            label="Nome"
          ></v-text-field>

          <v-text-field
            slot="activator"
            v-model="username"
            persistent-hint
            label="Nome de Usuário"
          ></v-text-field>

          <v-text-field
            slot="activator"
            v-model="email"
            persistent-hint
            label="Email"
          ></v-text-field>

          <v-text-field
            slot="activator"
            v-model="password"
            persistent-hint
            type="password"
            label="Senha"
          ></v-text-field>

          <v-layout row wrap>
            <v-flex xs12>
              <span>Permissões</span>
            </v-flex>
            <v-btn
              @click="selectedPermissions.indexOf(permission) > -1 ? selectedPermissions.splice(selectedPermissions.indexOf(permission), 1) :
selectedPermissions.push(permission)"
              :class="[selectedPermissions.indexOf(permission) > -1 ? 'primary' : 'white']"
              v-for="permission in permissions"
              :key="permission"
            >
              {{permission}}
            </v-btn>
          </v-layout>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary_dark darken-1" flat @click.native="dialog = false">Cancelar</v-btn>
          <v-btn color="primary_dark darken-1" flat @click.native="addUser">Adicionar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
  export default {
    name: "Register",
    data() {
      return {
        dialog: false,
        name: '',
        username: '',
        email: '',
        password: '',
        permissions: [
          'caixa',
          'prontuario'
        ],
        selectedPermissions: []
      }
    },
    computed: {
      user() {
        return this.$store.getters.user
      }
    },
    methods: {
      changePassword() {

      },
      addUser() {
        let payload = {
          name: this.name,
          email: this.email,
          username: this.username,
          password: this.password,
          permissions: this.selectedPermissions
        }
        this.$store.dispatch('addUser', payload)
          .then(response => {
            this.name = ''
            this.username = ''
            this.email = ''
            this.password = ''
            this.selectedPermissions = []
            this.dialog = false
          })
      }
    }
  }
</script>

<style scoped>

</style>
