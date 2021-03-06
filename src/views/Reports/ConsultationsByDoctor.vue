<template>
  <v-container>
    <v-card>
      <v-layout row wrap  class="justify-center pt-5">
        <v-col cols="5">
          <v-menu v-model="dateMenuStart">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                  v-model="formattedSelectedStartDate"
                  hint="Data inicial"
                  persistent-hint
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  outlined
                  dense
                  color="primary"
              />
            </template>
            <v-date-picker v-model="selectedStartDate" locale="pt-br"/>
          </v-menu>
        </v-col>
        <v-col cols="2">
          <v-icon class="primary--text pb-5" large>event</v-icon>
        </v-col>
        <v-col cols="5">
          <v-menu v-model="dateMenuFinal">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                  v-model="formattedSelectedFinalDate"
                  hint="Data final"
                  persistent-hint
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  outlined
                  dense
                  color="primary"
              />
            </template>
            <v-date-picker v-model="selectedFinalDate" locale="pt-br"/>
          </v-menu>
        </v-col>
        <v-flex xs7>
          <ApolloQuery
              :query="require('@/graphql/doctors/LoadDoctors.gql')"
          >
            <template v-slot="{ result: { data, loading } }">
              <v-select
                  class="pa-0 ma-0"
                  :items="data ? data.Doctor : []"
                  v-model="doctor"
                  item-text="name"
                  return-object
                  placeholder="Médico"
                  rounded solo filled dense color="background"
                  :loading="loading"
                  append-outer-icon="close"
                  @click:append-outer="clearDoctor()"

              >
                <template v-slot:selection="data">
                  <v-chip
                      :key="JSON.stringify(data.item)"
                      :input-value="data.selected"
                      :disabled="data.disabled"
                      class="v-chip--select-multi"
                      @click.stop="data.parent.selectedIndex = data.index"
                      @input="data.parent.selectItem(data.item)"
                      text-color="white"
                      color="primary"
                  >{{ data.item.name }}
                  </v-chip>
                </template>
              </v-select>
              <v-select
                  class="pa-0 ma-0"
                  :items="doctor.is_specialist_of"
                  v-model="specialty"
                  item-text="name"
                  return-object
                  placeholder="Especialidade"
                  rounded solo filled dense color="background"
                  :loading="loading"
                  append-outer-icon="close"
                  @click:append-outer="clearSpecialty()"
              >
                <template v-slot:selection="data">
                  <v-chip
                      :key="JSON.stringify(data.item)"
                      :input-value="data.selected"
                      :disabled="data.disabled"
                      class="v-chip--select-multi"
                      @click.stop="data.parent.selectedIndex = data.index"
                      @input="data.parent.selectItem(data.item)"
                      text-color="white"
                      color="primary"
                  >{{ data.item.name }}
                  </v-chip>
                </template>
              </v-select>
            </template>
          </ApolloQuery>
        </v-flex>


      </v-layout>

    </v-card>

    <ApolloQuery :query="require('@/graphql/consultations/LoadConsultationDoctorScheduled.gql')"
                 :variables="{  date_start:{formatted:formattedDate(selectedStartDate + 'T00:00:00')}, date_end:{formatted:formattedDate(selectedFinalDate + 'T23:59:59'),}
                 ,idDoctor: doctor.id ? doctor.id : '', specialty: specialty.name}">
      <template slot-scope="{ result: { data } }">
        <ConsultationScheduledExecuted v-if="data"
                                       :timeSchedule="timeConsultation(data.Consultation)"
                                       :scheduled="data.Consultation.length"
                                       :consultationsDone="filterConsultationsDone(data).length"
                                       :timeConsultations="timeConsultation(filterConsultationsDone(data))"
                                       :weekConsultation="weekConsultation(filterConsultationsDone(data))"
                                       :weekSchedule="weekConsultation(data.Consultation)"
        />
        <v-progress-linear v-else-if="!data"
                           class="mt-5"
                           color="blue"
                           indeterminate
                           rounded
                           height="10"
        />
      </template>
    </ApolloQuery>



  </v-container>
</template>

<script>
import ConsultationScheduledExecuted from "@/components/Reports/ConsultationScheduledExecuted";
import moment from "moment";

