<template>
  <v-combobox
    class="mx-5"
    prepend-icon="location_city"
    v-model="model"
    :items="items"
    item-text="name"
    return-object
    label="Clínica"
    no-data-text="Nenhum médico para esta especialidade"
    outlined
    rounded
    chips
    dense
    color="purple"
    clearable
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