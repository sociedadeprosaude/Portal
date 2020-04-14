<template>
  <v-container class="ma-0 pa-0">
    <v-row>
      <v-col sm="12" md="8">
        <v-layout
          row
          wrap
          style="width:100%"
          class="align-center justify-center py-0"
          v-for="(outtakesGroup, i) in outtakesByDate(accont)"
          :key="i"
        >

          <v-container fluid grid-list-sm class="py-0 my-3 mx-2">
            <v-row>
              <v-col>
                <v-card class="pa-4 my-4" v-for="(bill) in accont" :key="bill.name">
                  <v-layout row wrap>
                    <v-flex xs12 class="my-2">
                      <v-layout row wrap>
                        <span>{{bill.name}}</span>
                        <v-divider vertical class="mx-4"/>
                        <span>{{bill.paymentDayFormat}}</span>
                        <v-divider vertical class="mx-4"/>
                        <v-spacer/>
                        <v-flex xs12>
                          <span class="font-italic">{{bill.description}}</span>
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
                            <v-divider vertical/>
                            <v-layout column wrap>
                              <span class="my-sub-headline mb-4">Comprovante</span>
                              <v-flex xs12 sm2 class="text-right" v-if="loadingAnexo && outtakeSelect === bill">
                                <v-progress-circular indeterminate class="primary--text"/>
                              </v-flex>
                              <v-layout row wrap v-else>
                                <v-flex v-for="(append, i) in bill.receipts" :key="i">
                                  <v-card @click="openAppend(append)" flat>
                                    <img :src="append" style="max-width: 124px; max-width: 124px" />
                                  </v-card>
                                </v-flex>
                              </v-layout>
                            </v-layout>
                          </v-layout>
                        </v-flex>
                        <v-flex xs12 sm2 class="text-right" v-if="loading && outtakeSelect === bill">
                          <v-progress-circular indeterminate class="primary--text"/>
                        </v-flex>
                        <v-flex xs12 class="text-right"  v-else>
                          <v-btn @click="$refs[bill.id][0].click()" class="primary mx-2" fab small>
                            <v-icon>receipt</v-icon>
                          </v-btn>
                          <v-btn @click="deleteOuttake(bill)" class="error mx-2" fab small>
                            <v-icon>delete</v-icon>
                          </v-btn>
                          <v-btn @click="payOuttake(bill)" class="success mx-2" fab small
                                 placeholder="Complemento"
                          >
                            <v-icon>attach_money</v-icon>
                          </v-btn>
                        </v-flex>
                      </v-layout>
                      <input
                        v-show="false"
                        type="file"
                        :id="bill.id"
                        :ref="bill.id"
                        multiple
                        v-on:change="handleFileUpload(bill)"
                      />
                    </v-flex>
                  </v-layout>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-layout>
      </v-col>
      <v-col sm="12" md="4" order-sm="first" order-md="last">
        <v-date-picker
          full-width
          class="mx-4 sticky"
          v-model="date"
          :allowed-dates="allowedDates"
          locale="pt-br">
        </v-date-picker>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import moment from "moment";
