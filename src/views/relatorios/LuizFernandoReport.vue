<template>
  <v-container>
    <LuizFernandoReport
      :report="report"
      :loading="loading"
      :reportAllUnits="reportAllUnits"
      :now="now"
      :total="total"
      :reportOptions="reportOptions"
      :reportSelected="reportSelected"
      :finalProfit="finalProfit"
      :totalProfit="totalProfit"
      :totalCost="totalCost"
      :totalFinancialSupport="totalFinancialSupport"
      :proceduresQuantity="proceduresQuantity"
      :examsQuantity="examsQuantity"
      :totalExamsIntakes="totalExamsIntakes"
      :totalCostExamsIntakes="totalCostExamsIntakes"
      :totalSpecialtiesIntakes="totalSpecialtiesIntakes"
      :totalOuttakesInMoney="totalOuttakesInMoney"
      :totalOuttakesNotMoney="totalOuttakesNotMoney"
      :totalRawIntake="totalRawIntake"
      :totalCredit="totalCredit"
      :totalTaxaCredit="totalTaxaCredit"
      :totalDebit="totalDebit"
      :totalTaxaDebit="totalTaxaDebit"
      :totalMoney="totalMoney"
      :Procedures="Procedures"
      :QuantityTotalFinish="QuantityTotalFinish"
      :CostTotalFinish="CostTotalFinish"
      :PriceTotalFinish="PriceTotalFinish"
      @change-reportSelected="(value)=>reportSelected=value"
    />
  </v-container>
</template>

