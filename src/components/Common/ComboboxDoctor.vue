<template>
  <v-combobox
    prepend-icon="account_circle"
    v-model="model"
    :items="items"
    item-text="name"
    return-object
    label="Médico"
    no-data-text="Nenhum médico para esta especialidade"
    outlined
    rounded
    filled
    chips
    color="purple"
    clearable
    dense
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

<script>
export default {
  props: ["items"],
  data: () => ({
    model: undefined
  }),
  watch: {
    model(value) {
      this.$emit("model", value);
    }
  }
};
</script>

<style>
</style>