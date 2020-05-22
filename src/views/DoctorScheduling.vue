<template>
    <v-container fluid class="ma-0 pa-0">
        <v-layout row wrap>
            <v-flex sm3 lg3 class="primary">
                <DataToSearchConsultation @GetConsultations="schedules= $event" :moreSchedules="datas"/>
            </v-flex>
            <v-flex sm6 lg6>
                <SchedulesConsultations :Consultations="schedules" @refreshDate="datas = $event"/>
            </v-flex>
            <v-flex sm3 lg3 class="primary">
                <DataCashierConsultation/>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import DataToSearchConsultation from "../components/doctorsAgenda/DataToSearchConsultation"
    import SchedulesConsultations from "../components/doctorsAgenda/SchedulesConsultations"
    import DataCashierConsultation from "../components/doctorsAgenda/DataCashierConsultation"

    export default {
        components: {DataToSearchConsultation, SchedulesConsultations, DataCashierConsultation},
        data: () => ({
            schedules: {},
            datas: {},
        })
    }
</script>


