<template>
    <v-container class="fill-height grey_light2 align-start mt-n3">
        <v-flex xs12 class="grey_light2">
            <div class="mt-0">
                <v-layout row wrap class="align-center justify-start pa-3">
                    <v-flex xs12>
                        <v-select label="Unidade" v-model="unit" :items="units" item-text="name" outlined dense
                                  return-object
                                  class="primary--text"/>
                    </v-flex>
                    <v-flex xs12 class="mt-n3">
                        <v-combobox
                                v-model="category"
                                :items="categories"
                                item-text="name"
                                return-object
                                label="Categoria"
                                clearable
                                multiple
                                outlined
                                dense
                        />
                    </v-flex>
                    <v-flex xs12 class="mt-n3">
                        <v-textarea clearable label="Descrição" v-model="description" outlined dense/>
                    </v-flex>
                    <v-flex xs4 class="mt-n3">
                        <v-currency-field label="Valor" prefix="R$" clearable v-model="value" outlined dense/>
                    </v-flex>
                    <v-spacer/>
                    <v-flex xs7 class="mt-n3">
                        <v-select label="Método de pagamento" v-model="paymentMethod" :items="paymentMethods" dense
                                  outlined/>
                    </v-flex>
                    <v-flex xs12 class="mt-n3">
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
                                        label="Data para pagamento"
                                        dense
                                        outlined
                                        readonly
                                        v-on="on"
                                />
                            </template>
                            <v-date-picker locale="pt-br" v-model="dateToPay" @input="menu = false"/>
                        </v-menu>
                    </v-flex>

                    <v-flex xs6 class="mt-n4">
                        <v-checkbox color="success" class="font-weight-bold" label="Parcelar" v-model="parcel"/>
                    </v-flex>
                    <v-flex xs6 v-show="parcel" class="mt-n3">
                        <v-text-field
                                hint="Quantidade de parcelas"
                                persistent-hint
                                dense
                                outlined
                                :disabled="!parcel"
                                v-model="parcels"
                                v-mask="mask.number"
                        />
                    </v-flex>
                    <v-flex xs12 class="mt-n8">
                        <v-checkbox
                                color="success"
                                class="font-weight-bold"
                                label="Conta recorrente"
                                v-model="recurrent"
                        />
                    </v-flex>

                    <v-flex xs12 class="mt-n2">
                        <v-layout column wrap>
                            <v-flex xs12 class="text-start">
                                <span class="font-weight-bold" style="font-size: medium">Anexos</span>
                                <v-btn class="primary ml-2" fab x-small @click="$refs.files.click()" v-if="!uploading">
                                    <v-icon>add</v-icon>
                                </v-btn>
                                <v-progress-circular v-else indeterminate class="primary--text ml-2"/>
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
                                            <img style="max-height: 124px; max-width: 124px" :src="preview"/>
                                            <span>{{files[i].name}}</span>
                                        </v-layout>
                                    </v-card>
                                </v-layout>
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
                    <v-divider/>
                    <v-fade-transition>
                        <v-flex xs12 class="text-end mt-4" v-if="!loading">
                            <v-btn @click="bifurcation()" fab class="success">
                                <v-icon>done</v-icon>
                            </v-btn>
                        </v-flex>
                        <v-flex xs12 class="text-center" v-else>
                            <v-progress-circular indeterminate class="primary--text"/>
                        </v-flex>
                    </v-fade-transition>
                </v-layout>
            </div>
        </v-flex>
    </v-container>
</template>

<script>
    import {mask} from "vue-the-mask";
    import moment from "moment";

    export default {
        directives: {
            mask
        },
        name: "register-bill-mobile",
        data: () => ({
            menu: false,
            parcel: false,
            recurrent: false,
            parcels: null,
            unit: null,
            other: "Outro",
            selectedCategory: "",
            category: null,
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
        mounted() {
            this.initiate();
        },
        computed: {
            computedDateFormatted() {
                return this.formatDate(this.dateToPay);
            },
            categories() {
                return this.$store.getters.outtakesCategories;
            },

            user() {
                return this.$store.getters.user;
            },
            units() {
                this.unit = this.selectedUnit;
                return [...this.$store.getters.units, {name: this.other}];
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
                    this.categories[0] != null ? this.categories[0] : "";
            },
            formatDate(date) {
                if (!date) return null;

                const [year, month, day] = date.split("-");
                return `${day}/${month}/${year}`;
            },
            clear() {
                this.closeDialog();
            },
            closeDialog: function () {
                this.$emit("close-dialog");
            },

            async newCategory(categories) {
                categories.forEach(async category => {
                    if (this.categories.indexOf(category) < 0) {
                        await this.$store.dispatch("addOuttakesCategory", {
                            category: category
                        });
                    }
                });
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
                    category: this.category,
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
                this.uploading = true;
                let uploadedFiles = this.$refs.files.files;
                for (let i = 0; i < uploadedFiles.length; i++) {
                    if (this.files.indexOf(uploadedFiles[i]) < 0) {
                        let index = this.files.push(uploadedFiles[i]);
                        this.readFileUrl(uploadedFiles[i], index - 1);
                    }
                }
                setTimeout(() => (this.uploading = false), 2000);
            },
            readFileUrl(file, index) {
                let self = this;
                let reader = new FileReader();
                reader.onload = function (e) {
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
            }
        }
    };
</script>

<style scoped>
</style>