<template>
  <v-container>
    <NewUsersReport
      :date="date"
      :date2="date2"
      :todayNewUsers="todayNewUsers"
      :search="search"
      :now="now"
      :total="total"
      :options="options"
      :optionSelected="optionSelected"
      :headers="headers"
      :dateBegin="dateBegin"
      :dateEnd="dateEnd"
      :actualList="actualList"
      :newUsers="newUsers"
      :numNewUsers="numNewUsers"
      @change-optionSelected="(value)=>optionSelected=value"
    />
  </v-container>
</template>

<script>
import moment from "moment";
import NewUsersReport from "@/components/Reports2/NewUsersReport";

export default {
  // name: "NewUsersReport",
  components: { NewUsersReport },
  props: ["date", "date2", "todayNewUsers"],
  data() {
    return {
      search: "",
      now: moment().format("YYYY-MM-DD HH:mm:ss"),
      total: 0,
      options: ["De hoje", "Outros dias"],
      optionSelected: 0,
      headers: [
        {
          text: "Cpf",
          align: "start",
          sortable: false,
          value: "cpf"
        },
        { text: "Nome", value: "name", align: "center" },
        { text: "Email", value: "email", align: "center" },
        {
          text: "Número de associado",
          value: "association_number",
          align: "center"
        }
      ],

      dateBegin: null,
      dateEnd: null
    };
  },
  mounted() {},
  methods: {},
  computed: {
    actualList() {
      return this.optionSelected === 0 ? this.todayNewUsers : this.newUsers;
    },
    newUsers() {
      return this.$store.getters.users;
    },
    numNewUsers() {
      if (this.actualList) return this.actualList.length;
      return 0;
    }
  }
};
</script>

<style scoped>
.subTable {
  border-radius: 0px;
  border: 1px solid black;
}
</style>