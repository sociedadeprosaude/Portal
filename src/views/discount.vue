<template>
    <v-container>
        <v-layout row wrap >
            <v-flex xs12>
                <span class="my-headline">Colaboradores</span>
            </v-flex>
            <v-flex xs12 class="px-3 my-3">
                <v-expansion-panels inset>
                    <v-expansion-panel
                            v-for="(user,i) in users"
                            :key="i"
                    >
                        <v-expansion-panel-header>
                            <v-flex xs8>
                        <span>
                        {{user.name}}
                            </span>
                            </v-flex>
                            <v-flex xs2>

                            <span>
                                Descontos:
                        </span>
                            </v-flex>
                            <v-flex xs1>

                            <span>
                            {{user.qtd}}
                        </span>
                            </v-flex>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-layout row wrap>

                                <v-flex xs12>
                                 <span class="mr-3">
                            CPF: {{user.cpf}}
                                </span>
                                    <v-flex xs12>
                                        <v-divider/>
                                    </v-flex>
                                </v-flex>

                                <v-flex xs12>
                                    <v-layout row wrap>
                                        <v-flex xs12>
                                            <span class="my-headline text-left">Descontos</span>
                                        </v-flex>
                                        <v-flex xs3 class="my-2" v-for="intake in user.intakes" :key="intake.orcamento">
                                            <v-card class="pa-3">
                                                <v-layout row wrap>
                                                    <v-flex xs12 class="mb-3">
                                                        <span>{{intake.date | dateFilter}}</span>
                                                    </v-flex>
                                                    <v-flex xs12 class="text-right">
                                                        <v-flex xs12>
                                                            <span class="font-weight-bold">{{intake.discount}} %</span>
                                                        </v-flex>
                                                        <v-flex xs12>
                                                            <span class="font-weight-bold"> id :{{intake.orcamento}}</span>
                                                        </v-flex>
                                                    </v-flex>
                                                </v-layout>
                                            </v-card>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs12>
                                    <v-divider/>
                                </v-flex>
                            </v-layout>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>

    export default {
        data () {
            return {

            }
        },
        computed:{
            users(){
                return this.$store.getters.colaboratorsWarning
            }
        },
        mounted() {
            this.$store.dispatch('WarningColaborators')
        }
    }</script>

<style scoped>

</style>