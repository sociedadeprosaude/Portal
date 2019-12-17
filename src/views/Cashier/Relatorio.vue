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
            <v-flex xs12 v-if="selectedReport === 1">
                <colaborators-production-report :intakes="intakes"></colaborators-production-report>
            </v-flex>
            <v-flex xs12 v-else>
                <v-layout row wrap class="align-center">
                    <v-flex>
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

                    <v-flex>
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
                    <v-flex>
                        <v-btn @click="Pesquisar()" color="blue">
                            Pesquisar
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex class="hidden-screen-only">
                <p>DE {{dateFormatted}} ATÉ {{dateFormatted2}}</p>
            </v-flex>
            <v-flex xs12><p></p></v-flex>
            <v-card>
                <v-simple-table dense v-if="this.verificador !== true">
                    <template>
                        <thead>
                        <tr>
                            <th class="text-left"></th>
                            <th>Name</th>
                            <th class="text-left"></th>
                            <th class="text-left">Quantidade</th>
                            <th class="text-left"></th>
                            <th class="text-left">Preço</th>
                            <th class="text-left"></th>
                            <th class="text-left">Custo</th>
                            <th class="text-left"></th>
                            <th class="text-left">Saldo</th>
                            <th class="text-left"></th>
                            <th class="text-left">%</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in Relatorio[0].exames" :key="item.nome">
                            <td>
                                <v-divider vertical></v-divider>
                            </td>
                            <td>{{ item.nome }}</td>
                            <td>
                                <v-divider vertical></v-divider>
                            </td>
                            <td>{{ item.quantidade }}</td>
                            <td>
                                <v-divider vertical></v-divider>
                            </td>
                            <td>{{ parseFloat(item.valor).toFixed(2) }}</td>
                            <td>
                                <v-divider vertical></v-divider>
                            </td>
                            <td>{{ (parseFloat(item.custo)).toFixed(2) }}</td>
                            <td>
                                <v-divider vertical></v-divider>
                            </td>
                            <td>{{parseFloat(item.valor - item.custo).toFixed(2)}}</td>
                            <td>
                                <v-divider vertical></v-divider>
                            </td>
                            <td>{{(((item.valor- item.custo)*100)/item.valor).toFixed(2)}}</td>
                        </tr>
                        <tr v-for="item in Relatorio[0].consultas" :key="item.nome">
                            <td>
                                <v-divider vertical></v-divider>
                            </td>
                            <td>{{ item.nome }}</td>
                            <td>
                                <v-divider vertical></v-divider>
                            </td>
                            <td>{{ item.quantidade }}</td>
                            <td>
                                <v-divider vertical></v-divider>
                            </td>
                            <td>{{ parseFloat(item.valor).toFixed(2) }}</td>
                            <td>
                                <v-divider vertical></v-divider>
                            </td>
                            <td>{{ parseFloat(item.custo).toFixed(2) }}</td>
                            <td>
                                <v-divider vertical></v-divider>
                            </td>
                            <td>{{parseFloat(item.valor - item.custo).toFixed(2)}}</td>
                            <td>
                                <v-divider vertical></v-divider>
                            </td>
                            <td>{{(((item.valor- item.custo)*100)/item.valor).toFixed(2)}}</td>
                        </tr>
                        <tr>
                            <td>
                                <v-divider vertical></v-divider>
                            </td>
                            <td>TOTAIS GERAIS</td>
                            <td>
                                <v-divider vertical></v-divider>
                            </td>
                            <td></td>
                            <td>
                                <v-divider vertical></v-divider>
                            </td>
                            <td>{{parseFloat(Relatorio[0].totalBruto).toFixed(2)}}</td>
                            <td>
                                <v-divider vertical></v-divider>
                            </td>
                            <td>{{parseFloat(Relatorio[0].totalCusto).toFixed(2)}}</td>
                            <td>
                                <v-divider vertical></v-divider>
                            </td>
                            <td>{{parseFloat(Relatorio[0].totalBruto - Relatorio[0].totalCusto).toFixed(2)}}</td>
                            <td>
                                <v-divider vertical></v-divider>
                            </td>
                            <td> %</td>
                        </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-card>
            <v-flex xs12><p></p></v-flex>
            <v-flex xs12><p></p></v-flex>
            <v-flex xs12><p></p></v-flex>
            <v-card>
                <v-simple-table dense v-if="this.verificador !== true">
                    <template>
                        <thead>
                        <tr>
                            <th class="text-left"></th>
                            <th>Data</th>
                            <th class="text-left"></th>
                            <th class="text-left">Descrição</th>
                            <th class="text-left"></th>
                            <th class="text-left">Valor</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in Relatorio[0].saidas" :key="item.nome">
                            <td>
                                <v-divider vertical></v-divider>
                            </td>
                            <td>{{ item.data }}</td>
                            <td>
                                <v-divider vertical></v-divider>
                            </td>
                            <td>{{ item.categoria }}</td>
                            <td>
                                <v-divider vertical></v-divider>
                            </td>
                            <td>{{ parseFloat(item.valor).toFixed(2) }}</td>
                        </tr>
                        <tr>
                            <td> {{Relatorio[0].saidas.length}} Registros emitidos</td>
                            <td>
                                <v-divider vertical></v-divider>
                            </td>
                            <td>{{ parseFloat(Relatorio[0].totalSaidas).toFixed(2) }}</td>
                        </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-card>
            <v-flex xs12><p></p></v-flex>
            <v-flex xs12><p></p></v-flex>
            <v-flex xs12><p></p></v-flex>
            <v-card>
                <v-simple-table dense v-if="this.verificador !== true">
                    <template>
                        <tbody>
                        <tr>
                            <td>
                                <v-divider vertical></v-divider>
                            </td>
                            <td>
                                <v-icon>attach_money</v-icon>
                                SALDO FINAL (=)
                            </td>
                            <td>
                                <v-divider vertical></v-divider>
                            </td>
                            <td>{{ parseFloat((Relatorio[0].totalBruto - Relatorio[0].totalCusto) -
                                Relatorio[0].totalSaidas).toFixed(2) }}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <v-divider vertical></v-divider>
                            </td>
                            <td>
                                <v-icon>subtitles</v-icon>
                                TOTAL DEBITO (=)
                            </td>
                            <td>
                                <v-divider vertical></v-divider>
                            </td>
                            <td>{{ Relatorio[0].debito }}</td>
                        </tr>
                        <tr>
                            <td>
                                <v-divider vertical></v-divider>
                            </td>
                            <td>
                                <v-icon>indeterminate_check_box
                                </v-icon>
                                TAXA DEBITO (=)
                            </td>
                            <td>
                                <v-divider vertical></v-divider>
                            </td>
                            <td>{{ Relatorio[0].taxaDebito }}</td>
                        </tr>
                        <tr>
                            <td>
                                <v-divider vertical></v-divider>
                            </td>
                            <td>
                                <v-icon>subtitles</v-icon>
                                TOTAL CREDITO (=)
                            </td>
                            <td>
                                <v-divider vertical></v-divider>
                            </td>
                            <td>{{ Relatorio[0].credito }}</td>
                        </tr>
                        <tr>
                            <td>
                                <v-divider vertical></v-divider>
                            </td>
                            <td>
                                <v-icon>indeterminate_check_box
                                </v-icon>
                                TAXA CREDITO (=)
                            </td>
                            <td>
                                <v-divider vertical></v-divider>
                            </td>
                            <td>{{ Relatorio[0].taxaCredito }}</td>
                        </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-card>
            <v-flex xs12><p></p></v-flex>
            <v-flex class="hidden-print-only" v-if="this.verificador !== true">
                <v-btn @click="Imprimir()">Imprimir</v-btn>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import ColaboratorsProductionReport from "../../components/reports/ColaboratorsProductionReport";
    var moment = require('moment');
    export default {
        components: {
          ColaboratorsProductionReport
        },
        data: vm => ({
            reportOptions: ['Relatório Financeiro Geral', 'Produção do Associado'],
            selectedReport: 'Relatório Financeiro Geral',
            date: moment().format('YYYY-MM-DD 00:00:00'),
            date2: moment().format('YYYY-MM-DD 23:59:59'),
            dateFormatted: moment().format('DD/MM/YYYY'),
            dateFormatted2: moment().format('DD/MM/YYYY'),
            menu1: false,
            menu2: false,
            verificador: true,
            intakes: undefined
        }),
        methods: {
            async getIntakes() {
              this.intakes = await this.$store.dispatch('getIntakes', {
                  initialDate: this.date,
                  finalDate: this.date2
              })
            },
            Pesquisar() {
                console.log('data1: ', this.date, ', data2: ', this.date2);
                this.$store.dispatch('searchReports', {dataInicio: this.date, dataFinal: this.date2}).then(() => {
                    this.verificador = false;
                    console.log('rodei')
                });
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
                this.getIntakes()
            },
            date2(val) {
                this.dateFormatted2 = this.formatDate(this.date2)
                this.getIntakes()
            }
        }
    }
</script>

<style>
</style>
