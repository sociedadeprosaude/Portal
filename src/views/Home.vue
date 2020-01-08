<template>
    <v-container fluid>
        <v-layout wrap row class="justify-center" v-if="!loading">
            <v-flex xs12 class="text-center">
                <select-patient-card class="hidden-xs-only"></select-patient-card>
            </v-flex>
            <v-flex xs12 v-if="filteredPages.length === 0">
                <v-card>
                    <v-card-title>Você ainda não tem permissões</v-card-title>
                </v-card>
            </v-flex>

            <v-flex class="ma-1"
                    xs12
                    :key="section.title"
                    v-for="section in filteredPages">
                <v-layout row wrap class="align-center justify-center">
                    <v-flex xs12>
                        <span class="my-headline">{{section.title}}</span>
                    </v-flex>
                    <v-flex v-for="page in section.pages"
                            :key="page.title"
                            class="mx-2 my-2">
                        <v-card
                                min-width="200"
                                class="card hidden-xs-only" :to="page.external_url ? '' : page.to"
                                @click="page.external_url ? goToExternalUrl(page.external_url) : ''">
                            <v-layout column row>
                                <v-icon size="72">{{page.icon}}</v-icon>
                                <span class="text-center my-headline">
                        {{page.title}}
                    </span>
                            </v-layout>
                        </v-card>
                        <v-card
                                width="124"
                                class="card hidden-sm-and-up" :to="page.external_url ? '' : page.to"
                                @click="page.external_url ? goToExternalUrl(page.external_url) : ''">
                            <v-layout column row>
                                <v-icon size="24">{{page.icon}}</v-icon>
                                <span class="text-center font-weight-bold">
                        {{page.title}}
                    </span>
                            </v-layout>
                        </v-card>
                    </v-flex>
                    <v-flex xs12 class="my-4">
                        <v-divider></v-divider>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex xs12 class="ma-1 hidden-xs-only">
                <v-layout row wrap class="align-end justify-end">
                    <v-card class="card" width="200px" @click="logout()">
                        <v-layout column row>
                            <v-icon size="72">exit_to_app</v-icon>
                            <span class="text-center my-headline">
                        Sair
                    </span>
                        </v-layout>
                    </v-card>
                </v-layout>
            </v-flex>
            <v-flex xs12 class="ma-1 hidden-sm-and-up">
                <v-layout row wrap class="align-center justify-start">
                    <v-card class="card py-1 px-2" @click="logout()">
                        <v-layout row wrap class="align-center">
                            <span class="text-center font-weight-bold">
                        Sair
                    </span>
                            <v-icon size="24">exit_to_app</v-icon>

                        </v-layout>
                    </v-card>
                </v-layout>
            </v-flex>
            <v-flex xs12 class="text-right">
                <span>1.2.6</span>
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
            // let user = firebase.auth().currentUser;
            // if (!user) {
            //     this.$router.push('/login')
            //     return
            // }
            // this.getUser(user)
        },
        data() {
            return {
                loading: false,
                pages: [
                    {
                        title: 'Operacional',
                        pages: [
                            {
                                title: 'Agenda Médica',
                                permission: 'Agenda Médica',
                                to: '/agenda/agendamento',
                                // external_url: 'https://agenda-medica.firebaseapp.com',
                                icon: 'calendar_today'
                            },
                            {
                                title: 'Caixa',
                                icon: 'monetization_on',
                                permission: 'Caixa',
                                to: '/caixa'
                            },
                            // {
                            //     title: 'Senhas',
                            //     permission: 'Senhas',
                            //     external_url: 'https://prosaudesenhas.firebaseapp.com',
                            //     icon: 'filter_4'
                            // },
                        ]
                    },
                    {
                        title: 'Cadastro e Registros',
                        pages: [
                            {
                                title: 'Médicos',
                                icon: 'group',
                                permission: 'Caixa',
                                to: '/doctors'
                            },
                            {
                                title: 'Clinicas',
                                icon: 'location_city',
                                permission: 'Caixa',
                                to: '/clinics'
                            },
                            {
                                title: 'Exames',
                                icon: 'poll',
                                permission: 'Caixa',
                                to: '/exams'
                            },
                            {
                                title: 'Relatórios',
                                to: '/relatorio',
                                permission: 'Relatórios',
                                icon: 'report'
                            }, {
                                title: 'Consultas',
                                to: '/agenda/CadastroConsultasPlantoes',
                                permission: 'Agenda Médica',
                                icon: 'event',
                            },
                            {
                                title: 'Pacotes',
                                to: '/bundles',
                                permission: 'Caixa',
                                icon: 'queue',
                            },
                            // {
                            //     title: 'Exames',
                            //     to: '/exames',
                            //     permission: 'Exames',
                            //     icon: 'insert_drive_file'
                            // },
                            {
                                title: 'Colaboradores',
                                permission: 'Colaboradores',
                                to: '/labor',
                                icon: 'supervisor_account'
                            },
                            // {
                            //     title: 'Unidades',
                            //     permission: 'Colaboradores',
                            //     to: '/units',
                            //     icon: 'storefront'
                            // }
                        ]
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
            logout() {
                this.$store.dispatch('logOut')
            }
        },
        computed: {
            filteredPages() {
                // if (!this.user.permissions) return []
                return this.pages.filter(a => {
                    if (this.user.group === 'admin') {
                        return true
                    } else if (this.user.group === 'colaborador') {
                        return a === this.pages[0]
                    }
                    return false
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
