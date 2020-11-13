<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 class="mb-4">
        <v-btn v-if="allLoaded" class="primary rounded" @click="beginAnalises">Iniciar Analise</v-btn>
        <v-progress-circular v-else class="primary--text" indeterminate></v-progress-circular>
        <v-text-field
          v-bind:value="idealProfitPercentage"
          @change="(event)=>$emit('change-idealProfitPercentage',event)"
          label="Porcentagem Ideal de Lucro"
        ></v-text-field>
      </v-flex>
      <v-flex xs12>
        <v-layout row wrap>
          <v-chip-group
            row
            mandatory
            v-bind:value="selectedType"
            @change="(event)=>$emit('change-selectedType',event)"
            active-class="primary--text"
          >
            <v-chip v-for="type in types" :key="type">{{ type }}</v-chip>
          </v-chip-group>
          <v-divider vertical class="mr-2"></v-divider>
          <v-chip-group
            row
            mandatory
            v-bind:value="showOption"
            @change="(event)=>$emit('change-showOption',event)"
            active-class="primary--text"
          >
            <v-chip v-for="type in showOptions" :key="type">{{ type }}</v-chip>
          </v-chip-group>
        </v-layout>
      </v-flex>
      <v-flex xs12 id="card-to-print" v-if="selectedType === 0">
        <v-card flat style="border: 2px solid black">
          <v-layout row wrap>
            <v-flex xs2>Clínica</v-flex>
            <v-flex xs9>
              <v-layout row wrap>
                <v-flex xs4>Exame</v-flex>
                <v-flex xs2>Custo/Preço</v-flex>
                <v-flex xs2>Custo Ideal</v-flex>
                <v-flex xs2>Preço Ideal</v-flex>
                <v-flex xs2>Lucro</v-flex>
              </v-layout>
            </v-flex>

            <v-flex xs12>
              <v-layout
                row
                wrap
                class="align-center py-2"
                v-for="clinic in clinics"
                :key="clinic.name"
              >
                <v-flex xs12>
                  <v-divider class="black"></v-divider>
                </v-flex>
                <v-flex xs2>{{clinic.name}}</v-flex>
                <v-divider vertical></v-divider>
                <v-flex xs9>
                  <v-layout column wrap class="ma-0 pa-0">
                    <v-flex
                      xs12
                      v-for="exam in filterExams(clinic.exams)"
                      :key="clinic.name + exam.name"
                    >
                      <v-divider></v-divider>
                      <v-layout row wrap class="align-center ma-0 pa-0">
                        <v-flex xs4>
                          <span>{{exam.name}}</span>
                        </v-flex>
                        <v-flex xs2>
                          <span>{{exam.cost}}/{{exam.price}}</span>
                        </v-flex>
                        <v-flex xs2>
                          <span>{{getIdealCost(exam)}}</span>
                        </v-flex>
                        <v-flex xs2>
                          <span>{{getIdealPrice(exam)}}</span>
                        </v-flex>
                        <v-flex xs2>
                          <span
                            :class="[getProfitPercentage(exam) < idealProfitPercentage / 100 ? 'red--text' : '']"
                          >{{(getProfitPercentage(exam) * 100).toFixed(2)}}%</span>
                        </v-flex>
                      </v-layout>
                      <v-divider></v-divider>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs12>
                  <v-divider class="black"></v-divider>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
      <v-flex xs12 id="card-to-print" v-else>
        <v-card flat style="border: 2px solid black">
          <v-layout row wrap>
            <v-flex xs2>Exames</v-flex>
            <v-flex xs9>
              <v-layout row wrap>
                <v-flex xs4>Clínica</v-flex>
                <v-flex xs2>Custo/Preço</v-flex>
                <v-flex xs2>Custo Ideal</v-flex>
                <v-flex xs2>Preço Ideal</v-flex>
                <v-flex xs2>Lucro</v-flex>
              </v-layout>
            </v-flex>

            <v-flex xs12>
              <v-layout
                row
                wrap
                class="align-center py-2"
                v-for="clinic in this.exams"
                :key="clinic.name"
              >
                <v-flex xs12>
                  <v-divider class="black"/>
                </v-flex>
                <v-flex xs2>{{clinic.name}}</v-flex>
                <v-divider vertical></v-divider>
                <v-flex xs9>
                  <v-layout column wrap class="ma-0 pa-0">
                    <v-flex
                      xs12
                      v-for="exam in filterClinics(clinic.clinics)"
                      :key="clinic.name + exam.name"
                    >
                      <v-divider></v-divider>
                      <v-layout row wrap class="align-center ma-0 pa-0">
                        <v-flex xs4>
                          <span>{{exam.name}}</span>
                        </v-flex>
                        <v-flex xs2>
                          <span>{{exam.cost}}/{{exam.price}}</span>
                        </v-flex>
                        <v-flex xs2>
                          <span>{{getIdealCost(exam)}}</span>
                        </v-flex>
                        <v-flex xs2>
                          <span>{{getIdealPrice(exam)}}</span>
                        </v-flex>
                        <v-flex xs2>
                          <span
                            :class="[getProfitPercentage(exam) < idealProfitPercentage / 100 ? 'red--text' : '']"
                          >{{(getProfitPercentage(exam) * 100).toFixed(2)}}%</span>
                        </v-flex>
                      </v-layout>
                      <v-divider></v-divider>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs12>
                  <v-divider class="black"></v-divider>
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
export default {
  props: [
    "loading",
    "idealProfitPercentage",
    "selectedType",
    "types",
    "showOptions",
    "showOption",
    "exams",
    "clinics",
    "allLoaded",
    "filterExams",
    "filterClinics",
    "getClinicExams",
    "beginAnalises",
    "turnClinicsInExams",
    "getIdealCost",
    "getIdealPrice",
    "getProfitPercentage"
  ]
};
</script>

<style scoped>
</style>
