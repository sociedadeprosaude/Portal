<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card class="py-2 px-4">
          <v-layout row wrap>
            <v-flex xs12 class="text-left">
              <span class="my-headline">Adicionar conta à pagar</span>
            </v-flex>

            <v-flex xs12 sm3>
              <v-combobox outlined v-model="category" :items="categories" label="Categoria"></v-combobox>
            </v-flex>

            <v-flex xs12 sm3 class="ml-3">
              <v-select
                outlined
                label="Método de pagamento"
                v-model="paymentMethod"
                :items="paymentMethods"
              ></v-select>
            </v-flex>
            <v-flex xs12 sm3 class="ml-3">
              <v-select
                outlined
                label="Unidade"
                v-model="unit"
                :items="units"
                item-text="name"
                return-object
              ></v-select>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex xs12 sm2 class="mx-3">
              <v-currency-field outlined v-model="value"></v-currency-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field outlined label="Descrição" v-model="description"></v-text-field>
            </v-flex>
            <v-flex xs12 sm4>
              <span class="my-sub-headline">Data para pagamento</span>
              <v-date-picker locale="pt-br" v-model="dateToPay"></v-date-picker>
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

              <!--                            <button v-on:click="submitFile()">Submit</button>-->
            </v-flex>
            <v-spacer></v-spacer>
            <!--                        <v-flex xs12 sm7 class="mt-6">-->
            <!--                            <v-layout row wrap v-if="paymentMethod === paymentMethods[0]">-->
            <!--                                <v-flex xs12>-->
            <!--                                    <v-text-field-->
            <!--                                            outlined-->
            <!--                                            label="Número do boleto"></v-text-field>-->
            <!--                                </v-flex>-->
            <!--                            </v-layout>-->
            <!--                            <v-layout row wrap v-if="paymentMethod === paymentMethods[1]">-->
            <!--                                <v-flex xs12>-->
            <!--                                    <v-text-field-->
            <!--                                            outlined-->
            <!--                                            label="Número do boleto"></v-text-field>-->
            <!--                                </v-flex>-->
            <!--                            </v-layout>-->
            <!--                        </v-flex>-->
          </v-layout>
        </v-card>
      </v-flex>
      <v-fade-transition>
        <v-flex xs12 class="text-right mt-4" v-if="!loading">
          <v-btn @click="addBill()" rounded class="primary">Adicionar</v-btn>
        </v-flex>
        <v-flex xs12 class="text-right" v-else>
          <v-progress-circular indeterminate class="primary--text"></v-progress-circular>
        </v-flex>
      </v-fade-transition>

      <v-flex xs12 class="text-left mt-6">
        <span class="my-headline">Contas à pagar</span>
      </v-flex>
      <v-flex xs12>
        <outtake-order :outtakes="pendingOuttakes"></outtake-order>
      </v-flex>
      <v-flex xs12 class="text-left mt-6">
        <span class="my-headline">Contas pagas</span>
      </v-flex>
      <v-flex xs12 class="mt-4">
        <v-card class="pa-4 my-4" v-for="bill in paidOuttakes" :key="bill.id">
          <v-layout row wrap>
            <v-flex xs12>
              <v-layout row wrap>
                <span>{{bill.category}}</span>
                <v-divider vertical class="mx-4"></v-divider>
                <span>{{bill.payment_method}}</span>
                <v-divider vertical class="mx-4"></v-divider>
                <span class="font-weight-bold">{{bill.date_to_pay | dateFilter}}</span>
                <v-divider vertical class="mx-4"></v-divider>
                <span class="font-weight-bold">{{bill.paid | dateFilter}}</span>
                <v-divider vertical class="mx-4"></v-divider>
                <v-spacer></v-spacer>
                <span class="font-weight-bold">R$ {{bill.value}}</span>
                <v-flex xs12>
                  <span>{{bill.description}}</span>
                </v-flex>
                <v-flex xs12 sm10 class="mt-4">
                  <v-layout row wrap>
                    <v-layout column wrap>
                      <span class="my-sub-headline mb-4">Anexos</span>
                      <v-layout row wrap>
                        <v-flex v-for="(append, i) in bill.appends" :key="i">
                          <v-card @click="openAppend(append)" flat>
                            <img :src="append" style="max-width: 124px; max-width: 124px" />
                          </v-card>
                        </v-flex>
                      </v-layout>
                    </v-layout>
                    <v-divider vertical></v-divider>
                    <v-layout column wrap>
                      <span class="my-sub-headline mb-4">Comprovante</span>
                      <v-layout row wrap v-if="!loading">
                        <v-flex v-for="(append, i) in bill.receipts" :key="i">
                          <v-card @click="openAppend(append)" flat>
                            <img :src="append" style="max-width: 124px; max-width: 124px" />
                          </v-card>
                        </v-flex>
                      </v-layout>
                      <v-flex xs12 sm2 class="text-right" v-else>
                        <v-progress-circular indeterminate class="primary--text"></v-progress-circular>
                      </v-flex>
                    </v-layout>
                  </v-layout>
                </v-flex>
                <v-flex xs12 class="text-right" v-if="!loading">
                  <!--                                    <v-btn @click="deleteOuttake(bill)" class="error mx-2" fab small>-->
                  <!--                                        <v-icon>delete</v-icon>-->
                  <!--                                    </v-btn>-->
                  <v-btn @click="unpayOuttake(bill)" class="error mx-2" fab small>
                    <v-icon>money_off</v-icon>
                  </v-btn>
                </v-flex>
                <v-flex xs12 class="text-right" v-else>
                  <v-progress-circular indeterminate class="primary--text"></v-progress-circular>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import OuttakeOrder from "../components/OuttakeOrder";
