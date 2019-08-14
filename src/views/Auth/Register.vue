<template>
    <v-container fill-height>
        <v-layout row wrap class="align-center justify-center">
            <v-flex xs6 class="text-center align-center justify-center">
                <v-slide-x-transition>
                    <v-card class="px-5 py-3" v-if="!registered">
                        <v-layout row wrap>
                            <v-flex xs12 class="text-left">
                                <span class="my-headline">Cadastro</span>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field
                                        v-model="name"
                                        label="Nome Completo"
                                >
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field
                                        v-model="email"
                                        label="Email"
                                >
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field
                                        v-model="password"
                                        label="Senha"
                                        type="password"
                                >
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field
                                        v-model="confirm_password"
                                        label="Confirmação de senha"
                                        type="password"
                                >
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field
                                        v-model="telephone"
                                        v-mask="'(##)#####-####'"
                                        label="Telefone"
                                >
                                </v-text-field>
                            </v-flex>
                            <v-expand-transition>
                                <v-flex xs12 v-if="loading">
                                    <v-progress-linear color="primary" indeterminate></v-progress-linear>
                                </v-flex>
                            </v-expand-transition>
                        </v-layout>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                    :disabled="loading"
                                    @click="register()" class="primary_dark--text" text>
                                {{'Cadastrar'}}
                            </v-btn>
                        </v-card-actions>
                        <v-flex xs12>
                    <span class="red--text">
                        {{errorMessage}}
                    </span>
                        </v-flex>
                    </v-card>
                    <v-card v-else>
                        <v-card-title class="my-headline">
                            Cadastro realizado com sucesso
                        </v-card-title>
                        <v-card-text class="my-sub-headline">
                            Aguarde a confirmação do seu gerente
                        </v-card-text>
                    </v-card>
                </v-slide-x-transition>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import {mask} from 'vue-the-mask'
    import firebase from 'firebase'

    export default {
        name: "Register",
        directives: {
            mask
        },
        data() {
            return {
                email: '',
                password: '',
                confirm_password: '',
                telephone: '',
                name: '',
                errorMessage: undefined,
                registered: false,
                loading: false
            }
        },
        methods: {
            async register() {
                if (!this.email.includes('@') || !this.email.includes('.com')) {
                    this.errorMessage = 'Email inválido'
                    return
                }
                if (this.name.length < 2) {
                    this.errorMessage = 'Nome inválido'
                    return
                }
                if (this.password.length < 6) {
                    this.errorMessage = 'Senha deve conter pelo menos 6 caracteres'
                    return
                }
                if (this.password !== this.confirm_password) {
                    this.errorMessage = 'Confirmação de senha não confere'
                    return
                }
                this.loading = true
                try {
                    let resp = await firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
                    await this.$store.dispatch('registerUser', {
                        email: resp.user.email,
                        name: this.name,
                        uid: resp.user.uid,
                        telephone: this.telephone
                    })
                    this.registered = true
                } catch (e) {
                    this.errorMessage = e.code
                }
                this.loading = false
            }
        }
    }
</script>

<style scoped>

</style>
