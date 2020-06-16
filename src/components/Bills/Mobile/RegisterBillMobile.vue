<template>
    <v-card color="grey">
        <v-card-title class="primary" primary-title>
            <span style="color: white">Registro de Lançamentos</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="clear">
                <v-icon>close</v-icon>
            </v-btn>
        </v-card-title>

        <v-flex xs12 color="grey">
            <v-card color="grey">
                <v-layout row wrap class="align-center justify-center pa-3">
                    <v-flex xs12>
                        <v-select
                                label="Unidade"
                                v-model="unit"
                                :items="units"
                                item-text="name"
                                return-object>
                        </v-select>
                    </v-flex>
                    <v-flex xs12>
                        <v-currency-field label="Valor" prefix="R$" clearable v-model="value"/>
                    </v-flex>
                    <v-flex xs12>
                        <!--@input.native="category={name:$event.srcElement.value,subCategories:[]}"-->
                        <v-combobox
                                v-model="category"
                                :items="categories"
                                item-text="name"
                                return-object
                                label="Categoria"
                                clearable
                        ></v-combobox>
                        <!--@input.native="subCategory=$event.srcElement.value"-->
                        <v-combobox
                                v-if="category"
                                label="Subcategoria"
                                v-model="subCategory"
                                :items="category.subCategories? [...category.subCategories,other]:[other]"
                                item-text="name"
                                return-object
                                clearable
                        ></v-combobox>
                    </v-flex>
                    <v-flex xs12>
                        <v-textarea clearable label="Descrição" v-model="description"/>
                    </v-flex>
                    <v-flex xs12>
                        <v-select label="Método de pagamento"
                                  v-model="paymentMethod"
                                  :items="paymentMethods">
                        </v-select>
                    </v-flex>
                    <v-flex xs6>
                        <v-checkbox
                                color="success"
                                class="font-weight-bold"
                                label="Parcelar"
                                v-model="parcel"
                        />
                    </v-flex>
                    <v-flex xs6>
                        <v-text-field
                                hint="Quantidade de parcelas"
                                persistent-hint
                                dense
                                :disabled="!parcel"
                                v-model="parcels"
                                v-mask="mask.number">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-checkbox
                                color="success"
                                class="font-weight-bold"
                                label="Conta recorrente"
                                v-model="recurrent">
                        </v-checkbox>
                    </v-flex>

                    <v-flex xs12>
                        <v-menu
                                v-model="menu"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                        >
                            <template v-slot:activator="{ on }">
                                <v-text-field
                                        v-model="computedDateFormatted"
                                        label="Data para Pagamento"
                                        prepend-icon="event"
                                        readonly
                                        v-on="on"
                                ></v-text-field>
                            </template>
                            <v-date-picker locale="pt-br" v-model="dateToPay" @input="menu = false"></v-date-picker>
                        </v-menu>
                    </v-flex>

                    <v-flex xs12>
                        <v-layout column wrap>
                            <v-flex xs12>
                                <span class="my-sub-headline">Anexos</span>
                            </v-flex>
                            <v-flex xs12>
                                <v-layout row wrap class="align-center justify-center">
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
                                <v-fade-transition>
                                    <v-flex xs12 class="text-center" v-if="!uploading">
                                        <v-btn class="primary" rounded @click="$refs.files.click()">Adicionar Anexo</v-btn>
                                    </v-flex>
                                    <v-flex xs12 class="text-center" v-else>
                                        <v-progress-circular indeterminate class="primary--text"/>
                                    </v-flex>
                                </v-fade-transition>
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
                    <v-divider></v-divider>
                    <v-flex class="transparent"><span style="color: transparent">.</span></v-flex>
                    <v-spacer/>
                    <v-flex class="transparent"><span style="color: transparent">.</span></v-flex>
                    <v-spacer/>
                    <v-flex class="transparent"><span style="color: transparent">.</span></v-flex>
                    <v-spacer/>
                    <v-flex class="transparent"><span style="color: transparent">.</span></v-flex>
                    <v-fade-transition>
                        <v-flex xs12 class="text-center mt-4" v-if="!loading">
                            <v-btn @click="bifurcation()" fab class="success"><v-icon>add</v-icon></v-btn>
                        </v-flex>
                        <v-flex xs12 class="text-center" v-else>
                            <v-progress-circular indeterminate class="primary--text"/>
                        </v-flex>
                    </v-fade-transition>
                </v-layout>
            </v-card>
        </v-flex>
    </v-card>
</template>

<script>
    import { mask } from "vue-the-mask";
    import moment from "moment";
    export default {
        directives: {
            mask
        },
        data: () => ({
            menu: false,
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
            uploading: false,
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
            computedDateFormatted () {
                return this.formatDate(this.dateToPay)
            },
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
            formatDate (date) {
                if (!date) return null

                const [year, month, day] = date.split('-')
                return `${day}/${month}/${year}`
            },
            clear() {
                this.closeDialog()
            },
            closeDialog: function () {
                this.$emit('close-dialog')
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
                this.uploading = true
                let uploadedFiles = this.$refs.files.files;
                for (let i = 0; i < uploadedFiles.length; i++) {
                    if (this.files.indexOf(uploadedFiles[i]) < 0) {
                        let index = this.files.push(uploadedFiles[i]);
                        this.readFileUrl(uploadedFiles[i], index - 1);
                    }
                }
                setTimeout(() => (this.uploading = false), 2000)
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

<style scoped>
</style>