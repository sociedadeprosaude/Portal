<template>
    <v-container fluid>
        <v-layout  wrap row class="justify-center">
            <v-flex xs12 sm8 class="text-center" v-for="item in notifications">
                <v-alert
                        class="text-left"
                        color="warning"
                        border="left"
                        elevation="2"
                        colored-border
                        :icon="item.icon"
                        :to="item.link">
                    <v-layout row wrap>
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
    //import alertConsultationCanceled from "../components/doctorsAgenda/alertConsultationCanceled.vue";
   // import alertDiscountColaborator from "../components/cashier/alertDiscountColaborator";


    import moment from "moment";

    export default {

        data () {
            return {

            }
        },

        components: {
            //alertConsultationCanceled,
            //alertDiscountColaborator,
        },

        mounted() {
            this.$store.dispatch('WarningColaborators');
            this.$store.dispatch('getConsultationsCanceled');
            this.$store.dispatch('getOuttakes');
            let data = {
                date: moment().format("YYYY-MM-DD").toString(),
                outtakes: this.$store.getters.outtakes,
            };
            this.$store.dispatch('dueDateToday', data);
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
        },

        watch: {
            users(){
                if (this.users) {
                    let data = {
                        name: 'DiscountColaborator',
                        info: 'Existem ações incomuns quanto ao padrão de descontos!',
                        link: '/discount',
                        icon: 'notification_important',
                    };
                    this.$store.dispatch('addNotifications', data);
                } else {
                    this.$store.dispatch('deleteNotification', 'DiscountColaborator');
                }
            },

            consultation() {
                if (this.consultation) {
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
                if (this.outtakes) {
                    let data = {
                        name: 'outtakes',
                        info: 'Algumas contas vencem hoje. Pague-as agora!',
                        link: '/bills',
                        icon: 'monetization_on'
                    };
                    this.$store.dispatch('addNotifications', data);
                } else {
                    this.$store.dispatch('deleteNotification', 'outtakes');
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