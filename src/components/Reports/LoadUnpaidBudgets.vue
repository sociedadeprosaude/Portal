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

         <template v-slot:item.value="{item}">
            <v-btn text @click="openDialog(item)">
                {{ item.value }}
            </v-btn>
        </template>

        <template v-slot:item.date.formatted="{ item }">
          <span>
            {{ formatDate(item.date.formatted) }}
          </span>
        </template>
      </v-data-table>

        <v-dialog
            v-model="dialog"
            width="600"
        >   
            <v-card>
                <v-card-title class="headline grey lighten-2">
                    Produtos
                </v-card-title>

                <v-card-text>
                    <v-container>
                        <v-row v-for="(product, index) in itemSelected.products" :key="index">
                            <strong>{{product.with_product[0].name}}</strong>
                            <v-spacer></v-spacer>
                            <span>R$ {{product.price}}</span>
                        </v-row>
                    </v-container>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    text
                    @click="dialog = false"
                >
                    Fechar
                </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
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
        dialog: false,
        itemSelected: {}
    }),
    methods:{
      openDialog(item){
          this.itemSelected = item;
          console.log(item)
          this.dialog = true;
      },
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