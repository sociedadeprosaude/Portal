<template>
    <v-container fluid   v-if="animation === true" class="primary fill-height align-center justify-center mt-n2">
            <v-layout ref="loader" class="primary fill-height align-center justify-center">
                <img
                        ref="logo"
                        class="pulse-anim"
                        :src="require('../../../assets/logo.png')"
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
            consultations:[]
        }),

        created() { this.animation = true },
        async mounted() {
            setTimeout(() => (this.animation = false), 3000)
        },
        methods: {
            async deleteConsultation (consultation) {
                await this.$apollo.mutate({
                    mutation: require('@/graphql/consultations/DeleteConsultation.gql'),
                    variables:{
                        idConsultation: consultation.id,
                    },
                })
                const index = this.consultations.findIndex(value => value.id === consultation.id)
                this.consultations.splice(index,1)
                this.dialog = false
            },
            async selectUser(user) {
                this.$store.commit('setSelectedPatient', user);
                this.$store.commit('clearSelectedDependent');
            },
        },
        apollo: {
            loadConsultations: {
                query: require("@/graphql/consultations/LoadCanceledConsultations.gql"),
                update(data) {
                    this.consultations = data.Consultation.filter(consultations => consultations.patient)
                    console.log(this.consultations)
                }
            },
        }
    };
</script>