<script>
import LuizFernandoReport from "@/components/Reports2/LuizFernandoReport";
import moment from "moment";
export default {
  components: { LuizFernandoReport },
  //   name: "LuizFernandoReport",
  props: ["report", "loading", "reportAllUnits"],
  data() {
    return {
      now: moment().format("YYYY-MM-DD HH:mm:ss"),
      total: 0,
      reportOptions: ["Relatório Geral"],
      reportSelected: 0
    };
  },
  computed: {
    finalProfit() {
      return (
        parseFloat(this.totalProfit) - parseFloat(this.totalCost)
      ).toFixed(2);
    },
    totalProfit() {
      return (
        parseFloat(this.totalSpecialtiesIntakes) +
        parseFloat(this.totalExamsIntakes) +
        parseFloat(this.totalFinancialSupport)
      );
    },
    totalCost() {
      return (
        parseFloat(this.totalCostSpecialtiesIntakes) +
        parseFloat(this.totalCostExamsIntakes) +
        parseFloat(this.totalTaxaDebit) +
        parseFloat(this.totalTaxaCredit) +
        parseFloat(this.totalOuttakesInMoney) +
        parseFloat(this.totalOuttakesNotMoney)
      );
    },
    totalFinancialSupport() {
      let total = 0;
      for (let support in this.report.financialSupportIntakes) {
        total += this.report.financialSupportIntakes[support].value;
      }
      return total;
    },
    proceduresQuantity() {
      let procQt = 0;
      for (let specialty in this.Procedures) {
        procQt += this.Procedures[specialty].quantity;
      }
      return procQt;
    },
    examsQuantity() {
      let quantidade = 0;
      for (let clinic in this.report.clinics) {
        if (this.report.clinics[clinic].property !== true) {
          quantidade += this.report.clinics[clinic].quantidade;
        }
      }
      return quantidade;
    },
    totalExamsIntakes() {
      return this.report.intakesArray.reduce((sum, intake) => {
        let examsSum = 0;
        let discountPercentage = 0;
        if (intake.subTotal > 0) {
          discountPercentage = intake.discount / intake.subTotal;
        }
        if (intake.exams) {
          for (let exam of intake.exams) {
            if (exam.clinic.property !== true) {
              examsSum += exam.price - exam.price * discountPercentage;
            }
          }
        }
        return sum + examsSum;
      }, 0);
    },
    totalCostExamsIntakes() {
      return this.report.intakesArray.reduce((sum, intake) => {
        let examCost = 0;
        if (intake.exams) {
          for (let exam of intake.exams) {
            if (exam.clinic.property !== true) {
              examCost += parseFloat(exam.cost);
            }
          }
        }
        return sum + examCost;
      }, 0);
    },
    totalSpecialtiesIntakes() {
      let procQt = 0;
      for (let specialty in this.Procedures) {
        procQt += this.Procedures[specialty].price;
      }
      return procQt;
    },
    totalCostSpecialtiesIntakes() {
      let procQt = 0;
      for (let specialty in this.Procedures) {
        procQt += this.Procedures[specialty].cost;
      }
      return procQt;
    },
    totalOuttakesInMoney() {
      let total = 0;
      let moneyOuttakes = this.report.outtakes.filter(outtake => {
        return outtake.payment_method === "Dinheiro";
      });
      for (let outtake of moneyOuttakes) {
        total += parseFloat(outtake.value);
      }
      return total;
    },
    totalOuttakesNotMoney() {
      let total = 0;
      let moneyOuttakes = this.report.outtakes.filter(outtake => {
        return outtake.payment_method !== "Dinheiro";
      });
      for (let outtake of moneyOuttakes) {
        total += parseFloat(outtake.value);
      }
      return total;
    },
    totalRawIntake() {
      return this.report.intakesArray.reduce(
        (sum, intake) => sum + parseFloat(intake.total),
        0
      );
    },
    totalCredit() {
      return this.report.intakesArray.reduce((sum, intake) => {
        for (let payment in intake.payments) {
          if (intake.payments[payment] === "Crédito") {
            return sum + parseFloat(intake.valuesPayments[payment]);
          }
        }
        return sum + 0;
      }, 0);
    },
    totalTaxaCredit() {
      return this.report.intakesArray.reduce((sum, intake) => {
        for (let payment in intake.payments) {
          if (intake.payments[payment] === "Crédito") {
            if (intake.parcel[payment] === 1) {
              return (
                sum + (parseFloat(intake.valuesPayments[payment]) * 0.026) / 100
              );
            } else if (intake.parcel[payment] === 2) {
              return (
                sum +
                ((parseFloat(intake.valuesPayments[payment]) * 0.026) / 100 +
                  (parseFloat(intake.valuesPayments[payment]) * 0.0191) / 100)
              );
            } else if (intake.parcel[payment] === 3) {
              return (
                sum +
                ((parseFloat(intake.valuesPayments[payment]) * 0.026) / 100 +
                  (parseFloat(intake.valuesPayments[payment]) * 0.0254) / 100)
              );
            } else if (intake.parcel[payment] === 4) {
              return (
                sum +
                ((parseFloat(intake.valuesPayments[payment]) * 0.026) / 100 +
                  (parseFloat(intake.valuesPayments[payment]) * 0.0317) / 100)
              );
            } else if (intake.parcel[payment] === 5) {
              return (
                sum +
                ((parseFloat(intake.valuesPayments[payment]) * 0.026) / 100 +
                  (parseFloat(intake.valuesPayments[payment]) * 0.0378) / 100)
              );
            }
          }
        }
        return sum + 0;
      }, 0);
    },
    totalDebit() {
      return this.report.intakesArray.reduce((sum, intake) => {
        for (let payment in intake.payments) {
          if (
            intake.payments[payment] === "Débito" ||
            intake.payments[payment] === ""
          ) {
            return sum + parseFloat(intake.valuesPayments[payment]);
          }
        }
        return sum + 0;
      }, 0);
    },
    totalTaxaDebit() {
      return this.report.intakesArray.reduce((sum, intake) => {
        for (let payment in intake.payments) {
          if (intake.payments[payment] === "Débito") {
            return (
              sum + (parseFloat(intake.valuesPayments[payment]) * 0.0299) / 100
            );
          }
        }
        return sum + 0;
      }, 0);
    },
    totalMoney() {
      return this.report.intakesArray.reduce((sum, intake) => {
        for (let payment in intake.payments) {
          if (intake.payments[payment] === "Dinheiro") {
            return sum + parseFloat(intake.valuesPayments[payment]);
          }
        }
        return sum + 0;
      }, 0);
    },
    Procedures() {
      let procedures = {};
      procedures = Object.assign({}, this.report.specialties);
      for (let clinic in this.report.clinics) {
        if (this.report.clinics[clinic].property === true) {
          for (let exam in this.report.clinics[clinic].exams) {
            if (this.report.clinics[clinic].exams[exam].type !== "") {
              if (!procedures[this.report.clinics[clinic].exams[exam].type]) {
                procedures[this.report.clinics[clinic].exams[exam].type] = {
                  quantity: 0,
                  cost: 0,
                  price: 0
                };
              }
              procedures[
                this.report.clinics[clinic].exams[exam].type
              ].quantity += this.report.clinics[clinic].exams[exam].quantity;
              procedures[
                this.report.clinics[clinic].exams[exam].type
              ].cost += this.report.clinics[clinic].exams[exam].cost;
              procedures[
                this.report.clinics[clinic].exams[exam].type
              ].price += this.report.clinics[clinic].exams[exam].price;
            } else {
              if (!procedures[this.report.clinics[clinic].exams[exam].name]) {
                procedures[this.report.clinics[clinic].exams[exam].name] = {
                  quantity: 0,
                  cost: 0,
                  price: 0
                };
              }
              procedures[
                this.report.clinics[clinic].exams[exam].name
              ].quantity += this.report.clinics[clinic].exams[exam].quantity;
              procedures[
                this.report.clinics[clinic].exams[exam].name
              ].cost += this.report.clinics[clinic].exams[exam].cost;
              procedures[
                this.report.clinics[clinic].exams[exam].name
              ].price += this.report.clinics[clinic].exams[exam].price;
            }
          }
        }
      }
      return procedures;
    },
    QuantityTotalFinish() {
      return this.proceduresQuantity + this.examsQuantity;
    },
    CostTotalFinish() {
      return this.totalCostSpecialtiesIntakes + this.totalCostExamsIntakes;
    },
    PriceTotalFinish() {
      return this.totalSpecialtiesIntakes + this.totalExamsIntakes;
    }
  }
};
</script>

<style scoped>
.border {
  border: 1px solid grey;
}
</style>
