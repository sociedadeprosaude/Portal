<template>
  <v-container>
    
    <GeneralReport
      v-if="!loading && report"
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
      :totalCostSpecialtiesIntakes="totalCostSpecialtiesIntakes"
      :totalOuttakesInMoney="totalOuttakesInMoney"
      :totalOuttakesNotMoney="totalOuttakesNotMoney"
      :totalRawIntake="totalRawIntake"
      :totalCredit="totalCredit"
      :totalTaxaCredit="totalTaxaCredit"
      :totalDebit="totalDebit"
      :totalTaxaDebit="totalTaxaDebit"
      :totalMoney="totalMoney"
      :finalProfitAllClinics="finalProfitAllClinics"
      :totalProfitAllClinics="totalProfitAllClinics"
      :totalCostAllClinics="totalCostAllClinics"
      :totalFinancialSupportAllClinics="totalFinancialSupportAllClinics"
      :proceduresQuantityAllClinics="proceduresQuantityAllClinics"
      :examsQuantityAllClinics="examsQuantityAllClinics"
      :totalExamsIntakesAllClinics="totalExamsIntakesAllClinics"
      :totalCostExamsIntakesAllClinics="totalCostExamsIntakesAllClinics"
      :totalSpecialtiesIntakesAllClinics="totalSpecialtiesIntakesAllClinics"
      :totalCostSpecialtiesIntakesAllClinics="totalCostSpecialtiesIntakesAllClinics"
      :totalOuttakesInMoneyAllClinics="totalOuttakesInMoneyAllClinics"
      :totalOuttakesNotMoneyAllClinics="totalOuttakesNotMoneyAllClinics"
      :totalRawIntakeAllClinics="totalRawIntakeAllClinics"
      :totalCreditAllClinics="totalCreditAllClinics"
      :totalTaxaCreditAllClinics="totalTaxaCreditAllClinics"
      :totalDebitAllClinics="totalDebitAllClinics"
      :totalTaxaDebitAllClinics="totalTaxaDebitAllClinics"
      :totalMoneyAllClinics="totalMoneyAllClinics"
      @change-reportSelected="(value)=>reportSelected=value"
    />
    <v-progress-circular v-else indeterminate size="64"></v-progress-circular>
  </v-container>
</template>

