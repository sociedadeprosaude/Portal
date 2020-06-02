<template>
    <v-container v-if="consultation" fluid class=" ma-0 pa-0">
        <v-layout>
            <v-flex>
                <v-card flat class="item-to-print ma-0 mb-0" >
                    <v-layout row wrap>
                        <v-flex xs6 class="text-left hidden-print-only">
                            <v-btn  text @click="$emit('close')">
                                <v-icon>close</v-icon>
                            </v-btn>
                        </v-flex>
                        <v-flex xs6 class="text-right hidden-print-only">
                            <v-btn text :loading="loader" @click="print()">
                                <v-icon>print</v-icon>
                            </v-btn>
                        </v-flex>
                        <v-flex>
                            <v-card flat class="pa-10 py-2">
                                <v-flex xs12 class="white" style="color: white">.</v-flex>
                                <v-layout
                                        row
                                        wrap
                                        class="align-center pa-4"
                                        style="border: 2px solid #2196f3; border-radius: 16px"
                                >
                                    <v-flex xs6 class="text-left">
                                        <v-layout column wrap>
                                            <strong>Hoje: {{ hoje }} - {{dia}}</strong>
                                            <span
                                                    class="my-sub-headline primary--text"
                                                    style="font-size: 1.4em"
                                            >Dr. {{consultation.doctor.name}}</span>
                                            <v-flex>
                                                <span class="primary--text font-weight-bold">CRM:</span>
                                                <span class="font-weight-bold">{{consultation.doctor.crm}}</span>
                                            </v-flex>

                                            <div v-if="exames.indexOf(consultation.specialty.name) != -1">
                                                <v-flex>
                                                    <span class="primary--text font-weight-bold">Procedimento: </span>
                                                    <span class="font-weight-bold">Exame</span>
                                                </v-flex>
                                                <v-flex>
                                                    <span class="primary--text font-weight-bold">Exame: </span>
                                                    <span class="font-weight-bold">{{ exames.indexOf(consultation.specialty.name) != -1 ? this.consultation.exam.name : undefined}}</span>
                                                </v-flex>
                                            </div>

                                            <div v-else>
                                                <v-flex>
                                                    <span class="primary--text font-weight-bold">Especialidade: </span>
                                                    <span class="font-weight-bold">{{this.consultation.specialty.name}}</span>
                                                </v-flex>
                                                <v-flex>
                                                    <span class="primary--text font-weight-bold">Procedimento: </span>
                                                    <span class="font-weight-bold">{{this.consultation.type}}</span>
                                                </v-flex>
                                            </div>

                                            <v-flex>
                                                <span class="primary--text font-weight-bold">Data:</span>
                                                <span class="font-weight-bold">{{this.consultation.date | dateFilter}}</span>
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>
                                    <v-spacer></v-spacer>
                                    <v-flex xs4>
                                        <v-img v-if="selectedUnit"
                                               :src="selectedUnit.logo"
                                               width="400"
                                        ></v-img>

                                    </v-flex>
                                    <v-flex xs12>
                                        <v-divider class="primary my-2"></v-divider>
                                    </v-flex>
                                    <v-flex xs6 class="text-left">
                                        <v-layout column wrap align-start justify-start>
                <span
                        class="my-sub-headline primary--text"
                        style="font-size: 1.4em"
                >{{dependent ? dependent.name : user.name}}</span>
                                            <v-flex v-if="!dependent">
                                                <span class="primary--text font-weight-bold">CPF:</span>
                                                <span class="font-weight-bold">{{user.cpf}}</span>
                                            </v-flex>
                                            <v-flex>
                                                <span class="primary--text font-weight-bold">Data de Nascimento:</span>
                                                <span class="font-weight-bold">{{this.birthDate}}</span>
                                                <br/>
                                            </v-flex>
                                            <v-flex>
                                                <span class="primary--text font-weight-bold">Idade:</span>
                                                <span class="font-weight-bold">{{idade}}</span>
                                                <br/>
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex xs6 class="text-center">
                                        <v-layout row wrap justify-end align-end>
                                            <!--<v-layout column wrap>-->
                                            <v-flex xs5>
                                                <span class="my-sub-headline primary--text" style="font-size: 1.4em">Triagem</span>
                                                <v-text-field prefix="Peso:" type="number" suffix="KG" hide-details
                                                              v-model="p"></v-text-field>
                                                <v-text-field
                                                        prefix="Altura:"
                                                        type="number"
                                                        suffix="cm"
                                                        hide-details
                                                        v-model="alt"
                                                ></v-text-field>
                                                <v-text-field
                                                        prefix="P.A:"
                                                        suffix="PA"
                                                        v-mask="'##x##'"
                                                        v-model="pa"
                                                        hide-details
                                                ></v-text-field>
                                            </v-flex>
                                            <!--</v-layout>-->
                                        </v-layout>
                                    </v-flex>
                                    <v-flex xs12 class="mt-2 py-1 px-4">
                                        <v-layout row wrap class="align-center"></v-layout>
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-flex>
                        <v-flex>
                            <v-card flat class="pa-10 py-2">
                                <v-flex xs12 class="white" style="color: white">.</v-flex>
                                <v-layout
                                        row
                                        wrap
                                        class="align-center pa-4"
                                        style="border: 2px solid #2196f3; border-radius: 16px"
                                >
                                    <v-flex xs12 style="height: 550px" >
                                    </v-flex>
                                    <v-flex xs12 class="mt-2 py-1 px-4">
                                        <v-layout row wrap class="align-center"></v-layout>
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    var moment = require("moment/moment");
    import {mask} from 'vue-the-mask';

    export default {
        name: "Receipt",
        props: ['consultation', 'openDocument'],
        computed: {

            user() {
                return this.$store.getters.selectedPatient
            },
            selectedUnit() {
                return this.$store.getters.selectedUnit
            },
        },
        directives: {mask},
        data: () => ({
            alt: '',
            p: '',
            pa: '',
            exames: ['ULTRASSONOGRAFIA', 'ELETROCARDIOGRAMA', 'ELETROENCEFALOGRAMA', 'ECOCARDIOGRAMA', 'VIDEOLARIGONSCOPIA'],
            consultationHour: moment().locale('pt-BR').format('YYYY-MM-DD HH:mm:ss'),
            hoje: moment().locale('pt-BR').format('DD/MM/YYYY HH:mm:ss'),
            dia: moment().format('dddd'),
            dependent: undefined,
            idade: '',
            birthDate: '',
            loader: false,
            payment_number: undefined
        }),
        async mounted() {
            this.saveConsultationHour()
            this.dependent = this.consultation.dependent
            this.formatDates()
            await this.$store.dispatch('loadSpecialties')
        },
        methods: {

            specialtyCost() {
                let espArray = Object.values(this.$store.getters.specialties);
                let cost = undefined
                espArray.forEach(specialty => {
                    if (specialty.name == this.consultation.specialty.name) {

                        specialty.doctors.forEach(doctor => {
                            if (doctor.cpf === this.consultation.doctor.cpf) {
                                cost = {
                                    cost: doctor.cost,
                                    price: doctor.price,
                                    doctorConsultation: doctor
                                }
                                return cost
                            }
                        });
                    }
                });
                return cost
            },

             formatDates(){
                
                let date = this.dependent ? this.dependent.birthDate : this.user.birth_date;
                let patt = new RegExp(/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/);
                if(patt.test(date)) date = moment(date,"DD/MM/YYYY").format("YYYY-MM-DD");
                this.idade = moment().diff(moment(date, 'YYYY-MM-DD'), 'years');
                this.birthDate = moment(date).format('DD/MM/YYYY');
            },
            async print() {
                this.loader = true;
                let cost = this.specialtyCost();
                if (cost && cost.price === 0) {
                    this.$store
                        .dispatch("thereIsIntakes", {
                            user: this.user,
                            specialty: this.consultation.specialty,
                            status: ['Agendado', 'Consulta Paga'],
                            payment_number: this.consultation.payment_number
                        })
                        .then(async (obj) => {

                            this.loader = false
                            window.print()
                        })
                        .catch(async (response) => {
                            await this.newIntake(cost)
                            this.consultation.payment_number = this.payment_number
                            await this.$store.dispatch('updatePaymentNumberConsultation', {
                                user: this.user,
                                consultation: this.consultation,
                                payment_number: this.payment_number
                            })
                            this.loader = false
                            window.print()
                        });
                } else {
                    this.loader = false
                    window.print()
                }

            },
            inititize() {
                this.consultationHour = moment().locale('pt-BR').format('YYYY-MM-DD HH:mm:ss')
                this.hoje = moment().locale('pt-BR').format('DD/MM/YYYY HH:mm:ss')
                this.dia = moment().format('dddd')
            },
            saveConsultationHour() {
                this.inititize()
                if(this.openDocument){
                    this.$store.dispatch('setConsultationHour',{consultation:this.consultation.id,patient:this.user.cpf ,consultationHour:this.consultationHour,day:this.dia})
                        .then((result)=>{
                            if(result){
                                this.consultationHour = result.consultationHour
                                this.hoje = moment(result.consultationHour).locale('pt-BR').format('DD/MM/YYYY HH:mm:ss')
                                this.dia = result.day
                            }
                        })
                }

            },
            async newIntake(costConsultation) {

                let id = moment().valueOf();
                let budget = {
                    id: id,
                    specialties: [
                        {
                            doctor: costConsultation.doctorConsultation,
                            cost: costConsultation.cost,
                            price: costConsultation.price,
                            name: this.consultation.specialty.name
                        }
                    ],
                    exams: undefined,
                    subTotal: 0,
                    discount: 0,
                    total: 0,
                    date: moment().format("YYYY-MM-DD HH:mm:ss"),
                    cost: costConsultation.cost,
                    user: this.$store.getters.selectedPatient,
                    colaborator: this.$store.getters.user,
                    doctor: costConsultation.doctorConsultation,
                    unit: this.selectedUnit,
                    consultation: this.consultation
                };
                await this.$store.dispatch("addIntake", budget);
                this.payment_number = id

            },
        },
        watch: {
            openDocument(value) {
                this.saveConsultationHour()
                return value
            }

        }
    }
</script>
