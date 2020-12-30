<template>
  <v-container>
    <v-card>
      <v-row>
        <v-col cols="5">
          <v-menu v-model="dateMenuStart">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                  v-model="formattedSelectedStartDate"
                  hint="Data inicial"
                  persistent-hint
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  outlined
                  dense
                  color="primary"
              />
            </template>
            <v-date-picker v-model="selectedStartDate" locale="pt-br"/>
          </v-menu>
        </v-col>
        <v-icon class="primary--text pb-5" large>event</v-icon>
        <v-col cols="5">
          <v-menu v-model="dateMenuFinal">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                  v-model="formattedSelectedFinalDate"
                  hint="Data final"
                  persistent-hint
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  outlined
                  dense
                  color="primary"

              />
            </template>
            <v-date-picker v-model="selectedFinalDate" locale="pt-br"/>
          </v-menu>
        </v-col>
      </v-row>
    </v-card>
    <ApolloQuery :query="require('@/graphql/productTransaction/loadProductTransactionTypeExam.gql')"
                 :variables="{dateStart: formattedDateStart(formattedSelectedStartDate), dateEnd:formattedDateEnd(formattedSelectedFinalDate)}">
      <template v-slot="{result: {data, loading, error}}">
        <v-progress-linear v-if="loading" color="primary" indeterminate/>
        <strong class="red--text" v-else-if="error">
          Erro ao carregar exames, verifique sua conexão
        </strong>
        <BestSellingExamsReport
            v-if="data"
            :date="formattedSelectedStartDate"
            :date2="formattedSelectedFinalDate"
            :search="search"
            :now="now"
            :total="total"
            :options="options"
            :optionSelected="optionSelected"
            :headers="headers"
            :subHeaders="subHeaders"
            :ExamsFormatArray="ExamsFormatArray(data)"
            :numSales="numSales"
            :totalPrice="totalPrice"
            :totalCost="totalCost"
            :totalProfit="totalProfit"

            @change-search="(value)=>search=value"
            @change-optionSelected="(value)=>optionSelected=value"
        />
      </template>
    </ApolloQuery>
  </v-container>
</template>

<script>
import BestSellingExamsReport from "@/components/Reports/BestSellingExamsReport";
import moment from "moment";
export default {
  // name: "BestSellingExamsReport",
  components: { BestSellingExamsReport },
  data() {
    return {
      dateMenuStart: false,
      dateMenuFinal: false,
      loadExams: false,
      selectedStartDate: moment().format("YYYY-MM-DD"),
      selectedFinalDate: moment().format("YYYY-MM-DD"),
      search: "",
      now: moment().format("YYYY-MM-DD HH:mm:ss"),
      total: 0,
      options: ["Exames", "Exames separados por clinica"],
      optionSelected: 0,
      ExamsFormatt: '',
      headers: [
        {
          text: "Exame",
          align: "start",
          sortable: false,
          value: "Name"
        },
        { text: "Quantidade vendida", value: "NumSales", align: "center" },
        { text: "Custo total", value: "cost", align: "center" },
        { text: "Venda total", value: "price", align: "center" },
        { text: "Lucro liquido", value: "profit" }
      ],
      subHeaders: [
        {
          text: "Codigo",
          align: "start",
          sortable: false,
          value: "idIntake"
        },
        { text: "Custo", value: "cost", align: "center" },
        { text: "Venda", value: "price", align: "center" },
        { text: "Clinica", value: "clinicName" }
      ],
    };
  },
  methods: {
    formattedDateStart(date){
      date = date + 'T00:00:00'
      console.log('date inicio: ', date)
      return moment(date,'DD/MM/YYYYTHH:mm:ss').format('YYYY-MM-DDTHH:mm:ss')
    },
    formattedDateEnd(date){
      date = date + 'T23:59:59'
      return moment(date,'DD/MM/YYYYTHH:mm:ss').format('YYYY-MM-DDTHH:mm:ss')
    },
    ExamsFormatArray(data){
      if(data.ProductTransaction[0]) {
        let exams = []
        data.ProductTransaction.map(e => {
          if (exams[e.product.name]) {
            exams[e.product.name].NumSales += 1
            exams[e.product.name].price += e.price
            exams[e.product.name].cost += e.averageCost
            exams[e.product.name].profit = exams[e.product.name].price - exams[e.product.name].cost
          } else {
            exams[e.product.name] = {
              NumSales: 1,
              Name: e.product.name,
              price: e.price,
              cost: e.averageCost,
              profit: e.price - e.averageCost
            }
          }
        })
        let FormattedExams = []
        for (let i in exams) {
          FormattedExams.push(exams[i])
        }
        this.ExamsFormatt= FormattedExams
        this.loadExams = true
        return FormattedExams
      }
    },
  },
  computed: {
    formattedSelectedStartDate: {
      get() {
        return moment(this.selectedStartDate).format("DD/MM/YYYY")
      },
      set(val) {
        this.selectedDate = val
      }
    },
    formattedSelectedFinalDate: {
      get() {
        return moment(this.selectedFinalDate).format("DD/MM/YYYY")
      },
      set(val) {
        this.selectedDate = val
      }
    },
    /*intakesDividedByExam() {
      let listIntakesRemade = [];
      listIntakesRemade = this.intakesWithExam.map(intake =>
        intake.exams.map(exam => {
          return {
            idIntake: intake.id,
            clinicName:
              exam.clinic != null
                ? exam.clinic.name
                : "Erro, exame sem clinica",
            cost: exam.cost,
            examName: exam.name,
            price: exam.price
          };
        })
      );
      listIntakesRemade = [].concat.apply([], listIntakesRemade);
      let listIntakesGroupedByExam = [];
      this.exams.forEach(exam => {
        let listIntakesExam = listIntakesRemade.filter(
          intake => intake.examName == exam.name
        );
        if (listIntakesExam.length != 0)
          listIntakesGroupedByExam.push(
            this.calcIntakeFromExam(exam, listIntakesExam)
          );
      });
      return listIntakesGroupedByExam;
    }, */
    numSales() {
      return this.ExamsFormatt.reduce(
        (total, e) => total + e.NumSales,
        0
      );
    },
    totalPrice() {
      return this.ExamsFormatt.reduce(
        (total, e) => total + e.price,
        0
      );
    },
    totalCost() {
      return this.ExamsFormatt.reduce(
        (total, e) => total + e.cost,
        0
      );
    },
    totalProfit() {
      return this.ExamsFormatt.reduce(
        (total, e) => total + e.profit,
        0
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
</style>