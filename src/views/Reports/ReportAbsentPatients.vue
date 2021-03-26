<template>
    <div>
        <h1>Pacientes que estão há 4 meses sem aparecer</h1>
            <ApolloQuery :query="require('@/graphql/reports/LoadPatientsNotAttendanced.gql')" :update="teste">
                <template slot-scope="{ result: { data } }">

                    <v-container v-if="data">
                        <v-row>
                            <v-spacer></v-spacer>
                            <v-btn class="primary mr-5 mb-2" @click="exportToCSV">Exportar CSV</v-btn>
                        </v-row>
                        <v-data-table
                            :headers="headers"
                            :items="data.Patient"
                            :items-per-page="20"
                            class="mt-3 elevation-1 pa-3"
                        >
                        </v-data-table>
                    </v-container>

                    <v-progress-linear v-else-if="!data"
                        class="mt-5"
                        color="blue"
                        indeterminate
                        rounded
                        height="10"
                    />
                </template>
            </ApolloQuery>
    </div>
</template>

<script>
import moment from 'moment';
export default {
    data:()=>({
        headers: [
            { text: 'Nome', value: 'name', sortable: true, },
            { text: 'cpf', value: 'cpf', sortable: true, },
            { text: 'email', sortable: true, value: 'email'},
            { text: 'telefone', value: 'telephones[0]', sortable: true, },
        ],
        patients:[]
    }),
    methods:{
        teste(data){
            this.patients = data.Patient;

            return data;
        },
        formatDate(date){
            return moment(date, 'YYYY-MM-DDTHH:mm').format('DD/MM/YYYY [as] HH:mm')
        },
        exportToCSV(){

            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += [
            ['name', 'cpf', 'email', 'telephone'].join(";"),
            ...this.patients.map(item => [item.name, item.cpf, item.email, item.telephones ? item.telephones[0] : ''].join(";"))
            ]
            .join("\n")
            .replace(/(^\[)|(\]$)/gm, "");

            const data = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", data);
            link.setAttribute("download", "export.csv");
            link.click();
        }
    }
}
</script>

<style>

</style>