export default {
  // name: "ConsultationScheduledExecuted",
  components: {
    ConsultationScheduledExecuted
  },
  props: ["report", "loading"],
  data() {
    return {
      doctor: "",
      specialty:"",
      dateStart: moment().subtract(1, 'month').format('DD/MM/YYYY'),
      dateEnd: moment().format('DD/MM/YYYY'),
      dateMenuStart: false,
      dateMenuFinal: false,
      selectedStartDate: moment().format("YYYY-MM-DD"),
      selectedFinalDate: moment().format("YYYY-MM-DD"),
      now: moment().format("YYYY-MM-DD HH:mm:ss"),
      total: 0,
      reportOptions: [
        "Relatorio Especialidades",
        "Relatorio Especialidades Detalhado"
      ],
      reportSelected: 0,
      hours: [
        '00:00',
        '01:00',
        '02:00',
        '03:00',
        '04:00',
        '05:00',
        '06:00',
        '07:00',
        '08:00',
        '09:00',
        '10:00',
        '11:00',
        '12:00',
        '13:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
        '18:00',
        '19:00',
        '20:00',
        '21:00',
        '22:00',
        '23:00',
      ]
    };
  },
  computed: {
    formattedSelectedStartDate: {
      get() {
        return moment(this.selectedStartDate).format("DD/MM/YYYY")
      },
      set(val) {
        this.selectedDate = val
      }
    },
    formattedSelectedFinalDate: {
      get() {
        return moment(this.selectedFinalDate).format("DD/MM/YYYY")
      },
      set(val) {
        this.selectedDate = val
      }
    },
    QuantityTotal() {
      let quantidade = 0;
      for (let doctor in this.report.doctors) {
        quantidade += this.report.doctors[doctor].quantityTotal;
      }
      return quantidade;
    },
    CostTotal() {
      let custo = 0;
      for (let doctor in this.report.doctors) {
        custo += this.report.doctors[doctor].payment;
      }
      return custo;
    },
    PercentageTotal() {
      let porcentagem = 0;
      porcentagem =
          (parseFloat(this.QuantityTotalExecuted) /
              parseFloat(this.QuantityTotalScheduled)) *
          100;
      return porcentagem;
    },
    QuantityTotalExecuted() {
      let executed = 0;
      for (let consultation in this.report.consultations) {
        executed += this.report.consultations[consultation].executed;
      }
      return executed;
    },
    QuantityTotalScheduled() {
      let scheduled = 0;
      for (let consultation in this.report.consultations) {
        scheduled += this.report.consultations[consultation].scheduled;
      }
      return scheduled;
    }
  },
  methods: {
    formattedDate (date) {
      console.log('date: ', date)
      return moment(date, 'YYYY-MM-DD').format('YYYY-MM-DDTHH:mm')
    },
    timeConsultation(data) {
      console.log('data: ', data)
      const arrData= [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
      data.map(e => {
        if(arrData[parseInt(e.date.formatted.substring(11,13))]){
          arrData[parseInt(e.date.formatted.substring(11,13))] +=1
        }
        else{
          arrData[parseInt(e.date.formatted.substring(11,13))] =1
        }
      });

      return {
        labels: this.hours,
        datasets: [
          {
            label: 'consultas',
            lineTension: 0,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            data: arrData,
          }
        ]
      };
    },

    weekConsultation (data) {
      const arrData= [0,0,0,0,0,0,0];
      data.map(e => {

        if(arrData[moment(e.date.formatted.substring(0,10)).format('d')]){
          arrData[moment(e.date.formatted.substring(0,10)).format('d')] +=1
        }
        else{
          arrData[moment(e.date.formatted.substring(0,10)).format('d')] =1
        }
      });

      return {
        labels: [
          'Domingo',
          'Segunda',
          'Terça',
          'Quarta',
          'Quinta',
          "Sexta",
          'Sábado'
        ],
        datasets: [
          {
            label: 'consultas',
            lineTension: 0,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            data: arrData,
          }
        ]
      };
    },

    filterConsultationsDone (data) {
      return data.Consultation.filter(e => e.productTransaction !== null && e.productTransaction.with_charge !== null)
    },
    clearDoctor(){
      this.doctor = ""
    },
    clearSpecialty(){
      this.specialty = ""
    }
  }
};
</script>

<style scoped>
.border {
  border: 1px solid grey;
}
</style>
