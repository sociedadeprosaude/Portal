<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-flex xs12>
                <v-card>
                    <v-layout row wrap class="pa-4">
                        <v-flex xs12 sm5>
                            <v-select
                                    label="Categoria"
                                    v-model="category"
                                    :items="categories"
                                    item-text="name"
                                    return-object
                                    outlined
                                    multiple
                                    append-outer-icon="add"
                                    @click:append-outer="addCategory = true"
                            />
                          
                        </v-flex>
                        <v-spacer/>
                        <v-flex xs12 sm6>
                            <v-currency-field
                                    label="valor"
                                    v-model="value"
                                    required
                                    outlined
                            />
                            <v-text-field
                                    label="Descrição"
                                    v-model="description"
                                    outlined
                            />
                        </v-flex>
                        <v-flex xs12 sm6>
                            <p class="my-sub-headline">Data para pagamento</p>
                            <v-date-picker locale="pt-br" v-model="dateToPay"/>
                        </v-flex>
                        <v-flex xs12 sm6>
                            <v-select
                                    label="Unidade"
                                    v-model="unit"
                                    :items="units"
                                    item-text="name"
                                    return-object
                                    outlined
                            />
                        </v-flex>
                    </v-layout>
                    <v-card-actions class="align-end justify-end">
                        <submit-button text="Enviar" :loading="loading" :success="success" @click="save()"/>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
        <v-dialog v-model="addCategory" width="500px" class="pa-7">
            <v-card>
                Adicionar Nova Categoria
                <v-text-field v-model="newCategory"/>
                <submit-button
                        text="Adicionar"
                        :loading="loading"
                        :success="success"
                        @click="saveNewCategory()">
                </submit-button>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<script>

    import moment from "moment";
    import SubmitButton from "../SubmitButton";


    export default {

        name: "RegisterOutflows",
        components: { SubmitButton },

        data: () => ({
            category: "",
            addCategory: false,
            newCategory: "",
            value: 0,
            description: "",
            unit: null,
            other: "OUTRO",
            dateToPay: moment().format("YYYY-MM-DD"),
            loading: false,
            success: false,
            date: moment().format("YYYY-MM-DD HH:mm:ss"),

        }),

        async mounted() {
            await this.$store.dispatch("getOuttakesCategories");
        },

        computed: {
            categories() {
                return this.$store.getters.outtakesCategories;
            },
       
            user() {
                return this.$store.getters.user;
            },
            units () {
                this.unit = this.selectedUnit;
                return [...this.$store.getters.units, { name: this.other }];
            },
            selectedUnit() {
                return this.$store.getters.selectedUnit;
            },
        },

        watch: {
            otherName: function(val) {
                this.unit.name = val;
            }
        },

        methods: {
            async saveNewCategory() {
                if (this.categories.indexOf(this.newCategory) < 0 && this.newCategory !== this.other){
                    await this.$store.dispatch("addOuttakesCategory", {
                        category: this.newCategory
                    });
                }

                await this.$store.dispatch("getOuttakesCategories");
                this.reset();
            },

            async reset (){

                this.success = true;
                this.loading = false;
                this.addCategory = false;
                this.newCategory = "";
                this.description = "";
                this.value = "";
                this.category = "";
            },

            save () {
                this.loading = true;
                delete this.unit.exams;
                delete this.unit.specialties;
                this.$store.dispatch("AddSaida", {
                    description: this.description,
                    category: this.category,
                    value: parseFloat(this.value),
                    date_to_pay: this.dateToPay,
                    created_at: this.date,
                    paid: this.date,
                    colaborator: this.user,
                    payment_method: "Dinheiro",
                    unit: this.unit.name !== this.other ? this.unit : null
                });
                this.reset();
            }
        }
    }
</script>