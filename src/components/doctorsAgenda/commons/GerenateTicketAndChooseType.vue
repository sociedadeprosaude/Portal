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
          <v-icon x-large :color="type === 'normal' ? 'info': ''">wc</v-icon>
          <v-checkbox
              v-model="type"
              label="PREFERENCIAL"
              value="priority"
          ></v-checkbox>
          <v-icon x-large :color="type === 'priority' ? 'info': ''">elderly</v-icon>
          <v-icon x-large :color="type === 'priority' ? 'info': ''">pregnant_woman</v-icon>
          <v-icon x-large :color="type === 'priority' ? 'info': ''">accessible</v-icon>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-if="inside === true" rounded color="primary" :disabled="!type">Gerar Senha</v-btn>
          <v-alert class="justify-center align-center" v-else type="warning"><strong>{{consultation.doctor.name}}</strong> Ainda não está dentro de nenhuma sala.</v-alert>
        </v-card-actions>
      </v-card>
    </v-layout>

    <v-dialog v-model="dialog" width="300">
      <v-card>
        <v-card-title class="headline grey lighten-2">Senha Gerada <v-spacer/><v-btn class="transparent" small text fab @click="dialog = false"><v-icon>close</v-icon></v-btn> </v-card-title>
        <v-card-text>
          <br/><br/>
          <span style="font-weight: bold; color: #003B8F; font-size: xx-large">
            Sala: {{roomName}}
          </span><br/>
          <span style="font-weight: bold; color: #003B8F; font-size: xx-large">
            Senha: 5 {{ticket}}
          </span>
          <br/><br/>
        </v-card-text>
      </v-card>
    </v-dialog>

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
      dialog: false,
      roomName: undefined,
      room: undefined,
      ticket: undefined,
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
        for (let sector in sectors){
          if(sectors[sector].has_rooms){
            for(let room in sectors[sector].has_rooms){
              if(sectors[sector].has_rooms[room].doctor){
                if(sectors[sector].has_rooms[room].doctor.id === this.consultation.doctor.id){
                  this.inside = true
                  this.roomName = sectors[sector].has_rooms[room].name
                  this.room = sectors[sector].has_rooms[room]
                }
              }
            }
          }
        }
      },
    }
  },
  methods:{
    async gerenateTicketforPatient(){
/*      console.log('room', this.room)
      console.log('leng:', this.room.room_has_tickets.length)
      console.log('idDoctor', this.consultation.doctor.id)*/
      if(this.room.room_has_tickets.length > 0){
        console.log('gerando quando tem + de 0(zero)')
        let count = this.room.room_has_tickets.length + 1
        count = count.toString();
        if(this.type === 'normal'){
          console.log('Gerar Normal')
          const dataTicket = await this.$apollo.mutate({
            mutation: require('@/graphql/tickets/CreateTicket.gql'),
            variables: {
              name: count,
              type: "normal",
              created_at: { formatted : moment().format('YYYY-MM-DDTHH:mm:ss')}
            },
          });
          //add relation ticket romm
          const idTicket = dataTicket.data.CreateTicket.id
          this.ticket = dataTicket.data.CreateTicket.name
          await this.$apollo.mutate({
            mutation: require('@/graphql/tickets/AddRelationsRoomTicket.gql'),
            variables: {
              idTicket: idTicket,
              idRoom: this.room.id,
            },
          });
          //add relation ticket patient
          await this.$apollo.mutate({
            mutation: require('@/graphql/tickets/AddTicketPatient.gql'),
            variables: {
              idPatient: this.consultation.patient.id,
              idTicket: idTicket,
            },
          });
        } else {
          console.log('Gerar Prioridade')
          const dataTicket = await this.$apollo.mutate({
            mutation: require('@/graphql/tickets/CreateTicket.gql'),
            variables: {
              name: count,
              type: "priority",
              created_at: { formatted : moment().format('YYYY-MM-DDTHH:mm:ss')}
            },
          });
          //add relation ticket romm
          const idTicket = dataTicket.data.CreateTicket.id
          this.ticket = dataTicket.data.CreateTicket.name
          await this.$apollo.mutate({
            mutation: require('@/graphql/tickets/AddRelationsRoomTicket.gql'),
            variables: {
              idTicket: idTicket,
              idRoom: this.room.id,
            },
          });
          //add relation ticket patient
          await this.$apollo.mutate({
            mutation: require('@/graphql/tickets/AddTicketPatient.gql'),
            variables: {
              idPatient: this.consultation.patient.id,
              idTicket: idTicket,
            },
          });
        }
      } else {
        let count = 1
        count = count.toString();
        if(this.type === 'normal'){
          console.log('Gerar Normal')
          const dataTicket = await this.$apollo.mutate({
            mutation: require('@/graphql/tickets/CreateTicket.gql'),
            variables: {
              name: count,
              type: "normal",
              created_at: { formatted : moment().format('YYYY-MM-DDTHH:mm:ss')}
            },
          });
          //add relation ticket romm
          const idTicket = dataTicket.data.CreateTicket.id
          this.ticket = dataTicket.data.CreateTicket.name
          await this.$apollo.mutate({
            mutation: require('@/graphql/tickets/AddRelationsRoomTicket.gql'),
            variables: {
              idTicket: idTicket,
              idRoom: this.room.id,
            },
          });
          //add relation ticket patient
          await this.$apollo.mutate({
            mutation: require('@/graphql/tickets/AddTicketPatient.gql'),
            variables: {
              idPatient: this.consultation.patient.id,
              idTicket: idTicket,
            },
          });
        } else {
          console.log('Gerar Prioridade')
          const dataTicket = await this.$apollo.mutate({
            mutation: require('@/graphql/tickets/CreateTicket.gql'),
            variables: {
              name: count,
              type: "priority",
              created_at: { formatted : moment().format('YYYY-MM-DDTHH:mm:ss')}
            },
          });
          //add relation ticket romm
          const idTicket = dataTicket.data.CreateTicket.id
          this.ticket = dataTicket.data.CreateTicket.name
          await this.$apollo.mutate({
            mutation: require('@/graphql/tickets/AddRelationsRoomTicket.gql'),
            variables: {
              idTicket: idTicket,
              idRoom: this.room.id,
            },
          });
          //add relation ticket patient
          await this.$apollo.mutate({
            mutation: require('@/graphql/tickets/AddTicketPatient.gql'),
            variables: {
              idPatient: this.consultation.patient.id,
              idTicket: idTicket,
            },
          });
        }
      }
      this.dialog = true
    },
  },
  mounted() {
    console.log('componente:', this.consultation)
  }
}
</script>