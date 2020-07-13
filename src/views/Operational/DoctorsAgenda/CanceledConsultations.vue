<template>
    <v-container>
        <v-layout v-if="animation === true"  class="align-center justify-center" row wrap>
            <div class="text-center">
                <v-progress-circular
                        :size="350"
                        :width="12"
                        color="primary"
                        indeterminate>
                    <span class="headline">CARREGANGO...</span>
                </v-progress-circular>
            </div>
        </v-layout>

        <v-layout v-else-if="animation === false"  class="align-center justify-center" row wrap>
            <v-card>
                <header-canceled-consultations></header-canceled-consultations>
                <expansion-panel-canceled-consultations @indexSelected="indexSelected= $event" @dialog="dialog= $event" :consultations="consultations" ></expansion-panel-canceled-consultations>
                <v-dialog v-model="dialog"  width="700">
                    <dialog-canceled-consultations @dialog="dialog = $event" :indexSelected="indexSelected" ></dialog-canceled-consultations>
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
        }),
        computed: {
            consultations () {
                return this.$store.getters.consultationsCanceled;
            }
        },
        created() {
            this.animation = true
        },
        async mounted() {
            await this.$store.dispatch('getConsultationsCanceled');
            setTimeout(() => (this.animation = false), 3000)
        },
        methods: {
            deleteConsultation () {
                this.$store.dispatch('removeAppointmentForever',{... this.indexSelected});
                this.dialog = false
            },
            async registerCall(){
                let val = {
                    idCall: this.idCall,
                    descriptionCall: this.descriptionCall,
                    dateHourCall: moment().locale('pt-BR').format('DD/MM/YYYY HH:mm:ss'),
                    dayOfTheWeekCall: moment().format('dddd'),
                };
                if (this.indexSelected.calls === undefined){
                    this.calls.push(val);
                    await this.$store.dispatch('addArrayCallsToConsultation', {
                        calls: this.calls,
                        idConsultation: this.indexSelected.idConsultation,
                    });
                    this.calls = []
                } else {
                    this.indexSelected.calls.push(val);
                    await this.$store.dispatch('addArrayCallsToConsultation', {
                        calls: this.indexSelected.calls,
                        idConsultation: this.indexSelected.idConsultation,
                    })
                }
                this.resetData();
            },
            resetData () {
                this.call = undefined;
                this.idCall = undefined;
                this.descriptionCall = undefined;
                this.dialog = false
            }
        },
    };
</script>