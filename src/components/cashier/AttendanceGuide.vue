<template>
  <v-container v-if="guide" fluid class="fill-height ma-0 pa-0">
    <v-layout row wrap>
      <v-flex>
        <v-card flat class="pa-10" style="page-break-before: always !important; display: block">
          <v-layout
            row
            wrap
            class="align-center pa-4"
            style="border: 2px solid #2196f3; border-radius: 16px"
          >
            <v-flex xs6 class="text-left">
              <img :src="selectedUnit.logo" height="50px" class="ml-0 px-0 mr-0 pa-0" />
            </v-flex>
            <v-flex xs6 class="text-right">
              <img :src="QrCode" class="ml-0 px-0 mr-0 pa-0" />
            </v-flex>
            <v-flex xs6 class="text-left">
              <v-layout column wrap v-for="(item, index) in [items[0]]" :key="index">
                <span
                  class="my-sub-headline primary--text"
                  style="font-size: 1.4em"
                >{{item.clinic.name}}</span>
                <v-flex>
                  <span class="primary--text font-weight-bold">CNPJ:</span>
                  <span class="font-weight-bold">{{item.clinic.cnpj}}</span>
                </v-flex>
                <v-flex>
                  <v-layout column wrap class="primary--text">
                    <span
                        v-if="item.clinic.has_address[0]"
                      class="font-weight-bold"
                    >{{item.clinic.has_address[0].street}}, {{item.clinic.has_address[0].number}}, {{item.clinic.has_address[0].neighboor}}, {{item.clinic.has_address[0].cep}}</span>
                    <span
                      v-if="item.clinic.has_address[0] && item.clinic.has_address[0].complement"
                    >Complemento: {{item.clinic.has_address[0].complement}}</span>
                    <span v-if="item.clinic.has_address[0]">{{item.clinic.has_address[0].city}} - {{item.clinic.has_address[0].state}}</span>
                    <br />
                    <span class="font-weight-bold">
                      Contato.:
                      <v-icon>call</v-icon>
                      {{item.clinic.telephone[0]}}
                    </span>
                    <br />
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs4 class="text-right">
              <v-layout
                column
                wrap
                class="primary--text justify-start align-start"
                v-for="(item, index) in [items[0]]"
                :key="index"
              >
                <span class="font-weight-bold">Dias e Horarios de Funcionamento:</span>
                <span>
                  <v-icon>event</v-icon>
                  Segunda-Feira: {{item.clinic.opening_hours[0]}}
                </span>
                <span>
                  <v-icon>event</v-icon>
                  Terça-Feira: {{item.clinic.opening_hours[1]}}
                </span>
                <span>
                  <v-icon>event</v-icon>
                  Quarta-Feira: {{item.clinic.opening_hours[2]}}
                </span>
                <span>
                  <v-icon>event</v-icon>
                  Quinta-Feira: {{item.clinic.opening_hours[3]}}
                </span>
                <span>
                  <v-icon>event</v-icon>
                  Sexta-Feira: {{item.clinic.opening_hours[4]}}
                </span>
                <span>
                  <v-icon>event</v-icon>
                  Sábado: {{item.clinic.opening_hours[5]}}
                </span>
              </v-layout>
            </v-flex> *
            <v-flex xs2 class="align-text-top text-right">
              <v-layout column wrap>
                  <span class="primary--text font-weight-bold align-text-top">
                  Recibo: {{this.id}}
                </span>
                <span v-for="(item,index) in 6" v-bind:key="index" class="white--text">
                  .
                </span>
              </v-layout>
            </v-flex>
            <v-flex v-if="patient && patient.dependents && patient.dependents.length > 0" xs5 class="my-0 py-0  d-print-none">
                <v-select
                        :items="patient.dependents"
                        v-model="selectedDependent"
                        class="my-0 py-0"
                        prepend-icon="person"
                        dense
                        return-object
                        item-text="name"
                        label="Selecionar dependente?"
                        outlined
                        chips
                        color="blue"
                        hide-details
                        clearable
                >
                  <template v-slot:selection="data">
                    <v-chip
                            :key="JSON.stringify(data.item)"
                            :input-value="data.selected"
                            :disabled="data.disabled"
                            class="v-chip--select-multi"
                            @click.stop="data.parent.selectedIndex = data.index"
                            @input="data.parent.selectItem(data.item)"
                            text-color="white"
                            color="info"
                    >{{ data.item.name }}</v-chip>
                  </template>
                </v-select>
            </v-flex>
            <v-flex xs7></v-flex>
            <v-flex xs6 class="align-start pt-6">
              <v-layout column wrap class="justify-start align-start">
                <span class="primary--text font-weight-bold">Paciente:</span>
                <span v-if="!selectedDependent" class="primary--text font-weight-bold">Número do Associado:</span>
                <span class="primary--text font-weight-bold">Data de Nascimento:</span>
              </v-layout>
            </v-flex>
            <v-flex xs6 class="align-start pt-6">

                  <v-layout column wrap class="justify-start align-start">
                    <span class="font-weight-bold">{{selectedDependent ? selectedDependent.name : patient.name}}</span>
                    <span v-if="!selectedDependent" class="font-weight-bold">{{patient.association_number}}</span>
                    <span class="font-weight-bold">{{selectedDependent ? selectedDependent.birth_date :patient.birth_date | dateFilter}}</span>
                  </v-layout>

            </v-flex>

            <v-flex class="white" style="color: white">.</v-flex>

            <v-flex xs12 class="mx-0 my-0">
              <template>
                <v-simple-table dense class="elevation-3 mx-0 my-0">
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="primary text-left white--text">EXAME</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in items" :key="index">
                        <td class="primary--text" style="text-align: justify">{{ item.name }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </template>
            </v-flex>

            <v-flex xs6 class="text-left mt-12">
              <v-layout column wrap class="primary--text">
                <span class="font-weight-bold">Instituto Pró Saúde do Amazonas</span>
                <span v-if="selectedUnit.has_address"> {{selectedUnit.has_address[0].street + ' ' + selectedUnit.has_address[0].number +  ',' +  selectedUnit.has_address[0].neighboor}}</span>
                <span>Manaus - AM</span>
                <span>CNPJ: 09.066.632/0001-22</span>
              </v-layout>
            </v-flex>
            <v-flex xs6 class="primary" style="height: 2px; margin-top: 124px;"></v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "attendanceGuide",
  props: ["guide","id"],
  computed: {
    items() {
      console.log('items: ', this.guide)
      return this.guide;
    },
    selectedUnit() {
      console.log('unit: ', this.$store.getters.selectedUnit)
      return this.$store.getters.selectedUnit;
    },
    QrCode(){
      let initApi = "https://api.qrserver.com/v1/create-qr-code/?data="
      let finApi = "&size=100x100"
      console.log('api: ', initApi + this.id + finApi)
      return initApi + this.id + finApi
    },
    patient() {
      return this.$store.getters.selectedPatient;
    }
  },
  data: () => ({
      selectedDependent:undefined
  }),
  methods: {
    print() {
      window.print();
    }
  }
};
</script>
