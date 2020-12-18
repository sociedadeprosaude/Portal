<template>
    <v-container fluid fill-height>
        <v-layout row wrap class="align-center justify-center" style="margin-bottom: 30vh">
            <v-flex xs12 sm4 class="text-xs-center">
                <img :src="require('../../assets/logo.png')"
                     width="100px" class="mb-5 mt-5">
                 <v-alert class="text-left" :value="alert" type="error">
                    {{messageError}}
                </v-alert>
                <v-card v-if="!successReset" style="min-width: 300px" class="mb-5">
                    <v-card-text>
                        <v-form ref="form" lazy-validation>
                            <v-text-field
                                v-model="password"
                                type="password"
                                :rules="rules"
                                hint="Senha"
                                persistent-hint
                                required
                                outlined
                                color="text"
                                dense
                                background-color="white_ice"
                            />

                            <v-text-field
                                v-model="confirmPassword"
                                type="password"
                                :rules="[confirmPasswordRules]"
                                hint="Confirmar Senha"
                                persistent-hint
                                required
                                outlined
                                color="text"
                                dense
                                background-color="white_ice"
                            />                            
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-layout row wrap>
                            <v-flex xs12>
                                <v-progress-linear :indeterminate="true" v-if="loading"/>
                            </v-flex>
                            <v-flex xs12 class="text-center">
                                <v-btn :disabled="!token"  @click="resetPassword(token,password)" :loading="loading" outlined >
                                    Resetar senha
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-card-actions>
                </v-card>

                <v-row v-if="successReset" class="align-center justify-center">
                    <v-col cols="12">
                            <v-alert class="text-left" type="success">
                            <strong>Senha redefinida com sucesso ! Agora você poderá entrar na sua conta.</strong>
                            </v-alert>
                    </v-col>
                    <v-col cols="12" class="pt-0">
                        <v-btn color="primary" to="/login">
                                    Entrar
                        </v-btn>
                    </v-col>
                </v-row>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>

    export default {
        name: "Login",
        data() {
            return {
                confirmPassword: undefined,
                password: '',
                rules: [v => !!v || "Preencha o campo"],
                loading: false,
                token:undefined,
                alert: false,
                messageError: undefined,
                successReset:false
            }
        },
        mounted() {
          window.addEventListener('keydown', this.handleEnter);
          this.token = this.$route.query.token;
        },
        computed:{
            confirmPasswordRules() {
                if (this.password && !this.confirmPassword)
                    return "Campo de confirmação de senha precisa ser preenchido!";
                if (
                    this.password &&
                    this.confirmPassword &&
                    this.confirmPassword != this.password
                )
                    return "As senhas precisam ser iguais!";
                return null;
            },
        },
        methods: {
            handleEnter(e) {
                if (e.key === 'Enter') {
                    this.resetPassword()
                }
            },
            async resetPassword(token, password) {
                this.loading = true;
                    if(this.$refs.form.validate()){
                    try{
                        await this.$apollo.mutate({
                            mutation: require('@/graphql/authentication/resetPassword.gql'),
                            variables:{
                                token:token,
                                password:password
                            },
                        });
                        this.successReset = true;
                    }catch({graphQLErrors}){
                        this.messageError = graphQLErrors[0].message;
                        this.alert = true;
                    }
                }
                this.loading = false
            },  
        },
        beforeDestroy() {
          window.removeEventListener('keydown', this.handleEnter)
        },
    }
</script>
