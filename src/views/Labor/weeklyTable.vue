<template>
    <v-content>
        <v-container fluid>
            <v-layout row wrap class="align-center justify-center">
                <v-flex xs12>

                    <v-card>

                        <v-card-title>
                            Tabela Semanal dos Médicos - Especialidades - Unidades:
                            <v-divider vertical  class="mx-4" inset></v-divider>
                            <v-chip label dark color="primary"> Médico - Especialidade - Unidade </v-chip>
                            <v-spacer></v-spacer>
                            <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
                        </v-card-title>

                        <v-data-table
                                hide-default-header
                                hide-default-footer
                                :headers="headers"
                                :items="weeklyTable"
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
                                <strong v-for="(index,i) in item.monday" :key="i">{{index}}</strong>
                            </template>
                            <template v-slot:item.tuesday="{ item }">
                                <strong v-for="(index,i) in item.tuesday" :key="i">{{index}}</strong>
                            </template>
                            <template v-slot:item.wednesday="{ item }">
                                <strong v-for="(index,i) in item.wednesday" :key="i">{{index}}</strong>
                            </template>
                            <template v-slot:item.thursday="{ item }">
                                <strong v-for="(index,i) in item.thursday" :key="i">{{index}}</strong>
                            </template>
                            <template v-slot:item.friday="{ item }">
                                <strong v-for="(index,i) in item.friday" :key="i">{{index}}</strong>
                            </template>
                            <template v-slot:item.saturday="{ item }">
                                <strong v-for="(index,i) in item.saturday" :key="i">{{index}}</strong>
                            </template>

<!--                            <template v-slot:item.monday="{ item }">
                                <br/>
                                <v-chip small class="font-weight-bold" style="font-size: 0.8em" dark label v-for="(index,i) in item.monday" :key="i"
                                        :color="i == '0' ? 'blue' : i == '1' ? 'green' : i == '2' ? 'red' : i == '3' ? 'purple' : i == '4' ? 'orange' : 'pink'"
                                >{{index}}</v-chip>
                                <br/><br/>
                            </template>

                            <template v-slot:item.tuesday="{ item }">
                                <br/>
                                <v-chip small class="font-weight-bold" style="font-size: 0.8em" dark label v-for="(index,i) in item.tuesday" :key="i"
                                        :color="i == '0' ? 'blue' : i == '1' ? 'green' : i == '2' ? 'red' : i == '3' ? 'purple' : i == '4' ? 'orange' : 'pink'"
                                >{{index}}</v-chip>
                                <br/><br/>
                            </template>

                            <template v-slot:item.wednesday="{ item }">
                                <br/>
                                <v-chip small class="font-weight-bold" style="font-size: 0.8em" dark label v-for="(index,i) in item.wednesday" :key="i"
                                        :color="i == '0' ? 'blue' : i == '1' ? 'green' : i == '2' ? 'red' : i == '3' ? 'purple' : i == '4' ? 'orange' : 'pink'"
                                >{{index}}</v-chip>
                                <br/><br/>
                            </template>

                            <template v-slot:item.thursday="{ item }">
                                <br/>
                                <v-chip small class="font-weight-bold" style="font-size: 0.8em" dark label v-for="(index,i) in item.thursday" :key="i"
                                        :color="i == '0' ? 'blue' : i == '1' ? 'green' : i == '2' ? 'red' : i == '3' ? 'purple' : i == '4' ? 'orange' : 'pink'"
                                >{{index}}</v-chip>
                                <br/><br/>
                            </template>

                            <template v-slot:item.friday="{ item }">
                                <br/>
                                <v-chip small class="font-weight-bold" style="font-size: 0.8em" dark label v-for="(index,i) in item.friday" :key="i"
                                        :color="i == '0' ? 'blue' : i == '1' ? 'green' : i == '2' ? 'red' : i == '3' ? 'purple' : i == '4' ? 'orange' : 'pink'"
                                >{{index}}</v-chip>
                                <br/><br/>
                            </template>

                            <template v-slot:item.saturday="{ item }">
                                <br/>
                                <v-chip small class="font-weight-bold" style="font-size: 0.8em" dark label v-for="(index,i) in item.saturday" :key="i"
                                        :color="i == '0' ? 'blue' : i == '1' ? 'green' : i == '2' ? 'red' : i == '3' ? 'purple' : i == '4' ? 'orange' : 'pink'"
                                >{{index}}</v-chip>
                                <br/><br/>
                            </template>-->
                            {{lista}}
                        </v-data-table>
                    </v-card>

                </v-flex>
            </v-layout>
        </v-container>
    </v-content>
