<template>
    <v-data-table
            :search="search"
            :headers="headers"
            :items="intakesDividedBySpecialtiesAndClinic"
            :sort-by="['quantity']"
            :sort-desc="[true]"
            item-key="specialtieName"
            show-expand
            single-expand
            :footer-props="{
      itemsPerPageText:'Consultas por página',
      pageText:'{0}-{1} de {2}'
    }"
    >
        <template v-slot:item.totalPrice="{ item }">R$ {{item.totalPrice}}</template>
        <template v-slot:item.totalCost="{ item }">R$ {{item.totalCost}}</template>
        <template v-slot:item.profit="{ item }">R$ {{item.profit}}</template>

        <template v-slot:expanded-item="{ item }">
            <td :colspan="headers.length+1">
                <v-data-table
                        class="subTable"
                        show-expand
                        single-expand
                        :headers="subHeaders"
                        :items="item.clinics"
                        item-key="clinicName"
                        hide-default-footer
                >
                    <template v-slot:item.totalPrice="{ item }">R$ {{item.totalPrice}}</template>
                    <template v-slot:item.totalCost="{ item }">R$ {{item.totalCost}}</template>
                    <template v-slot:expanded-item="{ item }">
                        <td :colspan="subHeaders.length+1">
                            <v-data-table
                                class="subTable"
                                dense
                                single-expand
                                :headers="triHeaders"
                                :items="item.intakes"
                                item-key="intakeId"
                                hide-default-footer
                            >
                                <template v-slot:item.price="{ item }">R$ {{item.price}}</template>
                                <template v-slot:item.cost="{ item }">R$ {{item.cost}}</template>
                            </v-data-table>
                        </td>
                    </template>
                </v-data-table>
            </td>
        </template>
    </v-data-table>
</template>


<script>
    import moment from "moment";
    export default {
        name: "TableConsultationClinics",
        props: ["intakesDividedBySpecialties", "search"],
        data() {
            return {
                headers: [
                    {
                        text: "CONSULTAS",
                        align: "start",
                        sortable: false,
                        value: "specialtieName"
                    },
                    { text: "QUANTIDADE VENDIDA", value: "quantity", align: "center" },
                    { text: "CUSTO TOTAL", value: "totalCost", align: "center" },
                    { text: "VENDA TOTAL", value: "totalPrice", align: "center" },
                    { text: "LUCRO LÍQUIDO", value: "profit" }
                ],
                subHeaders: [
                    { text: "Clínica", value: "clinicName" },
                    {
                        text: "Quantidade enviada para clinica",
                        value: "quantity",
                        align: "center"
                    },
                    { text: "Custo", value: "totalCost", align: "center" },
                    { text: "Venda", value: "totalPrice", align: "center" },
                ],
                triHeaders: [
                    {
                        text: "Código",
                        align: "start",
                        sortable: false,
                        value: "idIntake"
                    },
                    { text: "Custo", value: "cost", align: "center" },
                    { text: "Venda", value: "price", align: "center" },
                    { text: "Médico", value: "doctorName"},
                ]
            };
        },
        methods: {
            calcIntakeFromSpecialties (clinicName, listIntakes) {
                const sumCost = listIntakes.reduce((sum, e) => sum + e.cost, 0);
                const sumPrice = listIntakes.reduce((sum, e) => sum + e.price, 0);
                return {
                    clinicName: clinicName,
                    totalCost: sumCost,
                    totalPrice: sumPrice,
                    quantity: listIntakes.length,
                    intakes: listIntakes,
                    profit: sumPrice - sumCost
                };
            },
            calcIntakeFromClinic(specialtieName, listClinics) {
                const sumCost = listClinics.reduce((sum, e) => sum + e.totalCost, 0);
                const sumPrice = listClinics.reduce((sum, e) => sum + e.totalPrice, 0);
                const sumSales = listClinics.reduce((sum, e) => sum + e.quantity, 0);
                return {
                    specialtieName: specialtieName,
                    totalCost: sumCost,
                    totalPrice: sumPrice,
                    quantity: sumSales,
                    clinics: listClinics,
                    profit: sumPrice - sumCost
                };
            }
        },
        computed: {
            clinics() {
                return this.$store.getters.clinics;
            },
            intakesDividedBySpecialtiesAndClinic() {
                let listIntakes = [];
                this.intakesDividedBySpecialties.forEach(specialtie => {
                    let listConsultationGroupedByClinic = [];
                    this.clinics.forEach(clinic => {
                        let listIntakeFromClinic = specialtie.intakes.filter(
                            intake => intake.clinicName === clinic.name
                        );
                        if (listIntakeFromClinic.length !== 0)
                            listConsultationGroupedByClinic.push(
                                this.calcIntakeFromSpecialties(clinic.name, listIntakeFromClinic)
                            );
                    });
                    if (listConsultationGroupedByClinic.length !== 0)
                        listIntakes.push(
                            this.calcIntakeFromClinic(specialtie.name, listConsultationGroupedByClinic)
                        );
                });
                return listIntakes;
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
