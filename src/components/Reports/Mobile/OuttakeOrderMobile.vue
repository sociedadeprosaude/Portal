<template>
    <v-container class="ma-0 pa-0 align-start justify-center" fluid>
        <ApolloQuery :query="require('@/graphql/transaction/LoadBillsToPay.gql')"
                     :variables="{ date_start: formattedDate(dateStart), date_end: formattedDate(dateEnd), type: 'bill'}"
        >
            <template v-slot="{result: {data, loading}, query}">
                <HeaderOuttakeOrder :data="data" :dateStart="dateStart" :dateEnd="dateEnd" v-if="data"/>
                <v-layout row wrap class="justify-center fill-height mt-4" v-if="loading">
                    <v-progress-circular indeterminate color="primary" large :size="200"/>
                </v-layout>
                <v-container fluid class="ma-0 " v-if="data">
                    <BillsOuttakeOrder :data="data"/>
                </v-container>
            </template>
        </ApolloQuery>
    </v-container>
</template>

<script>
    import moment from "moment";
    import HeaderOuttakeOrder from "../../Bills/OuttakeOrder/HeaderOuttakeOrder"
    import BillsOuttakeOrder from "../../Bills/OuttakeOrder/BillsOuttakeOrder"

    export default {

        components: {
            HeaderOuttakeOrder,
            BillsOuttakeOrder
        },


        data() {
            return {
                dateStart: new Date().toISOString().substr(0, 10),
                dateEnd: moment().format('DD/MM/YYYY'),
            };
        },

        methods: {

            formattedDate(date) {
                return moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD')
            },

        }
    };

</script>
