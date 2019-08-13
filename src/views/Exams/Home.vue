<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12>
        <v-layout row wrap>
          <v-flex xs12 md9 class="pr-3">
          <v-combobox
            v-model="selectedDoctor"
            label="Medico"
            :items="doctors"
            clearable
          >
          </v-combobox>
          </v-flex>
          <v-flex md3 xs12>
            <v-text-field
              v-model="numBudget"
            label="No do Orcamento"></v-text-field>
          </v-flex>
        </v-layout>
        <v-combobox
          v-model="selectedExam"
          label="Exames"
          :items="exams"
          auto-select-first
          clearable
          ref="examField"
        >
        </v-combobox>
      </v-flex>
      <v-flex xs12>
        <v-card min-height="73vh">
          <v-card-title>
            <span class="my-headline">{{selectedDoctor ? selectedDoctor : 'Escolha um médico'}}</span>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-divider></v-divider>
              <v-list-tile
                v-for="exam in selectedExams"
              >
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-list-tile-title class="my-2" style="font-weight: bold">
                      <v-layout row wrap>
                        <span>{{exam}}</span>
                        <v-btn
                          style="min-width: 0; min-height: 0"
                          @click="selectedExams.splice(selectedExams.indexOf(exam), 1)"
                          round flat class="white">
                          <v-icon>delete</v-icon>
                        </v-btn>
                      </v-layout>
                    </v-list-tile-title>
                  </v-flex>
                  <v-flex xs12>
                    <v-divider></v-divider>
                  </v-flex>
                </v-layout>
              </v-list-tile>
            </v-list>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                @click="saveBudget()"
                round class="primary dark"> Salvar
              </v-btn>
            </v-card-actions>
            <v-alert
              :value="doctorAlert"
              type="error"
            >
              {{errorMessage}}
            </v-alert>
            <v-alert
              :value="successAlert"
              type="success"
            >
              Orçamento salvo
            </v-alert>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 class="text-xs-center mt-3">
        <v-btn round class="white" @click="$router.push('/registered_exams')">Orçamentos cadastrados</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

  export default {
    name: 'home',
    data() {
      return {
        selectedExams: [],
        selectedDoctor: undefined,
        selectedExam: undefined,
        numBudget: undefined,
        doctorAlert: false,
        errorMessage: '',
        successAlert: false,
        loading: false
      }
    },
    computed: {
      exams() {
        return this.$store.getters.exams
      },
      doctors() {
        return this.$store.getters.doctors
      }
    },
    watch: {
      selectedDoctor: function (val) {
        // this.$refs.examField.focus()
        // this.selectedDoctor(val)
      },
      selectedExam: function (val) {
        if (!val) return
        if (this.selectedExams.includes(val)) return
        this.selectedExams.push(val)
      }
    },
    methods: {
      saveBudget() {
        if (!this.selectedDoctor) {
          this.errorMessage = 'Escolha um médico.'
          this.doctorAlert = true
          setTimeout(() => {
            this.doctorAlert = false
          }, 2000)
          return
        }
        if (!this.numBudget || this.numBudget === '') {
          this.errorMessage = 'Coloque o número do orçamento.'
          this.doctorAlert = true
          setTimeout(() => {
            this.doctorAlert = false
          }, 2000)
          return
        }
        if (this.selectedExams.length <= 0) {
          this.errorMessage = 'Adicione Exames.'
          this.doctorAlert = true
          setTimeout(() => {
            this.doctorAlert = false
          }, 2000)
          return
        }
        let payload = {
          doctor: this.selectedDoctor,
          budget: this.selectedExams,
          budgetNumber: this.numBudget
        }
        this.loading = true
        this.$store.dispatch('addBudget', payload).then(() => {
          this.successAlert = true
          setTimeout(() => {
            this.successAlert = false
          }, 2000)
        })
          .catch((error) => {
            this.errorMessage = 'Erro ao salvar exame. ' + error
            this.doctorAlert = true
            setTimeout(() => {
              this.doctorAlert = false
            }, 2000)
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    beforeMount() {
      this.$store.dispatch('getExamsList')
      this.$store.dispatch('getDoctorsList')
    }
  }
</script>

<style>
  .my-headline {
    color: grey;
    font-weight: bold;
    font-size: 24px;
  }
</style>
