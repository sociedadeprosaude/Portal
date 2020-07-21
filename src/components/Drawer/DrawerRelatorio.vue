<template>
  <v-navigation-drawer
    hide-overlay
    :right="false"
    v-model="overviewDrawer"
    absolute
    temporary
    disable-resize-watcher
    app
    dark
    clipped
  >
    <v-list dense>
      <v-list-item
        v-for="(item,index) in items"
        :key="index"
        link
        @click="selected = index; $emit('change-selected',index); overviewDrawer=false"
      >
        <v-list-item-content>
          <v-list-item-title>{{item}}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: [],
  data() {
    return {
      selected: 0,
      items: [
        "Relatório Financeiro Geral",
        "Relatório Luiz Fernando",
        "Produção do Colaborador",
        "Relatório de Vendas",
        "Analise de preço de exames",
        "Exames mais vendidos",
        "Consultas mais vendidas",
        "Relatório de Saídas",
        "Novos associados",
        "Relatório Especialidades",
        "Relatório Consulta Marcada x Realizada",
        "Relatorio Paciente por Procedimento",
        "Intakes",
        "Outtakes",
        "Outtakes clinicas",
        "Clientes"
      ]
    };
  },
  mounted() {},
  methods: {},
  computed: {
    overviewDrawer: {
      get() {
        return this.$store.getters.overviewDrawer;
      },
      set(val) {
        this.$store.dispatch("overviewToggle", val);
      }
    }
  }
};
</script>

<style>
</style>