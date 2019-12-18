<template>
  <v-card width="850">
    <v-card-title class="headline grey lighten-2" primary-title>
      <span class="headline">Exclusão de Produtos Cadastrados</span>
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout align-center justify-center wrap>
          <v-flex xs12>
            <v-text-field
              prepend-icon="business"
              label="Clinicas"
              outlined
              readonly
              v-model="selectedClinic.name"
              hide-details
            ></v-text-field>
          </v-flex>

          <v-card-text v-if=" allExams.length !== 0">
            <strong>EXAMES</strong>
            <v-list-item v-for="(item,index) in allExams" :key="index">
              <v-chip color="red" text-color="white">
                <strong>{{item.name}} | Custo R$ {{item.cost}} | Venda R$ {{item.price}}</strong>
                <v-btn class="ml-1" small icon @click="preprocessExam(index)">
                  <v-icon>cancel</v-icon>
                </v-btn>
              </v-chip>
            </v-list-item>
          </v-card-text>

          <v-dialog v-model="dialog" max-width="355">
            <v-card>
              <v-card-title class="headline grey lighten-2" primary-title>
                <span class="headline">Deletar o Item Selecionado ?</span>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <strong>
                  Exame: {{product}}
                  <br />
                  Preço-Custo: R$ {{cost}}
                  <br />
                  Preço-Venda: R$ {{price}}
                </strong>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn color="error" rounded @click="dialog = false">NÃO</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="success" rounded @click="removeFromE">SIM</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-card-text v-if=" allSpecialties.length !== 0">
            <strong>CONSULTAS</strong>
            <v-expansion-panels  v-model="panel" accordion>
              <v-expansion-panel v-for="(item,index) in allSpecialties" :key="index">
                <v-expansion-panel-header class="primary white--text">
                  {{item.name}}
                  <template v-slot:actions>
                    <v-icon color="white">$expand</v-icon>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-simple-table>
                    <template v-slot:default>
                      <thead>
                        <tr>
                            <v-layout row wrap>
                                <v-flex xs11>
                                    <v-layout row wrap>
                                        <v-flex xs6><th class="text-left">Name</th></v-flex>
                                        <v-flex xs3><th class="text-left">Custo R$</th></v-flex>
                                        <v-flex xs3><th class="text-left">Venda R$</th></v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs1>
                                    <th></th>
                                </v-flex>
                            </v-layout>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(doctor,index2) in item.doctors" :key="index2">
                            <v-layout row wrap>
                                <v-flex xs11>
                                    <v-layout row wrap>
                                        <v-flex xs6><td class="text-left">{{ doctor.name }}</td></v-flex>
                                        <v-flex xs3><td class="text-left">R$ {{ doctor.cost }}</td></v-flex>
                                        <v-flex xs3><td class="text-left">R$ {{ doctor.price }}</td></v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs1>
                                    <td class="text-left">
                                        <v-btn  small icon @click="preprocessSpec(index,index2)">
                                            <v-icon>cancel</v-icon>
                                        </v-btn>
                                    </td>
                                </v-flex>
                            </v-layout>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-expansion-panel-content>
                
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>

          <v-dialog v-model="dialog2" max-width="355">
            <v-card>
              <v-card-title class="headline grey lighten-2" primary-title>
                <span class="headline">Deletar o Item Selecionado ?</span>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                  <strong>
                      Medico: {{doctor}}<br>
                      Especialidade: {{specialtie}}<br>
                      Preço-Custo: R$ {{cost}}<br>
                      Preço-Venda: R$ {{price}}
                  </strong>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn color="error" rounded @click="dialog2 = false">NÃO</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="success" rounded @click="removeFromS">SIM</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

            <v-divider></v-divider>
            <v-card-actions>
                <v-layout align-center justify-center>
                    <v-btn color="error" @click="clear()"><v-icon>close</v-icon>Fechar</v-btn>
                </v-layout>
            </v-card-actions>

        </v-layout>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data: () => ({
      dialog: false,
      dialog2: false,
      product: undefined,
      doctor: undefined,
      specialtie: undefined,
      cpf: undefined,
      cost: undefined,
      price: undefined,
      options: undefined,
      panel: [0],
      headers: [
        {
          text: 'Nome do médico',
          align: 'left',
          sortable: false,
          value: 'name',
        },
        {
          text: 'Custo R$',
          align: 'left',
          sortable: false,
          value: 'cost',
        },
        {
          text: 'Venda R$',
          align: 'left',
          sortable: false,
          value: 'sale',
        },
        { text: '', value: 'action', sortable: false },
      ],
  }),

  computed: {
    selectedClinic() {
      return this.$store.getters.selectedClinic;
    },

    listando() {
      let val = this.$store.getters.clinics.filter(a => {
        return a.name === this.selectedClinic.name;
      });
      return val;
      //return this.$store.getters.clinics
    },

    allExams() {
      let clinic = this.listando[0];
      let exams = [];

      for (let i in clinic.exams) {
        exams.push({
          ...clinic.exams[i]
        });
      }
      console.log("EXAMES::", exams);
      return exams;
    },

    allSpecialties() {
      let clinic = this.listando[0];
      let specialties = [];

      for (let i in clinic.specialties) {
        specialties.push({
          ...clinic.specialties[i]
        });
      }
      console.log("DOCTORS:", specialties);
      return specialties;
    }
  },

  mounted() {
    this.$store.dispatch("loadClinics");
  },

  methods: {
      clear () {
          this.$store.dispatch('selectClinic', null);
      },
    preprocessExam(index) {
      this.product = this.allExams[index].name;
      this.cost = this.allExams[index].cost;
      this.price = this.allExams[index].price;
      this.dialog = true;
    },
    removeFromE() {
      let info = {
        product: this.product,
        clinic: this.selectedClinic
      };
      console.log(info);
      this.$store.dispatch("removeExamFromClinic", info);
      this.$store.dispatch("removeClinicFromExam", info);
      this.dialog = false;
      this.$store.dispatch("loadClinics");
    },
    preprocessSpec(index, index2) {
        //console.log("shavdhsavd:",this.allSpecialties[index].doctors[index2])
        this.specialtie = this.allSpecialties[index].doctors[index2].specialtie;
        this.cpf = this.allSpecialties[index].doctors[index2].cpf;
        this.doctor = this.allSpecialties[index].doctors[index2].name;
        this.cost = this.allSpecialties[index].doctors[index2].cost;
        this.price = this.allSpecialties[index].doctors[index2].price;
        this.dialog2 = true;
    },
    removeFromS() {
      let info = {
          cpf: this.cpf,
          clinic: this.selectedClinic,
          specialtie: this.specialtie,
      };
      //console.log('disgraça:',info);
      this.$store.dispatch('deleteAppointment', info)
      this.dialog2 = false;
      this.$store.dispatch("loadClinics");
    },
  }
};
</script>

<style scoped>
</style>