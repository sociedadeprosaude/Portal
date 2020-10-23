<template>
  <v-container>
    <v-layout>
      <v-flex xs12>
        <v-card v-if="collaborators && selectedUnit">
          <v-card-title>
            <span>Relatorio de Atendimentos por Colaborador</span>
            <v-spacer></v-spacer>
            <v-divider vertical></v-divider>
            <v-spacer></v-spacer>
            <v-text-field
                outlined
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
              :headers="headers"
              :items="desserts"
              :items-per-page="-1"
              :search="search"
              class="elevation-1"
          >
            <template v-slot:item.normal="{ item }">
              <v-chip
                  color="primary"
                  dark
              >
                <span style="font-weight: bold">{{ item.normal }}</span>
              </v-chip>
            </template>
            <template v-slot:item.priority="{ item }">
              <v-chip
                  color="blue"
                  dark
              >
                <span style="font-weight: bold">{{ item.priority }}</span>
              </v-chip>
            </template>
            <template v-slot:item.all="{ item }">
              <v-chip
                  color="green"
                  dark
              >
                <span style="font-weight: bold">{{ item.all }}</span>
              </v-chip>
            </template>
            <template v-slot:item.time="{ item }">
              <v-chip
                  color="purple"
                  dark
              >
                <span style="font-weight: bold">{{ item.time }}</span>
              </v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  props:["collaborators", "selectedUnit"],
  mounted() {
    if(this.selectedUnit){
      let val =  this.collaborators.filter(a => {
        return a.clinic;
      });
      let aux = val.filter(a => {
        return a.clinic.id === this.selectedUnit.id;
      });
      //console.log('filter1', val)
      //console.log('filter2', aux)
      this.collaborators = aux;
    }
    //fgdfhgdfgdf
    for (let collaborator in this.collaborators){
      let holder = {}
      if(this.collaborators[collaborator].name){
        holder.collaborator = this.collaborators[collaborator].name
      }
      if(this.collaborators[collaborator].clinic){
        holder.unity = this.collaborators[collaborator].clinic.name
      }
      holder.all = this.collaborators[collaborator].tickets_called_by_collaborator.length
      if(this.collaborators[collaborator].tickets_called_by_collaborator.length > 0){
        let n = this.collaborators[collaborator].tickets_called_by_collaborator.filter(a => {
          return a.type === 'normal';
        });
        holder.normal = n.length
        let p = this.collaborators[collaborator].tickets_called_by_collaborator.filter(a => {
          return a.type === 'priority';
        });
        holder.priority = p.length
      } else {
        holder.normal = 0
        holder.priority = 0
        holder.time = 0
      }
      this.desserts.push(holder)
    }
  },
  computed:{
    //
  },
  watch:{
    //
  },
  methods: {
    //
  },
  data () {
    return {
      search: '',
      headers: [
        { text: 'Nome', align: 'start', sortable: false, value: 'collaborator' },
        { text: 'Unidade', value: 'unity' , align: 'center', sortable: false,},
        { text: 'Atendimentos: NORMAL', value: 'normal' , align: 'center', sortable: false,},
        { text: 'Atendimentos: PRIORITY', value: 'priority' , align: 'center', sortable: false,},
        { text: 'Atendimentos: TOTAL', value: 'all' , align: 'center', sortable: false,},
        { text: 'Média dos Atendimentos (minutos)', value: 'time' , align: 'center', sortable: false,},
      ],
      desserts: [
/*        {
          collaborator: 'dummy',
          unity: 'dummy',
          normal: 20,
          priority: 6,
          all: 26,
          time: 6,
        },*/
      ],
    }
  },
}
</script>
<style scoped>
</style>