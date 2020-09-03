<template>
    <v-layout row wrap>
        <v-flex xs12>
          <v-checkbox
            v-model="examTypeCheck"
            label="Criar agenda para exame agendável?"
          ></v-checkbox>
        </v-flex>
        <v-flex v-if="!examTypeCheck" xs12>

          <template>
            <!-- Apollo Query -->
            <ApolloQuery 
                :query="gql => gql`
                  query ($type: String!) {
                    Product (type: $type){
                      name,id,
                      doctors{
                        id,
                        name
                      },
                      clinics{
                        id,
                        name
                      }
                    }
                  }
                `"
                :variables="{ type:'SPECIALTY' }"
            
            >
              <template slot-scope="{ result: { data } }">
                <v-combobox
                  class="mx-1"
                  label="Especialidade"
                  prepend-icon="school"
                  v-model="specialty"
                  :items="data ? data.Product:[]"
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
              </template>
            </ApolloQuery>
          </template>

        </v-flex>
        <v-flex v-if="examTypeCheck" xs12>
          <template>
            <!-- Apollo Query -->
            <ApolloQuery 
                :query="gql => gql`
                  query ($type: String!, $schedulable: Boolean) {
                    Product(type:$type,schedulable:$schedulable){
                      name,
                      id,
                      doctors{
                        name,
                        id
                      },
                      clinics{
                        name,
                        id
                      }
                    }
                  }
                `"
                :variables="{ type:'EXAM', schedulable:true}"
            
            >
              <template slot-scope="{ result: { data } }">
                <v-select
                    class="mx-1"
                    prepend-icon="location_city"
                    v-model="examType"
                    :items="data ? data.Product : []"
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
              </template>
            </ApolloQuery>
          </template>
        </v-flex>
        <v-flex xs12>
          <v-combobox
              class="mx-1"
              prepend-icon="account_circle"
              v-model="doctor"
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
        <v-flex xs6>
            <v-text-field v-model="interval" label="Intervalo entre consulta" type="number" rounded dense outlined prepend-icon ="watch_later"></v-text-field>
        </v-flex>
    </v-layout>
</template>

<script>
import gql from 'graphql-tag'

export default {
  name:'CardAddSchedule',
  data: () => ({
    doctor: "",
    specialty: undefined,
    clinic: undefined,
    interval:undefined,
    examType:undefined,
    examTypeCheck:false,
    clinics:[],
    doctors:[]
  }),
  watch:{
    specialty(value){
      this.clinic = undefined
      this.doctor = undefined
      this.examType = undefined
      if(value){
        this.clinics = value.clinics
        this.doctors = value.doctors
      }
    },
    examTypeCheck(value){
      this.clinic = undefined
      this.doctor = undefined 
      this.specialty = undefined
      if(value){
        this.$apollo.queries.loadClinics.refresh()
        this.$apollo.queries.loadDoctors.refresh()
      }
    }
  },
  methods:{
      clear(){
        this.clinic = undefined
        this.doctor = undefined 
        this.specialty = undefined
        this.examType = undefined
      },
      async saveNewSchedule(){
        const interval = this.interval ? this.interval : 5
        let newScheduleObj = {
          clinic:this.clinic,
          doctor:this.doctor,
          interval:Number(interval)
        }
        if(this.examTypeCheck){
          console.log('Exam',this.examType)
          newScheduleObj.product = this.examType      
        }else{
          console.log('Specialty',this.specialty)
          newScheduleObj.product = this.specialty
        }

        this.$apollo.mutate({
          mutation: require('@/graphql/schedules/new_schedule.gql'),
          // Parameters
          variables: {
            interval: newScheduleObj.interval,
          },
          
        }).then((data) => {
          this.saveRelationSchedule(data.data.CreateSchedule.id, newScheduleObj)
        }).catch((error) => {
          console.error(error)
        })
      },

    saveRelationSchedule(idSchedule, scheduleObj){
        console.log(scheduleObj)
        this.$apollo.mutate({
          mutation: require('@/graphql/schedules/add_relations.gql'),
          // Parameters
          variables: {
            idSchedule: idSchedule,
            idProduct: scheduleObj.product.id,
            idClinic: scheduleObj.clinic.id,
            idDoctor: scheduleObj.doctor.id
          },
          
        }).then((data) => {
          this.clear()
        }).catch((error) => {
          console.error(error)
        })
    }
  },
  apollo: {
    loadClinics: {
      query: gql`query {
        Clinic(orderBy:[name_desc]){
          id,name
        }
      }`,
      update(data) {
        this.clinics = data.Clinic
      },
    },
    loadDoctors: {
      query: gql`query {
        Doctor(orderBy:[name_desc]){
          id,name
        }
      }`,
      update(data) {
        this.doctors = data.Doctor
      },
    }
  }
};
</script>

<style>
</style>