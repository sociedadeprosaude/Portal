<template>
    <v-content>
        <v-container fluid>
            <v-layout row wrap class="align-center justify-center">
                <v-flex xs12>
                    
                    <v-card>

                        <v-card-title>
                            Tabela Semanal dos Médicos - Especialidades - Unidades
                            <v-spacer></v-spacer>
                            <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
                        </v-card-title>

                        <v-data-table
                                hide-default-header
                                hide-default-footer
                                :headers="headers"
                                :items="desserts"
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
                                <br/>
                                <v-chip dark label v-for="(index,i) in item.monday" :key="i"
                                        :color="i == '0' ? 'blue' : i == '1' ? 'green' : i == '2' ? 'red' : i == '3' ? 'purple' : i == '4' ? 'orange' : 'pink'"
                                >{{index}}</v-chip>
                                <br/><br/>
                            </template>
                            <template v-slot:item.tuesday="{ item }">
                                <br/>
                                <v-chip dark label v-for="(index,i) in item.tuesday" :key="i"
                                        :color="i == '0' ? 'blue' : i == '1' ? 'green' : i == '2' ? 'red' : i == '3' ? 'purple' : i == '4' ? 'orange' : 'pink'"
                                >{{index}}</v-chip>
                                <br/><br/>
                            </template>
                            <template v-slot:item.wednesday="{ item }">
                                <br/>
                                <v-chip dark label v-for="(index,i) in item.wednesday" :key="i"
                                        :color="i == '0' ? 'blue' : i == '1' ? 'green' : i == '2' ? 'red' : i == '3' ? 'purple' : i == '4' ? 'orange' : 'pink'"
                                >{{index}}</v-chip>
                                <br/><br/>
                            </template>
                            <template v-slot:item.thursday="{ item }">
                                <br/>
                                <v-chip dark label v-for="(index,i) in item.thursday" :key="i"
                                        :color="i == '0' ? 'blue' : i == '1' ? 'green' : i == '2' ? 'red' : i == '3' ? 'purple' : i == '4' ? 'orange' : 'pink'"
                                >{{index}}</v-chip>
                                <br/><br/>
                            </template>
                            <template v-slot:item.friday="{ item }">
                                <br/>
                                <v-chip dark label v-for="(index,i) in item.friday" :key="i"
                                        :color="i == '0' ? 'blue' : i == '1' ? 'green' : i == '2' ? 'red' : i == '3' ? 'purple' : i == '4' ? 'orange' : 'pink'"
                                >{{index}}</v-chip>
                                <br/><br/>
                            </template>
                            <template v-slot:item.saturday="{ item }">
                                <br/>
                                <v-chip dark label v-for="(index,i) in item.saturday" :key="i"
                                        :color="i == '0' ? 'blue' : i == '1' ? 'green' : i == '2' ? 'red' : i == '3' ? 'purple' : i == '4' ? 'orange' : 'pink'"
                                >{{index}}</v-chip>
                                <br/><br/>
                            </template>

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
            desserts: [
                {
                    hour: '06:00',
                    monday: ['lucas - dermatologista'],
                    tuesday: ['lucas - dermatologista'],
                    wednesday: ['lucas - dermatologista'],
                    thursday: ['adria - ginecologia'],
                    friday: ['lucas - dermatologista'],
                    saturday: ['lucas - dermatologista'],
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
                    monday: ['jackson - dermatologista', 'jonatas - cardiologia','jackson - dermatologista', 'jonatas - cardiologia', 'jonatas - cardiologia', 'jonatas - cardiologia'],
                    tuesday: ['raul - urologia', 'jonatas - cardiologia', 'jonatas - cardiologia', 'jonatas - cardiologia', 'jonatas - cardiologia'],
                    wednesday: ['jackson - dermatologista', 'jonatas - cardiologia', 'jonatas - cardiologia', 'jonatas - cardiologia'],
                    thursday: ['raul - urologia', 'jonatas - cardiologia', 'jonatas - cardiologia'],
                    friday: ['jackson - dermatologista', 'jonatas - cardiologia'],
                    saturday: ['jackson - dermatologista'],
                },
                {
                    hour: '07:30',
                    monday: ['monica - dermatologista', 'carlos - cardiologia'],
                    tuesday: ['adria - ginecologia','jackson - dermatologista', 'jonatas - cardiologia'],
                    wednesday: ['monica - dermatologista', 'carlos - cardiologia'],
                    thursday: ['adria - ginecologia'],
                    friday: ['lucas - dermatologista'],
                    saturday: ['lucas - dermatologista', 'carlos- cardiologia'],
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
                {
                    hour: '17:30',
                    monday: [],
                    tuesday: [],
                    wednesday: [],
                    thursday: [],
                    friday: [],
                    saturday: [],
                },
                {
                    hour: '18:00',
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
            //
        },
        watch:{
            //
        },
        mounted() {
            //
        },
        methods: {
            //
        },
    }
</script>

<style scoped>
</style>