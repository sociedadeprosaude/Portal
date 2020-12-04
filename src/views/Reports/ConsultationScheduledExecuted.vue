<template>
    <v-container>
        <v-card>
            <v-layout row wrap  class="justify-center pt-5">
                <v-flex xs3>
                  <v-text-field rounded solo filled dense color="background"
                                placeholder="Data inicial"
                                v-model="dateStart" v-mask="mask.date" append-outer-icon="event"/>

                </v-flex>
                <v-flex xs3 class="ml-2">
                  <v-text-field rounded solo filled dense color="background" class="mr-4"
                                v-model="dateEnd" v-mask="mask.date" placeholder="Data final"/>
                </v-flex>
                    <v-flex xs7>
                        <ApolloQuery
                                :query="require('@/graphql/products/LoadProducts.gql')"
                                :variables="{ type:'SPECIALTY', schedulable:false}"
                        >
                            <template v-slot="{ result: { data, loading } }">
                                <v-select
                                        class="pa-0 ma-0"
                                        :items="data ? data.Product : []"
                                        v-model="specialty"
                                        item-text="name"
                                        return-object
                                        placeholder="Especialidades"
                                        rounded solo filled dense color="background"
                                        :loading="loading"
                                        append-outer-icon="close"
                                        @click:append-outer="clearSpecialty()"

                                >
                                    <template v-slot:selection="data">
                                        <v-chip
                                                :key="JSON.stringify(data.item)"
                                                :input-value="data.selected"
                                                :disabled="data.disabled"
                                                class="v-chip--select-multi"
                                                @click.stop="data.parent.selectedIndex = data.index"
                                                @input="data.parent.selectItem(data.item)"
                                                text-color="white"
                                                color="primary"
                                        >{{ data.item.name }}
                                        </v-chip>
                                    </template>
                                </v-select>
                            </template>
                        </ApolloQuery>
                    </v-flex>


            </v-layout>

        </v-card>

        <ApolloQuery :query="require('@/graphql/consultations/LoadConsultationScheduled.gql')"
                     :variables="{  date_start:{formatted:formattedDate(dateStart)}, date_end:{formatted:formattedDate(dateEnd)}, specialty: specialty.name}">
            <template slot-scope="{ result: { data } }">
                <ConsultationScheduledExecuted v-if="data"
                                               :scheduled="data.Consultation.length"
                                               :consultationsDone="filterConsultationsDone(data).length"
                                               :timeSchedule="timeConsultation(data.Consultation)"
                                               :timeConsultations="timeConsultation(filterConsultationsDone(data))"
                                               :weekConsultation="weekConsultation(filterConsultationsDone(data))"
                                               :weekSchedule="weekConsultation(data.Consultation)"
                />
                <v-progress-linear v-else-if="!data"
                                   class="mt-5"
                                   color="blue"
                                   indeterminate
                                   rounded
                                   height="10"
                />
            </template>
        </ApolloQuery>



    </v-container>
</template>

<script>
    import ConsultationScheduledExecuted from "@/components/Reports/ConsultationScheduledExecuted";
    import moment from "moment";
    import {mask} from 'vue-the-mask'

    export default {
        // name: "ConsultationScheduledExecuted",
        components: {
            ConsultationScheduledExecuted
        },
        props: ["report", "loading"],
        data() {
            return {
              mask: {
                date: '##/##/####',
              },
                specialty: "",
              dateStart: moment().subtract(1, 'month').format('DD/MM/YYYY'),
              dateEnd: moment().format('DD/MM/YYYY'),
                now: moment().format("YYYY-MM-DD HH:mm:ss"),
                total: 0,
                reportOptions: [
                    "Relatorio Especialidades",
                    "Relatorio Especialidades Detalhado"
                ],
                reportSelected: 0,
                hours: [
                    '00:00',
                    '01:00',
                    '02:00',
                    '03:00',
                    '04:00',
                    '05:00',
                    '06:00',
                    '07:00',
                    '08:00',
                    '09:00',
                    '10:00',
                    '11:00',
                    '12:00',
                    '13:00',
                    '14:00',
                    '15:00',
                    '16:00',
                    '17:00',
                    '18:00',
                    '19:00',
                    '20:00',
                    '21:00',
                    '22:00',
                    '23:00',
                ]
            };
        },
        computed: {

            QuantityTotal() {
                let quantidade = 0;
                for (let doctor in this.report.doctors) {
                    quantidade += this.report.doctors[doctor].quantityTotal;
                }
                return quantidade;
            },
            CostTotal() {
                let custo = 0;
                for (let doctor in this.report.doctors) {
                    custo += this.report.doctors[doctor].payment;
                }
                return custo;
            },
            PercentageTotal() {
                let porcentagem = 0;
                porcentagem =
                    (parseFloat(this.QuantityTotalExecuted) /
                        parseFloat(this.QuantityTotalScheduled)) *
                    100;
                return porcentagem;
            },
            QuantityTotalExecuted() {
                let executed = 0;
                for (let consultation in this.report.consultations) {
                    executed += this.report.consultations[consultation].executed;
                }
                return executed;
            },
            QuantityTotalScheduled() {
                let scheduled = 0;
                for (let consultation in this.report.consultations) {
                    scheduled += this.report.consultations[consultation].scheduled;
                }
                return scheduled;
            }
        },
        methods: {
          formattedDate (date) {
            return moment(date, 'DD/MM/YYYY').format('YYYY-MM-DDTHH:mm')
          },
            timeConsultation(data) {
                const arrData= [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                data.map(e => {
                    if(arrData[parseInt(e.date.formatted.substring(11,13))]){
                        arrData[parseInt(e.date.formatted.substring(11,13))] +=1
                    }
                    else{
                        arrData[parseInt(e.date.formatted.substring(11,13))] =1
                    }
                });
                
                return {
                    labels: this.hours,
                    datasets: [
                        {
                            label: 'consultas',
                            lineTension: 0,
                            fill: false,
                            borderColor: "rgb(75, 192, 192)",
                            data: arrData,
                        }
                    ]
                };
            },

            weekConsultation (data) {
                const arrData= [0,0,0,0,0,0,0];
                data.map(e => {

                    if(arrData[moment(e.date.formatted.substring(0,10)).format('d')]){
                        arrData[moment(e.date.formatted.substring(0,10)).format('d')] +=1
                    }
                    else{
                        arrData[moment(e.date.formatted.substring(0,10)).format('d')] =1
                    }
                });

                return {
                    labels: [
                        'Domingo',
                        'Segunda',
                        'Terça',
                        'Quarta',
                        'Quinta',
                        "Sexta",
                        'Sábado'
                    ],
                    datasets: [
                        {
                            label: 'consultas',
                            lineTension: 0,
                            fill: false,
                            borderColor: "rgb(75, 192, 192)",
                            data: arrData,
                        }
                    ]
                };
            },

            filterConsultationsDone (data) {
                return data.Consultation.filter(e => e.productTransaction !== null && e.productTransaction.with_charge !== null)
            },
            clearSpecialty(){
                this.specialty = ""
            }
        }
    };
</script>

<style scoped>
    .border {
        border: 1px solid grey;
    }
</style>
