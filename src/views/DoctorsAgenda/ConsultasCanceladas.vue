<template>
    <v-container>
        <v-layout align-center justify-center row wrap>
            <v-card>

                <template>
                    <v-container fluid grid-list-xl>
                        <v-layout align-center wrap>
                            <v-flex sm3>
                                    <v-btn text>
                                        <v-icon color="blue">event</v-icon>:
                                        <v-chip small text-color="white" color="blue">Consulta</v-chip>
                                    </v-btn>
                            </v-flex>
                            <v-flex sm3>
                                    <v-btn text>
                                        <v-icon color="blue">restore</v-icon>:
                                        <v-chip small text-color="white" color="blue">Retorno</v-chip>
                                    </v-btn>
                            </v-flex>
                            <v-flex sm2>
                                    <v-btn text>
                                        <v-icon color="success">attach_money</v-icon>:
                                        <v-chip small text-color="white" color="success">Pago</v-chip>
                                    </v-btn>
                            </v-flex>
                            <v-flex sm4>
                                    <v-btn text>
                                        <v-icon color="error">money_off</v-icon>:
                                        <v-chip small text-color="white" color="error">Aguardando Pagamento</v-chip>
                                    </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </template>

                <template>
                    <v-container class="align-center justify-center py-0">
                        <v-layout column align-center justify-center wrap>
                            <v-subheader>Gerenciamento de Consultas Canceladas de Todas as Especilidades e Médicos<br/></v-subheader>

                            <v-expansion-panels>
                                <v-expansion-panel
                                        class="elevation-6"
                                        hide-actions
                                        v-model="panel"
                                >
                                    <v-expansion-panel-header>
                                        <v-layout align-center justify-center row wrap>

                                            <v-flex row wrap>
                                                <v-chip small color="primary" text-color="white">
                                                    <v-avatar>
                                                        <v-icon>settings</v-icon>
                                                    </v-avatar>
                                                    Gerenciamento de Consultas Canceladas de Todas as Especilidades e Médicos
                                                </v-chip>
                                            </v-flex>

                                        </v-layout>
                                    </v-expansion-panel-header>

                                    <v-expansion-panel-content>
                                        <v-divider></v-divider>
                                        <v-card class="elevation-0">
                                            <v-list three-line subheader>
                                                <v-layout wrap>
                                                    <v-flex sm3
                                                            xs12
                                                            v-for="item in consultas"
                                                    >
                                                        <v-list-item
                                                                class="py-3"
                                                                @click="visualizarConsulta = {
                                                                    idConsultation:item.id,
                                                                    idPaciente: item.user.cpf,
                                                                    paciente: item.user.name,
                                                                    cartaoId: item.user.association_number,
                                                                    cpf:item.user.cpf,
                                                                    data: item.date.split(' ')[0],
                                                                    hora: item.date.split(' ')[1],
                                                                    crm: item.doctor.crm,
                                                                    especialidade: item.specialty,
                                                                    esp:item.specialty.name,
                                                                    status: item.status,
                                                                    modalidade: item.type,
                                                                    medico:item.doctor.name,
                                                                    doctor:item.doctor,
                                                                    num_recibo:item.payment_number,
                                                                    pacienteObj:item.user,
                                                                    consultation:item
                                                        }">
                                                            <v-list-tile-content>
                                                                <v-list-tile-title class="primary--text">
                                                                    <span  style="font-weight: bolder">
                                                                        {{item.user.dependent ? item.user.dependent.name:
                                                                    item.user.name}}
                                                                    </span>
                                                                </v-list-tile-title>
                                                                <br>
                                                                <v-list-tile-sub-title class="text-left">
                                                                   {{item.user.dependent ? 'Nascimento:' + item.user.dependent.birthDate
                                                                    : 'CPF:' + item.user.cpf}}
                                                                </v-list-tile-sub-title>
                                                                <br>
                                                               <v-list-item-subtitle>
                                                                    Telefone: {{item.user.telephones  ? item.user.telephones[0] : 'Número não informado'}}
                                                                </v-list-item-subtitle>
                                                                <br>
                                                                <v-list-tile-action-text>
                                                                    {{item.date.split(' ')[0] | dateFilter}} -
                                                                    {{item.date.split(' ')[1]}}
                                                                </v-list-tile-action-text>
                                                            </v-list-tile-content>
                                                            <br>
                                                            <v-list-tile-action class="ml-2">
                                                                <v-btn icon ripple text>
                                                                    <v-icon v-if="item.type === 'Retorno'" color="primary">restore</v-icon>
                                                                    <v-icon v-if="item.type === 'Consulta'" color="primary">event</v-icon>
                                                                    <v-icon v-if="item.status === 'Pago'" color="success">attach_money</v-icon>
                                                                    <v-icon v-if="item.status === 'Aguardando pagamento'" color="error">money_off</v-icon>
                                                                </v-btn>
                                                            </v-list-tile-action>
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
                </template>

                <template>
                    <v-container>
                        <v-layout>
                            <div class="text-xs-center">
                                <v-dialog v-model="dialog" width="500">
                                    <v-card>
                                        <v-card-title class="headline grey lighten-2" primary-title>
                                            Informações
                                        </v-card-title>
                                        <v-card-text>
                                            <v-container grid-list-md>
                                                <v-layout wrap>
                                                    <v-flex xs12 sm6>
                                                        <v-text-field readonly hide-details outlined prepend-icon="person" label="Nome do Paciente" v-model="index_Selecionado.paciente">
                                                        </v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12 sm6>
                                                        <v-text-field readonly hide-details outlined prepend-icon="credit_card" label="CPF" v-model="index_Selecionado.cpf">
                                                        </v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12 sm12 md12 lg12><v-divider ></v-divider></v-flex>
                                                    <v-flex xs12 sm6>
                                                        <v-text-field readonly hide-details outlined prepend-icon="person" label="Nome do Médico" v-model="index_Selecionado.medico">
                                                        </v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12 sm6>
                                                        <v-text-field readonly hide-details outlined prepend-icon="credit_card" v-model="index_Selecionado.crm" label="CRM">
                                                        </v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12 sm6>
                                                        <v-text-field readonly hide-details outlined prepend-icon="school" label="Especialidade" v-model="index_Selecionado.esp">
                                                        </v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12 sm6>
                                                        <v-text-field readonly hide-details outlined prepend-icon="event" label="Dia da Consulta" v-model="computedDateFormattedSelecionado">
                                                        </v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12 sm6>
                                                        <v-text-field readonly hide-details outlined prepend-icon="access_alarm" label="Hora da Consulta" v-model="index_Selecionado.hora">
                                                        </v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12 sm6>
                                                        <v-text-field prepend-icon="assignment_turned_in" v-model="index_Selecionado.status" label="Status" chips outlined hide-details readonly>
                                                        </v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12 sm6>
                                                        <v-text-field prepend-icon="assignment" v-model="index_Selecionado.modalidade" readonly outlined hide-details label="Modalidade">
                                                        </v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12 sm6>
                                                        <v-text-field prepend-icon="receipt" label="Nº do Recibo" v-model="index_Selecionado.num_recibo" outlined hide-details readonly
                                                        ></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12 sm12 md12 lg12><v-divider ></v-divider></v-flex>
                                                    <v-flex xs12>
                                                        <v-select
                                                                prepend-icon="device_unknown"
                                                                v-model="attendance"
                                                                :items="attendanceOptions"
                                                                label="Atendimento"
                                                                chips
                                                                outlined
                                                                hide-details
                                                                readonly
                                                        ></v-select>
                                                    </v-flex>
                                                </v-layout>
                                            </v-container>
                                        </v-card-text>
                                        <v-divider></v-divider>
                                        <v-card-actions>
                                            <v-btn color="warning" rounded @click="dialog = false">Voltar<v-icon right>clear</v-icon></v-btn>
                                            <v-spacer></v-spacer>
                                            <v-btn color="error" rounded @click="apagar">Apagar<v-icon right>delete</v-icon></v-btn>
                                            <v-spacer></v-spacer>
                                            <v-btn color="success" rounded dark :to="{ name: 'RemarcarConsultas', params: { q: {...index_Selecionado}}}">Remarcar<v-icon right>assignment_turned_in</v-icon></v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </div>
                        </v-layout>
                    </v-container>
                </template>

            </v-card>
        </v-layout>
    </v-container>
