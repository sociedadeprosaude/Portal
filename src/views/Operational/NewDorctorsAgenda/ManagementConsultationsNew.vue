<template>
  <!--start mobile-->
  <v-layout v-if="this.$vuetify.breakpoint.name === 'xs'"  row wrap>
    <v-tabs grow
            dark
            background-color="primary"
            v-model="tab"
    >
      <v-btn color="white" v-if="patientSelected.name" @click="restoreSelectedPatient">
        <v-icon color="primary">undo</v-icon>
      </v-btn>

      <v-tab href="#consultations" v-if="!patientSelected.name" >Consultas</v-tab>
      <v-tab href="#attendance" v-if="tab === 'attendance'">Atendimentos</v-tab>

      <v-tab-item value="consultations">
        <v-flex xs12>
          <v-card class="pa-4">
            <v-layout aling-center row wrap>
              <v-flex xs12 class="mt-4 pa-0 ">
                <v-checkbox
                    class="pl-3 py-0 my-0"
                    v-model="examTypeCheck"
                    color="primary"
                >
                  <template v-slot:label>
                    <div >Listar agendas de exames</div>
                  </template>
                </v-checkbox>
              </v-flex>
              <v-flex v-if="!examTypeCheck" xs12 sm4>
                <ApolloQuery
                    :query="require('@/graphql/products/LoadProducts.gql')"
                    :variables="{ type:'SPECIALTY'}"
                >
                  <template slot-scope="{ result: { data } }">
                    <v-combobox
                        v-model="specialty"
                        :items="data ? data.Product : []"
                        item-text="name"
                        return-object
                        placeholder="Especialidade"
                        outlined
                        color="write"
                        class="mr-3"
                    />
                  </template>
                </ApolloQuery>
              </v-flex>
              <v-flex v-else>
                <ApolloQuery
                    :query="require('@/graphql/products/LoadProducts.gql')"
                    :variables="{ type:'EXAM', schedulable:true}"
                >
                  <template slot-scope="{ result: { data } }">
                    <v-combobox
                        v-model="examType"
                        :items="data ? data.Product : []"
                        item-text="name"
                        return-object
                        placeholder="Exames"
                        outlined
                        color="write"
                        class="mr-3"
                    />
                  </template>
                </ApolloQuery>
              </v-flex>
              <!-- <v-flex xs12 sm3>
                  <v-menu
                          ref="menu1"
                          v-model="menu1"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          offset-y
                          max-width="290px"
                          min-width="290px"
                  >
                      <template v-slot:activator="{ on }">
                          <v-text-field
                                  outlined
                                  v-model="computedDateFormatted"
                                  placeholder="Data Inicial"
                                  hint="Data Inicial"
                                  v-on="on"
                                  class="mx-3"
                          />
                      </template>
                      <v-date-picker v-model="date" no-title @input="menu1 = false"
                                     @change="getConsultationsDorctors()"/>
                  </v-menu>
              </v-flex> -->
              <v-flex xs12 sm5>
                <v-select
                    v-model="clinic"
                    :items="clinics"
                    item-text="name"
                    return-object
                    label="Clínica"
                    outlined
                    clearable
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
              </v-flex>
            </v-layout>
            <v-layout aling-center row wrap>
              <v-flex xs12>
                <CardDoctorsManagementConsultations @consultationSelect="consultatioSelect= $event"
                                                    @patientSelect="patientSelected = $event" :filterByExam="examTypeCheck" :examType="examType"
                                                    :specialty="specialty" :date="date"
                                                    :clinic="clinic"
                />
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
      </v-tab-item>
      <v-tab-item value="attendance">
        <v-flex xs12>
          <CardInformationManagementConsultations :patient="patientSelected" :consultation="consultatioSelect"/>
        </v-flex>
      </v-tab-item>
    </v-tabs>
  </v-layout>
  <!--end mobile-->
  <!--start desktop-->
  <v-layout v-else row wrap>
    <v-flex xs8>
      <v-card class="pa-4">
        <v-layout aling-center row wrap>
          <v-flex xs12 class="mt-4 pa-0 ">
            <v-checkbox
                class="pl-3 py-0 my-0"
                v-model="examTypeCheck"
                color="primary"
            >
              <template v-slot:label>
                <div >Listar agendas de exames</div>
              </template>
            </v-checkbox>
          </v-flex>
          <v-flex v-if="!examTypeCheck" xs12 sm4>
            <ApolloQuery
                :query="require('@/graphql/products/LoadProducts.gql')"
                :variables="{ type:'SPECIALTY'}"
            >
              <template slot-scope="{ result: { data } }">
                <v-combobox
                    v-model="specialty"
                    :items="data ? data.Product : []"
                    item-text="name"
                    return-object
                    placeholder="Especialidade"
                    outlined
                    color="write"
                    class="mr-3"
                />
              </template>
            </ApolloQuery>
          </v-flex>
          <v-flex v-else>
            <ApolloQuery
                :query="require('@/graphql/products/LoadProducts.gql')"
                :variables="{ type:'EXAM', schedulable:true}"
            >
              <template slot-scope="{ result: { data } }">
                <v-combobox
                    v-model="examType"
                    :items="data ? data.Product : []"
                    item-text="name"
                    return-object
                    placeholder="Exames"
                    outlined
                    color="write"
                    class="mr-3"
                />
              </template>
            </ApolloQuery>
          </v-flex>
          <!-- <v-flex xs12 sm3>
              <v-menu
                      ref="menu1"
                      v-model="menu1"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
              >
                  <template v-slot:activator="{ on }">
                      <v-text-field
                              outlined
                              v-model="computedDateFormatted"
                              placeholder="Data Inicial"
                              hint="Data Inicial"
                              v-on="on"
                              class="mx-3"
                      />
                  </template>
                  <v-date-picker v-model="date" no-title @input="menu1 = false"
                                 @change="getConsultationsDorctors()"/>
              </v-menu>
          </v-flex> -->
          <v-flex xs12 sm5>
            <v-select
                v-model="clinic"
                :items="clinics"
                item-text="name"
                return-object
                label="Clínica"
                outlined
                clearable
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
          </v-flex>
        </v-layout>
        <v-layout aling-center row wrap>
          <v-flex xs12>
            <CardDoctorsManagementConsultations @consultationSelect="consultatioSelect= $event"
                                                @roomSelect="roomSelect= $event"
                                                @sectorSelect="sectorSelect= $event"
                                                @ticketSelect="ticketSelect= $event"
                                                @patientSelect="patientSelected = $event" :filterByExam="examTypeCheck" :examType="examType"
                                                :specialty="specialty" :date="date"
                                                :clinic="clinic"
            />
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>
    <v-flex xs4>
      <CardInformationManagementConsultations :patient="patientSelected" :consultation="consultatioSelect" :room="roomSelect" :sector="sectorSelect" :ticket="ticketSelect"/>
    </v-flex>
  </v-layout>
  <!--end desktop-->

