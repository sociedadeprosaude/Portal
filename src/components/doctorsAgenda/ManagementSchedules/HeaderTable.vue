<template>
  <v-row>
    <v-col :xs="12" :md="4">
      <h1 class="headline">Gerenciamento de consultas</h1>
    </v-col>

    <v-col class="py-0 my-0" :xs="12" :md="4">
      <ComboboxClinic :items="clinics" @model="$emit('filterClinic',$event)" />
    </v-col>

    <v-col :xs="12" :md="4">
      <v-btn class="primary" @click="dialogNewSchedule=true">
        <v-icon>add</v-icon>Criar nova agenda
      </v-btn>
    </v-col>

    <v-col cols="12">
      <v-checkbox
        class="ml-12 pl-3 py-0 my-0"
        v-model="examTypeCheck"
        label="Listar agendas de exames"
      ></v-checkbox>
    </v-col>
    <v-dialog v-model="dialogNewSchedule">
      <v-card>
        <v-card-title>
          <span class="headline">Criar nova agenda</span>
        </v-card-title>
        <v-card-text>
          <CardAddSchedule ref="newSchedule"></CardAddSchedule>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogNewSchedule = false">Cancelar</v-btn>
          <v-btn :loading="loading" color="blue darken-1" text @click="callSaveNewSchedule">Criar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import ComboboxClinic from "../../Common/ComboboxClinic";
import CardAddSchedule from "./CardAddSchedule";
export default {
    props:['clinics'],
    components:{
        ComboboxClinic,
        CardAddSchedule
    },
    data:()=>({
        examTypeCheck: false,
        dialogNewSchedule: false,
        loading:false,
    }),
    watch:{
        examTypeCheck(value){
            this.$emit('examTypeCheck',value)
        }
    },
    methods:{
        async callSaveNewSchedule() {
            this.loading = true;
            await this.$refs.newSchedule.saveNewSchedule();
            this.dialogNewSchedule = false;
            this.loading = false;
        },
    }
};
</script>

<style>
</style>