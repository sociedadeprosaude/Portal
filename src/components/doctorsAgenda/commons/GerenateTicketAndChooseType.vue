<template>
  <v-container fluid v-if="consultation" fluid class=" ma-0 pa-0">
    <v-layout row wrap class="align-center justify-center">
      <v-card flat class="item-to-print ma-0 mb-0">
        <v-card-title class="headline grey lighten-2">Selecione o Tipo da Senha
          <v-divider class="transparent"></v-divider><v-btn  text @click="$emit('close')">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
            <v-checkbox
                v-model="type"
                label="NORMAL"
                value="normal"
            ></v-checkbox>
          <v-icon> </v-icon>
            <v-checkbox
                v-model="type"
                label="PREFERENCIAL"
                value="priority"
            ></v-checkbox>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-if="inside === true" rounded color="primary" @click="dialog = false" :disabled="!type">Gerar Senha</v-btn>
          <v-alert class="justify-center align-center" v-else type="warning"><strong>{{consultation.doctor.name}}</strong> Ainda não está dentro de nenhuma sala.</v-alert>
        </v-card-actions>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
import Alert from "@/components/alert";
export default {
  components: {Alert},
  props: ['consultation'],
  name: "GerenateTicketAndChooseType",
  data () {
    return {
      type: undefined,
      inside: false,
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
        console.log('G:', sectors)
        for (let sector in sectors){
          if(sectors[sector].has_rooms){
            for(let room in sectors[sector].has_rooms){
              if(sectors[sector].has_rooms[room].doctor){
                if(sectors[sector].has_rooms[room].doctor.id === this.consultation.doctor.id){
                  this.inside = true
                  this.gerenateTicketforPatient(sectors[sector].has_rooms[room]);
                }
              }
            }
          }
        }
      },
    }
  },
  methods:{
    async gerenateTicketforPatient(room){
      console.log('room', room)
      console.log('leng:', room.room_has_tickets.length)
      console.log('idDoctor', this.consultation.doctor.id)
      //criar ticket para a sala
      if(room.room_has_tickets.length > 0){
        let count = room.room_has_tickets.length + 1
        if(this.type === 'normal'){
          console.log('GN')
          const dataTicket = await this.$apollo.mutate({
            mutation: require('@/graphql/tickets/CreateTicket.gql'),
            variables: {
              name: count,
              type: "priority",
              created_at: { formatted : moment().format('YYYY-MM-DDTHH:mm:ss')}
            },
          });
          //add relation ticket romm
          //add relation ticket patient
          const idTicket = dataTicket.data.CreateTicket.id
          await this.$apollo.mutate({
            mutation: require('@/graphql/tickets/AddRelationsSectorTicket.gql'),
            variables: {
              idTicket: idTicket,
              idSector: this.sector.id,
            },
          });
          //ultima prioridade do setor
          await this.$apollo.mutate({
            mutation: require('@/graphql/sectors/UpdateSector.gql'),
            variables: {
              id: this.sector.id,
              counter_reset: 0,
              counter_normal: this.sector.counter_normal,
              counter_priority: this.sector.counter_priority = this.sector.counter_priority + 1,
            },
          });
        } else {
          console.log('GP')
        }
      } else {
        let count = 1
        //
      }
    }
  },
  mounted() {
    console.log('componente:', this.consultation)
  }
}
</script>