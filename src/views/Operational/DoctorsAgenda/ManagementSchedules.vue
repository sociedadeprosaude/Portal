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
          >
            <template slot-scope="{ result: { data } }">
              <HeaderTable :clinics="data.Clinic" @filterClinic="clinic=$event" @examTypeCheck="examTypeCheck=$event"/>
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
      this.loading = true;
      
      this.$apollo.mutate({
          mutation: require('@/graphql/schedules/NewDay.gql'),
          variables: {
            day: newDay.day.toString(),
            hour: newDay.hour,
            vacancy: Number(newDay.vacancy)
          },
          
        }).then((data) => {
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
          console.log(data)
        }).catch((error) => {
          console.error(error)
        })
    },

    async createNewPeriod(newPeriod) {
      this.loading = true;
      let periods = newPeriod.schedule.cancelations_schedules
        ? newPeriod.schedule.cancelations_schedules
        : [];
      periods.push({
        start_date: newPeriod.start_date,
        final_date: newPeriod.final_date
      });
      await this.$store.dispatch("updateSchedulePeriods", {
        idSchedule: newPeriod.schedule.id,
        cancelations_schedules: periods
      });
      this.loading = false;
      /* this.dialogNewPeriod = false;
      this.newPeriod = {}; */
    },
    async updateExpirationDate(schedule) {
      this.loading = true;
      await this.$store.dispatch("updateExpirationDate", {
        idSchedule: schedule.id,
        expiration_date: schedule.expiration_date
      });
      this.loading = false;
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
      },
      result(data){
        console.log('->',data)
      }
    },
  }
};
</script>

<style>
</style>