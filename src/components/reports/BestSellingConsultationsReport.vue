<template>
    <v-container>
        <v-row cols="12">
            <v-chip-group row mandatory v-model="optionSelected" active-class="primary--text" class="mb-3 ml-2">
                <v-chip v-for="option in options" :key="option">{{ option }}</v-chip>
            </v-chip-group>
        </v-row>
        <v-card id="card-to-print">
            <v-card-title>
                <v-text-field
                        v-model="search"
                        prepend-inner-icon="mdi-magnify"
                        label="Procurar"
                        single-line
                        rounded
                        hide-details>
                </v-text-field>
                <v-spacer/>
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
                hide-default-footer
              >
                <template v-slot:item.price="{ item }">R$ {{item.price.toFixed(2)}}</template>
                <template v-slot:item.cost="{ item }">R$ {{item.cost.toFixed(2)}}</template>
              </v-data-table>
            </td>
          </template>
        </v-data-table>
      </div>
      <div v-if="optionSelected===1">
        <TableConsultationClinics :intakesDividedBySpecialties="intakesDividedBySpecialties" />
      </div>
      <div v-if="optionSelected===2">
        <TableConsultationDoctor :intakesDividedBySpecialties="intakesDividedBySpecialties" />
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
import moment from "moment";
import TableConsultationClinics from "./TableConsultationClinics";
import TableConsultationDoctor from "./TableConsultationDoctors";
export default {
  name: "BestSellingConsultationsReports",
  components: { TableConsultationDoctor, TableConsultationClinics },
  props: ["date", "date2"],
  data() {
    return {
      search: "",
      now: moment().format("YYYY-MM-DD HH:mm:ss"),
      total: 0,
      options: ["Consultas", "Consultas por clínica", "Consultas por médico"],
      optionSelected: 0,
      headers: [
        {
          text: "CONSULTAS",
          align: "start",
          sortable: false,
          value: "name"
        },
        { text: "QUANTIDADE VENDIDA", value: "quantity", align: "center" },
        { text: "CUSTO TOTAL", value: "totalCost", align: "center" },
        { text: "VENDA TOTAL", value: "totalPrice", align: "center" },
        { text: "LUCRO LÍQUIDO", value: "profit" }
      ],
      subHeaders: [
        {
          text: "Código",
          align: "start",
          sortable: false,
          value: "idIntake"
        },
      ]
    }
  },
  computed: {
    intakesWithConsultation() {
      return this.$store.getters.intakesWithConsultation;
    },
    specialties() {
      return this.$store.getters.specialties;
    },
    intakesDividedBySpecialties() {
      let listIntakesRemade = [];
      // Criando com exames com os dados necessarios
      listIntakesRemade = this.intakesWithConsultation.map(intake =>
        intake.specialties.map(consultation => {
          //console.log("intake", intake);
          return {
            idIntake: intake.id,
            clinicName:
              consultation.doctor.clinic != null
                ? consultation.doctor.clinic.name
                : "Erro, consulta sem clinica",
            cost: consultation.cost,
            specialtieName: consultation.name,
            price: consultation.price,
            doctorName: consultation.doctor.name
          };
        })
      );
      // Juntando em uma array que o bloco de cima retona uma array de array
      listIntakesRemade = [].concat.apply([], listIntakesRemade);
      let listIntakesGroupedBySpecialties = [];
      // Agrupando os intakes que tem ao mesmo exame
      this.specialties.forEach(specialtie => {
        let listIntakesSpecialties = listIntakesRemade.filter(
          intake => intake.specialtieName === specialtie.name
        );
        if (listIntakesSpecialties.length !== 0)
          listIntakesGroupedBySpecialties.push(
            this.calcIntakeFromConsultation(specialtie, listIntakesSpecialties)
          );
      });
      return listIntakesGroupedBySpecialties;
    },
    numSales() {
      return this.intakesDividedBySpecialties.reduce(
        (total, e) => total + e.quantity,
        0
      );
    },
    totalPrice() {
      return this.intakesDividedBySpecialties.reduce(
        (total, e) => total + e.totalPrice,
        0
      );
    },
    totalCost() {
      return this.intakesDividedBySpecialties.reduce(
        (total, e) => total + e.totalCost,
        0
      );
    },
    totalProfit() {
      return this.intakesDividedBySpecialties.reduce(
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