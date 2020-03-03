<template>
    <v-container fluid>
        <v-layout row wrap class="justify-center ">
            <v-flex xs8>
                <v-alert
                        class="text-left"
                        color="warning"
                        border="left"
                        elevation="2"
                        colored-border
                        icon="error"
                        v-if="consultation">
                    <v-layout row wrap>
                        <span><strong>Existem pacientes com consultas canceladas à serem avisados!</strong></span>
                        <v-spacer/>
                        <v-btn text
                               small
                               fab
                               class="pb-3"
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
                console.log('route', route);
                this.$router.push(route)
            },
        }
    }
</script>