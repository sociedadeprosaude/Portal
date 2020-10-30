<template>
    <v-container>
        <v-row cols="12">
            <v-chip-group
                    row
                    mandatory
                    v-bind:value="optionSelected"
                    @change="(event)=>$emit('change-optionSelected',event)"
                    active-class="primary--text"
            >
                <v-chip v-for="option in options" :key="option">{{ option }}</v-chip>
            </v-chip-group>
        </v-row>
        <v-card id="card-to-print">
            {{this.optionSelected}}
            <v-card-title class="text-end" v-if="optionSelected !== 0 ">
<!--                <v-text-field-->
<!--                        v-bind:value="search"-->
<!--                        @input="(event)=>$emit('change-search',event)"-->
<!--                        append-icon="mdi-magnify"-->
<!--                        label="Procurar"-->
<!--                        single-line-->
<!--                        hide-details-->
<!--                />-->
                <v-spacer/>
                <v-flex xs3>
                    <v-text-field outlined
                                  dense
                                  v-model="dateStart"
                                  :rules="rulesDate"
                                  v-mask="mask.date"
                                  prepend-icon="date_range"
                                  placeholder="Data inicial"
                                  class="mx-1"
                    />
                </v-flex>
                <v-flex xs3>
                    <v-text-field outlined
                                  class="mx-1"
                                  dense
                                  v-model="dateEnd"
                                  :rules="rulesDate"
                                  v-mask="mask.date"
                                  placeholder="Data final"/>
                </v-flex>

<!--                <span class="float-right">{{date }} 00:00:00 até {{date2}} 23:59:59</span>-->
            </v-card-title>

            <ApolloQuery
                    :query="require('@/graphql/reports/ReportNewPatients.gql')"
                    :variables="{ start_date: dateStart, end_date: dateEnd}"
            >
                <template slot-scope="{ result: { data,  loading} }">
                    <v-progress-linear v-if="loading" color="primary" indeterminate/>
                    <v-data-table v-else-if="data"
                            :headers="headers"
                            :search="search"
                            :items="data.Patient"
                            item-key="cpf"
                            no-data-text="Sem novos associados no intervalo escolhido"
                            :footer-props="{
                      itemsPerPageText:'usuários por página',
                      pageText:'{0}-{1} de {2}'
                        }"
                    />
                    <v-card class="mt-4">
                        <v-container>
                            <v-row>
                                <v-col>
                                    <span class="my-headline">{{data.Patient.length}}</span>
                                    <br/>Número de novos pacientes
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card>

                </template>
            </ApolloQuery>
        </v-card>


    </v-container>
</template>

<script>
    import {mask} from 'vue-the-mask'
    import moment from "moment";

    export default {
        name: "BestSellingExamsReport",
        directives: {
            mask,
        },
        data: () => ({
            mask: {
                date: '##/##/####',

            },
            dateStart: undefined,
            dateEnd: undefined,
            rulesDate: [
                value => {
                    const data = moment(value, "DD/MM/YYYY", true);
                    this.dateStart = moment(this.value, "DD/MM/YYYY").format("YYYY-MM-DD");
                    return data.isValid() || 'Data inválida'
                },
            ],
        }),

        watch: {
            dataStart (date) {
                return moment(date, "DD/MM/YYYY").format("YYYY-MM-DD")
            }
        },

        mounted() {
            this.dateStart = moment().format('YYYY-MM-DD');
            this.dateEnd = moment().add(1, 'days').format('YYYY-MM-DD');

        },

        props: [
            "date",
            "date2",
            "todayNewUsers",
            "search",
            "now",
            "total",
            "options",
            "optionSelected",
            "headers",
            "actualList",
            "newUsers",
            "numNewUsers"
        ]
    };
</script>

<style scoped>
    .subTable {
        border-radius: 0px;
        border: 1px solid black;
    }
</style>