export default {
  name: "ClinicsPaymentOrder",
  props: ["accont"],
  data() {
    return {
      isEditing: false,
      loading: false,
      loadingAnexo: false,
      outtakeSelect: [],
      date: moment().format("YYYY-MM-DD"),
      files: [],
      options: {
        duration: 500,
        offset: 15,
        easing: "easeInQuint"
      },
      semanaOptions: [
        "Domingo",
        "Segunda-feira",
        "Terça-feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-feira",
        "Sábado"
      ]
    };
  },
  watch: {
    date(val) {
      this.$vuetify.goTo("#group-" + val, this.options);
    }
  },
  methods: {
    allowedDates(val) {
      return (
        Object.keys(this.outtakesByDate(this.outtakes)).indexOf(val) !== -1
      );
    },
    daydate(date) {
      var dateMoment = moment(date);
      return this.semanaOptions[dateMoment.day()];
    },
    outtakesByDate(outtakes) {
      let res = {};
      for (let outtake in outtakes) {
        let targetDate = outtakes[outtake].date_to_pay.split(" ")[0];
        if (!res[targetDate]) {
          res[targetDate] = [];
        }
        res[targetDate].push(outtakes[outtake]);
      }
      return res;
    },
    async editBillValue (bill) {
      if (!this.isEditing) {

        console.log(bill);
        await this.$store.dispatch("editOuttakes", bill);
        await this.$store.dispatch("getOuttakes");
        this.loading = false;

      }

    },
    distanceToToday(date) {
      let now = moment();
      return moment(date, "YYYY-MM-DD").diff(now, "days");
    },
    async payOuttake(outtake) {
      this.loading = true;
      console.log(' outtake select :', this.outtakeSelect);
      this.outtakeSelect= outtake;
      console.log(' outtake select before:', this.outtakeSelect);
      await this.$store.dispatch("updateOuttake", {
        outtake: outtake,
        field: "paid",
        value: moment().format("YYYY-MM-DD HH:mm:ss")
      });

      if (outtake.recurrent === 'true') {
        console.log('pagamento:', outtake.date_to_pay)
        console.log('outtakes', outtake)
        let bill = {
          category: outtake.category,
          subCategory: outtake.subCategoria,
          payment_method: outtake.payment_method,
          description: outtake.description,
          value: outtake.value,
          date_to_pay: moment(outtake.date_to_pay).add(1, 'months').format('YYYY-MM-DD'),
          created_at: outtake.created_at,
          colaborator: outtake.colaborator,
          unit:outtake.unit,
          recurrent: 'true',
        };
        console.log('pagamento:', outtake.date_to_pay);

        await this.$store.dispatch("addOuttakes", bill);
      }
      this.outtakeSelect= []
      await this.$store.dispatch("getOuttakes");
      this.loading = false;
    },
    async deleteOuttake(outtake) {
      this.loading = true;
      await this.$store.dispatch("deleteOuttake", outtake);
      await this.$store.dispatch("getOuttakes");
      this.loading = false;
    },
    async handleFileUpload(outtake) {
      this.loadingAnexo = true;
      this.outtakeSelect= outtake;
      await this.$store.dispatch("deleteFile", {
        imagePaths: outtake.receipts,
        path: "outtakes/receipts"
      });
      let uploadedFiles = this.$refs[outtake.id][0].files;

      for (var i = 0; i < uploadedFiles.length; i++) {
        if (this.files.indexOf(uploadedFiles[i]) < 0) {
          this.files.push(uploadedFiles[i]);
          // this.readFileUrl(uploadedFiles[i], index - 1)
        }
      }
      let urls = await this.submitFiles(this.files);
      await this.$store.dispatch("updateOuttake", {
        outtake: outtake,
        field: "receipts",
        value: urls
      });
      await this.$store.dispatch("getOuttakes");
      this.loadingAnexo = false;
      this.outtakeSelect= [];

    },
    // readFileUrl(file, index) {
    //     let self = this
    //     let reader = new FileReader();
    //     reader.onload = function (e) {
    //         self.filesPreviews[index] = e.target.result
    //         self.$forceUpdate()
    //     }
    //     reader.readAsDataURL(file);
    // },
    removeFile(index) {
      this.files.splice(index, 1);
      this.filesPreviews.splice(index, 1);
    },
    async submitFiles(files) {
      return await this.$store.dispatch("uploadFileToStorage", {
        files: files,
        path: "/outtakes/receipts"
      });
    },
    openAppend(append) {
      window.open(append);
    }
  }
};
</script>

<style scoped>
.sticky {
  top: 100px;
  position: sticky;
  position: -webkit-sticky;
  z-index: 1;
}
</style>
