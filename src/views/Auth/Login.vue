<template>
    <v-container fluid fill-height>
        <v-layout row wrap class="align-center justify-center" style="margin-bottom: 30vh">
            <v-flex xs12 sm4 class="text-xs-center">
                <img :src="require('../../assets/logo.png')"
                     width="100px" class="mb-5 mt-5">
                <v-card style="min-width: 300px" class="mb-5">
                    <v-card-text>
                        <v-text-field
                            outlined
                                slot="activator"
                                v-model="email"
                                label="Email"
                                persistent-hint
                                :error="credentialError"
                                prepend-icon="email">
                        </v-text-field>
                        <v-text-field
                            outlined
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
                            <v-flex xs6 class="text-left pl-1">
                                <v-btn outlined to="/cadastro">
                                    Cadastre-se
                                </v-btn>
                            </v-flex>
                            <v-spacer/>
                            <v-flex xs6 class="text-right pr-1">
                                <v-btn color="primary" @click.native="signIn">
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
                user_id: undefined,
                show_password: false,
                credentialError: false,
                password: '',
                passwordError: false,
                loading: false,
                errorMessage: undefined,
                skipSignIn:true,
                skip:true
            }
        },
        mounted() {
          window.addEventListener('keydown', this.handleEnter)
          /* if (firebase.auth().currentUser) {
                this.$router.push('/')
            } */
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
                    this.$apollo.queries.signIn.refresh()//await firebase.auth().signInWithEmailAndPassword(this.email, this.password);

                    this.skipSignIn = false
                    //this.$apollo.queries.findColaborator.refresh()
                } catch (e) {
                    /* switch (e.code) {
                        case 'auth/user-not-found':
                            this.errorMessage = 'Usuário não cadastrado';
                            break;
                        case 'auth/wrong-password':
                            this.errorMessage = 'Senha incorreta';
                            break
                    }
                    setTimeout(() => {
                        this.errorMessage = undefined
                    }, 2000) */
                    console.log('Error na autenticação')
                }
                //this.loading = false
            }
        },
        apollo:{
            signIn:{
                query: require("@/graphql/authentication/SignIn.gql"),
                variables(){
                    return{
                        email:this.email,
                        password: this.password
                    }
                },
                update(data){
                    this.skipSignIn = true;
                    this.skip = false;
                    localStorage.setItem('token', data.signIn.token);
                    this.user_id = data.signIn.user_id;
                    this.$apollo.queries.currentColaborator.refresh();
                },
                error({graphQLErrors}){
                   this.loading = false;
                   this.errorMessage = graphQLErrors[0].message
                },
                skip(){
                    return this.skipSignIn;
                }
            },
            currentColaborator:{
                query: require("@/graphql/authentication/currentColaborator.gql"),
                update(data){
                    this.skip = true
                    const user = Object.assign({},data.current_user_colaborator)
                    this.$store.dispatch('getUser', user);
                    this.loading = false;
                    this.$router.push('/');
                },
                error({graphQLErrors}){
                   this.loading = false;
                   this.errorMessage = graphQLErrors[0].message
                },
                skip(){
                    return this.skip
                }
            }
        },
        beforeDestroy() {
          window.removeEventListener('keydown', this.handleEnter)
        },
    }
</script>
