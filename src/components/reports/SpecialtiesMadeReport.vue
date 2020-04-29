 <template>
    <v-container>
        <v-layout row wrap v-if="report">
            <v-flex xs12>
                <v-chip-group
                        row
                        mandatory
                        v-model="reportSelected"
                        active-class="primary--text"
                >
                    <v-chip v-for="report in reportOptions" :key="report">
                        {{ report }}
                    </v-chip>
                </v-chip-group>
            </v-flex>
            <v-flex xs12>
                <v-card class="pa-4 receipt-to-print">
                    <v-layout row wrap>
                        <v-flex xs6 class="text-left">
                            <img :src="report.unit.logo" height="64px">
                        </v-flex>
                        <v-flex xs6 class="text-right">
                            <v-layout column wrap>
                                <span class="my-sub-headline mb-4">Relatório Especialidades</span>
                                <span>{{report.dataInicio | dateFilter}} até {{report.dataFinal | dateFilter}}</span>
                            </v-layout>
                        </v-flex>
                        <v-flex xs12>
                            <v-layout row wrap class="mt-2">
                                <v-flex xs12>
                                    <v-divider></v-divider>
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs4>
                                    Médico
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs2>
                                    Quantidade
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs2>
                                    Custo
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs12>
                                    <v-divider></v-divider>
                                </v-flex>
                            </v-layout>
                        </v-flex>

                        <v-flex xs12>
                            <span class="my-headline">Médicos</span>
                        </v-flex>
                        <v-flex xs12 v-for="(doctor, label) in report.doctors" :key="label" class="my-1">
                            <v-layout row wrap>
                                <v-flex xs12>
                                    <v-divider></v-divider>
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs4>
                                    <span class="font-weight-bold">{{label}}</span>
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs2>
                                    {{doctor.quantityTotal}}
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs2>
                                    {{doctor.payment | moneyFilter}}
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs12 class="mt-4" v-if="reportSelected === 1">
                                    <v-layout row wrap v-for="(specialties, name) in doctor.specialties" :key="name">
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs4>
                                            - {{name}}
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs2>
                                            {{specialties.quantity}}
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs2>
                                            {{specialties.cost | moneyFilter}}
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-divider></v-divider>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs12>
                                    <v-divider></v-divider>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs12>
                            <v-layout row wrap class="mt-2">
                                <v-flex xs12>
                                    <v-divider></v-divider>
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs4>
                                    <span class="font-weight-bold">TOTAL</span>
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>

                                <v-flex xs2>
                                    {{QuantityTotal }}
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs2>
                                    {{CostTotal | moneyFilter}}
                                </v-flex>
                                <v-flex xs1>
                                    <v-divider vertical></v-divider>
                                </v-flex>
                                <v-flex xs12>
                                    <v-divider></v-divider>
                                </v-flex>
                            </v-layout>
                        </v-flex>

                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import moment from "moment"

    export default {
        name: "SpecialtiesMadeReport",
        props: ['report', 'loading'],
        data() {
            return {
                now: moment().format('YYYY-MM-DD HH:mm:ss'),
                total: 0,
                reportOptions: ['Relatorio Especialidades', 'Relatorio Especialidades Detalhado'],
                reportSelected: 0
            }
        },
        computed: {
            QuantityTotal(){
                let quantidade = 0
                for (let doctor in this.report.doctors) {
                    quantidade += this.report.doctors[doctor].quantityTotal
                }
                return quantidade
            },
            CostTotal(){
                let custo = 0
                for (let doctor in this.report.doctors) {
                    custo += this.report.doctors[doctor].payment
                }
                return custo
            }

        }
    }
</script>

<style scoped>
    .border {
        border: 1px solid grey;
    }
</style>
