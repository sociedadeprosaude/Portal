<template>
  <v-container>
    <v-row class="align-content-sm-space-between pa-0 ma-0 justify-center">
      <v-col cols="3" class="mr-3">
        <v-menu
          ref="menu1"
          v-model="menu1"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="dateFormatted"
              label="Data Inicial"
              dense
              prepend-icon="event"
              v-on="on"
            />
          </template>
          <v-date-picker v-model="date" no-title @input="menu1 = false" />
        </v-menu>
      </v-col>
      <v-col cols="3" class="ml-3">
        <v-menu
          v-model="menu2"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="dateFormatted2"
              label="Data Final"
              prepend-icon="event"
              readonly
              dense
              v-on="on"
            />
          </template>
          <v-date-picker v-model="date2" no-title @input="menu2 = false" />
        </v-menu>
      </v-col>
    </v-row>
    <v-row class="align-center pa-0 ma-0">
      <v-col class="pa-0 ma-0">
        <v-btn @click="refresh()" color="blue" v-if="!loading">Pesquisar</v-btn>
        <v-progress-circular indeterminate class="primary--text" v-else />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: ["cb"],
  data: vm => ({
    date: moment().format("YYYY-MM-DD 00:00:00"),
    date2: moment().format("YYYY-MM-DD 23:59:59"),
    dateFormatted: moment().format("DD/MM/YYYY"),
    dateFormatted2: moment().format("DD/MM/YYYY"),
    dateBegin: null,
    dateEnd: null,
    menu1: false,
    menu2: false,
    loading: false
  }),
  methods: {
    async refresh() {
      this.$emit("change-dateFormatted", this.dateFormatted);
      this.$emit("change-dateFormatted2", this.dateFormatted);
      this.loading = true;
      await this.cb();
      this.loading = false;
    },
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    }
  },
  watch: {
    date(val) {
      this.dateFormatted = this.formatDate(this.date);
      this.$emit("change-date", val);
    },
    date2(val) {
      this.dateFormatted2 = this.formatDate(this.date2);
      this.$emit("change-date2", val);
    }
  }
};
</script>

<style>
</style>