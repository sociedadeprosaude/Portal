<template>
  <v-container v-if="budget" fluid class="fill-height ma-0 pa-0">
    <v-layout row wrap>
     <!--  <v-flex class="text-right white hidden-print-only mt-2" xs1>
            <v-btn @click="print('receipt')" class="transparent" text>
              <v-icon>print</v-icon>
            </v-btn>
          </v-flex> -->
      <v-flex sm12 xs12>

        <!-- <v-tabs class="receipt-to-print">
          <v-flex class="text-left white hidden-print-only mt-2" xs1>
            <v-btn @click="$emit('close')" class="transparent" text>
              <v-icon>close</v-icon>
            </v-btn>
          </v-flex>
          <v-tab>Recibo</v-tab>
          <v-tab :key=i v-for="(item, i) in examsPerClinic">{{ i }}</v-tab>
          <v-spacer/>
          <v-flex class="text-right white hidden-print-only mt-2" xs1>
            <v-btn @click="print()" class="transparent" text>
              <v-icon>print</v-icon>
            </v-btn>
          </v-flex>
          <v-tab-item class="receipt-to-print">
            
          </v-tab-item>
          <v-tab-item :key=i v-for="(item, i) in examsPerClinic">
            <attendance-guide :guide=item :id="budget.id" :ref="'guide-' + i"
                              class="receipt-to-print"/>
          </v-tab-item>
        </v-tabs> -->
        
        <div class="text-left" style="height: 60px; background-color: #fff">
          <v-row>
            <v-col cols="1">
              <v-btn @click="$emit('close')" class="transparent" text>
                <v-icon>close</v-icon>
              </v-btn>
            </v-col>

            <v-col cols="1">
              <v-btn text @click="showInvoice = true">
                Recibo
              </v-btn>
            </v-col>

            <v-col :key=i v-for="(item, i) in examsPerClinic">
              <v-btn text @click="showAttendanceGuide=item">
                {{i}}
              </v-btn>
            </v-col>

            <v-spacer></v-spacer>
            <v-col>
              <v-btn @click="print('receipt')" class="transparent" text>
                <v-icon>print</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </div>
        
        
        <v-card v-if="showInvoice" class="pa-10 receipt-to-print" flat id="receipt" ref="receipt">
              <v-layout class="align-center pa-4" row style="border: 2px solid #2196f3; border-radius: 16px"
                        wrap>
                <v-flex class="text-left" xs6>
                  <v-layout column wrap>
                    <span class="my-sub-headline primary--text"
                          style="font-size: 1.4em">{{ this.budget.user ? this.budget.user.name : this.patient.name }}</span>
                    <v-flex>
                      <span class="primary--text font-weight-bold">CPF: </span>
                      <span
                          class="font-weight-bold">{{ this.budget.user ? this.budget.user.cpf : this.patient.cpf }}</span>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex class="text-right" xs6>
                  <img :src="selectedUnit.logo" height="84px">
                </v-flex>
                <v-flex class="align-start pt-6" xs3>
                  <v-layout class="justify-start align-start" column wrap>
                    <span class="primary--text font-weight-bold">Recibo #</span>
                    <span class="primary--text font-weight-bold">Data</span>
                  </v-layout>
                </v-flex>
                <v-flex class="align-start pt-6" xs3>
                  <v-layout class="justify-start align-start" column wrap>
                    <span class="font-weight-bold">{{ this.budget.id }}</span>
                    <span class="font-weight-bold">{{ this.budget.date.formatted | dateFilter }}</span>
                  </v-layout>
                </v-flex>
                <v-flex class="mt-12 primary py-1 px-4" style="height: 32px" xs12>
                  <v-layout class="align-center" row wrap>
                    <v-flex class="text-left" xs2>
                      <span class="white--text font-weight-bold">Quantidade</span>
                    </v-flex>
                    <v-flex class="text-left" xs6>
                      <span class="white--text font-weight-bold">Descrição</span>
                    </v-flex>
                    <v-flex class="text-right" xs4>
                      <span class="white--text font-weight-bold">Valor</span>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex class="mt-2 py-1 px-4" xs12>
                  <v-layout class="align-center" row wrap :key="index"
                            v-for="(item, index) in items"
                  >
                    <v-flex class="text-center" xs2>
                      <span class="font-weight-bold">1</span>
                    </v-flex>
                    <v-flex class="text-left" xs6>
                      <span class="font-weight-bold">{{ item.name }}</span>
                    </v-flex>
                    <v-flex class="text-right" xs4>
                      <span class="font-weight-bold">{{
                          item.price.toLocaleString('en-us', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })
                        }}</span>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-row class=" mt-4 mr-4" v-if="!budget.payment_methods">
                  <v-col cols="12">
                    <v-row justify="end" class="mt-4 mr-4" :key="index"
                           v-for="(item, index) in budget.payments">
                                                    <span class="primary--text font-weight-bold pr-6"
                                                          style="font-size: 1.2em">{{ budget.payments[index] }} :</span>
                      <span v-if="budget.payments[index] === 'Crédito'"
                            class="font-weight-bold"> {{ budget.parcel[index] }} x {{
                          (parseFloat(budget.valuesPayments[index]) / parseFloat(budget.parcel[index])).toLocaleString('en-us', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })
                        }} </span>
                      <span v-else class="font-weight-bold"> {{
                          budget.valuesPayments[index].toLocaleString('en-us', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })
                        }} </span>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row class=" mt-4 mr-4" v-else>
                  <v-col cols="12">
                    <v-row justify="end" class="mt-4 mr-4" :key="index"
                           v-for="(item, index) in budget.payment_methods">
                                                    <span class="primary--text font-weight-bold pr-6"
                                                          style="font-size: 1.2em">{{ budget.payment_methods[index] }} :</span>
                      <span v-if="budget.payment_methods[index] === 'Crédito'"
                            class="font-weight-bold"> {{ budget.parcels[index] }} x {{
                          (parseFloat(budget.payments[index]) / parseFloat(budget.parcels[index])).toLocaleString('en-us', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })
                        }} </span>
                      <span v-else class="font-weight-bold"> {{
                          budget.payments[index].toLocaleString('en-us', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })
                        }} </span>
                    </v-row>
                  </v-col>
                </v-row>
                <v-flex class="text-right mt-4 mr-4" xs12>
                  <v-layout class="align-center" row wrap>
                    <v-flex class="text-right mt-4 mr-4" v-if="budget.discount > 0" xs12>
                                                                        <span
                                                                            class="primary--text font-weight-bold pr-6"
                                                                            style="font-size: 1.2em">SubTotal </span>
                      <span class="font-weight-bold">{{
                          budget.subTotal ? budget.subTotal.toLocaleString('en-us', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }) : (budget.value - budget.discount).toLocaleString('en-us', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })
                        }}</span>
                    </v-flex>
                    <v-flex class="text-right mr-4" v-if="budget.discount > 0" xs12>
                                                                        <span
                                                                            class="primary--text font-weight-bold pr-6"
                                                                            style="font-size: 1.2em">Desconto </span>
                      <span class="font-weight-bold">{{
                          budget.discount.toLocaleString('en-us', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })
                        }}</span>
                    </v-flex>
                    <v-flex class="text-right mr-4 mt-2" xs12>
                                                                        <span
                                                                            class="primary--text font-weight-bold pr-6"
                                                                            style="font-size: 1.2em">Total </span>
                      <span class="font-weight-bold">{{
                          budget.total ? budget.total.toLocaleString('en-us', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }) : budget.value.toLocaleString('en-us', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })
                        }}</span>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex class="text-left mt-12" xs6>
                  <v-layout class="primary--text" column wrap>
                    <span class="font-weight-bold">Medikon</span>
                    <span
                        v-if="selectedUnit.has_address"> {{ selectedUnit.has_address[0].street + ' ' + selectedUnit.has_address[0].number + ',' + selectedUnit.has_address[0].neighboor }}</span>
                    <span>Manaus - AM</span>
                    <span>CNPJ: 33.531.977/0001-94</span>
                  </v-layout>
                </v-flex>
                <v-flex class="primary" style="height: 2px; margin-top: 124px;" xs6></v-flex>
              </v-layout>
        </v-card>

        <attendance-guide v-if="showAttendanceGuide" :guide=showAttendanceGuide :id="budget.id" class="receipt-to-print"/>
    
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import AttendanceGuide from "./AttendanceGuide";
import moment from 'moment';

