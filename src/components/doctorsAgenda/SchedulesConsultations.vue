<template>
    <v-container fluid>
        <div class="container" id="app">
            <ul class="list-group" id="infinite-list">
                <v-layout row wrap style="width:100%"
                          class="align-center justify-center py-0"
                          v-for="(scheduleGroup, i) in Consultations"
                          :key="i">
                    <v-flex xs12 class="align-start justify-start">
                        <div v-bind:id="'group-' + i" class="text-left">
                            <span class="my-sub-headline primary--text">{{i | dateFilter}} - {{dayDate(i)}}</span>
                            <v-divider class="primary"/>
                        </div>
                    </v-flex>
                    <v-container fluid grid-list-sm class="py-0 my-3 mx-2">
                        <v-layout row wrap>
                            <v-flex v-for="(schedule, j) in scheduleGroup" :key="j" sm12 xs12 class="px-2 py-2">
                                <v-card class="pa-4 background" style="border-radius:20px; height: 100%">
                                    <v-layout>
                                        <v-layout row wrap>
                                            <v-flex xs12 class="text-left">
                                                <v-layout row wrap>
                                                    <span class="subtitle-2 font-weight-bold">{{schedule.doctor.name}}</span>
                                                    <span class="subtitle-2 font-weight-bold mx-2">-</span>
                                                    <span class="subtitle-2 font-weight-bold subheading">
                                                    {{schedule.specialty ? schedule.specialty.name : schedule.exam_type.name}}
                                            </span>
                                                    <v-spacer/>
                                                    <v-chip color="primary_dark" class="mb-2" small text-color="white">
                                                        {{schedule.clinic.name}}
                                                    </v-chip>
                                                </v-layout>
                                            </v-flex>
                                            <v-flex xs12 class="mb-1">
                                                <v-divider class="primary"/>
                                            </v-flex>
                                            <v-flex class="my-0" xs12>
                                                <v-layout row wrap class="text-left font-weight-bold">
                                                    <v-flex xs12>
                                                        <v-chip small class="mx-2" color="primary_dark"
                                                                text-color="white">
                                                            {{schedule.date.split(' ')[1]}}
                                                        </v-chip>
                                                        <v-chip small color="primary_dark" text-color="white">
                                                            Vagas :
                                                            {{schedule.vacancy}}
                                                        </v-chip>
                                                        <v-chip v-if="schedule.specialty" small class="mx-2" color="primary_dark"
                                                                text-color="white">
                                                            Consultas :
                                                            {{schedule.qtd_consultations ? schedule.qtd_consultations :
                                                            0}}
                                                        </v-chip>
                                                         <v-chip v-if="schedule.exam_type" small class="mx-2" color="primary_dark"
                                                                text-color="white">
                                                            Agendados :
                                                            {{schedule.qtd_consultations ? schedule.qtd_consultations :
                                                            0}}
                                                        </v-chip>
                                                        <v-chip v-if="schedule.specialty" class="mx-2" small color="primary_dark"
                                                                text-color="white">
                                                            Retornos :
                                                            {{schedule.qtd_returns ? schedule.qtd_returns : 0}}
                                                        </v-chip>
                                                    </v-flex>
                                                </v-layout>
                                            </v-flex>
                                            <v-flex xs12 class="text-right">
                                                <v-fade-transition>
                                                    <v-btn v-if="isOnline"
                                                           rounded
                                                           small
                                                           color="primary_dark white--text"
                                                           class="mx-0"
                                                           :disabled="schedule.vacancy === 0"
                                                           @click="scheduleAppointment(schedule)"
                                                    >Agendar
                                                    </v-btn>
                                                    <v-btn v-else
                                                           rounded
                                                           small
                                                           color="grey"
                                                           class="mx-0"
                                                    >Sem conexão
                                                    </v-btn>
                                                </v-fade-transition>
                                            </v-flex>
                                        </v-layout>
                                    </v-layout>
                                </v-card>
                            </v-flex>
                        </v-layout>
                        <div class="text-xs-center">
                            <v-dialog v-model="dialog" persistent v-if="createConsultationForm" max-width="520">
                                <SchedulingForm @close-dialog="closeDialog"
                                                :createConsultationForm="createConsultationForm"
                                                :loaderPaymentNumber="loaderPaymentNumber"
                                                :exams="examsLoading"
                                                :numberReceipt="numberReceipt"
                                                :modalidade="modalidade"
                                                :previousConsultation="previousConsultation"
                                                :status="status"
                                                :payment_numberFound="payment_numberFound"
                                                @findPaymentNumberToExam="thereIsPaymentNumber($event)"
                                                :rescheduleConsultation="rescheduleConsultation"
                                />
                            </v-dialog>
                        </div>
                    </v-container>
                </v-layout>
            </ul>
        </div>
            <div class="text-xs-center">
                <v-dialog v-model="dialog" v-if="createConsultationForm" max-width="520">
                    <SchedulingForm @close-dialog="dialog = false"
                                    :createConsultationForm="createConsultationForm"
                                    :loaderPaymentNumber="loaderPaymentNumber"
                                    :exams="examsLoading"
                                    :numberReceipt="numberReceipt"
                                    :modalidade="modalidade"
                                    :previousConsultation="previousConsultation"
                                    :status="status"
                                    :payment_numberFound="payment_numberFound"
                    />
                </v-dialog>
            </div>
        </v-flex> -->
        <v-flex xs12 v-if="!consultationLoading">
            <v-btn class="primary" rounded text @click="listenMoreConsultations">Carregar mais</v-btn>
        </v-flex>

        <v-flex xs12 v-if="consultationLoading">
            <v-progress-circular class="primary--text" indeterminate/>
        </v-flex>
    </v-container>
