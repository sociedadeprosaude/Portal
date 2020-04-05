<template>
  <v-container>
    <v-row cols="12">
      <v-chip-group row mandatory v-model="optionSelected" active-class="primary--text">
        <v-chip v-for="option in options" :key="option">{{ option }}</v-chip>
      </v-chip-group>
    </v-row>
    <v-card>
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
        :search="search"
        :headers="headers"
        :items=" actualList"
        :sort-by="['quantity']"
        :sort-desc="[true]"
        item-key="name"
        show-expand
        single-expand
        no-data-text="Sem saídas no intervalo escolhido"
        :footer-props="{
      itemsPerPageText:'Categorias por página',
      pageText:'{0}-{1} de {2}'
    }"
      >
        <template v-slot:item.totalCost="{ item }">R$ {{item.totalCost}}</template>
        <template v-slot:item.percentage="{ item }">{{item.percentage}} %</template>

        <template v-slot:expanded-item="{ item }">
          <td :colspan="headers.length+1">
            <v-data-table
              class="subTable"
              dense
              single-expand
              :headers="subHeaders"
              :items="item.outtakes"
              item-key="idOuttake"
              :footer-props="{
      itemsPerPageText:'Saídas por página',
      pageText:'{0}-{1} de {2}'
    }"
            >
              <template v-slot:item.cost="{ item }">R$ {{item.cost}}</template>
              <template v-slot:item.CRUD="{ item }">
                <v-row>
                  <ReadOuttake :item="item" />
                  <DeleteOuttake :item="item" :cb="cb" />
                </v-row>
              </template>
              <template v-slot:item.status="{ item }">
                <div v-if="item.status" class="green">Pago</div>
                <div v-else class="red white--text">Pendente</div>
              </template>
            </v-data-table>
          </td>
        </template>
      </v-data-table>
    </v-card>
    <v-card>
      <div class="Chart">
        <PieOuttake :chart-data="dataCollection" :options="options" />
      </div>
    </v-card>

    <v-card class="mt-4">
      <v-container>
        <v-row>
          <v-col>
            <span class="my-headline">{{numOuttakes}}</span>
            <br />total de saídas
          </v-col>
          <v-divider vertical />
          <v-col>
            <span class="my-headline">R$ {{totalCost}}</span>
            <br />Custo total das saídas
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import moment from "moment";
import PieOuttake from "./PieOuttake.js";
import DeleteOuttake from "./CRUD/DeleteOuttake";
import ReadOuttake from "./CRUD/ReadOuttake";