</template>

<script>
    var moment = require('moment');
    export default {
        data: () => ({
            moment: moment,
            search: '',
            headers: [
                { text: 'Hora', value: 'hour', align: 'center', sortable: false },
                { text: 'Segunda', value: 'monday', align: 'center', sortable: false },
                { text: 'Terça', value: 'tuesday', align: 'center', sortable: false },
                { text: 'Quarta', value: 'wednesday', align: 'center', sortable: false },
                { text: 'Quinta', value: 'thursday', align: 'center', sortable: false },
                { text: 'Sexta', value: 'friday', align: 'center', sortable: false },
                { text: 'Sabado', value: 'saturday', align: 'center', sortable: false },
            ],
            weeklyTable: [
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
                },                {
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
                },                {
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
            ],
        }),
        computed:{
            lista() {
                let arr = this.$store.getters.AllSchedules
/*                console.log(arr)*/
                for (let i in arr) {
                    let data = ''
                    data = arr[i].doctor.name + ' - ' + arr[i].specialty.name + ' - ' + arr[i].clinic.name
                    let daysoftheweek = arr[i].days
                    for (let j in daysoftheweek) {
                        for (let k in this.weeklyTable) {
                            if( daysoftheweek[j].hour === this.weeklyTable[k].hour && j == '1'){
                                this.weeklyTable[k].monday.push(data)
                            } else if( daysoftheweek[j].hour === this.weeklyTable[k].hour && j == '2'){
                                this.weeklyTable[k].tuesday.push(data)
                            } else if( daysoftheweek[j].hour === this.weeklyTable[k].hour && j == '3'){
                                this.weeklyTable[k].wednesday.push(data)
                            } else if( daysoftheweek[j].hour === this.weeklyTable[k].hour && j == '4'){
                                this.weeklyTable[k].thursday.push(data)
                            } else if( daysoftheweek[j].hour === this.weeklyTable[k].hour && j == '5'){
                                this.weeklyTable[k].friday.push(data)
                            } else if( daysoftheweek[j].hour === this.weeklyTable[k].hour && j == '6'){
                                this.weeklyTable[k].saturday.push(data)
                            }
                        }
                    }
                }
                return arr
            },
        },
        watch:{
            //
        },
        mounted() {
            this.$store.dispatch('getAllSchedules');
        },
        methods: {
/*            mappingDoctors(item) {
                let data = ''
                data = item.doctor.name + ' - ' + item.specialty.name + ' - ' + item.clinic.name
                let daysoftheweek = item.days
                for (let j in daysoftheweek) {
                    for (let i in this.weeklyTable) {
                        if( daysoftheweek[j].hour === this.weeklyTable[i].hour && j == '1'){
                            this.weeklyTable[i].monday.push(data)
                        } else if( daysoftheweek[j].hour === this.weeklyTable[i].hour && j == '2'){
                            this.weeklyTable[i].tuesday.push(data)
                        } else if( daysoftheweek[j].hour === this.weeklyTable[i].hour && j == '3'){
                            this.weeklyTable[i].wednesday.push(data)
                        } else if( daysoftheweek[j].hour === this.weeklyTable[i].hour && j == '4'){
                            this.weeklyTable[i].thursday.push(data)
                        } else if( daysoftheweek[j].hour === this.weeklyTable[i].hour && j == '5'){
                            this.weeklyTable[i].friday.push(data)
                        } else if( daysoftheweek[j].hour === this.weeklyTable[i].hour && j == '6'){
                            this.weeklyTable[i].saturday.push(data)
                        }
                    }
                }
                return true
            },*/
        },
    }
</script>

<style scoped>
</style>
