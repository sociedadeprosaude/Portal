<template>
    <v-content>
        <v-container fluid>
            <v-layout row wrap class="align-center justify-center">
                <v-flex xs12>
                    <v-card>
                        <v-card-title>
                            Tabela Semanal dos Médicos - Especialidades - Unidades:
                            <v-divider vertical class="mx-4" inset>
                            </v-divider>
                            <v-chip label dark color="primary">
                                Médico - Especialidade - Unidade
                            </v-chip>
                            <v-spacer/>
                            <v-text-field v-model="search" append-icon="search" label="Search" single-line
                                          hide-details/>
                        </v-card-title>
                        <v-data-table
                                hide-default-header
                                hide-default-footer
                                :headers="headers"
                                :items="doctorsMapping"
                                :search="search"
                                :items-per-page="-1"
                                item-key="hour"
                                class="elevation-1"
                        >
                            <template v-slot:header="{}">
                                <thead>
                                <tr>
                                    <th class="text-center primary white--text">Hora</th>
                                    <th class="text-center primary white--text">Segunda</th>
                                    <th class="text-center primary white--text">Terça</th>
                                    <th class="text-center primary white--text">Quarta</th>
                                    <th class="text-center primary white--text">Quinta</th>
                                    <th class="text-center primary white--text">Sexta</th>
                                    <th class="text-center primary white--text">Sabado</th>
                                </tr>
                                </thead>
                            </template>
                            <template v-slot:item.hour="{ item }">
                                <v-avatar tile color="primary">
                                    <span style="color: white">{{item.hour}}</span>
                                </v-avatar>
                            </template>
                            <template v-slot:item.monday="{ item }">
                                <strong v-for="(index,i) in item.monday" :key="i">
                                    <br/>
                                    <v-tooltip bottom v-if="index.cancelations_schedules" color="info">
                                        <template v-slot:activator="{ on }">
                                            <v-card
                                                    v-on="on"
                                                    class="white--text pa-1 my-n2"
                                                    color="grey"
                                            >
                                                {{index.doctor.name}} - {{index.specialty.name}} - {{index.clinic.name}}
                                            </v-card>
                                        </template>
                                        <span>
                                            <strong>Período de cancelamento: {{index.cancelations_schedules[0].start_date | dateFilter}} a {{index.cancelations_schedules[0].final_date | dateFilter}}</strong>
                                        </span>
                                    </v-tooltip>
                                    <v-card
                                            v-else
                                            class="white--text pa-1 my-n2"
                                            :color="i === '0' ? 'blue' : i === '1' ? 'green' : i === '2' ? 'red' : i === '3' ? 'purple' : i === '4' ? 'orange' : 'pink'"
                                    >
                                        {{index.doctor.name}} - {{index.specialty.name}} - {{index.clinic.name}}
                                    </v-card>
                                </strong>
                                <br/>
                            </template>
                            <template v-slot:item.tuesday="{ item }">
                                <strong v-for="(index,i) in item.tuesday" :key="i">
                                    <br/>
                                    <v-tooltip bottom v-if="index.cancelations_schedules" color="info">
                                        <template v-slot:activator="{ on }">
                                            <v-card
                                                    v-on="on"
                                                    class="white--text pa-1 my-n2"
                                                    color="grey"
                                            >
                                                {{index.doctor.name}} - {{index.specialty.name}} - {{index.clinic.name}}
                                            </v-card>
                                        </template>
                                        <span>
                                            <strong>Período de cancelamento: {{index.cancelations_schedules[0].start_date | dateFilter}} a {{index.cancelations_schedules[0].final_date | dateFilter}}</strong>
                                        </span>
                                    </v-tooltip>
                                    <v-card
                                            v-else
                                            class="white--text pa-1 my-n2"
                                            :color="i === '0' ? 'blue' : i === '1' ? 'green' : i === '2' ? 'red' : i === '3' ? 'purple' : i === '4' ? 'orange' : 'pink'"
                                    >
                                        {{index.doctor.name}} - {{index.specialty.name}} - {{index.clinic.name}}
                                    </v-card>
                                </strong>
                                <br/>
                            </template>
                            <template v-slot:item.wednesday="{ item }">
                                <strong v-for="(index,i) in item.wednesday" :key="i">
                                    <br/>
                                    <v-tooltip bottom v-if="index.cancelations_schedules" color="info">
                                        <template v-slot:activator="{ on }">
                                            <v-card
                                                    v-on="on"
                                                    class="white--text pa-1 my-n2"
                                                    color="grey"
                                            >
                                                {{index.doctor.name}} - {{index.specialty.name}} - {{index.clinic.name}}
                                            </v-card>
                                        </template>
                                        <span>
                                            <strong>Período de cancelamento: {{index.cancelations_schedules[0].start_date | dateFilter}} a {{index.cancelations_schedules[0].final_date | dateFilter}}</strong>
                                        </span>
                                    </v-tooltip>
                                    <v-card
                                            v-else
                                            class="white--text pa-1 my-n2"
                                            :color="i === '0' ? 'blue' : i === '1' ? 'green' : i === '2' ? 'red' : i === '3' ? 'purple' : i === '4' ? 'orange' : 'pink'"
                                    >
                                        {{index.doctor.name}} - {{index.specialty.name}} - {{index.clinic.name}}
                                    </v-card>
                                </strong>
                                <br/>
                            </template>
                            <template v-slot:item.thursday="{ item }">
                                <strong v-for="(index,i) in item.thursday" :key="i">
                                    <br/>
                                    <v-tooltip bottom v-if="index.cancelations_schedules" color="info">
                                        <template v-slot:activator="{ on }">
                                            <v-card
                                                    v-on="on"
                                                    class="white--text pa-1 my-n2"
                                                    color="grey"
                                            >
                                                {{index.doctor.name}} - {{index.specialty.name}} - {{index.clinic.name}}
                                            </v-card>
                                        </template>
                                        <span>
                                            <strong>Período de cancelamento: {{index.cancelations_schedules[0].start_date | dateFilter}} a {{index.cancelations_schedules[0].final_date | dateFilter}}</strong>
                                        </span>
                                    </v-tooltip>
                                    <v-card
                                            v-else
                                            class="white--text pa-1 my-n2"
                                            :color="i === '0' ? 'blue' : i === '1' ? 'green' : i === '2' ? 'red' : i === '3' ? 'purple' : i === '4' ? 'orange' : 'pink'"
                                    >
                                        {{index.doctor.name}} - {{index.specialty.name}} - {{index.clinic.name}}
                                    </v-card>
                                </strong>
                                <br/>
                            </template>
                            <template v-slot:item.friday="{ item }">
                                <strong v-for="(index,i) in item.friday" :key="i">
                                    <br/>
                                    <v-tooltip bottom v-if="index.cancelations_schedules" color="info">
                                        <template v-slot:activator="{ on }">
                                            <v-card
                                                    v-on="on"
                                                    class="white--text pa-1 my-n2"
                                                    color="grey"
                                            >
                                                {{index.doctor.name}} - {{index.specialty.name}} - {{index.clinic.name}}
                                            </v-card>
                                        </template>
                                        <span>
                                            <strong>Período de cancelamento: {{index.cancelations_schedules[0].start_date | dateFilter}} a {{index.cancelations_schedules[0].final_date | dateFilter}}</strong>
                                        </span>
                                    </v-tooltip>
                                    <v-card
                                            v-else
                                            class="white--text pa-1 my-n2"
                                            :color="i === '0' ? 'blue' : i === '1' ? 'green' : i === '2' ? 'red' : i === '3' ? 'purple' : i === '4' ? 'orange' : 'pink'"
                                    >
                                        {{index.doctor.name}} - {{index.specialty.name}} - {{index.clinic.name}}
                                    </v-card>
                                </strong>
                                <br/>
                            </template>
                            <template v-slot:item.saturday="{ item }">
                                <strong v-for="(index,i) in item.saturday" :key="i">
                                    <br/>
                                    <v-tooltip bottom v-if="index.cancelations_schedules" color="info">
                                        <template v-slot:activator="{ on }">
                                            <v-card
                                                    v-on="on"
                                                    class="white--text pa-1 my-n2"
                                                    color="grey"
                                            >
                                                {{index.doctor.name}} - {{index.specialty.name}} - {{index.clinic.name}}
                                            </v-card>
                                        </template>
                                        <span>
                                            <strong>Período de cancelamento: {{index.cancelations_schedules[0].start_date | dateFilter}} a {{index.cancelations_schedules[0].final_date | dateFilter}}</strong>
                                        </span>
                                    </v-tooltip>
                                    <v-card
                                            v-else
                                            class="white--text pa-1 my-n2"
                                            :color="i === '0' ? 'blue' : i === '1' ? 'green' : i === '2' ? 'red' : i === '3' ? 'purple' : i === '4' ? 'orange' : 'pink'"
                                    >
                                        {{index.doctor.name}} - {{index.specialty.name}} - {{index.clinic.name}}
                                    </v-card>
                                </strong>
                                <br/>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </v-content>
