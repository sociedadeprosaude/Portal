<template>
    <v-container fluid>
        <v-layout wrap row class="justify-center" v-if="!loading">
            <v-flex xs12 sm8 class="text-center" v-if="notifications && user.group !== 'doctor' && user.group !== 'clinic'">
                <alert/>
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
                                    <v-icon v-if="(page.title === 'Desconto A Cima' && Warning)">notification_important</v-icon>
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
                        <v-divider/>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex xs12 class="ma-1 hidden-xs-only">
                <v-layout row wrap class="align-end justify-end">
                    <v-card class="card mx-2 my-2" width="200px" @click="profile()">
                        <v-layout column row>
                            <v-icon size="72">account_circle</v-icon>
                            <span class="text-center my-headline">
                        Perfil
                    </span>
                        </v-layout>
                    </v-card>
                    <v-card class="mx-2 my-2 card" width="200px" @click="logout()">
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
                     <v-card class="card mx-2 my-2  py-1 px-2" @click="logout()">
                        <v-layout row wrap class="align-center">
                            <span class="text-center font-weight-bold">
                        Perfil
                    </span>
                            <v-icon size="24">account_circle</v-icon>

                        </v-layout>
                    </v-card>
                    <v-card class="card mx-2 my-2  py-1 px-2" @click="logout()">
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
                <span>2.3</span>
            </v-flex>
        </v-layout>
        <v-layout row wrap v-else class="align-center">
            <v-flex xs12>
                <v-progress-circular
                        size="64"
                        class="white--text"
                        indeterminate>
                </v-progress-circular>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>

    import alert from "../components/alert.vue";

    export default {

        components: {
            alert,
        },

        mounted() {
            this.$store.dispatch('loadNotifications');
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
                                icon: 'calendar_today'
                            },
                            {
                                title: 'Senhas',
                                permission: 'Senhas',
                                to: '/senhas',
                                icon: 'filter_4'
                            },
                            {
                                title: 'Tabela Semanal',
                                permission: 'Agenda Médica',
                                to: '/agenda/TabelaSemanal',
                                icon: 'date_range'
                            },
                        ]
                    },
                    {
                        title: 'Cadastro e Registros',
                        pages: [
                            {
                                title: 'Registros',
                                icon: 'group',
                                permission: 'Caixa',
                                to: '/registros/doctors'
                            },
                            {
                                title: 'Relatórios',
                                to: '/relatorios',
                                permission: 'Relatórios',
                                icon: 'report'
                            },
                            {
                                title: 'Financeiro',
                                to: '/pagamento/financeiro',
                                permission: 'Caixa',
                                icon: 'attach_money',
                            }
                        ]
                    },
                    {
                        title: 'Atendimento Médico',
                        pages: [
                            {
                                title: 'Atendimentos de Consultas e Retornos',
                                to: '/MedicalCare',
                                icon: 'assignment_ind',
                            },
                        ]
                    },
                    {
                        title: 'Pessoal',
                        pages: [
                            {
                                title: 'Colaboradores',
                                permission: 'Colaboradores',
                                to: '/labor',
                                icon: 'supervisor_account'
                            },
                        ]
                    },
                    {
                        title: 'Clinicas Associadas',
                        pages: [
                            {
                                title: 'Check Exames',
                                permission: 'clinic',
                                to: '/DischargeProcedures',
                                icon: 'supervisor_account'
                            },
                            {
                                title: 'Verificação Encaminhamentos A Cobrar',
                                permission: 'clinic',
                                to: '/VerificacaoEncaminhamentos',
                                icon: 'supervisor_account'
                            },
                            {
                                title: 'Histórico de Pagamentos',
                                permission: 'clinic',
                                to: '/HistoricoDePagamentos',
                                icon: 'supervisor_account'
                            },
                        ]
                    },

                ]
            }
        },
        methods: {
            goToExternalUrl(url) {
                window.open(url)
            },
            logout() {
                this.$store.dispatch('logOut')
            },
            profile(){
                this.$router.push('/conta')
            },
        },
        computed: {
            user() {
                return this.$store.getters.user
            },
            userPermissions() {
                let holder = this.$store.getters.user.permissions;
                let vectorOfPaths = [];
                for(let i in holder){
                    vectorOfPaths.push(holder[i].path)
                }
                return vectorOfPaths
            },
            permissions () {
                let holder = this.$store.getters.permissions[0].children;
                let listOfPaths = [];
                for(let i in holder){
                    listOfPaths.push(holder[i].path)
                }
                return listOfPaths
            },
            notifications () {
                return this.$store.getters.notification;
            },

            filteredPages() {
                if(this.user){
                    if(this.userPermissions && this.permissions){
                        for(let rota in this.userPermissions){
                            if(this.permissions.indexOf(this.userPermissions[rota]) !== -1){
                                console.log('tem permissão')
                            } else {
                                console.log('não tem permissão')
                            }
                        }
                    }
                    return this.pages.filter(a => {
                        if (this.user.group === 'admin') {
                            return a === this.pages[0] || a === this.pages[1] || a === this.pages[2] || a === this.pages[3]
                        } else if (this.user.group === 'colaborador') {
                            return a === this.pages[0]
                        } else if (this.user.group === 'gerente') {
                            return a === this.pages[0] || a === this.pages[1]
                        } else if (this.user.group === 'doctor') {
                            return a === this.pages[2]
                        } else if (this.user.group === 'clinic') {
                            return a === this.pages[4]
                        }

                        return false
                    })
                }
                }
        },

    }
</script>

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
