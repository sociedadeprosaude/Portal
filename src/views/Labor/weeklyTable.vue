<template>
    <v-content>
        <v-container fluid>
            <v-layout row wrap class="align-center justify-center">
                <v-flex xs12>
                    <v-simple-table>
                        <template v-slot:default>
                            <thead>
                            <tr>
                                <th class="text-left primary white--text">Hora</th>
                                <td class="text-left primary white--text"><v-divider vertical class="white"></v-divider></td>
                                <th class="text-center primary white--text">Segunda</th>
                                <td class="text-left primary white--text"><v-divider vertical class="white"></v-divider></td>
                                <th class="text-center primary white--text">Terça</th>
                                <td class="text-left primary white--text"><v-divider vertical class="white"></v-divider></td>
                                <th class="text-center primary white--text">Quarta</th>
                                <td class="text-left primary white--text"><v-divider vertical class="white"></v-divider></td>
                                <th class="text-center primary white--text">Quinta</th>
                                <td class="text-left primary white--text"><v-divider vertical class="white"></v-divider></td>
                                <th class="text-center primary white--text">Sexta</th>
                                <td class="text-left primary white--text"><v-divider vertical class="white"></v-divider></td>
                                <th class="text-center primary white--text">Sabado</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="item in desserts" :key="item.hour">
                                <td>{{ item.hour }}</td>
                                <td><v-divider vertical></v-divider></td>
                                <td>{{ item.monday }}</td>
                                <td><v-divider vertical></v-divider></td>
                                <td>{{ item.tuesday }}</td>
                                <td><v-divider vertical></v-divider></td>
                                <td>{{ item.wednesday }}</td>
                                <td><v-divider vertical></v-divider></td>
                                <td>{{ item.thursday }}</td>
                                <td><v-divider vertical></v-divider></td>
                                <td>{{ item.friday }}</td>
                                <td><v-divider vertical></v-divider></td>
                                <td>{{ item.saturday }}</td>
                            </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
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
            desserts: [
                {
                    hour: '07:00',
                    monday: ['jackson - dermatologista, jonatas - cardiologia'],
                    tuesday: ['raul - urologia, jonatas - cardiologia'],
                    wednesday: ['jackson - dermatologista, jonatas - cardiologia'],
                    thursday: ['raul - urologia, jonatas - cardiologia'],
                    friday: ['jackson - dermatologista, jonatas - cardiologia'],
                    saturday: ['jackson - dermatologista, jonatas - cardiologia'],
                },
                {
                    hour: '07:30',
                    monday: ['monica - dermatologista, carlos - cardiologia'],
                    tuesday: ['adria - ginecologia'],
                    wednesday: ['monica - dermatologista, carlos - cardiologia'],
                    thursday: ['adria - ginecologia'],
                    friday: ['lucas - dermatologista'],
                    saturday: ['lucas - dermatologista, carlos- cardiologia'],
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