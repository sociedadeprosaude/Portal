<template>
    <v-container fluid fill-height>
        <v-layout row wrap class="align-center justify-center" style="margin-bottom: 30vh">
            <v-flex xs12 sm4 class="text-xs-center">
                <img :src="require('../../assets/logo.png')"
                     width="100px" class="mb-5 mt-5">
                 <v-alert class="text-left" :value="alert" type="error">
                    {{messageError}}
                </v-alert>
                <v-card v-if="!successSendEmail" style="min-width: 300px" class="mb-5">
                    <v-card-text>
                        <v-form ref="form" lazy-validation>
                            <v-text-field
                                v-model="email"
                                type="email"
                                :rules="rules"
                                hint="E-mail"
                                persistent-hint
                                placeholder="Digite o seu E-mail"
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
                                <v-btn  @click="sendForgotEmail(email)" :loading="loading" outlined >
                                    Redefinir senha
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-card-actions>
                </v-card>

                <v-row v-if="successSendEmail" class="align-center justify-center">
                    <v-col cols="12">
                            <v-alert class="text-left" type="success">
                             <strong>E-mail enviado com sucesso! Agora você pode redefir a sua senha através do e-mail enviado.</strong>
                            </v-alert>
                    </v-col>
                    <v-col cols="12" class="pt-0">
                        <v-btn color="primary" to="/login">
                            Entendi
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
                rules: [v => !!v || "Preencha o campo"],
                loading: false,
                alert: false,
                messageError: undefined,
                successSendEmail:false
            }
        },
        mounted() {
          window.addEventListener('keydown', this.handleEnter);
        },
        methods: {
            handleEnter(e) {
                if (e.key === 'Enter') {
                    this.sendForgotEmail()
                }
            },
            async sendForgotEmail(email) {
                this.loading = true;
                if(this.$refs.form.validate()){
                    try{
                        await this.$apollo.mutate({
                            mutation: require('@/graphql/authentication/forgotPassword.gql'),
                            variables:{
                                email:email
                            },
                        });
                        this.successSendEmail = true;
                    }catch({graphQLErrors}){
                        this.messageError = graphQLErrors[0].message;
                        this.alert = true;
                    }
                }
                this.loading = false
            }
        },
        beforeDestroy() {
          window.removeEventListener('keydown', this.handleEnter)
        },
    }
</script>
