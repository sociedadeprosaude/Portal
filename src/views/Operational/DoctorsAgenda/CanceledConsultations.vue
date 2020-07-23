<template>
    <v-container fluid   v-if="animation === true" class="primary fill-height align-center justify-center mt-n2">
            <v-layout ref="loader" class="primary fill-height align-center justify-center">
                <img
                        ref="logo"
                        class="pulse-anim"
                        :src="require('../../../assets/pro_saude_logo.png')"
                        width="150px"
                        height="150px"
                >
            </v-layout>
    </v-container>
    <v-container v-else-if="animation === false">
        <v-layout  class="align-center justify-center" row wrap>
            <v-card>
                <header-canceled-consultations></header-canceled-consultations>
                <expansion-panel-canceled-consultations @user="selectUser($event)" @indexSelected="indexSelected= $event" @dialog="dialog= $event" :consultations="consultations" ></expansion-panel-canceled-consultations>
                <v-dialog v-model="dialog"  width="700">
                    <dialog-canceled-consultations @registerCall="registerCall($event)"  @delete="deleteConsultation($event)" @dialog="dialog = $event" :indexSelected="indexSelected" ></dialog-canceled-consultations>
                </v-dialog>
            </v-card>
        </v-layout>
    </v-container>
</template>

<script>
    let moment = require('moment/moment');
    import HeaderCanceledConsultations from '../../../components/doctorsAgenda/CanceledConsultations/HeaderCanceledConsultations'
    import ExpansionPanelCanceledConsultations from '../../../components/doctorsAgenda/CanceledConsultations/ExpansionPanelCanceledConsultations'
    import DialogCanceledConsultations from '../../../components/doctorsAgenda/CanceledConsultations/DialogCanceledConsultations'
    export default {
        components:{HeaderCanceledConsultations, ExpansionPanelCanceledConsultations,DialogCanceledConsultations},
        data: () => ({
            dialog: false,
            indexSelected: {},
            statusSelected:'',
            animation: false,
        }),
        computed: {
            consultations () { return this.$store.getters.consultationsCanceled; }
        },
        created() { this.animation = true },
        async mounted() {
            await this.$store.dispatch('getConsultationsCanceled');
            setTimeout(() => (this.animation = false), 3000)
        },
        methods: {
            deleteConsultation (consultation) {
                this.$store.dispatch('removeAppointmentForever',consultation);
                this.dialog = false
            },
            async registerCall(values){
                await this.$store.dispatch('addArrayCallsToConsultation', {
                    calls: values.calls,
                    idConsultation: values.idConsultation,
                })
            },
            async selectUser(user) {
                if (user) {
                    let intakes = await this.$store.dispatch('getUserIntakes', user);
                    if (intakes) {
                        user.intakes = intakes
                    }
                    let budgets = await this.$store.dispatch('getUserBudgets', user);
                    if (budgets) {
                        user.budgets = budgets
                    }
                }
                this.$store.commit('setSelectedPatient', user);
                this.$store.commit('clearSelectedDependent');
            },
        },
    };
</script>