<template>
  <v-container>
    <v-row cols="12">
      <v-chip-group
        row
        mandatory
        v-bind:value="optionSelected"
        @change="(event)=>$emit('change-optionSelected',event)"
        active-class="primary--text"
        class="mb-3 ml-2"
      >
        <v-chip v-for="option in options" :key="option">{{ option }}</v-chip>
      </v-chip-group>
    </v-row>
    <v-card id="card-to-print">
      <v-card-title>
        <v-text-field
          v-bind:value="search"
          @input="(event)=>$emit('change-search',event)"
          prepend-inner-icon="mdi-magnify"
          label="Procurar"
          single-line
          rounded
          hide-details
        ></v-text-field>
        <v-spacer />
        <span class="float-right">{{date}} 00:00:00 até {{date2}} 23:59:59</span>
      </v-card-title>
      <div v-if="optionSelected === 0">
        <v-data-table
          :headers="headers"
          :search="search"
          :items="intakesDividedBySpecialties"
          :sort-by="['quantity']"
          :sort-desc="[true]"
          item-key="name"
          show-expand
          single-expand
          no-data-text="Sem consultas no intervalo escolhido"
          :footer-props="{
      itemsPerPageText:'Consultas por página',
      pageText:'{0}-{1} de {2}'
    }"
        >
          <template v-slot:item.totalPrice="{ item }">R$ {{item.totalPrice.toFixed(2)}}</template>
          <template v-slot:item.totalCost="{ item }">R$ {{item.totalCost.toFixed(2)}}</template>
          <template v-slot:item.profit="{ item }">R$ {{item.profit.toFixed(2)}}</template>

          <template v-slot:expanded-item="{ item }">
            <td :colspan="headers.length+1">
              <v-data-table
                class="subTable"
                dense
                single-expand
                :headers="subHeaders"
                :items="item.intakes"
                item-key="intakeId"
                :footer-props="{
      itemsPerPageText:'Itens por página',
      pageText:'{0}-{1} de {2}'
    }"
              >
                <template v-slot:item.price="{ item }">R$ {{item.price.toFixed(2)}}</template>
                <template v-slot:item.cost="{ item }">R$ {{item.cost.toFixed(2)}}</template>
              </v-data-table>
            </td>
          </template>
        </v-data-table>
      </div>
      <div v-if="optionSelected===1">
        <TableConsultationClinics
          :intakesDividedBySpecialties="intakesDividedBySpecialties"
          :search="search"
        />
      </div>
      <div v-if="optionSelected===2">
        <TableConsultationDoctor
          :intakesDividedBySpecialties="intakesDividedBySpecialties"
          :search="search"
        />
      </div>
    </v-card>

    <v-card class="mt-4">
      <v-container>
        <v-row>
          <v-col>
            <span class="my-headline">{{numSales}}</span>
            <br />
            <span class="font-italic">Total de consultas vendidas</span>
          </v-col>
          <v-divider vertical />
          <v-col>
            <span class="my-headline">R$ {{totalCost.toFixed(2)}}</span>
            <br />
            <span class="font-italic">Custo total das consultas</span>
          </v-col>
          <v-divider vertical />
          <v-col>
            <span class="my-headline">R$ {{totalPrice.toFixed(2)}}</span>
            <br />
            <span class="font-italic">Preço de venda total das consultas</span>
          </v-col>
          <v-divider vertical />
          <v-col>
            <span class="my-headline">R$ {{totalProfit.toFixed(2)}}</span>
            <br />
            <span class="font-italic">Lucro líquido total</span>
          </v-col>
          <v-divider vertical />
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>
<script>
import TableConsultationClinics from "@/components/Reports/TableConsultationClinics";
import TableConsultationDoctor from "@/components/Reports/TableConsultationDoctors";
export default {
  components: { TableConsultationDoctor, TableConsultationClinics },
  props: [
    "date",
    "date2",
    "search",
    "now",
    "total",
    "options",
    "optionSelected",
    "headers",
    "subHeaders",
    "calcIntakeFromConsultation",
    "intakesWithConsultation",
    "specialties",
    "intakesDividedBySpecialties",
    "numSales",
    "totalPrice",
    "totalCost",
    "totalProfit"
  ]
};
</script>

<style scoped>
.subTable {
  border-radius: 0px;
  border: 1px solid black;
}
</style>