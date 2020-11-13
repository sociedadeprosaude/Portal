<template>
    <v-container>
        <v-flex xs12>
            <v-card class="pa-3">
                <v-card-title class="justify-center">
                    <v-col cols="4">
                        <v-text-field v-bind:value="idealProfitPercentage"
                                      @change="(event)=>$emit('change-idealProfitPercentage',event)"
                                      placeholder="Porcentagem ideal de lucro"
                                      dense
                                      outlined
                                      type="number"
                                      prefix="%"

                        />
                        <v-btn class="primary mt-n10" rounded @click="beginAnalises" small>Iniciar Análise</v-btn>
                    </v-col>
                    <v-progress-circular v-if="allLoaded" class="primary--text" indeterminate/>
                </v-card-title>
                <v-card-text>
                    <v-flex xs12>
                        <v-layout row wrap>
                            <v-chip-group
                                    row
                                    mandatory
                                    v-bind:value="selectedType"
                                    @change="(event)=>$emit('change-selectedType',event)"
                                    active-class="primary--text">
                                <v-chip v-for="type in types" :key="type" @click="changeSelectType(type)">{{ type }}
                                </v-chip>
                            </v-chip-group>
                            <v-spacer/>
                            <v-chip-group
                                    row
                                    mandatory
                                    v-bind:value="showOption"
                                    @change="(event)=>$emit('change-showOption',event)"
                                    active-class="primary--text"
                            >
                                <v-chip v-for="type in showOptions" :key="type">{{ type }}</v-chip>
                            </v-chip-group>
                        </v-layout>
                    </v-flex>
                    <ApolloQuery :query="require('@/graphql/clinics/LoadCostExamClinics.gql')">
                        <template slot-scope="{ result: { data } }" >
                            <v-card class="background">
                                <v-card-title class="justify-center">
                                    <v-flex xs5>
                                        <v-progress-linear
                                                v-if="!data"
                                                color="primary"
                                                indeterminate
                                                rounded
                                                height="6"
                                        />
                                        <v-text-field
                                                v-else
                                                rounded
                                                dense
                                                prepend-inner-icon="search"
                                                solo
                                                v-model="search"
                                                @keyup="CostProductClinicFilter('', selectedType,true)"
                                        />
                                    </v-flex>
                                </v-card-title>
                                <v-flex xs12 v-if="data">
                                    <v-flex xs12 id="card-to-print" v-if="selectedType === 0">
                                        <v-card flat>
                                            <v-layout row wrap class="blue_grey">
                                                <v-flex xs3>
                                                    <h4>Clínica</h4>
                                                </v-flex>
                                                <v-flex xs4>Exames</v-flex>
                                                <v-flex xs5>
                                                    <v-layout row wrap>
                                                        <v-flex xs2>Custo</v-flex>
                                                        <v-flex xs2>Preço</v-flex>
                                                        <v-flex xs3>Custo Ideal</v-flex>
                                                        <v-flex xs3>Preço Ideal</v-flex>
                                                        <v-flex xs2>Lucro</v-flex>
                                                    </v-layout>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout row wrap>
                                                <v-flex xs12>
                                                    <v-layout
                                                            row
                                                            wrap
                                                            class="align-center py-2"
                                                            v-for="product in CostProductClinicFilter(data, selectedType,search)"
                                                            :key="product.id"
                                                    >

                                                        <v-flex xs3>{{product.with_clinic[0].name}}</v-flex>
                                                        <v-flex xs4>
                                                            <span>{{product.with_product[0].name}}</span>
                                                        </v-flex>
                                                        <v-flex xs5>
                                                            <v-layout row wrap class="justify-center align-center">
                                                                <v-flex xs2>
                                                                    <span>{{product.cost}}</span>
                                                                </v-flex>
                                                                <v-flex xs2 v-if="!editingPrice">
                                                                    <span @click="editingProduct(product)">{{product.with_product[0].price}}</span>
                                                                </v-flex>
                                                                <v-flex xs3 v-if="!editingPrice">
                                                                    <span>{{getIdealCost(product)}}</span>
                                                                </v-flex>
                                                                <v-flex xs5 v-else-if="loadingEditing">
                                                                    <v-progress-linear class="primary" indeterminate/>
                                                                </v-flex>
                                                                <v-flex xs5 v-else-if="!loadingEditing && editingPrice"
                                                                        class="justify-center">
                                                                    <v-text-field
                                                                                  v-show="selectedProduct === product"
                                                                                  solo
                                                                                  outlined
                                                                                  dense
                                                                                  append-outer-icon="done"
                                                                                  type="number"
                                                                                  @click:append-outer="editingPrice = false"

                                                                    />
                                                                </v-flex>
                                                                <v-flex xs3>
                                                                    <span>{{getIdealPrice(product)}}</span>
                                                                </v-flex>
                                                                <v-flex xs2>
                                                            <span :class="[getProfitPercentage(product) < idealProfitPercentage / 100 ? 'red--text' : '']">
                                                              {{(getProfitPercentage(product) * 100).toFixed(2)}}%
                                                            </span>
                                                                </v-flex>
                                                            </v-layout>
                                                        </v-flex>
                                                    </v-layout>
                                                </v-flex>
                                            </v-layout>
                                        </v-card>
                                    </v-flex>
                                    <v-flex xs12 id="card-to-print" v-else>
                                        <v-card flat>
                                            <v-layout row wrap class="blue_grey">
                                                <v-flex xs4>
                                                    <h4>Exames</h4>
                                                </v-flex>
                                                <v-flex xs3>Clínica</v-flex>
                                                <v-flex xs5>
                                                    <v-layout row wrap>
                                                        <v-flex xs2>Custo</v-flex>
                                                        <v-flex xs2>Preço</v-flex>
                                                        <v-flex xs3>Custo Ideal</v-flex>
                                                        <v-flex xs3>Preço Ideal</v-flex>
                                                        <v-flex xs2>Lucro</v-flex>
                                                    </v-layout>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout row wrap>

                                                <v-flex xs12>
                                                    <v-layout
                                                            row
                                                            wrap
                                                            class="align-center py-2"
                                                            v-for="product in CostProductClinicFilter(data, selectedType,search)"
                                                            :key="product.id"
                                                    >

                                                        <v-flex xs4>
                                                            <span>{{product.with_product[0].name}}</span>
                                                        </v-flex>
                                                        <v-flex xs3>{{product.with_clinic[0].name}}</v-flex>
                                                        <v-flex xs5>
                                                            <v-layout row wrap class="justify-center align-center">
                                                                <v-flex xs2>
                                                                    <span>{{product.cost}}</span>
                                                                </v-flex>
                                                                <v-flex xs2 v-if="!editingPrice">
                                                                    <span @click="editingProduct(product)">{{product.with_product[0].price}}</span>
                                                                </v-flex>
                                                                <v-flex xs3 v-if="!editingPrice">
                                                                    <span>{{getIdealCost(product)}}</span>
                                                                </v-flex>
                                                                <v-flex xs5 v-else-if="loadingEditing">
                                                                    <v-progress-linear class="primary" indeterminate/>
                                                                </v-flex>
                                                                <v-flex xs5 v-else-if="!loadingEditing && editingPrice" class="justify-center">
                                                                    <v-text-field
                                                                            v-show="selectedProduct === product"
                                                                            solo
                                                                            outlined
                                                                            dense
                                                                            append-outer-icon="done"
                                                                            type="number"
                                                                            @click:append-outer="editingPrice = false"

                                                                    />
                                                                </v-flex>
                                                                <v-flex xs3>
                                                                    <span>{{getIdealPrice(product)}}</span>
                                                                </v-flex>
                                                                <v-flex xs2>
                                                            <span :class="[getProfitPercentage(product) < idealProfitPercentage / 100 ? 'red--text' : '']">
                                                              {{(getProfitPercentage(product) * 100).toFixed(2)}}%
                                                            </span>
                                                                </v-flex>
                                                            </v-layout>
                                                        </v-flex>
                                                    </v-layout>
                                                </v-flex>
                                            </v-layout>
                                        </v-card>
                                    </v-flex>
                                </v-flex>
                            </v-card>
                        </template>
                    </ApolloQuery>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-container>