export default {
  name: "OuttakesReport",
  components: {
    PieOuttake,
    DeleteOuttake,
    ReadOuttake
  },
  props: ["date", "date2", "cb"],
  data() {
    return {
      search: "",
      paid: false,
      now: moment().format("YYYY-MM-DD HH:mm:ss"),
      total: 0,
      options: ["Saídas", "Saídas pendentes", "Saídas pagas"],
      optionSelected: 0,
      headers: [
        {
          text: "Saída",
          align: "start",
          sortable: false,
          value: "name"
        },
        { text: "Quantidade", value: "quantity", align: "center" },
        { text: "Percentual", value: "percentage", align: "center" },
        { text: "Custo total", value: "totalCost", align: "center" }
      ],
      subHeaders: [
        {
          text: "Codigo",
          align: "start",
          sortable: false,
          value: "idOuttake"
        },
        { text: "Custo", value: "cost", align: "center" },
        { text: "SubCategoria", value: "subCategory", align: "center" },
        { text: "Status", value: "status", align: "center" },
        { text: "Criado em", value: "created_at", align: "center" },
        { text: "Pago em", value: "paidIn", align: "center" },
        { text: "Ações", value: "CRUD" }
      ],
      dateBegin: null,
      dateEnd: null,
      colors: [
        "#ea4335",
        "#fbbc03",
        "#33a853",
        "#4285f4",
        "#5f6368",
        "#14584d",
        "#dc5623",
        "#f3c414",
        "#242124"
      ]
    };
  },

  methods: {
    formatDate(date) {
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    formatDateHour: date => moment(date).format("DD/MM/YYYY, HH:mm"),

    calcPercentage: (sum, total) =>
      parseFloat(((sum / total) * 100).toFixed(2)),

    calcOuttakeInfo(category, listOuttakesCategory, totalCost) {
      const sumCost = this.calcCost(listOuttakesCategory);
      const percentage = totalCost
        ? this.calcPercentage(sumCost, totalCost)
        : 0;
      return {
        name: category.name,
        outtakes: listOuttakesCategory,
        quantity: listOuttakesCategory.length,
        percentage: percentage,
        totalCost: sumCost
      };
    },
    calcTotalCost: arr =>
      parseFloat(arr.reduce((total, e) => total + e.totalCost, 0).toFixed(2)),

    //BugFont, tem que outtake em que value é string e outros que é number
    calcCost: arr =>
      parseFloat(
        arr.reduce((total, e) => total + parseFloat(e.cost), 0).toFixed(2)
      ),

    updatePercentage(subList) {
      const totalSubCost = this.calcTotalCost(subList);
      return subList.map(e => {
        e.percentage = this.calcPercentage(e.totalCost, totalSubCost);
        return e;
      });
    }
  },
  computed: {
    outtakes() {
      return this.$store.getters.outtakes;
    },
    listOuttakesRemade() {
      return this.outtakes.map(e => ({
        idOuttake: e.id,
        category: e.category,
        subCategory: e.subCategory,
        cost: e.value,
        paidIn: e.paid
          ? this.formatDateHour(e.paid)
          : "Marcado para " + this.formatDate(e.date_to_pay),
        created_at: this.formatDateHour(e.created_at),
        toPayIn: e.date_to_pay,
        info: e.description,
        status: e.paid ? true : false
      }));
    },

    categories() {
      return this.$store.getters.outtakesCategories;
    },
    outtakesDividedByCategory() {
      let listOuttakesGroupedByCategory = [];

      const totalCost = this.calcCost(this.listOuttakesRemade);
      this.categories.forEach(category => {
        let listOuttakesCategory = this.listOuttakesRemade.filter(
          outtake => outtake.category == category.name
        );
        if (listOuttakesCategory.length != 0)
          listOuttakesGroupedByCategory.push(
            this.calcOuttakeInfo(category, listOuttakesCategory, totalCost)
          );
      });
      return listOuttakesGroupedByCategory;
    },

    outtakesToPayList() {
      const subList = this.outtakesDividedByCategory.map(e => {
        const listAux = e.outtakes.filter(e2 => !e2.status);
        //não tem como calcular a porcentagem de cada outtake se a lista ainda está sendo criada
        return this.calcOuttakeInfo(e, listAux, null);
      });
      // calculando a porcentagem de cada outtake no total da lista filtrada
      return this.updatePercentage(subList);
    },
    outtakesPaidList() {
      const subList = this.outtakesDividedByCategory.map(e => {
        const listAux = e.outtakes.filter(e2 => e2.status);
        return this.calcOuttakeInfo(e, listAux, null);
      });
      return this.updatePercentage(subList);
    },
    dataCollection() {
      const labels = this.actualList.map(e => e.name);
      const data = this.actualList.map(e => e.totalCost);
      return {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: this.colors
          }
        ]
      };
    },
    actualList() {
      return this.optionSelected === 0
        ? this.outtakesDividedByCategory
        : this.optionSelected === 1
        ? this.outtakesToPayList
        : this.outtakesPaidList;
    },

    numOuttakes() {
      return this.actualList.reduce((total, e) => total + e.quantity, 0);
    },
    totalCost() {
      return parseFloat(
        this.actualList.reduce((total, e) => total + e.totalCost, 0).toFixed(2)
      );
    }
  }
};
</script>

<style scoped>
.subTable {
  border-radius: 0px;
  border: 1px solid black;
}
.Chart {
  padding: 20px;
  margin: 50px 0;
}
</style>
