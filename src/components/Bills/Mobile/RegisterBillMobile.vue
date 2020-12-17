<template>
    <v-container class="fill-height grey_light2 align-start mt-n3 mt-sm-1 justify-center" fluid>
        <v-flex xs12 md7 class="grey_light2">
            <div class="mt-0">
                <v-layout row wrap class="align-center justify-start pa-3">
                    <v-flex xs12>
                        <v-select label="Unidade" v-model="unit" :items="units" item-text="name" outlined dense
                                  return-object
                                  class="primary--text"/>
                    </v-flex>
                    <v-flex xs12 class="mt-n3">
                        <ApolloQuery
                                :query="require('@/graphql/category/LoadCategories.gql')"
                        >
                            <template slot-scope="{ result: { data } }">
                                <v-select
                                        outlined
                                        v-model="category"
                                        :items="data ? data.Category : []"
                                        item-text="name"
                                        return-object
                                        label="Categoria"
                                        multiple
                                        dense
                                        clearable
                                />
                            </template>
                        </ApolloQuery>
                    </v-flex>
                    <v-flex xs12 class="mt-n3">
                        <v-textarea clearable label="Descrição" v-model="description" outlined dense/>
                    </v-flex>
                    <v-flex xs12 class="mt-n3">
                        <v-currency-field label="Valor" prefix="R$" clearable v-model="value" outlined dense/>
                    </v-flex>
                    <v-spacer/>
                    <v-flex xs12 class="mt-n3">
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
                if (this.parcel) {
                    this.value = this.value / this.parcels;
                    for (let i = 0; i < this.parcels; i++) {
                        await this.addBill(i - (this.parcels - 1));
                        this.dateToPay = moment(this.dateToPay)
                            .add(1, "months")
                            .format("YYYY-MM-DD");

                    }

                } else {
                    await this.addBill(0);

                }
            },
            async addBill(parcels) {
                this.loading = true;
                delete this.unit.exams;
                delete this.unit.specialties;

                let bill = {
                    category: this.category,
                    payment_method: this.paymentMethod,
                    description: this.description,
                    value: this.value,
                    date_to_pay: moment(this.date_to_pay).format('YYYY-MM-DDTHH:mm'),
                    date: moment().format('YYYY-MM-DDTHH:mm'),
                    colaborator: this.user,
                    unit: this.unit.name !== this.other ? this.unit : null,
                    recurrent: this.recurrent ? true : false
                };
                if (parseFloat(bill.value) > 0) {
                    bill.value = (parseFloat(bill.value) - (2 * parseFloat(bill.value)))
                }
                let charge = ''
                await this.$apollo.mutate({
                    mutation: require('@/graphql/charge/CreateChargeBill.gql'),
                    variables: {
                        payment_methods: bill.payment_method,
                        value: bill.value,
                        date: bill.date,
                        description: bill.description,
                        date_to_pay: bill.date_to_pay,
                        recurrent: bill.recurrent,
                        type: 'bill'
                    }
                }).then((data) => {
                    charge = data.data.CreateCharge;
                    this.$apollo.mutate({
                        mutation: require('@/graphql/charge/AddRelationsChargeBillRelations.gql'),
                        variables: {
                            idColaborator: bill.colaborator.id,
                            idUnit: bill.unit.id,
                            idCharge: data.data.CreateCharge.id
                        }
                    });
                    for (let i in bill.category) {
                        this.$apollo.mutate({
                            mutation: require('@/graphql/charge/AddRelationsChargeBill-CategoryRelations.gql'),
                            variables: {
                                idCategory: bill.category[i].id,
                                idCharge: data.data.CreateCharge.id
                            }
                        })
                    }
                });

                if (parcels === 0) {
                    this.resetData();
                    this.loading = false;
                    this.$emit('UpdateCharges')
                }
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
            },
            async resetData() {
                this.category = null;
                this.paymentMethod = undefined;
                this.value = 0.0;
                this.description = undefined;
                this.parcel = false;
                this.parcels = null;
                this.recurrent = false;
                this.dateToPay = moment().format("YYYY-MM-DD");
            }
        }
    };
</script>

<style scoped>
</style>