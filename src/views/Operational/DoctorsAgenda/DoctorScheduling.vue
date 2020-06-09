<template>
    <v-container fluid class="ma-0 pa-0">
        <v-layout row wrap>
            <v-flex sm3 class="primary hidden-md-and-down">
                <DataToSearchConsultation @GetConsultations="schedules= $event" :daysToListen="daysToListen"/>
            </v-flex>

            <v-flex sm6 class="hidden-md-and-down white">
                <SchedulesConsultations :Consultations="schedules" @refreshDate="daysToListen = $event"/>
            </v-flex>
            <v-flex sm3 class="primary hidden-md-and-down">
                <DataCashierConsultation/>
            </v-flex>
            <v-flex xs12 class="hidden-md-and-up" >
                <v-layout row wrap class="justify-space-between primary">
                    <v-btn v-for="item in items" :key="item.title" class="primary" text large @click="chooseView(item.view)">
                        {{item.title}}
                    </v-btn>
                </v-layout>
            </v-flex>
            <v-flex xs12 class="hidden-md-and-up">
                <DataToSearchConsultation @GetConsultations="schedules= $event" :daysToListen="daysToListen" v-if="this.viewSeleted === 'data'"/>
                <SchedulesConsultations class="white" :Consultations="schedules" @refreshDate="daysToListen = $event" v-if="this.viewSeleted === 'schedules'"/>
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
            viewSeleted: 'data',
            items: [
                {title: 'Dados', view: 'data'},
                {title: 'Consultas', view: 'schedules'},
                {title: 'Caixa', view: 'cashier'}
            ]
        }),

        methods: {
            chooseView(view) {
                this.viewSeleted = view;
            }
        }

    }
</script>


