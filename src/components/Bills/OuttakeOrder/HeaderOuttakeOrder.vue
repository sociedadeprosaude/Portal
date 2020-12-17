<template>
    <v-row class="align-center justify-center">
        <v-col cols="12" xs="12" class="primary mt-n5">
            <v-card class="elevation-0 white--text mt-md-2 primary" style="border-radius: 0">
                <v-card-title class="font-weight-bold align-lg-center justify-center" v-if="data.Charge[0]">
                    {{ data.Charge[0].balance | moneyFilter }}
                </v-card-title>
                <v-card-subtitle style="font-size: small" class="white--text font-italic" v-if="data.Charge[0]">
                    Saldo
                </v-card-subtitle>

                <v-layout row wrap class="justify-center pt-5">
                    <v-flex xs3>
                        <v-menu
                                ref="menu1"
                                v-model="menu1"
                                :close-on-content-click="false"
                                transition="scale-transition"
                                offset-y
                                max-width="290px"
                                min-width="290px"
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                        v-model="dateStart"
                                        label="Date"
                                        prepend-icon="mdi-calendar"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                />
                            </template>
                            <v-date-picker
                                    v-model="date"
                                    no-title
                                    @input="menu1 = false"
                            />
                        </v-menu>
                        <v-text-field rounded solo filled dense color="background"
                                      placeholder="Data inicial"
                                      background-color="white"
                                      v-model="dateStart" append-outer-icon="event"/>

                    </v-flex>
                    <v-flex xs3 class="ml-2">
                        <v-text-field rounded solo filled dense color="background" class="mr-4"
                                      background-color="white"
                                      v-model="dateEnd" placeholder="Data final"/>
                    </v-flex>
                </v-layout>

            </v-card>
        </v-col>
    </v-row>
</template>
<script>
    export default {
        name: `HeaderOuttakeOrder`,
        props: ['data', 'dateStart', 'dateEnd'],
        data: vm => ({
            date: new Date().toISOString().substr(0, 10),
            dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
            menu1: false,
            menu2: false,
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