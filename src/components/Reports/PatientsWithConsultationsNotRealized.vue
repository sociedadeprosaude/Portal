<template>
    <v-container>
      <v-row>
        <v-spacer></v-spacer>
        <v-btn class="primary mr-5 mb-2" @click="exportToCSV">Exportar CSV</v-btn>
      </v-row>
      <v-data-table
        :headers="headers"
        :items="consultations"
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
    props:['consultations'],
    data:()=>({
        headers: [
          {
            text: 'Paciente',
            align: 'start',
            sortable: true,
            value: 'patient.name',
          },
          { text: 'Especialidade', value: 'has_product.name', sortable: true, },
          { text: 'Médico', value: 'attended_by.name', sortable: true, },
          { text: 'Data do agendamento', value: 'date.formatted', sortable: true, },
          { text: 'Status', value: 'status', sortable: true, },
        ],
    }),
    methods:{
      formatDate(date){
        return moment(date, 'YYYY-MM-DDTHH:mm').format('DD/MM/YYYY [as] HH:mm')
      },
      exportToCSV(){

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += [
          ['patient', 'specialty', 'doctor', 'date', 'status'].join(";"),
          ...this.consultations.map(item => [item.patient.name, item.has_product.name, 
            item.attended_by.name, item.date.formatted, item.status].join(";"))
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