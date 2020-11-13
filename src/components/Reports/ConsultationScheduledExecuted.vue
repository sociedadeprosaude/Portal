<template>
    <v-container fluid v-if="scheduled">
        <v-row>
            <v-col cols="12" sm="6" md="3">
                <MiniStatistic icon="mdi-counter" :title="scheduled" sub-title="Quantidade de consultas agendadas" color="blue" />
            </v-col>
            <v-col cols="12" sm="6" md="3">
                <MiniStatistic icon="mdi-counter" :title="consultationsDone" sub-title="Quantidade de consultas realizadas" color="blue" />
            </v-col>
        </v-row>
<!--        <v-card elevation="0">-->
<!--            <v-row>-->
<!--                <v-col>-->
<!--                    <line-chart-->
<!--                            :chart-data="this.$vuetify.breakpoint.xs?faturamentoDatasetWeekly:faturamentoDatasetMonthly"-->
<!--                            :options="options"-->
<!--                    />-->
<!--                    <div v-if="this.$vuetify.breakpoint.xs">-->
<!--                        <v-icon @click="week -= week == 0 ? 0:1">mdi-minus</v-icon>-->
<!--                        semana {{week+1}}-->
<!--                        <v-icon @click="week += week == 3 ? 0:1">mdi-plus</v-icon>-->
<!--                    </div>-->
<!--                </v-col>-->
<!--            </v-row>-->
<!--        </v-card>-->
    </v-container>
</template>

<script>
    import LineChart from "@/components/Charts/LineChart";
    import BarChart from "@/components/Charts/BarChart";
    import PieChart from "@/components/Charts/PieChart";
    import MiniStatistic from "@/components/MiniStatistic";
    import moment from 'moment'
    export default {
        components: {
            MiniStatistic,
            LineChart,
            PieChart,
            BarChart
        },
        props: [
            "scheduled",
            "consultationsDone",
            "timeConsultations"
        ],
        methods:{
            date(date){
                return moment(date).format('DD/MM/YYYY')
            }
        }
    };
</script>
