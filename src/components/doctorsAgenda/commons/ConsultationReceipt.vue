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
                                    <v-flex xs12 class="justify-center py-6">
                                        <p class="font-weight-bold">COMPROVANTE DE AGENDAMENTO</p>
                                    </v-flex>
                                    <v-flex xs6 class="text-left">
                                        <v-layout column wrap>
                                            <strong>{{ hoje }} - {{dia}}</strong>
                                            <span
                                                    class="my-sub-headline primary--text"
                                                    style="font-size: 1.4em"
                                            >Dr. {{consultation.doctor.name}}</span>
                                            <v-flex>
                                                <span class="primary--text font-weight-bold">CRM:</span>
                                                <span class="font-weight-bold">{{consultation.doctor.crm}}</span>
                                            </v-flex>

                                            <div >
                                                <v-flex>
                                                    <span class="primary--text font-weight-bold">Procedimento: </span>
                                                    <span class="font-weight-bold">{{ this.consultation.product.type === 'EXAM' ? 'Exame' : 'Especialidade' }}</span>
                                                </v-flex>
                                                <v-flex>
                                                    <span class="primary--text font-weight-bold">{{ this.consultation.product.type === 'EXAM' ? 'Exame' : 'Especialidade' }}: </span>
                                                    <span class="font-weight-bold">{{this.consultation.product.name}}</span>
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
                                            >{{this.consultation.dependent ? this.consultation.dependent.name : this.consultation.patient.name}}</span>
                                            <v-flex v-if="!this.consultation.dependent">
                                                <span class="primary--text font-weight-bold">CPF:</span>
                                                <span class="font-weight-bold">{{user.cpf}}</span>
                                            </v-flex>
                                            <v-flex>
                                                <span class="primary--text font-weight-bold">Data de Nascimento:</span>
                                                <span class="font-weight-bold">{{formatbirthDate()}}</span>
                                                <br/>
                                            </v-flex>
                                            <v-flex>
                                                <span class="primary--text font-weight-bold">Idade:</span>
                                                <span class="font-weight-bold">{{formatIdade()}}</span>
                                                <br/>
                                            </v-flex>
                                        </v-layout>
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
        name: "ConsultationReceipt",
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
            loader: false,
            payment_number: undefined
        }),
        mounted() {
            //this.saveConsultationHour()
        },
        methods: {
            formatbirthDate(){
                const date = this.consultation.dependent ? this.consultation.dependent.birth_date : this.consultation.patient.birth_date
                let formatbirthDateFormat = moment(date).format('DD/MM/YYYY')
                return formatbirthDateFormat
            },

            formatIdade(){
                let idade;
                let date = this.consultation.dependent ? this.consultation.dependent.birth_date : this.consultation.patient.birth_date;
                let patt = new RegExp(/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/);
                if(patt.test(date)) date = moment(date,"DD/MM/YYYY").format("YYYY-MM-DD");
                idade = moment().diff(moment(date, 'YYYY-MM-DD'), 'years');
                return idade
            },

            async print() {
                this.loader = true;
                this.loader = false
                window.print()
            },
            inititize() {
                this.consultationHour = moment().locale('pt-BR').format('YYYY-MM-DD HH:mm:ss')
                this.hoje = moment().locale('pt-BR').format('DD/MM/YYYY HH:mm:ss')
                this.dia = moment().format('dddd')
            },
            /* saveConsultationHour() {
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

            }, */
        },
        /* watch: {
            openDocument(value) {
                this.saveConsultationHour()
                return value
            }

        } */
    }
</script>