</template>

<script>
    import moment from 'moment/moment'
    import CardDoctorsManagementConsultations from '../../../components/doctorsAgenda/ManagementConsultations/CardDoctorsManagementConsultations'
    import CardInformationManagementConsultations from '../../../components/doctorsAgenda/ManagementConsultations/CardInformationManagementConsultations'

    export default {
        components: {CardDoctorsManagementConsultations, CardInformationManagementConsultations},
        data: vm => ({
            date: new Date().toISOString().substr(0, 10),
            dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
            menu1: false,
            clinic: undefined,
            loadingConsultations: false,
            specialty: '',
            examType:'',
            examTypeCheck:false,
            patientSelected: {},
            consultatioSelect: {},
            roomSelect: {},
            sectorSelect: {},
            ticketSelect:{},
            clinics:[],
            //news
            tab:'consultations',
            room: undefined,
            ticket: undefined,
            sector: undefined,
        }),
        computed: {
            computedDateFormatted() {
                return this.formatDate(this.date)
            },
        },
        mounted() {
            this.initialConfig();
            this.date = moment().format('YYYY-MM-DD');
            this.dateFormatted = moment().format('DD/MM/YYYY');
            this.clinic = this.$store.getters.selectedUnit
        },
        watch: {
            date(val) {
                this.dateFormatted = this.formatDate(this.date)
            },

            specialty(value){
                if(value)
                    this.clinics = value.clinics
            },
            examTypeCheck(value){
                if(value)
                    this.$apollo.queries.loadClinics.refresh()
            }
        },
        methods: {
            async initialConfig() {
                //await this.$store.dispatch("getSpecialties");
                //this.especialidade = this.specialties[0];
                //this.getConsultationsDorctors()

            },
            restoreSelectedPatient(){
              this.patientSelected = {}
              this.consultatioSelect = {}
              this.tab = 'consultations'
            },
            formatDate(date) {
                if (!date) return null;
                const [year, month, day] = date.split('-');
                return `${day}/${month}/${year}`
            },

            parseDate(date) {
                if (!date) return null;
                const [month, day, year] = date.split('/');
                return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
            },

            returnOutRule(item) {
                let dateConsultation = moment(item.consultation.date);
                let today = moment();
                let diff = today.diff(dateConsultation, 'days');
                return diff > 21
            },
            async getConsultationsDorctors() {
                this.loadingConsultations = true;
                await this.$store.dispatch('listenConsultations',
                    {
                        start_date: this.date,
                        final_date: moment().add(10, 'days').format('YYYY-MM-DD 23:59:59')
                    });
                this.loadingConsultations = false
            }
        },
        apollo: {
            loadClinics: {
                query: require("@/graphql/clinics/LoadClinics.gql"),
                variables:{
                    property:true
                },
                update(data) {
                    this.clinics = data.Clinic
                },
            }
        }
    }
</script>
<style scoped>

</style>
