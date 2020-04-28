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
            <v-flex xs12 class="text-center">
              <img :src="selectedUnit.logo" height="50px" class="ml-0 px-0 mr-0 pa-0" />
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
                      class="font-weight-bold"
                    >{{item.clinic.address.street}}, {{item.clinic.address.number}}, {{item.clinic.address.neighboor}}, {{item.clinic.address.cep}}</span>
                    <span
                      v-if="item.clinic.address.complement"
                    >Complemento: {{item.clinic.address.complement}}</span>
                    <span>{{item.clinic.address.city}} - {{item.clinic.address.state}}</span>
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
            <v-flex xs6 class="text-right">
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
                  Segunda-Feira: {{item.clinic.agenda[0]}}
                </span>
                <span>
                  <v-icon>event</v-icon>
                  Terça-Feira: {{item.clinic.agenda[1]}}
                </span>
                <span>
                  <v-icon>event</v-icon>
                  Quarta-Feira: {{item.clinic.agenda[2]}}
                </span>
                <span>
                  <v-icon>event</v-icon>
                  Quinta-Feira: {{item.clinic.agenda[3]}}
                </span>
                <span>
                  <v-icon>event</v-icon>
                  Sexta-Feira: {{item.clinic.agenda[4]}}
                </span>
                <span>
                  <v-icon>event</v-icon>
                  Sábado: {{item.clinic.agenda[5]}}
                </span>
              </v-layout>
            </v-flex>
            <v-flex v-if="patient.dependents && patient.dependents.length > 0" xs5 class="my-0 py-0  d-print-none">
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
                    <span class="font-weight-bold">{{selectedDependent ? selectedDependent.birthDate :patient.birth_date | dateFilter}}</span>
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
                <span>Rua Major Gabriel 915, Centro</span>
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
  props: ["guide"],
  computed: {
    items() {
      return this.guide;
    },
    selectedUnit() {
      return this.$store.getters.selectedUnit;
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
