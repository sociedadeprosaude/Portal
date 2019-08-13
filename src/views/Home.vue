<template>
    <v-container fluid>
        <v-layout wrap row class="align-center justify-center" v-if="!loading">
            <v-flex xs2 class="ma-1"
                    :key="page.title"
                    v-for="page in pages">
                <v-card class="card" :to="page.external_url ? '' : page.to" @click="page.external_url ? goToExternalUrl(page.external_url) : ''">
                    <v-layout column row>
                        <v-icon size="72">{{page.icon}}</v-icon>
                        <span class="text-center my-headline">
                        {{page.title}}
                    </span>
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
        <v-layout row wrap v-else class="align-center">
            <v-flex xs12>
                <v-progress-circular
                        class="black--text"
                        indeterminate
                ></v-progress-circular>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {

        data() {
            return {
                loading: false,
                pages: [
                    {
                        title: 'Caixa',
                        icon: 'attach_money',
                        to: '/caixa'
                    },
                    {
                        title: 'Prontuarios',
                        to: '/prontuario',
                        icon: 'enhanced_encryption'
                    },
                    {
                        title: 'Relatórios',
                        to: '/relatorio',
                        icon: 'report'
                    },
                    {
                        title: 'Exames',
                        to: '/exames',
                        icon: 'insert_drive_file'
                    },
                    {
                        title: 'Agenda Médica',
                        to: '/exames',
                        external_url: 'https://agenda-medica.firebaseapp.com',
                        icon: 'calendar_today'
                    },
                    {
                        title: 'Senhas',
                        to: '/exames',
                        external_url: 'https://prosaudesenhas.firebaseapp.com',
                        icon: 'filter_4'
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
            }
        },
        computed: {
            userPermissions() {
                return [
                    'caixa',
                    'prontuario'
                ]
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
