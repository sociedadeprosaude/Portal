<template>
    <v-layout row wrap>
        <v-flex xs12>
          <v-checkbox
            v-model="scheduledExamCheck"
            label="Criar agenda para exame agendável?"
          ></v-checkbox>
        </v-flex>
        <v-flex v-if="!scheduledExamCheck" xs12 sm6>
          <v-combobox
              class="mx-1"
              label="Especialidade"
              prepend-icon="school"
              v-model="especialidade"
              :items="specialties"
              item-text="name"
              return-object
              outlined
              rounded
              filled
              dense
              chips
              color="pink"
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
          </v-combobox>
        </v-flex>
        <v-flex v-if="scheduledExamCheck" xs6>
          <v-select
              class="mx-1"
              prepend-icon="location_city"
              v-model="scheduledExam"
              :items="scheduledExams"
              item-text="name"
              return-object
              label="Exame agendável"
              outlined
              rounded
              filled
              chips
              dense
              color="purple"
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
        <v-flex xs12 sm6>
          <v-combobox
              class="mx-1"
              prepend-icon="account_circle"
              v-model="medicos"
              :items="doctors"
              item-text="name"
              return-object
              label="Médico"
              no-data-text="Nenhum médico para esta especialidade"
              outlined
              rounded
              filled
              chips
              dense
              color="purple"
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
          </v-combobox>
        </v-flex>
        <v-flex xs12>
          <v-select
              class="mx-1"
              prepend-icon="location_city"
              v-model="clinic"
              :items="clinics"
              item-text="name"
              return-object
              label="Clínica"
              no-data-text="Nenhum médico para esta especialidade"
              outlined
              rounded
              filled
              chips
              dense
              color="purple"
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
    </v-layout>
</template>

<script>
export default {
  name:'CardAddSchedule',
  data: () => ({
    medicos: "",
    especialidade: undefined,
    clinic: undefined,
    scheduledExam:undefined,
    scheduledExamCheck:false
  }),
  mounted() {
    this.$store.dispatch("getSpecialties");
    this.$store.dispatch("getScheduledExams");
    this.$store.dispatch("getDoctors");
    this.$store.dispatch("getClinics");
  },
  computed: {
    specialties() {
      let espArray = Object.values(this.$store.getters.specialties);
      espArray = espArray.filter(specialty => {
        if (!this.medicos) {
          return true;
        }
        let find = false;
        specialty.doctors.forEach(doctor => {
          if (doctor.cpf === this.medicos.cpf) {
            find = true;
            return true;
          }
        });

        return find;
      });
      return espArray;
    },

    doctors() {
      let doctors = Object.values(this.$store.getters.doctors);
      if (this.especialidade) {
        doctors = doctors.filter(a => {
          for (let spe in a.specialties) {
            if (a.specialties[spe].name === this.especialidade.name) {
              return true;
            }
          }
          return false;
        });
      }
      return doctors;
    },
    clinics() {
      return this.$store.getters.clinics.filter(a => {
        return a.property;
      });
    },
    scheduledExams() {
      return this.$store.getters.scheduledExams;
    }
  },
  methods:{
      async saveNewSchedule(){
          let newScheduleObj
          if(this.scheduledExamCheck){
            newScheduleObj = {
              clinic:this.clinic,
              exam_type:this.scheduledExam,
              doctor:this.medicos
            }
          }else{
            newScheduleObj = {
              clinic:this.clinic,
              specialty:this.especialidade,
              doctor:this.medicos
          }
          }
          await this.$store.dispatch('newShedule',newScheduleObj)
      }
  }
};
</script>

<style>
</style>