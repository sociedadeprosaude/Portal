<template>
  <div class="text-right">
    <v-dialog
      v-model="dialog"
      scrollable
      persistent
      max-width="600"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          style="text-transform:none"
          class="subtitle-1"
          dark
          v-bind="attrs"
          v-on="on"
        >
          Observações
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="headline justify-center">
          <h1 class="headline">Observações da Agenda</h1>
        </v-card-title>
        <v-card-subtitle class="px-5 mt-1">
            <v-row>
                <v-col cols="9"><v-text-field v-model="newObservation" label="Adicione uma nova observação" dense></v-text-field></v-col>
                <v-col cols="3"> 
                    <v-btn
                        color="primary"
                        style="text-transform:none"
                        class="subtitle-1"
                        @click="addObservation"
                    >
                        Adicionar
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-subtitle>
        <v-divider></v-divider>
        <v-card-text>
            <v-list v-if="observations.length > 0">
                <v-list-item-group>
                    <template  v-for="(observation,index) in observations">
                    <v-list-item :key="index">
                        <template >
                        <v-list-item-content class="text-left">
                            <v-list-item-title v-text="observation"></v-list-item-title>
                        </v-list-item-content>

                        <v-list-item-action>
                            <v-btn icon @click="deleteObservation(index)" ><v-icon>delete</v-icon></v-btn>
                        </v-list-item-action>
                        </template>
                    </v-list-item>

                    <v-divider
                        v-if="index < observations.length - 1"
                        :key="`divider-${index}`"
                    ></v-divider>
                    </template>
                </v-list-item-group>
            </v-list>
            <span v-else>Não há observações para a agenda!</span>
        </v-card-text>
       
       <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            Cancelar
          </v-btn>
          <ApolloMutation
            :mutation="require('@/graphql/schedules/UpdateObservations.gql')"
            :variables="{
                id:schedule.id,
                observations:observations
            }"
            @done="afterSave"
            >
            <template v-slot="{ mutate, loading }">
                <v-btn
                    color="primary"
                    text
                    :loading="loading" @click="mutate()"
                >
                    Salvar
                </v-btn>
            </template>
        </ApolloMutation>   
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  export default {
    props:['schedule'],
    data () {
      return {
        dialog: false,
        newObservation:undefined,
        observations:[]
      }
    },
    watch:{
        dialog(value){
            if(value){
                this.observations = Object.assign([],this.schedule.observations)
            }
        }
    },
    methods:{
        addObservation(){
            if(this.newObservation){
                this.observations.push(this.newObservation)
                this.newObservation = undefined
            }
        },
        deleteObservation(index){
            this.observations.splice(index,1);
        },
        afterSave(){
            this.dialog = false;
            this.schedule.observations = this.observations;
        }
    }
  }
</script>