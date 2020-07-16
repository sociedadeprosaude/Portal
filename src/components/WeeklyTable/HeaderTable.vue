<template>
  <v-card-title>
    Tabela Semanal dos Médicos - Especialidades - Unidades:
    <v-divider vertical class="mx-4" inset></v-divider>
    <v-chip label dark color="primary">Médico - Especialidade - Unidade</v-chip>
    <v-spacer />
    <v-layout class="mt-5" row wrap>
      <v-flex class="mr-5" xs12 sm5 md4>
        <ComboboxSpecialty :items="specialties" v-on:model="specialty=$event"></ComboboxSpecialty>
      </v-flex>
      <v-flex xs12 sm5 md4>
        <ComboboxDoctor :items="doctors" v-on:model="doctor=$event"></ComboboxDoctor>
      </v-flex>
    </v-layout>
  </v-card-title>
</template>

<script>
import ComboboxSpecialty from '../../../components/Common/ComboboxSpecialty'
import ComboboxDoctor from '../../../components/Common/ComboboxDoctor'
export default {
    components:{
        ComboboxSpecialty,
        ComboboxDoctor
    },
    data:()=>({
        
    })
};
</script>

<style>
</style>