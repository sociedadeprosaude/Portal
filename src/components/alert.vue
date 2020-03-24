<template>
    <v-container fluid>
        <v-layout row wrap class="justify-center ">
            <v-flex xs12>
                <v-alert
                        class="text-left"
                        color="warning"
                        border="left"
                        elevation="2"
                        colored-border
                        icon="notifications_active"
                        @click.native="goRoute('/notifications')">
                    <v-layout row wrap>
                        <span><strong>Há notificações para serem verificadas!</strong></span>
                        <v-spacer/>
                        <v-btn text
                               small
                               fab
                               class="pb-3 hidden-xs-only"
                               @click.native="goRoute('/notifications')">
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

        name: "alert",

        data: () => ({

        }),


        methods:{
            goRoute(route) {
                this.$router.push(route)
            },
        }
    }
</script>