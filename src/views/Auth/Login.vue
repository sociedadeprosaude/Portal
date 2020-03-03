<template>
    <v-container fluid fill-height>
        <v-layout row wrap align-center justify-center style="margin-bottom: 30vh">
            <v-flex xs8 sm4 class="text-xs-center">
                <img src="https://firebasestorage.googleapis.com/v0/b/prosaude-36f66.appspot.com/o/assets%2Flogo.svg?alt=media&token=280c2f44-d4e0-4213-b480-30a995c5a254"
                     width="300px" class="mb-5 mt-5">
                <v-card style="min-width: 300px" class="mb-5">
                    <v-card-text>
                        <v-text-field
                                slot="activator"
                                v-model="email"
                                label="Email"
                                persistent-hint
                                :error="credentialError"
                                prepend-icon="email">
                        </v-text-field>
                        <v-text-field
                                slot="activator"
                                v-model="password"
                                label="Senha"
                                type="password"
                                persistent-hint
                                :error="passwordError"
                                prepend-icon="fingerprint">
                        </v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-layout row wrap>
                          <v-flex xs12>
                            <v-progress-linear :indeterminate="true" v-if="loading"/>
                          </v-flex>
                          <v-flex xs6>
                            <v-btn text class="primary_dark--text" to="/cadastro">
                              Cadastre-se
                            </v-btn>
                          </v-flex>
                            <v-spacer/>
                          <v-flex xs6 class="text-right pr-3">
                            <v-btn text class="primary_dark--text" @click.native="signIn">
                                Entrar
                            </v-btn>
                          </v-flex>
                        </v-layout>
                    </v-card-actions>
                </v-card>
                <v-fade-transition mode="out-in">
                    <v-card v-show="errorMessage" style="min-width: 300px">
                        <v-layout row wrap class="align-center">
                            <v-flex class="my-sub-headline text-center">
                                {{errorMessage}}
                            </v-flex>
                        </v-layout>
                    </v-card>
                </v-fade-transition>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import firebase from 'firebase'

    export default {
        name: "Login",
        data() {
            return {
                email: '',
                credentialError: false,
                password: '',
                passwordError: false,
                loading: false,
                errorMessage: undefined
            }
        },
        methods: {
            async signIn() {
                try {
                    this.loading = true;
                    let user = await firebase.auth().signInWithEmailAndPassword(this.email, this.password);
                    await this.$store.dispatch('getUser', user);
                    await this.$router.go()
                } catch (e) {
                    switch (e.code) {
                        case 'auth/user-not-found':
                            this.errorMessage = 'Usuário não cadastrado';
                            break;
                        case 'auth/wrong-password':
                            this.errorMessage = 'Senha incorreta';
                            break
                    }
                    setTimeout(() => {
                        this.errorMessage = undefined
                    }, 2000)
                }
                this.loading = false
            }
        },
        mounted() {
            if (firebase.auth().currentUser) {
                this.$router.push('/')
            }
        }
        // components: {VTextField}
    }
</script>

<style scoped>

</style>
