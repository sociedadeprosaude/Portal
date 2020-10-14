<template>
  <!-- <ApolloQuery 
    :query="require('@/graphql/schedules/LoadSchedules.gql')"
    :variables="{ type:'SPECIALTY' }"
  >
    <template slot-scope="{ result: { data, loading} }">
      <v-progress-circular v-if="loading" indeterminate></v-progress-circular> -->
      <v-data-table
        :headers="headers"
        :items="schedulesFilter"
        single-expand
        :expanded.sync="expanded"
        item-key="id"
        show-expand
        class="elevation-1 mx-2 mt-10 pt-5"
        height="400"
      >
        <template v-slot:top>
          <ApolloQuery 
            :query="require('@/graphql/clinics/LoadClinics.gql')"
            :variables="{property:true}"
          >
            <template slot-scope="{ result: { data } }">
              <HeaderTable :clinics="data && data.Clinic" @filterClinic="clinic=$event" @examTypeCheck="examTypeCheck=$event"/>
            </template>
          </ApolloQuery>
        </template>

        <template v-slot:expanded-item="{ headers, item }">
          <BodyTable :headers="headers" :item="item" @createNewDay="createNewDay($event)" @createNewPeriod="createNewPeriod($event)" />
        </template>

        <!-- <template v-slot:item.actions="{ item }">
              <v-icon small @click="deleteSchedule(item)">mdi-delete</v-icon>
        </template>-->
        
      </v-data-table>
    <!-- </template>
  </ApolloQuery> -->
</template>

<script>
import HeaderTable from "../../../components/doctorsAgenda/ManagementSchedules/HeaderTable"
import BodyTable from "../../../components/doctorsAgenda/ManagementSchedules/BodyTable"
export default {
  components: {
    HeaderTable,
    BodyTable
  },
  data: () => ({
    expanded: [],
    schedules:[],
    moment: moment,
    clinic: undefined,
    dialog: false,
    dialogNewPeriod: false,
    editExpirationDate: false,
    examTypeCheck: false,
    loading: false,
    newDay: {},
    newPeriod: {},
    headers: [
      {
        text: "Médico",
        align: "start",
        sortable: true,
        value: "doctor.name"
      },
      { text: "Especialidade", value: "product.name" },
      { text: "Clínica", value: "clinic.name", sortable: true },
      { text: "Intervalo (Minutos)", value: "interval", sortable: true ,  align: "center",},
      { text: "Ações", value: "actions", sortable: false }
    ],
  }),

  computed: {
    schedulesFilter(){
      if(this.clinic)
        return this.schedules.filter(schedule => schedule.clinic.id === this.clinic.id)

      return this.schedules
    }
  },
  watch: {
    examTypeCheck(value) {
      if (value) {
        this.headers = [
          {
            text: "Médico",
            align: "start",
            sortable: true,
            value: "doctor.name"
          },
          { text: "Tipo do Exame", value: "product.name" },
          { text: "Clínica", value: "clinic.name", sortable: true },
          { text: "Ações", value: "actions", sortable: false }
        ];
      } else {
        this.headers = [
          {
            text: "Médico",
            align: "start",
            sortable: true,
            value: "doctor.name"
          },
          { text: "Especialidade", value: "product.name" },
          { text: "Clínica", value: "clinic.name", sortable: true },
          { text: "Ações", value: "actions", sortable: false }
        ];
      }

      this.$apollo.queries.loadSchedules.refresh()
    }
  },
  methods: {
    formatDate(date) {
      return moment(date, "YYYY-MM-DD").format("DD/MM/YYYY");
    },
    async createNewDay(newDay) {
      this.$apollo.mutate({
          mutation: require('@/graphql/schedules/NewDay.gql'),
          variables: {
            day: newDay.day.toString(),
            hour: newDay.hour,
            vacancy: Number(newDay.vacancy)
          },
          
        }).then((data) => {
          //newDay.schedule.days.push(data.CreateDay)
          this.saveRelationDaySchedule(data.data.CreateDay.id, newDay.schedule.id)
        }).catch((error) => {
          console.error(error)
        })
      
    },

    saveRelationDaySchedule(idDay, idSchedule){
        this.$apollo.mutate({
          mutation: require('@/graphql/schedules/AddRelationForDay.gql'),
          // Parameters
          variables: {
            idSchedule: idSchedule,
            idDay: idDay
          },
          
        }).then((data) => {
          this.$apollo.queries.loadSchedules.refresh();
        }).catch((error) => {
          console.error(error)
        })
    },

    async createNewPeriod(newPeriod) {
      const response = await this.$apollo.mutate({
        mutation: require('@/graphql/schedules/NewCanceledPeriod.gql'),
        variables:{
          start_date:{
            formatted: newPeriod.start_date
          },
          final_date:{
            formatted: newPeriod.final_date
          }
        }
      });
      
      await this.$apollo.mutate({
        mutation: require('@/graphql/schedules/AddRelationCanceledPeriod.gql'),
        variables:{
          idSchedule: newPeriod.schedule.id,
          idCanceledPeriod: response.data.CreateCanceledPeriod.id
        }
      });

      this.$apollo.queries.loadSchedules.refresh();
    },
    deleteSchedule(item) {
      const index = this.schedules.indexOf(item);
      if (confirm("Você tem certeza que dejesa remover a agenda?")) {
        this.$store.dispatch("deleteSchedule", item.id);
      }
    }
  },
  apollo: {
    loadSchedules: {
      query: require("@/graphql/schedules/LoadSchedules.gql"),
      update(data) {
        console.log('-',data.Schedule)
        if(this.examTypeCheck)
          this.schedules = data.Schedule.filter(schedule => schedule.clinic && schedule.doctor && schedule.product && schedule.product.type === "EXAM")
        else
          this.schedules = data.Schedule.filter(schedule => schedule.clinic && schedule.doctor && schedule.product && schedule.product.type === "SPECIALTY")
      }
    },
  }
};
</script>

<style>
</style>