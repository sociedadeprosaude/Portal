<template>
    <v-container fluid class="ma-0 mt-n4 pa-0 fill-height hidden-print-only">
        <v-layout row wrap class="justify-center ">
            <v-flex xs12 class="hidden-md-and-up " >
                <v-layout row wrap class="justify-space-between primary">
                    <v-btn v-for="item in items" :key="item.title" class="primary" text large @click="chooseView(item.view)">
                        {{item.title}}
                    </v-btn>
                </v-layout>
            </v-flex>
            <v-flex sm3 class="primary hidden-sm-and-down">
                <DataToSearchConsultation @loading="loadingConsultations = $event" @GetConsultations="schedules= $event" :daysToListen="daysToListen"/>
            </v-flex>

            <v-flex sm6 class="white hidden-sm-and-down">
                <SchedulesConsultations :loadingConsultations="loadingConsultations" :Consultations="schedules" @refreshDate="daysToListen = $event" v-if="this.viewSeleted === 'schedules'"/>
            </v-flex>
            <v-flex sm3 class="primary hidden-sm-and-down">
                <DataCashierConsultation/>
            </v-flex>

            <v-flex xs12 class="primary hidden-md-and-up fill-height align-start">
                <DataToSearchConsultation @GetConsultations="schedules= $event" :daysToListen="daysToListen" v-if="this.viewSeleted === 'data'" />
                <SchedulesConsultations :loadingConsultations="loadingConsultations" :Consultations="schedules" @refreshDate="daysToListen = $event" v-if="this.viewSeleted === 'schedules'"/>
                <DataCashierConsultation v-if="this.viewSeleted === 'cashier'"/>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import DataToSearchConsultation from "../../../components/doctorsAgenda/DataToSearchConsultation"
    import SchedulesConsultations from "../../../components/doctorsAgenda/SchedulesConsultations"
    import DataCashierConsultation from "../../../components/doctorsAgenda/DataCashierConsultation"

    export default {
        components: {DataToSearchConsultation, SchedulesConsultations, DataCashierConsultation},
        data: () => ({
            schedules: {},
            daysToListen: null,
            viewSeleted: 'schedules',
            items: [
                {title: 'Dados', view: 'data'},
                {title: 'Consultas', view: 'schedules'},
                {title: 'Caixa', view: 'cashier'}
            ],
            query: {},
            loadingConsultations: true
        }),
        mounted() {
            this.query= this.$route.params.q
        },

        methods: {
            chooseView(view) {
                this.viewSeleted = view;
            }
        }

    }
</script>


