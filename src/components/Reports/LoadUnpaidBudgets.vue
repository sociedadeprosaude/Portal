<template>
    <v-container>
      <v-row>
        <v-spacer></v-spacer>
        <v-btn class="primary mr-5 mb-2" @click="exportToCSV">Exportar CSV</v-btn>
      </v-row>
      <v-data-table
        :headers="headers"
        :items="budgets"
        :items-per-page="20"
        class="elevation-1 pa-3"
      >
        <template v-slot:item.date.formatted="{ item }">
          <span>
            {{ formatDate(item.date.formatted) }}
          </span>
        </template>
      </v-data-table>
    </v-container>
</template>

<script>
import moment from 'moment';
export default {
    props:['budgets'],
    data:()=>({
        headers: [
            { text: 'Valor (R$)', value: 'value', sortable: true, },
            { text: 'Data', value: 'date.formatted', sortable: true, },
            { text: 'Paciente', sortable: true, value: 'patient[0].name'},
            { text: 'Unidade', value: 'unit[0].name', sortable: true, },
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