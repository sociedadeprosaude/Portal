<template>
    <v-combobox
      label="Especialidade"
      prepend-icon="school"
      v-model="model"
      :items="items"
      item-text="name"
      return-object
      outlined
      rounded
      filled
      chips
      color="pink"
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
    props:['items'],
    data:()=>({
        model:undefined
    }),
    watch:{
        model(value){
          this.$emit('model',value)
        }
    }
};
</script>

<style>
</style>