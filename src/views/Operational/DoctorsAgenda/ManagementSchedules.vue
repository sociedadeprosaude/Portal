<template>
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
          
          <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>
        </template>

        <template v-slot:expanded-item="{ headers, item }">
          <BodyTable :headers="headers" :item="item" @createNewDay="createNewDay()" @createNewPeriod="createNewPeriod()" />
        </template>        
      </v-data-table>
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
  mounted(){
    this.loading = true;
  },
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
    async createNewDay() {
      this.$apollo.queries.loadSchedules.refresh();  
    },

    async createNewPeriod() {
      this.$apollo.queries.loadSchedules.refresh();  
    }
  },
  apollo: {
    loadSchedules: {
      query: require("@/graphql/schedules/LoadSchedules.gql"),
      update(data) {
        if(this.examTypeCheck)
          this.schedules = data.Schedule.filter(schedule => schedule.clinic && schedule.doctor && schedule.product && schedule.product.type === "EXAM")
        else
          this.schedules = data.Schedule.filter(schedule => schedule.clinic && schedule.doctor && schedule.product && schedule.product.type === "SPECIALTY")
        this.loading = false;
      }
    },
  }
};
</script>

<style>
</style>