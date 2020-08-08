<template>
  <v-data-table
    :headers="headers"
    :items="schedules"
    single-expand
    :expanded.sync="expanded"
    item-key="id"
    show-expand
    class="elevation-1 mx-2 mt-10 pt-5"
    height="400"
  >

    <template v-slot:top>
      <HeaderTable :clinics="clinics" @filterClinic="clinic=$event" @examTypeCheck="examTypeCheck=$event"/>
    </template>

    <template v-slot:expanded-item="{ headers, item }">
      <BodyTable :headers="headers" :item="item" @createNewDay="createNewDay($event)" @createNewPeriod="createNewPeriod($event)" />
    </template>

    <!-- <template v-slot:item.actions="{ item }">
          <v-icon small @click="deleteSchedule(item)">mdi-delete</v-icon>
    </template>-->
    
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
      { text: "Especialidade", value: "specialty.name" },
      { text: "Clínica", value: "clinic.name", sortable: true },
      { text: "Intervalo (Minutos)", value: "interval", sortable: true ,  align: "center",},
      { text: "Ações", value: "actions", sortable: false }
    ],
  }),

  mounted() {
    this.$store.dispatch("getAllSchedules");
    this.$store.dispatch("getClinics");
  },
  computed: {
    schedules() {
      let resp = this.$store.getters.AllSchedules.filter(schedule => {
        let filter = true;
        if (this.clinic && schedule.clinic.name != this.clinic.name)
          filter = false;
        if (
          (this.examTypeCheck && !schedule.exam_type) ||
          (!this.examTypeCheck && schedule.exam_type)
        )
          filter = false;
        return filter;
      });
      return resp;
    },
    clinics() {
      return this.$store.getters.clinics.filter(a => {
        return a.property;
      });
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
          { text: "Tipo do Exame", value: "exam_type.name" },
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
          { text: "Especialidade", value: "specialty.name" },
          { text: "Clínica", value: "clinic.name", sortable: true },
          { text: "Ações", value: "actions", sortable: false }
        ];
      }
    }
  },
  methods: {
    formatDate(date) {
      return moment(date, "YYYY-MM-DD").format("DD/MM/YYYY");
    },
    async createNewDay(newDay) {
      this.loading = true;
      let days = newDay.schedule.days ? newDay.schedule.days : {};
      days[newDay.day] = {
        hour: newDay.hour,
        vacancy: newDay.vacancy
      };
      await this.$store.dispatch("newDaySchedule", {
        idSchedule: newDay.schedule.id,
        days: days
      });
      
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
  }
};
</script>

<style>
</style>