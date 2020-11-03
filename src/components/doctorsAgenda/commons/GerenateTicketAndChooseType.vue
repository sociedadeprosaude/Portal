<template>
  <v-container fluid v-if="consultation" fluid class=" ma-0 pa-0">
    <v-layout row wrap class="align-center justify-center">
      <v-card flat class="item-to-print ma-0 mb-0">
        <v-card-title class="headline grey lighten-2">Gerar Senha Para o Paciente
          <v-divider class="transparent"></v-divider><v-btn  text @click="$emit('close')">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <span>Selecione o Tipo da senha a ser Gerada:</span>
            <v-checkbox
                v-model="type"
                label="NORMAL"
                value="normal"
            ></v-checkbox>
            <v-checkbox
                v-model="type"
                label="PREFERENCIAL"
                value="priority"
            ></v-checkbox>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              rounded
              color="primary"
              @click="dialog = false"
          >
            Gerar Senha
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  props: ['consultation'],
  name: "GerenateTicketAndChooseType",
  data () {
    return {
      type: undefined,
    }
  },
  apollo: {
    LoadSectorsOfUnity: {
      query: require("@/graphql/sectors/LoadSectorsOfUnity.gql"),
      variables () {
        return {
          id: this.consultation.clinic.id,
        }
      },
      update(data){
        let sectors = Object.assign(data.Clinic[0].has_sectors)
        console.log('setors of unity:', sectors)
        for (let sector in sectors){
          if(sectors[sector].has_rooms){
            for(let room in sectors[sector].has_rooms){
              if(sectors[sector].has_rooms[room].doctor){
                if(sectors[sector].has_rooms[room].doctor.id === this.consultation.doctor.id){
                  //update da room.id room.room_has_tickets
                  this.gerenateTicketforPatient(sectors[sector].has_rooms[room].id);
                }
              }
            }
          }
        }
      },
    }
  },
  methods:{
    async gerenateTicketforPatient(idRoom){
      console.log('id',idRoom)
      //criar ticket para a sala
      //add relation ticket romm
      //add relation ticket patient
      //add
    }
  },
  mounted() {
    console.log('componente:', this.consultation)
  }
}
</script>