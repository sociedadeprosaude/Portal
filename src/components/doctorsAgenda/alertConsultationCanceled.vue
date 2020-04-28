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
                        icon="error"
                        v-if="consultation"
                        @click.native="goRoute('/agenda/ConsultasCanceladas')">
                    <v-layout row wrap>
                        <span><strong>Existem pacientes com consultas canceladas à serem avisados!</strong></span>
                        <v-spacer/>
                        <v-btn text
                               small
                               fab
                               class="pb-3 hidden-xs-only"
                               @click.native="goRoute('/agenda/ConsultasCanceladas')">
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

        data: () => ({

        }),

        computed: {
            consultation () {
                return this.$store.getters.consultationsCanceled;
            },
        },

        methods:{
            goRoute(route) {
                this.$router.push(route)
            },
        }
    }
</script>