</template>
<script>

    import SchedulingForm from "../doctorsAgenda/SchedulingForm"
    import {infiniteScroll} from "vue-infinite-scroll"
    import axios from "axios"

    let moment = require("moment/moment");

    export default {
        props: ['Consultations'],
        components: {SchedulingForm},
        directives: {infiniteScroll},
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
            dialog: false,
            numberReceipt: "",
            payment_numberFound: undefined,
            status: "",
            modalidade: "Consulta",
            previousConsultation: undefined,
            createConsultationForm: undefined,
            loaderPaymentNumber: false,
            daysToListen: 3,
            examsLoading:[],
            loading: false,
            nextItem: 1,
            rescheduleConsultation:undefined
        }),

        async mounted() {
            this.$emit('refreshDate', this.daysToListen);
            await this.listenMoreConsultations();

            const listElm = document.querySelector('#infinite-list');
            listElm.addEventListener('scroll', e => {
                if (listElm.scrollTop + listElm.clientHeight >= listElm.scrollHeight) {
                    this.listenMoreConsultations()
                }
            });

            this.query = this.$route.params.q
            if (this.query && !this.$route.params.reschedule) {
                this.modalidade = "Retorno"
                this.previousConsultation = this.query.id
                this.status = this.query.status
                this.numberReceipt = this.query.payment_number
            }else if(this.query && this.$route.params.reschedule){
                this.modalidade = this.query.type
                this.previousConsultation = this.query.previousConsultation
                this.status = this.query.status
                this.numberReceipt = this.query.payment_number
                this.rescheduleConsultation = this.query.id
                console.log('this. status', this.status)
            }            
            else{
                this.modalidade = "Consulta"
            }

        },

        computed: {

            isOnline() {
                return this.$store.getters.isOnline
            },
            selectedPatient() {
                return this.$store.getters.selectedPatient;
            },
            foundDependents() {
                return this.selectedPatient ? this.selectedPatient.dependents : undefined;
            },
            consultationLoading() {
                return this.$store.getters.consultationsLoading;
            },
        },

        watch:{
            createConsultationForm(value){
                this.examsLoading = []
                let exams = this.$store.getters.exams
                if(value){
                    exams = exams.filter((exam)=>{
                        let response = false
                        if(value.consultation.exam_type && value.consultation.exam_type.name == exam.type)
                            response = true
                        return response
                    })

                    this.examsLoading = exams
                }
            }
        },

        methods: {

            dayDate(date) {
                let dateMoment = moment(date);
                return this.semanaOptions[dateMoment.day()];
            },

            scheduleAppointment(consultation) {
                if (!this.selectedPatient && !this.query) {
                    this.$refs.patientCard.$el.classList.add("shaking-ease-anim");
                    setTimeout(() => {
                        this.$refs.patientCard.$el.classList.remove("shaking-ease-anim");
                    }, 1000);
                    return;
                }
                this.exam = undefined;
                this.fillConsultationForm(consultation);
                this.dialog = true;
            },

            async fillConsultationForm(consultation) {
                this.selectedForm = {
                    user: (this.query && this.query.user) ? this.query.user : this.selectedPatient,
                    consultation: consultation
                };

                if (!this.query /* && !consultation.exam_type */) {
                    this.thereIsPaymentNumber();
                }
                console.log(this.selectedForm)
                if(this.$route.params.reschedule && this.query.exam){
                    this.selectedForm.consultation.exam = this.query.exam
                }

                this.createConsultationForm = this.selectedForm;
            },

            async thereIsPaymentNumber(value) {
                this.payment_numberFound = undefined;
                this.numberReceipt = "";
                this.status = "Aguardando pagamento";
                this.loaderPaymentNumber = true;

                let obj = value ? {
                    user: this.selectedForm.user,
                    doctor: this.selectedForm.consultation.doctor,
                    exam: {
                        //exam_type:this.selectedForm.consultation.exam_type.name,
                        ...value
                    }
                }
                :this.selectedForm.consultation.specialty ? {
                    user: this.selectedForm.user,
                    doctor: this.selectedForm.consultation.doctor,
                    specialty: this.selectedForm.consultation.specialty,
                }
                :{
                    user: this.selectedForm.user,
                    doctor: this.selectedForm.consultation.doctor,
                    exam: {
                        type:this.selectedForm.consultation.exam_type.name
                    },
                }

                this.$store.dispatch("thereIsIntakes", obj)
                    .then(obj => {
                        if (obj.payment_number) {
                            this.payment_numberFound = obj;
                            this.numberReceipt = obj.payment_number;
                            this.exam = obj.exam ? {...obj.exam, notFindPayment: true} : undefined;
                            this.status = "Pago";
                            this.loaderPaymentNumber = false
                        } else {
                            this.payment_numberFound = obj[0];
                            this.numberReceipt = obj[0].payment_number;
                            this.exam = obj[0].exam ? {...obj[0].exam, notFindPayment: true} : undefined;
                            this.status = "Pago";
                            this.loaderPaymentNumber = false
                        }
                    })
                    .catch(response => {
                        let cost = response.cost;
                        if (cost && cost.price === 0) {
                            this.status = "Pago";
                            this.loaderPaymentNumber = false
                        }
                        this.loaderPaymentNumber = false
                    });
            },

            async listenMoreConsultations() {
                this.loading = true;
                this.daysToListen += 3;
                await this.$store.dispatch('listenConsultations',
                    {
                        start_date: new Date().toISOString().substr(0, 10),
                        final_date: moment().add(this.daysToListen, 'days').format('YYYY-MM-DD 23:59:59')
                    });
                this.$emit('refreshDate', this.daysToListen);
                this.loading = false;
            },
            closeDialog(){
                this.dialog = false
                this.payment_numberFound = undefined
                /* this.status = "" */
                this.numberReceipt = ""
                this.selectedForm = undefined
            }
        }
    }

</script>

<style scoped>

    .list-group {
        overflow: auto;
        height: 82vh;
    }
</style>