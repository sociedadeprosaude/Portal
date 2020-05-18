<template>
    <v-container fluid class="pa-0 ma-0">
        <v-layout column wrap class="mt-3">
            <CashierConsultation/>
        </v-layout>
    </v-container>
</template>

<script>
    import CashierConsultation from '../doctorsAgenda/CashierConsultation'

    export default {
        name: "DataCashierConsultation",
        components: {CashierConsultation}
    }

</script>