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
                <v-card flat class="pa-10 receipt-to-print">
                    <v-layout row wrap class="align-center pa-4 mt-12" style="border: 2px solid #2196f3; border-radius: 16px">
                        <v-flex xs6 class="text-left">
                            <img :src="consultation.clinic.logo" height="84px">
                        </v-flex>
                        <v-flex xs6 class="text-right">
                            <v-layout row wrap class="justify-end pb-12">
                                <span class="primary--text font-weight-bold mr-4">Comprovante de agendamento</span>
                            </v-layout>
                        </v-flex>
                        <v-flex xs12>
                            <v-layout row wrap>
                                <v-flex class="text-left pr-4" v-if="consultation.user">
                                    <v-layout column wrap>
                                        <span class="my-sub-headline primary--text" style="font-size: 1.4em">{{consultation.user ? consultation.user.name : consultation.paciente}}</span>
                                        <v-flex>
                                            <span class="primary--text font-weight-bold">CPF: </span>
                                            <span class="font-weight-bold">{{consultation.user ? consultation.user.cpf : consultation.cpf}}</span>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex class="align-center justify-center mt-8">
                                    <v-divider class="primary"></v-divider>
                                </v-flex>
                                <v-flex>
                                    <v-layout column wrap class="align-end">
                                        <span class="my-sub-headline primary--text" style="font-size: 1.4em">Dr(a). {{consultation.doctor.name}}</span>
                                        <span class="my-sub-headline">{{consultation.specialty.name}}</span>
                                        <span class="font-weight-bold">{{consultation.date | dateFilter}}</span>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs6 class="text-left mt-12">
                            <v-layout column wrap class="primary--text">
                                <span class="font-weight-bold">Sociedade Pró Saúde Dr. Luiz Fernando</span>
                                <span>{{consultation.clinic.address.street}} {{consultation.clinic.address.number}}, {{consultation.clinic.address.number}}</span>
                                <span>{{consultation.clinic.address.city}}</span>
                                <span>CNPJ: {{consultation.clinic.cnpj}}</span>
                            </v-layout>
                        </v-flex>
                        <v-flex xs6 class="text-right mt-12 primary--text">
                            <v-layout column wrap class="align-end justify-end">
                                    <span class="font-weight-bold"
                                          style="font-size: 0.6em">Nossas unidades</span>
                                <span class="font-weight-bold">
                                        <v-icon class=" pb-1" style="font-size: 1.2em">alarm</v-icon>
                                        6:00 - 17:00</span>
                                <span class="font-weight-bold"
                                      style="font-size: 0.6em">Atendimento por telefone</span>
                                <span class="font-weight-bold">
                                                                                <v-icon class=" pb-1"
                                                                                        style="font-size: 1.2em">alarm</v-icon>
                                        7:30 - 17:00</span>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        name: "ConsultationToPrint",
        props: ['consultation'],
        methods: {
            print() {
                window.print()
            }
        }
    }
</script>
