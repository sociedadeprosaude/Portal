<template>
    <v-container>
        <v-row cols="12" class="ml-1 mb-2">
            <v-chip-group

                    row
                    mandatory
                    v-bind:value="optionSelected"
                    @change="(event)=>$emit('change-optionSelected',event)"
                    active-class="primary--text"
            >
                <v-chip v-for="option in options" :key="option" small>{{ option }}</v-chip>
            </v-chip-group>
        </v-row>
        <v-card id="card-to-print" flat style="border: 10px solid #F5F5F5; background-color: #F5F5F5">
            <v-card-title>
                <v-text-field
                        v-bind:value="search"
                        @input="(event)=>$emit('change-search',event)"
                        append-icon="mdi-magnify"
                        placeholder="Procurar"
                        single-line
                        rounded
                        filled
                        dense
                        hide-details
                />
                <v-spacer/>
                <span class="float-right" style="font-size: 12px; font-style: italic">{{date }} 00:00:00 até {{date2}} 23:59:59</span>
            </v-card-title>
            <div v-if="optionSelected === 0">
                <v-data-table
                        :headers="headers"
                        :search="search"
                        :items="ExamsFormatArray"
                        :sort-by="['quantity']"
                        :sort-desc="[true]"
                        item-key="name"
                        no-data-text="Sem exames no intervalo escolhido"
                        :footer-props="{
      itemsPerPageText:'Exames por página',
      pageText:'{0}-{1} de {2}'
    }"
                >
                </v-data-table>
            </div>
            <div v-else>
                <TableExamsAndClinics :intakesDividedByExam="intakesDividedByExam" :search="search"/>
            </div>
        </v-card>

        <v-card class="mt-5">
            <v-container>
                <v-row>
                    <v-col>
                        <v-card class="primary align-center text-center pt-4" style="height: 100px; border-radius: 10px" flat>
                            <span class="my-headline white--text">{{numSales}}</span>
                            <br/>
                            <span class="background--text">Total de exames vendidos</span>
                        </v-card>
                    </v-col>
                    <v-col>
                        <v-card class="primary align-center text-center pt-4" style="height: 100px; border-radius: 10px" flat>
                            <span class="my-headline white--text">R$ {{totalCost.toFixed(2)}}</span>
                            <br/>
                            <span class="background--text">Custo total dos exames</span>
                        </v-card>
                    </v-col>
                    <v-col>
                        <v-card class="primary align-center text-center pt-4" style="height: 100px; border-radius: 10px" flat>
                            <span class="my-headline white--text">R$ {{totalPrice.toFixed(2)}}</span>
                            <br/>
                            <span class="background--text">Preço de venda total dos exames</span>
                        </v-card>
                    </v-col>
                    <v-col>
                        <v-card class="primary align-center text-center pt-4" style="height: 100px; border-radius: 10px" flat>
                            <span class="my-headline white--text">R$ {{totalProfit.toFixed(2)}}</span>
                            <br/>
                            <span class="background--text">Lucro liquido total</span>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </v-container>
</template>

<script>
    import TableExamsAndClinics from "@/components/Reports/TableExamsAndClinics";

    export default {
        components: {TableExamsAndClinics},
        props: [
            "date",
            "date2",
            "search",
            "now",
            "total",
            "options",
            "optionSelected",
            "headers",
            "calcIntakeFromExam",
            "ExamsFormatArray",
            "exams",
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