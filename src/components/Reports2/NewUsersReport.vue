<template>
  <v-container>
    <v-row cols="12">
      <v-chip-group
        row
        mandatory
        v-bind:value="optionSelected"
        @change="(event)=>$emit('change-optionSelected',event)"
        active-class="primary--text"
      >
        <v-chip v-for="option in options" :key="option">{{ option }}</v-chip>
      </v-chip-group>
    </v-row>
    <v-card id="card-to-print">
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Procurar"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <span class="float-right">{{date }} 00:00:00 até {{date2}} 23:59:59</span>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :search="search"
        :items="actualList"
        item-key="cpf"
        no-data-text="Sem novos associados no intervalo escolhido"
        :footer-props="{
      itemsPerPageText:'Exames por página',
      pageText:'{0}-{1} de {2}'
    }"
      ></v-data-table>
    </v-card>

    <v-card class="mt-4">
      <v-container>
        <v-row>
          <v-col>
            <span class="my-headline">{{numNewUsers}}</span>
            <br />Número de novos pacientes
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import moment from "moment";

export default {
  name: "BestSellingExamsReport",

  props: [
    "date",
    "date2",
    "todayNewUsers",
    "search",
    "now",
    "total",
    "options",
    "optionSelected",
    "headers",
    "dateBegin",
    "dateEnd",
    "actualList",
    "newUsers",
    "numNewUsers"
  ]
};
</script>

<style scoped>
.subTable {
  border-radius: 0px;
  border: 1px solid black;
}
</style>