
// import Badge from "../components/Badge";


import BaseHeader from "@/components/Argon/BaseHeader";
import StatsCard from "@/components/Argon/StatsCard";

export default {
  install(Vue) {
    Vue.component(BaseHeader.name, BaseHeader);

    Vue.component(StatsCard.name, StatsCard);
   
  }
};