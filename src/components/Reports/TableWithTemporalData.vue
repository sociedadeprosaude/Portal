<template>
  <v-container fluid>
    <v-col cols="12" xs="12">
      <v-card>
        <v-card-title>
          <v-text-field
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
            :loading="loading"
            loading-text="Loading... Please wait"
            :items-per-page="-1"
            class="elevation-1"
            hide-default-footer
            hide-default-header
        >
          <template v-slot:header="{}">
            <thead>
            <tr>
              <th class="text-center purple white--text">Médico</th>
              <th class="text-center purple white--text">Unidade</th>
              <th class="text-center purple white--text">Especialidade</th>
              <th class="text-center purple white--text">Quantidade: Consultas e Retornos</th>
              <th class="text-center purple white--text">Duração Média : Consultas e Retornos</th>
              <th class="text-center purple white--text">Duração Média : GERAL</th>
              <th class="text-center purple white--text">Tempo de Espera Médio : Consultas e Retornos</th>
              <th class="text-center purple white--text">Tempo de Espera Médio : GERAL</th>
            </tr>
            </thead>
          </template>

          <template v-slot:item.overallDuration="{ item }">
            <v-chip dark color="purple">
              <strong>{{ item.overallDuration }} mim</strong>
            </v-chip>
          </template>

          <template v-slot:item.durations="{ item }">
            <v-chip dark color="purple">
              <strong>{{ item.durations }} mim</strong>
            </v-chip>
          </template>

          <template v-slot:item.waitingTimes="{ item }">
            <v-chip dark color="purple">
              <strong>{{ item.waitingTimes }} mim</strong>
            </v-chip>
          </template>

          <template v-slot:item.overallWaitingTime="{ item }">
            <v-chip dark color="purple">
              <strong>{{ item.overallWaitingTime }} mim</strong>
            </v-chip>
          </template>

        </v-data-table>
      </v-card>
    </v-col>
  </v-container>
</template>

<script>
export default {
  props: ["loading","desserts"],
  data () {
    return {
      search: '',
      //loading: true,
      headers: [
        { text: 'Médico', filterable: false, value: 'doctor', align: 'start' },
        { text: 'Unidade', value: 'unity', filterable: false, align: 'center' },
        { text: 'Especialidade', value: 'specialty', filterable: false, align: 'center' },
        { text: 'qtd: Consultas e Retornos', value: 'qtds', filterable: false, align: 'center' },
        { text: 'Duração Média : Consultas e Retornos', value: 'durations', filterable: false, align: 'center' },
        { text: 'Duração Média GERAL', value: 'overallDuration', filterable: false, align: 'center'},
        { text: 'Tempo de Espera Médio : Consultas e Retornos', value: 'waitingTimes', filterable: false, align: 'center' },
        { text: 'Tempo de Espera Médio : GERAL', value: 'overallWaitingTime', filterable: false, align: 'center' },
      ],
    }
  },
}
</script>