<template>
  <v-app>
    <v-layout
      v-for="(consultation, i) in consultationsByDoctors"
      :key="i"
      row
      wrap
      justify-center
      align-center
    >
      <v-container class="align-center justify-center py-0">
        <v-layout row align-center justify-center wrap>
          <v-spacer></v-spacer>
          <v-flex xs12 sm12 md12 lg12></v-flex>
          <v-flex xs12 sm12 md12 lg12></v-flex>
          <v-flex xs12 sm12 md12 lg12></v-flex>
          <v-spacer></v-spacer>
          <!-- <v-subheader v-if="consultationsByDoctors.length != 0">
            <b>{{start_date | dateFilter}} - {{daydate(start_date)}} até {{final_date | dateFilter}} - {{daydate(final_date)}}</b>
          </v-subheader> -->

          <v-expansion-panels>
            <v-expansion-panel class="elevation-6" hide-actions v-model="panel">
              <v-expansion-panel-header>
                <v-layout align-center row spacer>
                  <v-flex xs4 hidden-xs-only>
                    <strong>Médico:</strong>
                    <v-chip small color="blue" text-color="white">
                      <v-avatar>
                        <v-icon>account_circle</v-icon>
                      </v-avatar>
                      {{consultation.doctor.name}}
                    </v-chip>
                  </v-flex>

                  <v-flex xs2 hidden-xs-only>
                    <strong>CRM-AM:</strong>
                    <v-chip small color="blue" text-color="white">
                      <v-avatar>
                        <v-icon>payment</v-icon>
                      </v-avatar>
                      {{consultation.doctor.crm}}
                    </v-chip>
                  </v-flex>

                  <v-flex row wrap xs2 class="text-xs-right blue--text">
                    <v-layout column wrap>
                      <strong>Vagas:</strong>
                      <v-chip small color="blue" text-color="white">
                        <v-avatar>
                          <v-icon>event</v-icon>
                        </v-avatar>
                        {{consultation.vacancy}}
                      </v-chip>
                    </v-layout>
                  </v-flex>

                  <v-flex row wrap xs2 class="text-xs-right blue--text">
                    <v-layout column wrap>
                      <strong>Consultas:</strong>
                      <v-chip small color="blue" text-color="white">
                        <v-avatar>
                          <v-icon>event</v-icon>
                        </v-avatar>
                        {{consultation.numConsultations}}
                      </v-chip>
                    </v-layout>
                  </v-flex>

                  <v-flex row wrap xs2 class="text-xs-right blue--text">
                    <v-layout column wrap>
                      <strong>Retornos:</strong>
                      <v-chip small color="blue" text-color="white">
                        <v-avatar>
                          <v-icon>restore</v-icon>
                        </v-avatar>
                        {{consultation.numRegress}}
                      </v-chip>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-expansion-panel-header>

              <v-expansion-panel-content>
                <v-divider></v-divider>
                <v-card class="elevation-0">
                  <v-list three-line subheader>
                    <v-layout wrap>
                      <v-flex
                        sm3
                        xs12
                        v-for="item in consultation.consultations"
                        :key="item.id"
                        v-if="item.user"
                        v-show="filterHour === false && filterDayWeek === false"
                      >
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title class="primary--text">
                              <span style="font-weight: bolder">{{item.user.name}}</span>
                            </v-list-item-title>
                            <br />
                            <v-list-item-subtitle class="text-center">CPF: {{item.user.cpf}}</v-list-item-subtitle>
                            <br />
                            <v-list-item-subtitle>Telefone: {{item.user.telephones ? item.user.telephones[0] : 'Número não informado'}}</v-list-item-subtitle>
                            <br />
                            <!-- <v-list-item-action-text>
                              {{item.date.split(' ')[0] | dateFilter}} -
                              {{item.date.split(' ')[1]}} -
                              {{moment(item.date.split(' ')[0],'YYYY-MM-DD').format('dddd')}}
                            </v-list-item-action-text> -->
                          </v-list-item-content>
                          <br />
                          <v-list-item-action class="ml-2">
                            <v-btn icon ripple text>
                              <v-icon v-if="item.type === 'Retorno'" color="primary">restore</v-icon>
                              <v-icon v-if="item.type === 'Consulta'" color="primary">event</v-icon>
                              <v-icon v-if="item.status === 'Pago'" color="success">attach_money</v-icon>
                              <v-icon
                                v-if="item.status === 'Aguardando pagamento'"
                                color="error"
                              >money_off</v-icon>
                            </v-btn>
                          </v-list-item-action>
                        </v-list-item>
                      </v-flex>
                      <v-flex
                        sm3
                        xs12
                        v-for="item in consultation.consultations"
                        :key="item.id"
                        v-if="item.user"
                        v-show="filterHour === true && times === item.date.split(' ')[1]"
                      >
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title class="primary--text">
                              <span style="font-weight: bolder">{{item.user.name}}</span>
                            </v-list-item-title>
                            <br />
                            <v-list-item-subtitle class="text-center">CPF: {{item.user.cpf}}</v-list-item-subtitle>
                            <br />
                            <v-list-item-subtitle>Telefone: {{item.user.telephones ? item.user.telephones[0] : 'Número não informado'}}</v-list-item-subtitle>
                            <br />
                            <v-list-item-action-text>
                              {{item.date.split(' ')[0] | dateFilter}} -
                              {{item.date.split(' ')[1]}} -
                              {{moment(item.date.split(' ')[0],'YYYY-MM-DD').format('dddd')}}
                            </v-list-item-action-text>
                          </v-list-item-content>
                          <br />
                          <v-list-item-action class="ml-2">
                            <v-btn icon ripple text>
                              <v-icon v-if="item.type === 'Retorno'" color="primary">restore</v-icon>
                              <v-icon v-if="item.type === 'Consulta'" color="primary">event</v-icon>
                              <v-icon v-if="item.status === 'Pago'" color="success">attach_money</v-icon>
                              <v-icon
                                v-if="item.status === 'Aguardando pagamento'"
                                color="error"
                              >money_off</v-icon>
                            </v-btn>
                          </v-list-item-action>
                        </v-list-item>
                      </v-flex>
                      <v-flex
                        sm3
                        xs12
                        v-for="item in consultation.consultations"
                        :key="item.id"
                        v-if="item.user"
                        v-show="filterDayWeek === true && moment(semana,'e').format('dddd') === moment(item.date.split(' ')[0],'YYYY-MM-DD').format('dddd')"
                      >
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title class="primary--text">
                              <span style="font-weight: bolder">{{item.user.name}}</span>
                            </v-list-item-title>
                            <br />
                            <v-list-item-subtitle class="text-center">CPF: {{item.user.cpf}}</v-list-item-subtitle>
                            <br />
                            <v-list-item-subtitle>Telefone: {{item.user.telephones ? item.user.telephones[0] : 'Número não informado'}}</v-list-item-subtitle>
                            <br />
                            <v-list-item-action-text>
                              {{item.date.split(' ')[0] | dateFilter}} -
                              {{item.date.split(' ')[1]}} -
                              {{moment(item.date.split(' ')[0],'YYYY-MM-DD').format('dddd')}}
                            </v-list-item-action-text>
                          </v-list-item-content>
                          <br />
                          <v-list-item-action class="ml-2">
                            <v-btn icon ripple text>
                              <v-icon v-if="item.type === 'Retorno'" color="primary">restore</v-icon>
                              <v-icon v-if="item.type === 'Consulta'" color="primary">event</v-icon>
                              <v-icon v-if="item.status === 'Pago'" color="success">attach_money</v-icon>
                              <v-icon
                                v-if="item.status === 'Aguardando pagamento'"
                                color="error"
                              >money_off</v-icon>
                            </v-btn>
                          </v-list-item-action>
                        </v-list-item>
                      </v-flex>
                    </v-layout>
                  </v-list>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-layout>
      </v-container>
    </v-layout>
  </v-app>
</template>

<script>
//import moment from "moment";
export default {
  name: "ViewConsultationsExpanded",
  props: ["consultationsByDoctors", "start_date", "final_date","filterHour","filterDayWeek"],
  data: () => ({
    semanas: [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado"
    ],
    panel: [true],
  }),
  methods: {
    /* daydate(date) {
      var dateMoment = moment(date)
      console.log(this.semanas)
      console.log(dateMoment.day())
      return this.semanas[dateMoment.day()];
    } */
  }
};
</script>

<style>
</style>