export default{
  name: "Receipt",
  props: ['budget'],
  data:()=>({
    showInvoice: true,
    showAttendanceGuide: undefined
  }),
  components: {
    AttendanceGuide
  },
  watch:{
    showAttendanceGuide(value){
      if(value){
        this.showInvoice = false;
      }
    },
    showInvoice(value){
      if(value){
        this.showAttendanceGuide = undefined;
      }
    }
  },
  computed: {
    patient() {
      return this.$store.getters.selectedPatient;
    },
    selectedUnit() {
      return this.$store.getters.selectedUnit
    },
    items() {
      if (this.budget.exams === undefined && this.budget.specialties !== undefined) {
        return this.budget.specialties
      }
      if (this.budget.specialties === undefined && this.budget.exams !== undefined) {
        return this.budget.exams
      }
      if (this.budget.specialties === undefined && this.budget.exams === undefined) {
        return this.budget.products
      }
      return this.budget.specialties.concat(this.budget.exams)
    },
    examsPerClinic() {
      let examsPerClinic = {};
      if (this.budget.exams) {
        for (let exam in this.budget.exams) {
          if (!examsPerClinic[this.budget.exams[exam].clinic.name]) {
            examsPerClinic[this.budget.exams[exam].clinic.name] = []
          }
          examsPerClinic[this.budget.exams[exam].clinic.name].push(this.budget.exams[exam])
        }
        return examsPerClinic
      } else if (this.budget.products) {
        for (let exam in this.budget.products) {
          this.budget.products[exam].name = this.budget.products[exam].with_product.name
          if (this.budget.products[exam].clinic) {
            if (!examsPerClinic[this.budget.products[exam].clinic.name]) {
              examsPerClinic[this.budget.products[exam].clinic.name] = []
            }
            examsPerClinic[this.budget.products[exam].clinic.name].push(this.budget.products[exam])
          }
        }
        return examsPerClinic
      }
      return examsPerClinic
    }
  },
  methods: {
    print() {
      window.print()
    },
    formartDate(date) {
      return moment(date).format('DD/MM/YYYY')
    },
  }
}
</script>
