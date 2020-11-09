<template>
  <v-container v-if="consultation" fluid class=" ma-0 pa-0">
    <v-layout row wrap class="align-center justify-center">
      <v-card flat class="item-to-print ma-0 mb-0">
        <v-card-title class="headline grey lighten-2">Selecione o Tipo da Senha
          <v-divider class="transparent"></v-divider><v-btn  text @click="$emit('close')">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>
<!--        C:{{this.consultation}}<br/>
        S:{{this.sector}}<br/>
        R:{{this.room}}<br/>
        T:{{this.ticket}}<br/>-->
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
          <div v-if="!ticket">
          <v-btn v-if="room" rounded color="primary" :disabled="!type" @click="gerenateTicketforPatient" :loading="loading">Gerar Senha</v-btn>
          <v-alert v-if="!room" class="justify-center align-center" type="warning"><strong>{{consultation.doctor.name}}</strong> Ainda não está dentro de nenhuma sala.</v-alert>
          </div>
          <div v-if="ticket">
            <v-alert v-if="ticket" class="justify-center align-center" type="error">Já existe um senha criada para: <strong>{{consultation.patient.name}}</strong></v-alert>
          </div>
        </v-card-actions>
      </v-card>
    </v-layout>

    <v-dialog v-model="dialog" width="300">
      <v-card>
        <v-card-title class="headline grey lighten-2">Senha Gerada <v-spacer/><v-btn class="transparent" small text fab @click="dialog = false"><v-icon>close</v-icon></v-btn> </v-card-title>
        <v-card-text>
          <br/><br/>
          <span style="font-weight: bold; color: #003B8F; font-size: xx-large">
            Sala: {{this.room.name}}
          </span><br/>
          <span style="font-weight: bold; color: #003B8F; font-size: xx-large">
            Senha: {{ticketName}}
          </span><br/>
          <span style="font-weight: bold; color: deeppink; font-size: xx-large">{{type === 'normal' ? 'Normal' : 'Preferencial' }}</span>
          <br/><br/>
        </v-card-text>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
export default {
  props: ['consultation', 'room', 'sector', 'ticket'],
  name: "GerenateTicketAndChooseType",
  data () {
    return {
      type: undefined,
      dialog: false,
      ticketName: undefined,
      loading: false,
    }
  },
  apollo: {
    LoadRoomOnly: {
      query: require("@/graphql/rooms/LoadRoomOnly.gql"),
      variables () {
        return {
          id: this.room.id,
        }
      },
      update(data){
        this.room = Object.assign(data.Room[0])
        console.log('query', this.room)
      },
      //pollInterval: 300, // ms
    },
  },
  methods:{
    async gerenateTicketforPatient(){
      await this.$apollo.queries.LoadRoomOnly.refresh()
      this.loading = true
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
          this.ticketName = dataTicket.data.CreateTicket.name
          await this.$apollo.mutate({
            mutation: require('@/graphql/tickets/AddRelationsRoomTicket.gql'),
            variables: {
              idTicket: idTicket,
              idRoom: this.room.id,
            },
          });
          //add relation ticket consultation
          await this.$apollo.mutate({
            mutation: require('@/graphql/tickets/AddTicketConsultation.gql'),
            variables: {
              idConsultation: this.consultation.id,
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
          this.ticketName = dataTicket.data.CreateTicket.name
          await this.$apollo.mutate({
            mutation: require('@/graphql/tickets/AddRelationsRoomTicket.gql'),
            variables: {
              idTicket: idTicket,
              idRoom: this.room.id,
            },
          });
          //add relation ticket consultation
          await this.$apollo.mutate({
            mutation: require('@/graphql/tickets/AddTicketConsultation.gql'),
            variables: {
              idConsultation: this.consultation.id,
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
          this.ticketName = dataTicket.data.CreateTicket.name
          await this.$apollo.mutate({
            mutation: require('@/graphql/tickets/AddRelationsRoomTicket.gql'),
            variables: {
              idTicket: idTicket,
              idRoom: this.room.id,
            },
          });
          //add relation ticket consultation
          await this.$apollo.mutate({
            mutation: require('@/graphql/tickets/AddTicketConsultation.gql'),
            variables: {
              idConsultation: this.consultation.id,
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
          this.ticketName = dataTicket.data.CreateTicket.name
          await this.$apollo.mutate({
            mutation: require('@/graphql/tickets/AddRelationsRoomTicket.gql'),
            variables: {
              idTicket: idTicket,
              idRoom: this.room.id,
            },
          });
          //add relation ticket consultation
          await this.$apollo.mutate({
            mutation: require('@/graphql/tickets/AddTicketConsultation.gql'),
            variables: {
              idConsultation: this.consultation.id,
              idTicket: idTicket,
            },
          });
        }
      }
      this.loading = false
      this.dialog = true
      await this.$apollo.queries.LoadRoomOnly.refresh()
    },
  },
  async mounted() {
    console.log('consulta:', this.consultation)
    console.log('setor:',this.sector)
    console.log('sala:', this.room)
    console.log('senha:', this.ticket)
    //await this.$apollo.queries.LoadRoomOnly.refresh()
  }
}
</script>