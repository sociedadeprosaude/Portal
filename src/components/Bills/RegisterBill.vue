<template>
  <v-container>
    <v-layout rpw wrap>
      <v-flex xs12>
        <v-card class="py-2 px-4">
          <v-layout row wrap>
            <v-flex xs12 class="text-left">
              <span class="my-headline">Adicionar conta à pagar</span>
              <v-dialog v-model="dialogCategory">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="primary" class="ml-2 py-0" dark v-bind="attrs" v-on="on">Categorias</v-btn>
                </template>
                <v-card>
                  <crudCategory />
                </v-card>
              </v-dialog>
            </v-flex>
            <v-flex xs12 sm3>
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
                  ></v-select>
                </template>
              </ApolloQuery>
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
            <v-spacer />
            <v-flex xs12 sm2 class="mx-3">
              <v-currency-field outlined v-model="value" />
            </v-flex>
            <v-flex xs12>
              <v-text-field outlined label="Descrição" v-model="description" />
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
                v-mask="mask.number"
              ></v-text-field>
            </v-flex>
            <v-spacer />
            <v-flex xs6>
              <v-checkbox
                color="success"
                class="font-weight-bold"
                label="Conta recorrente"
                v-model="recurrent"
              ></v-checkbox>
            </v-flex>
            <v-flex xs12 sm4>
              <span class="my-sub-headline">Data para pagamento</span>
              <v-date-picker locale="pt-br" v-model="dateToPay" />
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
                  <v-fade-transition>
                    <v-flex xs12 class="text-center" v-if="!uploading">
                      <v-btn class="primary" rounded @click="$refs.files.click()">Adicionar Anexo</v-btn>
                    </v-flex>
                    <v-flex xs12 class="text-center" v-else>
                      <v-progress-circular indeterminate class="primary--text" />
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
            <v-spacer />
          </v-layout>
        </v-card>
      </v-flex>
      <v-fade-transition>
        <v-flex xs12 class="text-right mt-4" v-if="!loading">
          <v-btn @click="bifurcation()" rounded class="primary">Adicionar</v-btn>
        </v-flex>
        <v-flex xs12 class="text-right" v-else>
          <v-progress-circular indeterminate class="primary--text" />
        </v-flex>
      </v-fade-transition>
    </v-layout>
  </v-container>
</template>
<script>
import crudCategory from "../../views/Financial/OuttakesCategories";
import { mask } from "vue-the-mask";
import moment from "moment";

export default {
  directives: {
    mask
  },
  components: {
    crudCategory
  },

  data: () => ({
    parcel: false,
    recurrent: false,
    parcels: null,
    unit: null,
    other: "Outro",
    selectedCategory: "",
    category: null,
    categoryArray: [null],
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
    },
    dialogCategory: false
  }),

  mounted() {
    this.initiate();
  },
  //testeNovoCategorias
  computed: {
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
      this.loading = false;
      this.selectedCategory =
        this.categories.length != 0 ? this.categories[0] : "";
    },

    async bifurcation() {
      if (this.parcel) {
        this.value = this.value / this.parcels;
        for (let i = 0; i < this.parcels; i++) {
          console.log('entrei' , this.parcels)
          await this.addBill(i - (this.parcels - 1));
          this.dateToPay = moment(this.dateToPay)
            .add(1, "months")
            .format("YYYY-MM-DD");
          console.log('i: ', i)
          console.log('parcels: ', this.parcels)
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
        date_to_pay: this.dateToPay,
        date: moment().format("YYYY-MM-DD HH:mm:ss"),
        colaborator: this.user,
        unit: this.unit.name !== this.other ? this.unit : null,
        recurrent: this.recurrent ? true : false
      };
      if(parseFloat(bill.value) > 0){
        bill.value = (parseFloat(bill.value) - (2 * parseFloat(bill.value)))
      }
      console.log('bill: ', bill)
      this.$apollo.mutate({
        mutation: require ('@/graphql/charge/CreateChargeBill.gql'),
        variables:{
          payment_methods: bill.payment_method,
          value: bill.value,
          date: bill.date,
          description: bill.description,
          date_to_pay: bill.date_to_pay,
          recurrent: bill.recurrent
        }
      }).then( (data) => {
        console.log('data: ', data)
        this.$apollo.mutate({
          mutation: require ('@/graphql/charge/AddRelationsChargeBillRelations.gql'),
          variables:{
            idColaborator: bill.colaborator.id,
            idUnit: bill.unit.id,
            idCharge: data.data.CreateCharge.id
          }
        })
        for(let i in bill.category){
          console.log('category', bill.category[i])
          this.$apollo.mutate({
            mutation: require ('@/graphql/charge/AddRelationsChargeBill-CategoryRelations.gql'),
            variables:{
              idCategory: bill.category[i].id,
              idCharge: data.data.CreateCharge.id
            }
          })
        }
      })
      console.log('parcels final: ', parcels)
      if(parcels === 0){
          this.resetData()
          this.loading = false;
          this.$emit('UpdateCharges')
      }
      /* if (this.files.length > 0) {
        bill.appends = await this.submitFiles(this.files);
      }
      await this.$store.dispatch("addOuttakes", bill);
      await this.$store.dispatch("getOuttakes");
      await this.$store.dispatch("getOuttakesPending", {
        finalDate: moment()
          .add(5, "days")
          .format("YYYY-MM-DD 23:59:59")
      });
      this.loading = false;*/
    },

    handleFileUpload() {
      this.uploading = true;
      let uploadedFiles = this.$refs.files.files;
      console.log(" files: ", this.$refs.files.files);
      for (let i = 0; i < uploadedFiles.length; i++) {
        if (this.files.indexOf(uploadedFiles[i]) < 0) {
          let index = this.files.push(uploadedFiles[i]);
          this.readFileUrl(uploadedFiles[i], index - 1);
        }
      }
      console.log("files final: ", this.files);
      setTimeout(() => (this.uploading = false), 2000);
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