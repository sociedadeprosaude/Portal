<template>
    <v-container fluid v-if="scheduled">
        <v-row>
            <v-col cols="12" sm="6" md="6" class="justify-center">
                <MiniStatistic icon="mdi-counter" :title="scheduled" sub-title="Quantidade de consultas agendadas" color="blue" />
                <v-card elevation="0">
                    <v-row>
                        <v-col>
                            <line-chart
                                    :chart-data="timeSchedule"
                            />
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="6" class="justify-center">
                <MiniStatistic icon="mdi-counter" :title="consultationsDone" sub-title="Quantidade de consultas realizadas" color="blue" />
                <v-card elevation="0">
                    <v-row>
                        <v-col>
                            <line-chart :chart-data="timeConsultations"/>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>

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
            "timeConsultations",
            "timeSchedule"
        ],

    };
</script>