</template>

<script>
    let moment = require('moment/moment');
    export default {
        data: () => ({
            moment: moment,
            today: '2020-15-05',
            //today: '2020-27-05',
            search: '',
            headers: [
                {text: 'Hora', value: 'hour', align: 'center', sortable: true},
                {text: 'Segunda', value: 'monday', align: 'center', sortable: false},
                {text: 'Terça', value: 'tuesday', align: 'center', sortable: false},
                {text: 'Quarta', value: 'wednesday', align: 'center', sortable: false},
                {text: 'Quinta', value: 'thursday', align: 'center', sortable: false},
                {text: 'Sexta', value: 'friday', align: 'center', sortable: false},
                {text: 'Sabado', value: 'saturday', align: 'center', sortable: false},
            ],
        }),
        computed: {
            doctorsMapping() {
                let weeklyTable = [
                    {
                        hour: '06:00',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '06:30',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '07:00',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '07:30',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '08:00',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '08:30',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '09:00',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '09:30',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '10:00',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '10:30',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '11:00',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '11:30',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '12:00',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '12:30',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '13:00',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '13:30',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    }, {
                        hour: '14:00',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '14:30',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    }, {
                        hour: '15:00',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '15:30',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '16:00',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '16:30',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '17:00',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                ]
                let schedules = this.$store.getters.AllSchedules
                for (let schedule in schedules) {
                    let daysOfTheWeek = schedules[schedule].days
                    for (let dayOfTheWeek in daysOfTheWeek) {
                        for (let weeklyItem in weeklyTable) {
                            if (daysOfTheWeek[dayOfTheWeek].hour === weeklyTable[weeklyItem].hour && dayOfTheWeek === '1') {
                                weeklyTable[weeklyItem].monday.push(schedules[schedule])
                            } else if (daysOfTheWeek[dayOfTheWeek].hour === weeklyTable[weeklyItem].hour && dayOfTheWeek === '2') {
                                weeklyTable[weeklyItem].tuesday.push(schedules[schedule])
                            } else if (daysOfTheWeek[dayOfTheWeek].hour === weeklyTable[weeklyItem].hour && dayOfTheWeek === '3') {
                                weeklyTable[weeklyItem].wednesday.push(schedules[schedule])
                            } else if (daysOfTheWeek[dayOfTheWeek].hour === weeklyTable[weeklyItem].hour && dayOfTheWeek === '4') {
                                weeklyTable[weeklyItem].thursday.push(schedules[schedule])
                            } else if (daysOfTheWeek[dayOfTheWeek].hour === weeklyTable[weeklyItem].hour && dayOfTheWeek === '5') {
                                weeklyTable[weeklyItem].friday.push(schedules[schedule])
                            } else if (daysOfTheWeek[dayOfTheWeek].hour === weeklyTable[weeklyItem].hour && dayOfTheWeek === '6') {
                                weeklyTable[weeklyItem].saturday.push(schedules[schedule])
                            }
                        }
                    }
                }
                return weeklyTable
            },
        },
        mounted() {
            this.$store.dispatch('getAllSchedules');
        }
    }
</script>
