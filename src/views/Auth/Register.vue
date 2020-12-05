<template>
    <v-container fill-height>
        <v-layout row wrap class="align-center justify-center">
            <v-flex xs12 sm5 class="text-center align-center justify-center">
                <v-slide-x-transition>
                    <v-card class="px-5 py-3" v-if="!registered">
                        <v-layout row wrap>
                            <v-flex xs12 class="text-left">
                                <v-alert class="text-center" :value="alert" type="error">
                                    Já existe um colaborador com o mesmo Email!
                                </v-alert>
                            </v-flex>
                            <v-flex xs12 class="text-center align-center justify-center">
                                <span class="my-headline">Cadastro</span>
                            </v-flex>
                            <v-flex xs12 class="transparent text-center align-center justify-center">
                              <span style="color: transparent">.</span>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field outlined v-model="name" label="Nome Completo"/>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field outlined v-model="email" label="Email"/>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field outlined v-model="password" label="Senha" type="password"/>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field
                                        outlined
                                        v-model="confirm_password"
                                        label="Confirmação de senha"
                                        type="password"
                                />
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field outlined v-model="cpf" v-mask="'###.###.###-##'" label="CPF"/>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field outlined v-model="telephone" v-mask="'(##)#####-####'" label="Telefone"/>
                            </v-flex>
                            <v-expand-transition>
                                <v-flex xs12 v-if="loading">
                                    <v-progress-linear color="primary" indeterminate/>
                                </v-flex>
                            </v-expand-transition>
                        </v-layout>
                        <v-card-actions>
                            <v-spacer/>
                            <v-btn color="primary" :disabled="loading" @click="register()">{{'Cadastrar'}}</v-btn>
                        </v-card-actions>
                        <v-flex xs12>
                            <span class="red--text">{{errorMessage}}</span>
                        </v-flex>
                    </v-card>
                    <v-card v-else>
                        <v-card-title class="my-headline">Cadastro realizado com sucesso</v-card-title>
                        <v-card-text class="my-sub-headline">Aguarde a confirmação do seu gerente</v-card-text>
                    </v-card>
                </v-slide-x-transition>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import {mask} from "vue-the-mask";
    import firebase from "firebase";

    export default {
        name: "Register",
        directives: {
            mask
        },
        data() {
            return {
                email: "",
                password: "",
                confirm_password: "",
                telephone: "",
                cpf: "",
                name: "",
                errorMessage: undefined,
                registered: false,
                loading: false,
                alert: false,
                skip:true,
                skipSignIn:true,
                skipCurrent: true
            };
        },
        methods: {
            async register() {
                this.loading = true
                if (!this.email.includes("@") || !this.email.includes(".com")) {
                    this.errorMessage = "Email inválido";
                    this.loading = false
                    return;
                }
                if (this.name.length < 2) {
                    this.errorMessage = "Nome inválido";
                    this.loading = false
                    return;
                }
                if (this.password.length < 6) {
                    this.errorMessage = "Senha deve conter pelo menos 6 caracteres";
                    this.loading = false
                    return;
                }
                if (this.password !== this.confirm_password) {
                    this.errorMessage = "Confirmação de senha não confere";
                    this.loading = false
                    return;
                }

                this.skip = false
                this.$apollo.queries.findUser.refresh()
            },

            async createUser(){
                try{
                    //let resp = await firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
                
                    const newUser = await this.$apollo.mutate({
                        mutation: require('@/graphql/authentication/CreateUser.gql'),
                        variables:{
                            email:this.email,
                            password: this.password
                        },
                    });
                    const userId = newUser.data.CreateUser.id

                    const newColaborator = await this.$apollo.mutate({
                        mutation: require('@/graphql/authentication/CreateColaborator.gql'),
                        variables:{
                                email: this.email,
                                name: this.name,
                                cpf: this.cpf.replace(/\./g, "").replace("-", ""),
                                telephones: [this.telephone],
                            
                        },
                    });
                    const colaboratorId = newColaborator.data.CreateColaborator.id

                    await this.setRelationUserColaborator(userId, colaboratorId)

                    this.$apollo.queries.signIn.refresh()
                    this.skipSignIn = false
                }catch(error){
                    this.errorMessage = error;
                    this.loading = false
                }
                
            },
            async setRelationUserColaborator(idUser,idColaborator){
                await this.$apollo.mutate({
                    mutation: require('@/graphql/authentication/AddRelationUserColaborator.gql'),
                    variables:{
                        idUser:idUser,
                        idColaborator:idColaborator
                    },
                });
            }
        },
        apollo:{
            findUser:{
                query: require("@/graphql/authentication/VerifyUserExistsbyEmail.gql"),
                variables(){
                    return{
                        email:this.email
                    }
                },
                update(data){
                    this.skip = true
                    const user = data.User ? data.User[0] : undefined
                    
                    if(!user){
                        this.createUser();
                    }else{
                        this.loading = false
                        this.alert = true
                    }
                },
                skip(){
                    return this.skip
                }
            },
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
                    this.skipCurrent = false;
                    localStorage.setItem('token', data.signIn.token);
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
                    this.$store.dispatch('setCurrentUser', user);
                    this.loading = false;
                    this.$router.push('/');
                },
                error({graphQLErrors}){
                   this.loading = false;
                   this.errorMessage = graphQLErrors[0].message
                },
                skip(){
                    return this.skipCurrent;
                }
            }
        }
    };
</script>

