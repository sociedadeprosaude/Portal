<template>
    <v-container fluid>
        <v-layout  wrap row class="justify-center">
            <v-flex xs12 sm8 class="text-center" v-for="item in notifications" v-bind:key="item.link">
                <v-alert
                        class="text-left"
                        color="warning"
                        border="left"
                        elevation="2"
                        colored-border
                        :icon="item.icon"
                        :to="item.link"
                        @click.native="goRoute(item.link)"
               >
                    <v-layout row wrap >
                        <span><strong>{{item.info}}</strong></span>
                        <v-spacer/>
                        <v-btn text
                               small
                               fab
                               class="pb-3 hidden-xs-only"
                               :to="item.link"
                        >
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
        mounted() {
            this.$store.dispatch('loadNotifications');
        },
        computed: {
            users() {
                return this.$store.getters.colaboratorsWarning
            },
            consultation () {
                return this.$store.getters.consultationsCanceled;
            },
            outtakes () {
                return this.$store.getters.alertOuttakes;
            },
            notifications () {
                return this.$store.getters.notification;
            },
            contestvalue(){
                return this.$store.getters.contestValue;
            }
        },
        watch: {
            async users(){
                let userValid= false;
                for( let user in this.users){
                    if(user){
                        userValid= true;
                        break
                    }
                }
                if (userValid) {
                    let data = {
                        name: 'DiscountColaborator',
                        info: 'Existem ações incomuns quanto ao padrão de descontos!',
                        link: '/discount',
                        icon: 'notification_important',
                    };
                    await this.$store.dispatch('addNotifications', data);
                    await this.$store.dispatch('loadNotifications');
                } else {
                    await this.$store.dispatch('deleteNotification', 'DiscountColaborator');
                    await this.$store.dispatch('loadNotifications');
                }
            },
            consultation() {
                if (this.consultation.length !== 0) {
                    let data = {
                        name: 'ConsultationCanceled',
                        info: 'Existem pacientes com consultas canceladas à serem avisados!',
                        link: '/agenda/ConsultasCanceladas',
                        icon: 'error',
                    };
                    this.$store.dispatch('addNotifications', data);
                } else {
                    this.$store.dispatch('deleteNotification', 'ConsultationCanceled');
                }
            },
            outtakes () {
                if (this.outtakes.length !== 0) {
                    let data = {
                        name: 'outtakes',
                        info: 'Algumas contas vencem hoje. Pague-as agora!',
                        link: '/bills',
                        icon: 'monetization_on',
                    };
                    this.$store.dispatch('addNotifications', data);
                } else {
                    this.$store.dispatch('deleteNotification', 'outtakes');
                }
            },
            contestvalue() {
                if (this.contestvalue.length !== 0) {
                    let data = {
                        name: 'contestValue',
                        info: 'Algumas Clinicas Associadas acreditam que tem exames com preços errados',
                        link: '/ContestValueAlert',
                        icon: 'assignment_late',
                    };
                    this.$store.dispatch('addNotifications', data);
                } else {
                    this.$store.dispatch('deleteNotification', 'contestValue');
                }
            }
        },
        methods:{ goRoute(route) { this.$router.push(route) }, }
    }

</script>