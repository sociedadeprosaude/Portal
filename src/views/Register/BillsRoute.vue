<template>
  <v-container>
    <BillsMobile v-if="this.$vuetify.breakpoint.xs" />
    <Bills
      v-else
      v-bind:other="other"
      v-bind:billsOptions="billsOptions"
      v-bind:dialogSelectDate="dialogSelectDate"
      v-bind:dialogCategory="dialogCategory"
      :switchDate.sync="switchDate"
      v-bind:switchCategory="switchCategory"
      v-bind:selectedOption="selectedOption"
      v-bind:selectedDate="selectedDate"
      v-bind:selectedCategory="selectedCategory"
      v-bind:loading="loading"
      v-bind:loadingFilter="loadingFilter"
      v-bind:loadingDelete="loadingDelete"
      v-bind:outtakeSelect="outtakeSelect"
      v-bind:files="files"
      v-bind:filesPreviews="filesPreviews"
      v-bind:outtakesPaid="outtakesPaid"
      v-bind:outtakesPaidToday="outtakesPaidToday"
      v-bind:pendingOuttakes="pendingOuttakes"
      v-bind:selectedPaidOuttakesList="selectedPaidOuttakesList"
      v-bind:categories="categories"
      :getOuttakesPaid="getOuttakesPaid"
      :unpayOuttake="unpayOuttake"
      :openAppend="openAppend"
      @change-selectedOption="(value)=>selectedOption=value"
      @change-switchDate="(value)=>switchDate=value"
      @change-switchCategory="(value)=>switchCategory=value"
      @change-selectedDate="(value)=>selectedDate=value"
      @change-selectedCategory="(value)=>selectedCategory=value"
    ></Bills>
  </v-container>
</template>

<script>
import Bills from "@/components/pagamento/Bills";
import BillsMobile from "@/views/Register/BillsMobile";

import moment from "moment";
export default {
  components: {
    Bills,
    BillsMobile
  },
  data() {
    return {
      other: "Outro",
      billsOptions: ["De hoje", "Filtrar"],
      dialogSelectDate: false,
      dialogCategory: false,
      switchDate: true,
      switchCategory: false,
      selectedOption: 0,
      selectedDate: moment().format("YYYY-MM-DD"),
      selectedCategory: "",
      loading: false,
      loadingFilter: false,
      loadingDelete: false,
      outtakeSelect: null,
      files: [],
      filesPreviews: [],
      mask: {
        number: "###"
      }
    };
  },
  mounted() {
    
    this.initiate();
  },
  computed: {
    outtakesPaid() {
      return this.$store.getters.outtakesPaid.sort((a, b) => {
        return b.date_to_pay > a.date_to_pay ? 1 : -1;
      });
    },
    outtakesPaidToday() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.$store.getters.outtakesPaidToday.sort((a, b) =>
        b.date_to_pay > a.date_to_pay ? 1 : -1
      );
    },
    selectedPaidOuttakesList() {
      return this.selectedOption == 0
        ? this.outtakesPaidToday
        : this.outtakesPaid;
    },
    pendingOuttakes() {
      return this.$store.getters.outtakesPending.sort((a, b) => {
        return b.date_to_pay < a.date_to_pay ? 1 : -1;
      });
    },
    categories() {
      return this.$store.getters.outtakesCategories;
    }
  },
  watch: {
    selectedDate(val) {
      this.getOuttakesPaid();
    },
    selectedCategory(val) {
      this.getOuttakesPaid();
    },
    switchDate(val) {
      this.getOuttakesPaid();
    },
    switchCategory(val) {
      this.getOuttakesPaid();
    },
    selectedOption(val) {
      if (val == 1) {
        this.switchDate = true;
      }
    }
  },
  methods: {
    async initiate() {
      this.loading = true;
      await this.$store.dispatch("getOuttakesCategories");
      await this.$store.dispatch("getOuttakesPending", {
        finalDate: moment()
          .add(5, "days")
          .format("YYYY-MM-DD 23:59:59")
      });
      await this.$store.dispatch("getOuttakesPaidToday");
      this.loading = false;
      this.selectedCategory =
        this.categories.length != 0 ? this.categories[0] : "";
    },
    async getOuttakesPaid() {
      this.loadingFilter = true;
      await this.$store.dispatch("getOuttakesPaid", {
        initialDate: this.switchDate
          ? moment(this.selectedDate).format("YYYY-MM-DD 00:00:00")
          : null,
        finalDate: this.switchDate
          ? moment(this.selectedDate).format("YYYY-MM-DD 23:59:59")
          : null,
        category: this.switchCategory ? this.selectedCategory : null
      });
      this.loadingFilter = false;
    },
    async unpayOuttake(outtake) {
      this.loadingDelete = true;
      this.outtakeSelect = outtake;
      await this.$store.dispatch("updateOuttake", {
        outtake: outtake,
        field: "paid",
        value: "delete"
      });
      await this.$store.dispatch("getOuttakes", {
        finalDate: moment()
          .add(5, "days")
          .format("YYYY-MM-DD 23:59:59")
      });
      this.outtakeSelect = {};
      this.loadingDelete = false;
    },
    openAppend(append) {
      window.open(append);
    }
  }
};
</script>