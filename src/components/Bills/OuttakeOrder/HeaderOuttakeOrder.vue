<template>
    <v-row class="align-center justify-center">
        <v-col cols="12" xs="12" class="primary mt-n5">
            <v-card class="elevation-0 white--text mt-md-2 primary" style="border-radius: 0">
                <v-card-title class="font-weight-bold align-lg-center justify-center" v-if="data.Charge[0]">
                    {{ data.Charge[0].balance | moneyFilter }}
                </v-card-title>
                <v-card-subtitle style="font-size: small" class="white--text font-italic"
                                 v-if="data.Charge[0]">
                    Saldo
                </v-card-subtitle>

                <v-layout row wrap class="justify-center pt-5">
                    <v-col>
                        <v-menu v-model="dateMenuStart">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                        v-model="formattedSelectedStartDate"
                                        hint="Data inicial"
                                        persistent-hint
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                        outlined
                                        dense
                                        color="primary"
                                />
                            </template>
                            <v-date-picker v-model="selectedStartDate" locale="pt-br"/>
                        </v-menu>
                    </v-col>
                    <v-icon class="primary--text pb-5" large>event</v-icon>
                    <v-col>
                        <v-menu v-model="dateMenuFinal">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                        v-model="formattedSelectedFinalDate"
                                        hint="Data final"
                                        persistent-hint
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                        outlined
                                        dense
                                        color="primary"

                                />
                            </template>
                            <v-date-picker v-model="selectedFinalDate" locale="pt-br"/>
                        </v-menu>
                    </v-col>
                </v-layout>

            </v-card>
        </v-col>
    </v-row>
</template>
<script>
    export default {
        name: `HeaderOuttakeOrder`,
        props: ['data', 'dateStart', 'dateEnd', 'selectedStartDate','selectedFinalDate', 'formattedSelectedStartDate',
        'formattedSelectedFinalDate'],
        data: vm => ({
            date: new Date().toISOString().substr(0, 10),
            dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
            dateMenuStart: false,
            dateMenuFinal: false,
        }),

        computed: {
            computedDateFormatted () {
                return this.formatDate(this.date)
            },
        },

        watch: {
            date (val) {
                this.dateFormatted = this.formatDate(this.date)
            },
        },

        methods: {
            formatDate (date) {
                if (!date) return null

                const [year, month, day] = date.split('-')
                return `${day}/${month}/${year}`
            },
            parseDate (date) {
                if (!date) return null

                const [month, day, year] = date.split('/')
                return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
            },
        },
    }
</script>