<script>
import GeneralReport from "@/components/Reports2/GeneralReport";
import moment from "moment";
export default {
  components: { GeneralReport },
  props: ["report", "loading", "reportAllUnits"],
  data() {
    return {
      now: moment().format("YYYY-MM-DD HH:mm:ss"),
      total: 0,
      reportOptions: [
        "Relatório Geral",
        "Relatório Geral Detalhado",
        "Relatório Geral de Todas Unidades",
        "Relatório Geral de Todas Unidades Detalhado"
      ],
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
      for (let specialty in this.report.specialties) {
        procQt += this.report.specialties[specialty].quantity;
      }
      return procQt;
    },
    examsQuantity() {
      let quantity = 0;
      for (let clinic in this.report.clinics) {
        quantity += this.report.clinics[clinic].quantity;
      }
      return quantity;
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
            examsSum += exam.price - exam.price * discountPercentage;
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
            examCost += parseFloat(exam.cost);
          }
        }
        return sum + examCost;
      }, 0);
    },
    totalSpecialtiesIntakes() {
      return this.report.intakesArray.reduce((sum, intake) => {
        let specialtiesSum = 0;
        let discountPercentage = 0;
        if (intake.subTotal > 0) {
          discountPercentage = intake.discount / intake.subTotal;
        }
        if (intake.specialties) {
          for (let spec of intake.specialties) {
            specialtiesSum += spec.price - spec.price * discountPercentage;
          }
        }
        return sum + specialtiesSum;
      }, 0);
    },
    totalCostSpecialtiesIntakes() {
      return this.report.intakesArray.reduce((sum, intake) => {
        let specialtiesCost = 0;
        if (intake.specialties) {
          for (let spec of intake.specialties) {
            specialtiesCost += parseFloat(spec.cost);
          }
        }
        return sum + specialtiesCost;
      }, 0);
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
    finalProfitAllClinics() {
      return (
        parseFloat(this.totalProfitAllClinics) -
        parseFloat(this.totalCostAllClinics)
      ).toFixed(2);
    },
    totalProfitAllClinics() {
      return (
        parseFloat(this.totalSpecialtiesIntakesAllClinics) +
        parseFloat(this.totalExamsIntakesAllClinics) +
        parseFloat(this.totalFinancialSupportAllClinics)
      );
    },
    totalCostAllClinics() {
      return (
        parseFloat(this.totalCostSpecialtiesIntakesAllClinics) +
        parseFloat(this.totalCostExamsIntakesAllClinics) +
        parseFloat(this.totalTaxaDebitAllClinics) +
        parseFloat(this.totalTaxaCreditAllClinics) +
        parseFloat(this.totalOuttakesInMoneyAllClinics) +
        parseFloat(this.totalOuttakesNotMoneyAllClinics)
      );
    },
    totalFinancialSupportAllClinics() {
      let total = 0;
      for (let support in this.report.financialSupportIntakes) {
        total += this.reportAllUnits.financialSupportIntakes[support].value;
      }
      return total;
    },
    proceduresQuantityAllClinics() {
      let procQt = 0;
      for (let specialty in this.reportAllUnits.specialties) {
        procQt += this.reportAllUnits.specialties[specialty].quantity;
      }
      return procQt;
    },
    examsQuantityAllClinics() {
      let quantity = 0;
      for (let clinic in this.reportAllUnits.clinics) {
        quantity += this.reportAllUnits.clinics[clinic].quantity;
      }
      return quantity;
    },
    totalExamsIntakesAllClinics() {
      return this.reportAllUnits.intakesArray.reduce((sum, intake) => {
        let examsSum = 0;
        let discountPercentage = 0;
        if (intake.subTotal > 0) {
          discountPercentage = intake.discount / intake.subTotal;
        }
        if (intake.exams) {
          for (let exam of intake.exams) {
            examsSum += exam.price - exam.price * discountPercentage;
          }
        }
        return sum + examsSum;
      }, 0);
    },
    totalCostExamsIntakesAllClinics() {
      return this.reportAllUnits.intakesArray.reduce((sum, intake) => {
        let examCost = 0;
        if (intake.exams) {
          for (let exam of intake.exams) {
            examCost += parseFloat(exam.cost);
          }
        }
        return sum + examCost;
      }, 0);
    },
    totalSpecialtiesIntakesAllClinics() {
      return this.reportAllUnits.intakesArray.reduce((sum, intake) => {
        let specialtiesSum = 0;
        let discountPercentage = 0;
        if (intake.subTotal > 0) {
          discountPercentage = intake.discount / intake.subTotal;
        }
        if (intake.specialties) {
          for (let spec of intake.specialties) {
            specialtiesSum += spec.price - spec.price * discountPercentage;
          }
        }
        return sum + specialtiesSum;
      }, 0);
    },
    totalCostSpecialtiesIntakesAllClinics() {
      return this.reportAllUnits.intakesArray.reduce((sum, intake) => {
        let specialtiesCost = 0;
        if (intake.specialties) {
          for (let spec of intake.specialties) {
            specialtiesCost += parseFloat(spec.cost);
          }
        }
        return sum + specialtiesCost;
      }, 0);
    },
    totalOuttakesInMoneyAllClinics() {
      let total = 0;
      let moneyOuttakes = this.reportAllUnits.outtakes.filter(outtake => {
        return outtake.payment_method === "Dinheiro";
      });
      for (let outtake of moneyOuttakes) {
        total += parseFloat(outtake.value);
      }
      return total;
    },
    totalOuttakesNotMoneyAllClinics() {
      let total = 0;
      let moneyOuttakes = this.reportAllUnits.outtakes.filter(outtake => {
        return outtake.payment_method !== "Dinheiro";
      });
      for (let outtake of moneyOuttakes) {
        total += parseFloat(outtake.value);
      }
      return total;
    },
    totalRawIntakeAllClinics() {
      return this.reportAllUnits.intakesArray.reduce(
        (sum, intake) => sum + parseFloat(intake.total),
        0
      );
    },
    totalCreditAllClinics() {
      return this.reportAllUnits.intakesArray.reduce((sum, intake) => {
        for (let payment in intake.payments) {
          if (intake.payments[payment] === "Crédito") {
            return sum + parseFloat(intake.valuesPayments[payment]);
          }
        }
        return sum + 0;
      }, 0);
    },
    totalTaxaCreditAllClinics() {
      return this.reportAllUnits.intakesArray.reduce((sum, intake) => {
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
    totalDebitAllClinics() {
      return this.reportAllUnits.intakesArray.reduce((sum, intake) => {
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
    totalTaxaDebitAllClinics() {
      return this.reportAllUnits.intakesArray.reduce((sum, intake) => {
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
    totalMoneyAllClinics() {
      return this.reportAllUnits.intakesArray.reduce((sum, intake) => {
        for (let payment in intake.payments) {
          if (intake.payments[payment] === "Dinheiro") {
            return sum + parseFloat(intake.valuesPayments[payment]);
          }
        }
        return sum + 0;
      }, 0);
    }
  }
};
</script>
