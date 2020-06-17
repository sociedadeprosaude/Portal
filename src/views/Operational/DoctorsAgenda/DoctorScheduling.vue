<template>
    <v-container fluid class="ma-0 pa-0">
        <v-layout row wrap>
            <v-flex sm3 lg3 class="primary">
                <DataToSearchConsultation @GetConsultations="schedules= $event" :query="query" :daysToListen="daysToListen"/>
            </v-flex>
            <v-flex sm6 lg6 class="white">
                <SchedulesConsultations :Consultations="schedules" @refreshDate="daysToListen = $event"/>
            </v-flex>
            <v-flex sm3 lg3 class="primary">
                <DataCashierConsultation/>
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
            query: {}
        }),
        mounted() {
            this.query= this.$route.params.q
            console.log('query PAI: ', this.query)
        }

    }
</script>