</template>

<script>
    var moment = require('moment');
    export default {
        data: () => ({
            menu: false,
            attendance:'Aguardando Atendimento',
            attendanceOptions:
                [
                    {text: 'Aguardando Atendimento'},
                    {text: 'Atendimento Realizado'},
                ],
            dateFormatted: '',
            date: null,
            dialog: false,
            panel:[true],
            date_choose: '',
            index_Selecionado: {},
            status_Selecionado:'',
            especialidade:'',
        }),
        computed: {
            computedDateFormattedSelecionado() {
                return this.formatDate(this.index_Selecionado.data)
            },
            visualizarConsulta:{
                get: function(){
                    return this.index_Selecionado;
                },
                set: function (index) {
                    this.status_Selecionado = index.status
                    this.index_Selecionado = {...index}
                    //console.log(this.index_Selecionado)
                    this.dialog = true
                }
            },
            consultas () {
                let consultas = this.$store.getters.consultationsCanceled
                return consultas;
            },
        },
        async mounted() {
            this.$store.dispatch('getConsultationsCanceled')
            this.date = moment().format('YYYY-MM-DD')
            this.dateFormatted = moment().format('YYYY-MM-DD')
        },
        methods: {
            formatDate (date) {
                if (!date) return null
                const [year, month, day] = date.split('-')
                return `${day}/${month}/${year}`
            },

            apagar () {
                this.$store.dispatch('removeAppointmentForever',{... this.index_Selecionado})
                this.dialog = false
            }
        },
    };
</script>
<style scoped>
</style>