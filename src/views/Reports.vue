<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12 class="hidden-print-only">
                <p class="my-headline">Relatórios</p>
            </v-flex>
            <v-flex xs12>
                <v-chip-group
                        row
                        mandatory
                        v-model="selectedReport"
                        active-class="primary--text"
                >
                    <v-chip v-for="report in reportOptions" :key="report">
                        {{ report }}
                    </v-chip>
                </v-chip-group>
            </v-flex>
            <v-flex xs6>
                <v-menu
                        ref="menu1"
                        v-model="menu1"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        full-width
                        max-width="290px"
                        min-width="290px"
                >
                    <template v-slot:activator="{ on }">
                        <v-text-field
                                v-model="dateFormatted"
                                label="Data Inicial"
                                prepend-icon="event"
                                @blur="date = parseDate(dateFormatted)"
                                v-on="on"
                        ></v-text-field>
                    </template>
                    <v-date-picker v-model="date" no-title @input="menu1 = false"></v-date-picker>
                </v-menu>
            </v-flex>

            <v-flex xs6>
                <v-menu
                        v-model="menu2"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        full-width
                        max-width="290px"
                        min-width="290px"
                >
                    <template v-slot:activator="{ on }">
                        <v-text-field
                                v-model="dateFormatted2"
                                label="Data Final"
                                prepend-icon="event"
                                readonly
                                v-on="on"
                        ></v-text-field>
                    </template>
                    <v-date-picker v-model="date2" no-title @input="menu2 = false"></v-date-picker>
                </v-menu>
            </v-flex>
            <v-flex xs12 class="mb-3">
                <v-layout row wrap class="align-center">
                    <v-flex>
                        <v-btn @click="getIntakes()" color="blue" v-if="!loading">
                            Pesquisar
                        </v-btn>
                        <v-progress-circular indeterminate class="primary--text" v-else>
                        </v-progress-circular>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex xs12 v-if="selectedReport === 0">
                <general-report :report="formattedReport" :loading="loading" :intakes="intakes"></general-report>
            </v-flex>
            <v-flex xs12 v-if="selectedReport === 1">
                <colaborators-production-report :loading="loading" :intakes="intakes"></colaborators-production-report>
            </v-flex>
            <v-flex xs12 v-if="selectedReport === 2">
                <intakes-report :report="formattedReport" :loading="loading" :intakes="intakes"></intakes-report>
            </v-flex>
            <v-flex class="hidden-screen-only">
                <p>DE {{dateFormatted}} ATÉ {{dateFormatted2}}</p>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import ColaboratorsProductionReport from "@/components/reports/ColaboratorsProductionReport";
    import GeneralReport from "@/components/reports/GeneralReport";
    import IntakesReport from '../components/reports/IntakesReport';

    var moment = require('moment');
    export default {
        components: {
            ColaboratorsProductionReport,
            GeneralReport,
            IntakesReport
        },
        data: vm => ({
            reportOptions: ['Relatório Financeiro Geral', 'Produção do Colaborador','Relatorio de Vendas'],
            selectedReport: 0,
            date: moment().format('YYYY-MM-DD 00:00:00'),
            date2: moment().format('YYYY-MM-DD 23:59:59'),
            dateFormatted: moment().format('DD/MM/YYYY'),
            dateFormatted2: moment().format('DD/MM/YYYY'),
            menu1: false,
            menu2: false,
            verificador: true,
            intakes: undefined,
            formattedReport: undefined,
            loading: false
        }),
        methods: {
            async getIntakes() {
                this.loading = true
                this.intakes = await this.$store.dispatch('getIntakes', {
                    initialDate: moment(this.date).format('YYYY-MM-DD 00:00:00'),
                    finalDate: moment(this.date2).format('YYYY-MM-DD 23:59:59')
                })
                await this.pesquisar()
                this.loading = false
            },
            async pesquisar() {
                this.loading = true
                this.formattedReport = await this.$store.dispatch('searchReports', {dataInicio: this.date, dataFinal: this.date2})
                this.loading = false
            },
            formatDate(date) {
                if (!date) return null;
                const [year, month, day] = date.split('-');
                return `${day}/${month}/${year}`
            },
            parseDate(date) {
                if (!date) return null;
                const [day, month, year] = date.split('/');
                return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
            },
            Imprimir() {
                window.print();
            }
        },
        mounted() {
            this.getIntakes()
        },
        computed: {
            Relatorio() {
                return this.$store.getters.relatorio
            }
        },
        watch: {
            date(val) {
                this.dateFormatted = this.formatDate(this.date)
                // this.getIntakes()
            },
            date2(val) {
                this.dateFormatted2 = this.formatDate(this.date2)
                // this.getIntakes()
            }
        }
    }
</script>

<style>
</style>
