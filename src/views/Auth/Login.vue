<template>
  <v-container fluid>
    <v-layout row wrap align-center justify-center>
      <v-flex xs8 sm4 class="text-xs-center">
        <img src="../../assets/logo-pro-saude.png" height="100px" class="mb-5 mt-5">
        <v-card >
          <v-card-text>
            <v-text-field
            slot="activator"
            v-model="credential"
            label="Email ou Nome de Usuario"
            persistent-hint
            :error="credentialError"
            prepend-icon="email"
            ></v-text-field>
          <v-text-field
            slot="activator"
            v-model="password"
            label="Senha"
            type="password"
            persistent-hint
            :error="passwordError"
            prepend-icon="fingerprint"
          ></v-text-field>
          </v-card-text>
          <v-card-actions>

            <v-progress-linear :indeterminate="true" v-if="loading"></v-progress-linear>
            <v-spacer></v-spacer>
            <v-btn flat class="primary_dark--text" @click.native="Login">
              Entrar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 class="mt-4 text-xs-center">
        <v-btn round class="white" to="/exames">
          Exames
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
    export default {
        name: "Login",
      data() {
          return {
            credential: '',
            credentialError: false,
            password: '',
            passwordError: false,
            loading: false
          }
      },
      methods: {
          Login() {
            if (this.credential.length === 0) {
              this.credentialError = true
              return
            }
            if (this.password.length === 0) {
              this.passwordError = true
              return
            }
            let payload = {
              credential: this.credential,
              password: this.password
            }
            this.loading = true
            this.$store.dispatch('login', payload)
              .then(response => {
                this.loading = false
                this.$router.push('/')
              })
              .catch(error => {
                this.loading = false
              })

          }
      }
      // components: {VTextField}
    }
</script>

<style scoped>

</style>
