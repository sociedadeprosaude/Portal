<template>
    <v-container>
        <v-layout rpw wrap>
            <v-flex xs12>
                <v-card class="py-2 px-4">
                    <v-layout row wrap>
                        <v-flex xs12 class="text-left">
                            <span class="my-headline">Adicionar conta à pagar</span>
                        </v-flex>
                        <v-flex xs12 sm3>
                            <v-combobox
                                    outlined
                                    @input.native="category={name:$event.srcElement.value,subCategories:[]}"
                                    v-model="category"
                                    :items="categories"
                                    item-text="name"
                                    return-object
                                    label="Categoria">
                            </v-combobox>
                            <v-combobox
                                    outlined
                                    v-if="category"
                                    label="Subcategoria"
                                    @input.native="subCategory=$event.srcElement.value"
                                    v-model="subCategory"
                                    :items="category.subCategories? [...category.subCategories,other]:[other]"
                                    item-text="name"
                                    return-object>
                            </v-combobox>
                        </v-flex>
                        <v-flex xs12 sm3 class="ml-3">
                            <v-select outlined
                                      label="Método de pagamento"
                                      v-model="paymentMethod"
                                      :items="paymentMethods">
                            </v-select>
                        </v-flex>
                        <v-flex xs12 sm3 class="ml-3">
                            <v-select
                                    outlined
                                    label="Unidade"
                                    v-model="unit"
                                    :items="units"
                                    item-text="name"
                                    return-object>
                            </v-select>
                        </v-flex>
                        <v-spacer />
                        <v-flex xs12 sm2 class="mx-3">
                            <v-currency-field outlined v-model="value"/>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field outlined label="Descrição" v-model="description"/>
                        </v-flex>
                        <v-flex xs1>
                            <v-checkbox
                                    color="success"
                                    class="font-weight-bold"
                                    label="Parcelar"
                                    v-model="parcel"
                            />
                        </v-flex>
                        <v-flex xs2>
                            <v-text-field
                                    hint="Quantidade de parcelas"
                                    persistent-hint
                                    class="ml-4 mt-4"
                                    outlined
                                    dense
                                    :disabled="!parcel"
                                    v-model="parcels"
                                    v-mask="mask.number">
                            </v-text-field>
                        </v-flex>
                        <v-spacer />
                        <v-flex xs6>
                            <v-checkbox
                                    color="success"
                                    class="font-weight-bold"
                                    label="Conta recorrente"
                                    v-model="recurrent">
                            </v-checkbox>
                        </v-flex>
                        <v-flex xs12 sm4>
                            <span class="my-sub-headline">Data para pagamento</span>
                            <v-date-picker locale="pt-br" v-model="dateToPay"/>
                        </v-flex>
                        <v-flex xs12 sm8>
                            <v-layout column wrap>
                                <v-flex xs12>
                                    <span class="my-sub-headline">Anexos</span>
                                </v-flex>
                                <v-flex xs12>
                                    <v-layout row wrap>
                                        <v-card class="pa-2 ma-2" v-for="(preview, i) in filesPreviews" :key="i">
                                            <v-btn
                                                    @click="removeFile(i)"
                                                    class="grey"
                                                    small
                                                    fab
                                                    text
                                                    style="position: absolute; right: 0;"
                                            >
                                                <v-icon>close</v-icon>
                                            </v-btn>
                                            <v-layout column wrap>
                                                <img style="max-height: 124px; max-width: 124px" :src="preview" />
                                                <span>{{files[i].name}}</span>
                                            </v-layout>
                                        </v-card>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs12>
                                    <v-btn class="primary" rounded @click="$refs.files.click()">Adicionar Anexo</v-btn>
                                </v-flex>
                                <label>
                                    <input
                                            v-show="false"
                                            type="file"
                                            id="files"
                                            ref="files"
                                            multiple
                                            v-on:change="handleFileUpload()"
                                    />
                                </label>
                            </v-layout>
                        </v-flex>
                        <v-spacer />
                    </v-layout>
                </v-card>
            </v-flex>
            <v-fade-transition>
                <v-flex xs12 class="text-right mt-4" v-if="!loading">
                    <v-btn @click="bifurcation()" rounded class="primary">Adicionar</v-btn>
                </v-flex>
                <v-flex xs12 class="text-right" v-else>
                    <v-progress-circular indeterminate class="primary--text"/>
                </v-flex>
            </v-fade-transition>
        </v-layout>
    </v-container>
