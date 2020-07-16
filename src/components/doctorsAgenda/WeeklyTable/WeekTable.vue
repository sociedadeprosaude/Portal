<template>
  <v-data-table
    hide-default-header
    hide-default-footer
    :headers="headers"
    :items="items"
    :items-per-page="-1"
    item-key="hour"
    class="elevation-1"
  >
    <template v-slot:header="{}">
      <thead>
        <tr>
          <th class="text-center primary white--text">Hora</th>
          <th class="text-center primary white--text">Segunda</th>
          <th class="text-center primary white--text">Terça</th>
          <th class="text-center primary white--text">Quarta</th>
          <th class="text-center primary white--text">Quinta</th>
          <th class="text-center primary white--text">Sexta</th>
          <th class="text-center primary white--text">Sabado</th>
        </tr>
      </thead>
    </template>

    <template v-slot:item.hour="{ item }">
      <v-avatar tile color="primary">
        <span style="color: white">{{item.hour}}</span>
      </v-avatar>
    </template>

    <template v-slot:item.monday="{ item }">
      <ListByDay :schedules="item.monday" :day="1" @updateDay="$emit('updateDay',$event)" @removeDay="$emit('removeDay',$event)"></ListByDay>
      <br />
    </template>

    <template v-slot:item.tuesday="{ item }">
      <ListByDay :schedules="item.tuesday" :day="2" @updateDay="$emit('updateDay',$event)" @removeDay="$emit('removeDay',$event)"></ListByDay>
      <br />
    </template>

    <template v-slot:item.wednesday="{ item }">
      <ListByDay :schedules="item.wednesday" :day="3" @updateDay="$emit('updateDay',$event)" @removeDay="$emit('removeDay',$event)"></ListByDay>
      <br />
    </template>

    <template v-slot:item.thursday="{ item }">
      <ListByDay :schedules="item.thursday" :day="4" @updateDay="$emit('updateDay',$event)" @removeDay="$emit('removeDay',$event)"></ListByDay>
      <br />
    </template>

    <template v-slot:item.friday="{ item }">
      <ListByDay :schedules="item.friday" :day="5" @updateDay="$emit('updateDay',$event)" @removeDay="$emit('removeDay',$event)"></ListByDay>
      <br />
    </template>

    <template v-slot:item.saturday="{ item }">
      <ListByDay :schedules="item.saturday" :day="6" @updateDay="$emit('updateDay',$event)" @removeDay="$emit('removeDay',$event)"></ListByDay>
      <br />
    </template>
  </v-data-table>
</template>

<script>
import ListByDay from "./ListByDay";
export default {
  props: ["items"],
  data: () => ({
    headers: [
      { text: "Hora", value: "hour", align: "center", sortable: true },
      { text: "Segunda", value: "monday", align: "center", sortable: false },
      { text: "Terça", value: "tuesday", align: "center", sortable: false },
      { text: "Quarta", value: "wednesday", align: "center", sortable: false },
      { text: "Quinta", value: "thursday", align: "center", sortable: false },
      { text: "Sexta", value: "friday", align: "center", sortable: false },
      { text: "Sabado", value: "saturday", align: "center", sortable: false }
    ]
  }),
  components: {
    ListByDay
  }
};
</script>

<style>
</style>