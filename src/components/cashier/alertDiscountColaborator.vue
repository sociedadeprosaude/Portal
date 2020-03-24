<template>
    <v-container fluid>
        <v-layout row wrap class="justify-center">
            <v-flex xs12>
                <v-alert
                        class="text-left"
                        color="warning"
                        border="left"
                        elevation="2"
                        colored-border
                        icon="notification_important"
                        v-if="users"
                        @click.native="goRoute('/discount')">
                    <v-layout row wrap>
                        <span><strong>Existem ações incomuns quanto ao padrão de descontos!</strong></span>
                        <v-spacer/>
                        <v-btn text
                               small
                               fab
                               class="pb-3 hidden-xs-only"
                               @click.native="goRoute('/discount')">
                            <v-icon>open_in_new</v-icon>
                        </v-btn>
                    </v-layout>
                </v-alert>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        name: "alertDiscountColaborator",

        computed:{
            users() {
                return this.$store.getters.colaboratorsWarning
            }
        },

        mounted () {
            this.$store.dispatch('WarningColaborators')
        },

        watch: {
            users(){
                if (this.users) {
                    let data = {
                        name: 'DiscountColaborator',
                        info: 'Existem ações incomuns quanto ao padrão de descontos!',
                        link: '/discount'
                    };
                    this.$store.dispatch('addNotifications', data);
                }
            }

        },

        methods:{
            goRoute(route) {
                this.$router.push(route)
            },
        }

    }
</script>