</template>
<script>

    import { mask } from "vue-the-mask";
    import moment from "moment";

    export default {
        directives: {
            mask
        },

        data: () => ({
            parcel: false,
            recurrent: false,
            parcels: null,
            unit: null,
            other: "Outro",
            selectedCategory: "",
            category: null,
            subCategory: null,
            paymentMethod: undefined,
            description: undefined,
            value: 0.0,
            dateToPay: moment().format("YYYY-MM-DD"),
            paymentMethods: ["Boleto", "Transferência", "Dinheiro"],
            loading: false,
            files: [],
            filesPreviews: [],
            mask: {
                number: "###"
            }
        }),

        mounted () {
            this.initiate();
        },

        computed: {

            categories() {
                return this.$store.getters.outtakesCategories;
            },
            categoriesName() {
                return this.categories.map(e => e.name);
            },
            user() {
                return this.$store.getters.user;
            },
            units() {
                this.unit = this.selectedUnit;
                return [...this.$store.getters.units, { name: this.other }];
            },
            selectedUnit() {
                return this.$store.getters.selectedUnit;
            }
        },

        methods: {

            async initiate() {
                this.loading = true;
                await this.$store.dispatch("getOuttakesCategories");
                this.loading = false;
                this.selectedCategory =
                    this.categoriesName[0] != null ? this.categoriesName[0] : "";
            },
            async newSubcategory(category, newSubcategory) {
                if (
                    category.subCategories &&
                    category.subCategories.indexOf(newSubcategory) < 0 &&
                    newSubcategory !== this.other
                ) {
                    try {
                        await this.$store.dispatch("addOuttakeSubcategory", {
                            category: category,
                            newSubcategory
                        });
                        category.subCategories.push(newSubcategory);
                    } catch (e) {
                        console.log(e);
                    }
                }
            },


            async newCategory(category) {
                if (this.categoriesName.indexOf(category.name) < 0) {
                    await this.$store.dispatch("addOuttakesCategory", {
                        category: category.name
                    });
                }
            },
            async bifurcation() {
                if (this.parcels) {
                    this.value = this.value / this.parcels;
                    for (let i = 0; i < this.parcels; i++) {
                        this.addBill();
                        this.dateToPay = moment(this.dateToPay)
                            .add(1, "months")
                            .format("YYYY-MM-DD");
                    }
                } else {
                    this.addBill();
                }
            },
            async addBill() {
                this.loading = true;
                delete this.unit.exams;
                delete this.unit.specialties;

                let bill = {
                    category: this.category.name,
                    subCategory: this.subCategory,
                    payment_method: this.paymentMethod,
                    description: this.description,
                    value: this.value,
                    date_to_pay: this.dateToPay,
                    created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
                    colaborator: this.user,
                    unit: this.unit.name !== this.other ? this.unit : null,
                    recurrent: this.recurrent ? "true" : "false"
                };
                await this.newCategory(this.category);
                if (this.subCategory) {
                    await this.newSubcategory(this.category, this.subCategory);
                }
                if (this.files.length > 0) {
                    bill.appends = await this.submitFiles(this.files);
                }
                await this.$store.dispatch("addOuttakes", bill);
                await this.$store.dispatch("getOuttakes");
                await this.$store.dispatch("getOuttakesPending", {
                    finalDate: moment()
                        .add(5, "days")
                        .format("YYYY-MM-DD 23:59:59")
                });
                this.loading = false;
            },

            handleFileUpload() {
                let uploadedFiles = this.$refs.files.files;
                for (let i = 0; i < uploadedFiles.length; i++) {
                    if (this.files.indexOf(uploadedFiles[i]) < 0) {
                        let index = this.files.push(uploadedFiles[i]);
                        this.readFileUrl(uploadedFiles[i], index - 1);
                    }
                }
            },
            readFileUrl(file, index) {
                let self = this;
                let reader = new FileReader();
                reader.onload = function(e) {
                    self.filesPreviews[index] = e.target.result;
                    self.$forceUpdate();
                };
                reader.readAsDataURL(file);
            },
            removeFile(index) {
                this.files.splice(index, 1);
                this.filesPreviews.splice(index, 1);
            },
            async submitFiles(files) {
                return await this.$store.dispatch("uploadFileToStorage", {
                    files: files,
                    path: "/outtakes/orders"
                });
            },

        }
    }
</script>