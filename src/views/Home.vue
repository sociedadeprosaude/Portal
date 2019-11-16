<template>
    <v-container fluid>
        <v-layout wrap row class="justify-center" v-if="!loading">
            <v-flex xs12>
                <select-patient-card></select-patient-card>
            </v-flex>
            <v-flex xs12 v-if="filteredPages.length === 0">
                <v-card>
                    <v-card-title>Você ainda não tem permissões</v-card-title>
                </v-card>
            </v-flex>
            <v-flex class="ma-1"
                    :key="page.title"
                    v-for="page in filteredPages">
                <v-card class="card" min-width="200" :to="page.external_url ? '' : page.to"
                        @click="page.external_url ? goToExternalUrl(page.external_url) : ''">
                    <v-layout column row>
                        <v-icon size="72">{{page.icon}}</v-icon>
                        <span class="text-center my-headline">
                        {{page.title}}
                    </span>
                    </v-layout>
                </v-card>
            </v-flex>
            <v-flex xs2 class="ma-1">
                <v-card class="card" to="/login">
                    <v-layout column row>
                        <v-icon size="72">exit_to_app</v-icon>
                        <span class="text-center my-headline">
                        Sair
                    </span>
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
        <v-layout row wrap v-else class="align-center">
            <v-flex xs12>
                <v-progress-circular
                        size="64"
                        class="white--text"
                        indeterminate
                ></v-progress-circular>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import firebase from 'firebase'
    import SelectPatientCard from "../components/SelectPatientCard";

    export default {

        components: {
            SelectPatientCard
        },

        mounted() {
            //   let perm = [
            //       'Caixa',
            //       'Prontuarios',
            //       'Relatórios',
            //       'Exames',
            //       'Agenda Médica',
            //       'Senhas',
            //       'Colaboradores'
            //   ]
            // firebase.database().ref('permissions/') .set(perm)
            let user = firebase.auth().currentUser
            if (!user) {
                this.$router.push('login')
                return
            }
            this.getUser(user)
        },
        data() {
            return {
                loading: true,
                pages: [
                    {
                        title: 'Médicos',
                        icon: 'attach_money',
                        permission: 'Caixa',
                        to: '/doctors'
                    },
                    {
                        title: 'Clinicas',
                        icon: 'attach_money',
                        permission: 'Caixa',
                        to: '/clinics'
                    },
                    {
                        title: 'Exames',
                        icon: 'attach_money',
                        permission: 'Caixa',
                        to: '/exams'
                    },
                    {
                        title: 'Caixa',
                        icon: 'attach_money',
                        permission: 'Caixa',
                        to: '/caixa'
                    },
                    {
                        title: 'Relatórios',
                        to: '/relatorio',
                        permission: 'Relatórios',
                        icon: 'report'
                    },
                    // {
                    //     title: 'Exames',
                    //     to: '/exames',
                    //     permission: 'Exames',
                    //     icon: 'insert_drive_file'
                    // },
                    {
                        title: 'Agenda Médica',
                        permission: 'Agenda Médica',
                        to: '/agenda/agendamento',
                        // external_url: 'https://agenda-medica.firebaseapp.com',
                        icon: 'calendar_today'
                    },
                    {
                        title: 'Senhas',
                        permission: 'Senhas',
                        external_url: 'https://prosaudesenhas.firebaseapp.com',
                        icon: 'filter_4'
                    },
                    {
                        title: 'Colaboradores',
                        permission: 'Colaboradores',
                        to: '/labor',
                        icon: 'supervisor_account'
                    }
                ]
            }
        },
        methods: {
            goToExternalUrl(url) {
                window.open(url)
            },
            onSalesSelected() {
                this.$router.push('/caixa')
            },
            async getUser(user) {
                await this.$store.dispatch('getUser', user)
                this.loading = false
            }
        },
        computed: {
            filteredPages() {
                if (!this.user.permissions) return []
                return this.pages.filter(a => {
                    return this.user.permissions.indexOf(a.permission) > -1
                })
            },
            user() {
                return this.$store.getters.user
            }
        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h1, h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