</template>

<script>
    export default {
        props: [
            "loading",
            "idealProfitPercentage",
            "selectedType",
            "types",
            "showOptions",
            "showOption",
            "exams",
            "clinics",
            "allLoaded",
            "filterExams",
            "filterClinics",
            "getClinicExams",
            "beginAnalises",
            "turnClinicsInExams",
            "getIdealCost",
            "getIdealPrice",
            "getProfitPercentage"
        ],
        data() {
            return {
                editingPrice: false,
                loadingEditing: false,
                selectedProduct: null,
                search: '',
                type: null,
                CostProductClinicObject: {}
            }
        },
        mounted() {

        },
        methods: {
            async editingProduct(product) {
                this.loadingEditing = true;
                this.selectedProduct = product;
                this.editingPrice = true;
                this.loadingEditing = false;
            },
            CostProductClinicFilter(data, type,filter) {
              if(filter.length !== 0){
                if(type === 0){
                  return this.CostProductClinicObject.filter(e => e.with_clinic[0].name.includes(this.search.toUpperCase()))
                }
                else{
                  return this.CostProductClinicObject.filter(e => e.with_product[0].name.includes(this.search.toUpperCase()))
                }
              }
              else {
                if (this.type === type) {
                  return this.CostProductClinicObject
                } else {

                  if (this.selectedType === 0) {
                    this.type = type;
                    this.CostProductClinicObject = data.CostProductClinic.filter(e => e.with_clinic[0].name.includes(this.search.toUpperCase())).sort(function (a, b) {
                      if (a.with_clinic[0].name > b.with_clinic[0].name) {
                        return 1
                      }
                      if (a.with_clinic[0].name < b.with_clinic[0].name) {
                        return -1
                      }
                      return 0
                    });
                    return this.CostProductClinicObject

                  } else {
                    this.type = type;
                    this.CostProductClinicObject = data.CostProductClinic.filter(e => e.with_product[0].name.includes(this.search.toUpperCase())).sort(function (a, b) {
                      if (a.with_product[0].name > b.with_product[0].name) {
                        return 1
                      }
                      if (a.with_product[0].name < b.with_product[0].name) {
                        return -1
                      }
                      return 0
                    });
                    return this.CostProductClinicObject
                  }
                }
              }
                this.type = type;
                return data.CostProductClinic
            },
            changeSelectType(type) {
                this.CostProductClinic = this.CostProductClinicFilter(data)
            },

        }

    };
</script>

<style scoped>
</style>
