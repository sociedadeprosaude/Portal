<template>
    <v-container>
        <v-layout row wrap v-if="especialtie">
            <v-flex xs12 v-for="(consultation, i) in ConsultationsByDoctors(consultations)">
                <v-card>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-card color="primary">
                                <v-layout row wrap class="py-2 px-3">
                                    <v-flex xs5>
                                        <p class="white--text text-left font-weight-bold">
                                            <v-icon dark left large>account_circle</v-icon>
                                            {{consultation.doctor.name}}
                                        </p>
                                    </v-flex>
                                    <v-spacer/>
                                    <v-flex xs3>
                                        <p class="white--text font-weight-bold text-left"> N° de Consultas: {{consultation.numConsultations}}</p>
                                    </v-flex>
                                    <v-flex xs5>
                                        <p class="white--text text-left font-weight-bold"> CRM: {{consultation.doctor.crm}}</p>
                                    </v-flex>
                                    <v-spacer/>
                                    <v-flex xs3>
                                        <p class="white--text font-weight-bold text-left"> N° de Retorno: {{consultation.numRegress}}</p>
                                    </v-flex>
                                    <v-flex xs5>
                                        <p class="white--text text-left font-weight-bold"> CPF: {{consultation.doctor.cpf}}</p>
                                    </v-flex>
                                    <v-spacer/>
                                    <v-flex xs1>
                                        <v-btn icon class="grey my-1 mx-1" dark x-small text fab>
                                            <v-icon @click="deactivateDoctor(consultation.doctor)">power_settings_new</v-icon>
                                        </v-btn>
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-flex>
                        <v-flex xs12 class="mt-4 mb-3">
                            <p class="text-left primary--text font-weight-bold ml-2" v-if="ConsultationsByDoctors(consultations).length !== 0">{{date |
                                dateFilter}} - {{daydate(date)}}</p>
                            <v-divider class="primary"/>
                        </v-flex>
                        <v-flex sm4 v-for="item in consultation.consultations" class="mt-3 mb-2">
                            <v-card outlined class="borderCard mx-2 mr-2 grey_light" @click="patientSelect(item)">
                                <v-layout row wrap class="mt-2">
                                    <v-flex xs4>
                                        <v-icon large>person</v-icon>
                                        <br>
                                        <v-icon small class="mt-1">donut_large</v-icon>
                                    </v-flex>
                                    <v-flex xs8 class="mb-3">
                                        <v-flex xs12>
                                            <h4 class="text-left font-weight-bold">{{item.user.name}}</h4>
                                            <h5 class="text-left mt-1">{{item.date.substring(11,16)}}</h5>
                                            <h5 class="text-left">Agendado em: {{item.date.substring(0,10)}}</h5>
                                        </v-flex>
                                    </v-flex>
                                </v-layout>

                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
            <v-flex xs12 v-if="loadingConsultations">
                <v-progress-circular class="primary--text" indeterminate/>
            </v-flex>
            <v-flex xs12 v-if="consultations.length === 0 && loadingConsultations === false">
                <p>Não a consultas marcadas para hoje :(</p>
            </v-flex>
          <v-dialog v-if="selectedDoctor" v-model="confirmDeactivate" max-width="500px" persistent>
              <v-flex xs12 v-if="loading">
                  <v-progress-circular class="primary--text" indeterminate/>
              </v-flex>
                <v-card v-else>
                    <v-card-title>
                        <v-spacer/>
                        <v-btn text @click="confirmDeactivate = false, cleanSpecialtyToDeactivate()" x-small fab>
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-select :items="specialtiesDoctor" v-model="specialtyToDeactivate" outlined persistent-hint
                              item-text="name"
                              class="mx-5 mb-4" return-object chips
                              hint="Selecione as especialidades para desativar"/>
                    <v-select :items="clinics" v-model="clinicsToDeactivate" outlined persistent-hint
                              item-text="name"
                              class="mx-5 mb-4" return-object chips hint="Selecione a unidade"/>
                    <v-card-text>
                        <span>Desativar </span>
                        <span class="font-weight-bold justify-center">{{selectedDoctor.name}}</span>
                        <span> ?</span>
                    </v-card-text>
                    <v-card-actions class="mx-3">
                        <v-spacer/>
                        <submit-button text="Confirmar" :loading="loading" :success="success" @reset="success = false"
                                       @click="deleteAllSchedule(doctor)">
                        </submit-button>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="success" max-width="300px">
                <v-alert type="success">
                    Médico apagado com sucesso.
                </v-alert>
            </v-dialog>
        </v-layout>
    </v-container>
</template>

<script>
    import moment from 'moment/moment'
    import SubmitButton from '../../../components/SubmitButton'
    export default {
        name: "CardDoctorsManagementConsultations",
        components:{SubmitButton},

        props: ['especialtie', 'date'],
        data: () => ({
            semanaOptions: [
                "Domingo",
                "Segunda-feira",
                "Terça-feira",
                "Quarta-feira",
                "Quinta-feira",
                "Sexta-feira",
                "Sábado"
            ],
            clinics:[],
            selectedDoctor:[],
            specialtiesDoctor:'',
            success:false,
            loading:false,
            loadingConsultations:false,
            confirmDeactivate:false,
            patientSelected: [],
            specialtyToDeactivate:{},
            clinicsToDeactivate:{}
        }),
        computed: {
            consultations() {
                if(moment().format('YYYY-MM-DD') !== this.date){
                    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                    this.loadingConsultations = !this.loadingConsultations
                }
                return this.$store.getters.consultations.filter((a) => {
                    return this.especialtie && this.date ? this.especialtie.name === a.specialty.name && this.date === a.date.split(' ')[0] && a.user : false
                });
            },
            doctor(){
                    return this.$store.getters.doctor
            }
        },
        mounted() {
            this.initialConfig()

        },
        watch: {
        },
        methods: {

            cleanSpecialtyToDeactivate(){
                this.specialtyToDeactivate=[];
                this.clinicsToDeactivate=[]
            },
            ConsultationsByDoctors(consultations) {
                let res = {};
                for (let cons in consultations) {
                    let targetDate = consultations[cons].doctor.cpf;
                    if (!res[targetDate]) {
                        res[targetDate] = {
                            doctor: consultations[cons].doctor,
                            numConsultations: 0,
                            numRegress: 0,
                            consultations: []
                        }
                    }
                    if (consultations[cons].type === 'Consulta') res[targetDate].numConsultations += 1;
                    else res[targetDate].numRegress += 1;
                    res[targetDate].consultations.push(consultations[cons])
                }
                return res
            },
            async deactivateDoctor(item) {
                await this.$store.dispatch('getDoctor',item.cpf);
                if(this.doctor.cpf === item.cpf){
                    this.selectedDoctor = this.doctor;
                    this.clinics = this.doctor.clinics;
                    this.specialtiesDoctor = this.doctor.specialties;
                    this.confirmDeactivate = true;
                }
            },
            async initialConfig() {

            },
            daydate(date) {
                let dateMoment = moment(date);
                return this.semanaOptions[dateMoment.day()];
            },
            patientSelect: function (item) {
                this.$emit('patientSelect', item.user);
                this.$emit('consultationSelect', item)
            },
            async deleteAllSchedule(doctor){
                this.loading = true;
                let payload = {
                    doctor: doctor,
                    specialty: this.specialtyToDeactivate,
                    clinic: this.clinicsToDeactivate,
                };
                await this.$store.dispatch('deleteAllSchedule', payload);
                this.success = true;
                this.loading = false;
                this.confirmDeactivate= false
            },
        }
    }
</script>
<style scoped>
    .borderCard {
        border-radius: 50%;
        border: #808080 solid;
    }

</style>
