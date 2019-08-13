<template>
    <v-container fluid>
        <v-layout wrap row class="align-center justify-center" v-if="!loading">
            <v-flex xs2 class="ma-1" v-if="userPermissions.indexOf('caixa') > -1">
                <v-card @click.native="onSalesSelected()">
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-icon size="72">attach_money</v-icon>
                        </v-flex>
                        <v-flex xs12>
            <span class="text-center headline">
              Caixa
            </span>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
            <v-flex xs2 class="ma-1" v-if="userPermissions.indexOf('caixa') > -1">
                <v-card class="card" @click.native="$router.push('/prontuarios')">
                    <v-icon size="72">enhanced_encryption</v-icon>
                    <v-card-title>
                        Prontuarios
                    </v-card-title>
                </v-card>
            </v-flex>
            <v-flex xs2 class="ma-1">
                <v-card class="card" @click.native="$router.push('/relatorio')">
                    <v-icon size="72">report</v-icon>
                    <v-card-title>
                        Relatórios
                    </v-card-title>
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
                loading: false
            }
        },
        methods: {
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