import moment from "moment";

export default {
  name: "Bills",
  components: {
    OuttakeOrder
  },
  data() {
    return {
      unit: null,
      other: "OUTRO",
      category: undefined,
      paymentMethod: undefined,
      description: undefined,
      value: 0.0,
      dateToPay: moment().format("YYYY-MM-DD"),
      paymentMethods: ["Boleto", "Transferência", "Dinheiro"],
      loading: false,
      files: [],
      filesPreviews: []
    };
  },
  mounted() {
    this.initiate();
  },
  computed: {
    outtakes() {
      return this.$store.getters.outtakes;
    },
    paidOuttakes() {
      return this.outtakes
        .filter(outtake => {
          return outtake.paid;
        })
        .sort((a, b) => {
          return b.date_to_pay > a.date_to_pay ? 1 : -1;
        });
    },
    pendingOuttakes() {
      return this.outtakes
        .filter(outtake => {
          return !outtake.paid;
        })
        .sort((a, b) => {
          return b.date_to_pay < a.date_to_pay ? 1 : -1;
        });
    },
    categories() {
      return this.$store.getters.outtakesCategories;
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
      await this.$store.dispatch("getOuttakes");
      this.loading = false;
    },
    async addBill() {
      this.loading = true;
      // Deletando esses dois campos se tiverem pra não salvar dados desnecessários no banco
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
        unit: this.unit.name != this.other ? this.unit : null
      };
      if (this.categories.indexOf(this.category) < 0) {
        await this.$store.dispatch("addOuttakesCategory", this.category);
      }
      if (this.files.length > 0) {
        let urls = await this.submitFiles(this.files);
        bill.appends = urls;
      }
      await this.$store.dispatch("addOuttakes", bill);
      await this.$store.dispatch("getOuttakes");
      this.loading = false;
    },
    async unpayOuttake(outtake) {
      this.loading = true;
      await this.$store.dispatch("updateOuttake", {
        outtake: outtake,
        field: "paid",
        value: "delete"
      });
      await this.$store.dispatch("getOuttakes");
      this.loading = false;
    },

    handleFileUpload() {
      let uploadedFiles = this.$refs.files.files;

      for (var i = 0; i < uploadedFiles.length; i++) {
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
    openAppend(append) {
      window.open(append);
    }
  }
};
</script>

<!--<style scoped>-->
<!--    input[type="file"]{-->
<!--        position: absolute;-->
<!--        top: -500px;-->
<!--    }-->
<!--</style>-->
