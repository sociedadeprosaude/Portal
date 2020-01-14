<template>
    <v-container v-if="consultation" fluid class="fill-height ma-0 pa-0">
        <v-layout row wrap>
            <v-flex xs6 class="text-left white">
                <v-btn class="transparent" text @click="$emit('close')">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-flex>
            <v-flex xs6 class="text-right white">
                <v-btn class="transparent" text @click="print()">
                    <v-icon>print</v-icon>
                </v-btn>
            </v-flex>
            <v-flex>
                <v-card flat class="pa-10 item-to-print">
                    <v-flex xs12 class="white" style="color: white">.</v-flex>
                    <v-layout row wrap class="align-center pa-4" style="border: 2px solid #2196f3; border-radius: 16px">
                        <v-flex xs6 class="text-left">
                            <v-layout column wrap>
                                <strong>Hoje: {{ hoje }} - {{dia}}</strong>
                                <span class="my-sub-headline primary--text" style="font-size: 1.4em">Dr. {{consultation.doctor.name}}</span>
                                <v-flex>
                                    <span class="primary--text font-weight-bold">CRM: </span>
                                    <span class="font-weight-bold">{{consultation.doctor.crm}}</span>
                                </v-flex>
                                <v-flex>
                                    <span class="primary--text font-weight-bold">Especialidade: </span>
                                    <span class="font-weight-bold">{{this.consultation.specialty.name}}</span>
                                </v-flex>
                                <v-flex>
                                    <span class="primary--text font-weight-bold">Procedimento: </span>
                                    <span class="font-weight-bold">{{this.consultation.type}}</span>
                                </v-flex>
                                <v-flex>
                                    <span class="primary--text font-weight-bold">Data: </span>
                                    <span class="font-weight-bold">{{this.consultation.date | dateFilter}}</span>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs6 class="text-right">
                            <img src="@/assets/logo-pro-saude.png" height="84px">
                        </v-flex>
                        <v-flex xs12>
                            <v-divider class="primary my-2"></v-divider>
                        </v-flex>
                        <v-flex xs6 class="text-left">
                            <v-layout column wrap align-start justify-start>
                                <span class="my-sub-headline primary--text" style="font-size: 1.4em">{{user.name}}</span>
                                <v-flex>
                                    <span class="primary--text font-weight-bold">CPF: </span>
                                    <span class="font-weight-bold">{{user.cpf}}</span>
                                </v-flex>
                                <v-flex>
                                    <span class="primary--text font-weight-bold">Data de Nascimento: </span>
                                    <span class="font-weight-bold">{{user.birth_date | dateFilter}}</span><br>
                                </v-flex>
                                <v-flex>
                                    <span class="primary--text font-weight-bold">Idade: </span>
                                    <span class="font-weight-bold">{{idade}}</span><br>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs6 class="text-center">
                            <v-layout row wrap justify-end align-end>
                                <!--<v-layout column wrap>-->
                                    <v-flex xs5>
                                        <span class="my-sub-headline primary--text" style="font-size: 1.4em">Triagem</span>
                                        <v-text-field prefix="Peso:" type="number" suffix="KG" hide-details v-model="p"></v-text-field>
                                        <v-text-field prefix="Altura:" type="number" suffix="cm" hide-details v-model="alt"></v-text-field>
                                        <v-text-field prefix="P.A:" suffix="PA" v-mask="'##x##'" v-model="pa" hide-details></v-text-field>
                                    </v-flex>
                                <!--</v-layout>-->
                            </v-layout>
                        </v-flex>
                        <v-flex xs12 class="mt-2 py-1 px-4">
                            <v-layout row wrap class="align-center">
                            </v-layout>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap class="align-center pa-4 mt-4" style="border: 2px solid #2196f3; border-radius: 16px">
                        <v-flex xs12 style="height: 550px"></v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    var moment = require("moment");
    import {mask} from 'vue-the-mask';
    export default {
        name: "Receipt",
        props: ['consultation','openDocument'],
        computed: {
            idade () {
                return moment().diff(moment(this.user.birth_date, 'YYYY-MM-DD'), 'years')
            },
            user() {
                return this.$store.getters.selectedPatient
            },
        },
        directives: {mask},
        data: () => ({
            alt: '',
            p: '',
            pa: '',
            consultationHour: moment().locale('pt-BR').format('YYYY-MM-DD HH:mm:ss'),
            hoje: moment().locale('pt-BR').format('DD/MM/YYYY HH:mm:ss'),
            dia: moment().format('dddd'),
        }),
        mounted(){
            this.saveConsultationHour()
        },
        methods: {
            print() {
                window.print()
            },
            inititize(){
                this.consultationHour = moment().locale('pt-BR').format('YYYY-MM-DD HH:mm:ss')
                this.hoje = moment().locale('pt-BR').format('DD/MM/YYYY HH:mm:ss')
                this.dia = moment().format('dddd')
            },
            saveConsultationHour(){
                this.inititize()
                if(this.openDocument){
                    this.$store.dispatch('setConsultationHour',{consultation:this.consultation.id,patient:this.user.cpf ,consultationHour:this.consultationHour,day:this.dia})
                        .then((result)=>{
                            //console.log('Tem Mesmo',result)
                            if(result){
                                this.consultationHour = result.consultationHour
                                this.hoje = moment(result.consultationHour).locale('pt-BR').format('DD/MM/YYYY HH:mm:ss')
                                this.dia = result.day
                            }
                        })
                }

            }
        },
        watch:{
            openDocument(value){
                this.saveConsultationHour()
                return value
            }

        }
    }
</script>
