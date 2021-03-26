<template>
    <div>
        <h1>Pacientes que estão há 4 meses sem aparecer</h1>
        <ApolloQuery :query="require('@/graphql/reports/LoadPatientsNotAttendanced.gql')">
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
                        class="elevation-1 pa-3"
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
    props:['budgets'],
    data:()=>({
        headers: [
            { text: 'Nome', value: 'name', sortable: true, },
            { text: 'cpf', value: 'cpf', sortable: true, },
            { text: 'email', sortable: true, value: 'email'},
            { text: 'telefone', value: 'telephones[0]', sortable: true, },
        ],
    }),
    methods:{
      formatDate(date){
        return moment(date, 'YYYY-MM-DDTHH:mm').format('DD/MM/YYYY [as] HH:mm')
      },
      exportToCSV(){

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += [
          ['value', 'date', 'patient', 'unit'].join(";"),
          ...this.budgets.map(item => [item.value, item.date.formatted, item.patient[0].name, item.unit[0].name].join(";"))
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