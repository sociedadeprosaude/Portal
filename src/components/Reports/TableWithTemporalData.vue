<template>
  <v-container fluid>
    <v-col cols="12" xs="12">
      <v-card>
        <v-card-title>
          <v-text-field
              v-model="search"
              append-icon="search"
              label="Search"
              single-line
              hide-details
              color="purple"
          ></v-text-field>
        </v-card-title>
        <v-data-table
            :headers="headers"
            :items="desserts"
            loading-text="Loading... Please wait"
            :items-per-page="-1"
            class="elevation-1"
            hide-default-footer
            hide-default-header
        >
          <template v-slot:header="{}">
            <thead>
            <tr>
              <th class="text-start purple white--text">Unidade</th>
              <th class="text-center purple white--text">Médico</th>
              <th class="text-center purple white--text">Especialidade</th>
              <th class="text-center purple white--text">Quantidade de Consultas</th>
              <th class="text-center purple white--text">Duração Média das Consultas</th>
              <th class="text-center purple white--text">Tempo de Espera Médio para Atendimento</th>
            </tr>
            </thead>
          </template>

          <template v-slot:item.qtd="{ item }">
            <strong>{{ item.qtd }}</strong>
          </template>

          <template v-slot:item.duration="{ item }">
            <strong>{{ item.duration }} mim</strong>
          </template>

          <template v-slot:item.waitingTime="{ item }">
            <strong>{{ item.waitingTime }} mim</strong>
          </template>

        </v-data-table>
      </v-card>
    </v-col>
  </v-container>
</template>

<script>
export default {
  props: ["desserts"],
  data () {
    return {
      search: '',
      headers: [
        { value: 'unity', align: 'start' },
        { value: 'doctor', align: 'center' },
        { value: 'specialty', align: 'center' },
        { value: 'qtd', align: 'center' },
        { value: 'duration', align: 'center' },
        { value: 'waitingTime', align: 'center' },
      ],
    }
  },
}
</script>