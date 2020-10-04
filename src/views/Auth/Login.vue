<template>
    <v-container fluid fill-height>
        <v-layout row wrap class="align-center justify-center" style="margin-bottom: 30vh">
            <v-flex xs8 sm4 class="text-xs-center">
                <img :src="require('../../assets/pro_saude_logo.png')"
                     width="100px" class="mb-5 mt-5">
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
                                persistent-hint
                                :append-icon="show_password ? 'visibility' : 'visibility_off'"
                                :type="show_password ? 'text' : 'password'"
                                @click:append="show_password = !show_password"
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
                show_password: false,
                credentialError: false,
                password: '',
                passwordError: false,
                loading: false,
                errorMessage: undefined,
                skip:true
            }
        },
        mounted() {
            if (firebase.auth().currentUser) {
                this.$router.push('/')
            }
        },
        methods: {
          handleEnter(e) {
            if (e.key === 'Enter') {
              this.signIn()
            }
          },
            async signIn() {
                
                try {
                    this.loading = true;
                    let user = await firebase.auth().signInWithEmailAndPassword(this.email, this.password);
                    
                    this.skip = false
                    this.$apollo.queries.findColaborator.refresh()
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
        apollo:{
            findColaborator:{
                query: require("@/graphql/authentication/FindUser.gql"),
                variables(){
                    return{
                        email:this.email
                    }
                },
                update(data){
                    this.skip = true
                    console.log(data.User[0])
                    const user = data.User[0].is_colaborator? data.User[0].is_colaborator : data.User[0].is_doctor
                    this.$store.dispatch('getUser', user);
                    this.$router.go()
                },
                skip(){
                    return this.skip
                }
            }
          window.addEventListener('keydown', this.handleEnter)
        },
        beforeDestroy() {
          window.removeEventListener('keydown', this.handleEnter)
        },
    }
</script>
