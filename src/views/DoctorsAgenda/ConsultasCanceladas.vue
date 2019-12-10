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

                =================
                <template>
                    <v-container class="align-center justify-center py-0">
                        <v-layout column align-center justify-center wrap>
                            <v-subheader ><b>Data: {{date | dateFilter}} - {{daydate(date)}}</b></v-subheader>

                            <v-expansion-panels>
                                <v-expansion-panel
                                        v-for="(consultation, i) in consultas"
                                        :key="i"
                                        class="elevation-6"
                                        hide-actions
                                        v-model="panel"
                                >
                                    <v-expansion-panel-header>
                                        <v-layout align-center row spacer>

                                            <v-flex xs6 hidden-xs-only>
                                                <strong>Médico:</strong>
                                                <v-chip small color="blue" text-color="white">
                                                    <v-avatar>
                                                        <v-icon>account_circle</v-icon>
                                                    </v-avatar>
                                                    {{consultation.doctor.name}}
                                                </v-chip>
                                            </v-flex>

                                            <v-flex xs2 hidden-xs-only >
                                                <strong>CRM-AM:</strong>
                                                <v-chip small color="blue" text-color="white">
                                                    <v-avatar>
                                                        <v-icon>payment</v-icon>
                                                    </v-avatar>
                                                    {{consultation.doctor.crm}}
                                                </v-chip>
                                            </v-flex>

                                            <v-flex row wrap xs2 class="text-xs-right blue--text">
                                                <strong>Consultas: </strong>
                                                <v-chip small color="blue" text-color="white">
                                                    <v-avatar>
                                                        <v-icon>event</v-icon>
                                                    </v-avatar>
                                                    {{consultation.numConsultations}}
                                                </v-chip>
                                            </v-flex>

                                            <v-flex row wrap xs2  class="text-xs-right blue--text" >
                                                <strong>Retornos: </strong>
                                                <v-chip small color="blue" text-color="white">
                                                    <v-avatar>
                                                        <v-icon>restore</v-icon>
                                                    </v-avatar>
                                                    {{consultation.numRegress}}
                                                </v-chip>
                                            </v-flex>
                                        </v-layout>
                                    </v-expansion-panel-header>

                                    <v-expansion-panel-content>
                                        <v-divider></v-divider>
                                        <v-card class="elevation-3">
                                            <v-list three-line subheader>
                                                <v-layout wrap>
                                                    <v-flex sm3
                                                            xs12
                                                            v-for="item in consultation.consultations"
                                                            :key="item.id"
                                                    >
                                                        <v-list-item
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
                                                            status: item.status,
                                                            modalidade: item.type,
                                                            medico:item.doctor.name,
                                                            doctor:item.doctor,
                                                            num_recibo:item.payment_number,
                                                            pacienteObj:item.user,
                                                            consultation:item
                                                        }"
                                                        >
                                                            <v-list-tile-content>
                                                                <v-list-tile-title class="primary--text">
                                                            <span  style="font-weight: bolder">
                                                                {{item.user.name}}
                                                            </span>
                                                                </v-list-tile-title>
                                                                <br>
                                                                <v-list-tile-sub-title class="text-left">
                                                                    CPF: {{item.user.cpf}}
                                                                </v-list-tile-sub-title>
                                                                <br>
                                                                <v-list-tile-sub-title>
                                                                    Telefone: {{item.user.telephones[0]}}
                                                                </v-list-tile-sub-title>
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
                                            Atualizar Informações
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
                                                        <v-text-field readonly hide-details outlined prepend-icon="school" label="Especialidade" v-model="especialidade.name">
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
                                                        <v-select
                                                                prepend-icon="assignment_turned_in"
                                                                v-model="index_Selecionado.status"
                                                                :items="statusOptions"
                                                                label="Status"
                                                                chips
                                                                outlined
                                                                hide-details
                                                        ></v-select>
                                                    </v-flex>
                                                    <v-flex xs12 sm6>
                                                        <v-text-field
                                                                prepend-icon="assignment"
                                                                v-model="index_Selecionado.modalidade"
                                                                readonly
                                                                outlined
                                                                hide-details
                                                                label="Modalidade"
                                                        ></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12 sm6>
                                                        <v-text-field
                                                                @click:clear="clearRecibo"
                                                                prepend-icon="receipt"
                                                                label="Nº do Recibo"
                                                                v-model="index_Selecionado.num_recibo"
                                                                type="number"
                                                                outlined
                                                                hide-details
                                                                :disabled="index_Selecionado.status === 'Pago' ? false : true"
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
                                                                :disabled="status_Selecionado.status === 'Pago' && index_Selecionado.num_recibo !== ''"
                                                        ></v-select>
                                                    </v-flex>
                                                </v-layout>
                                            </v-container>
                                        </v-card-text>
                                        <v-divider></v-divider>
                                        <v-card-actions>
                                            <v-btn color="warning" rounded @click="dialog = false">
                                                Voltar
                                                <v-icon>clear</v-icon>
                                            </v-btn>
                                            <v-spacer></v-spacer>
                                            <v-btn
                                                    color="error"
                                                    rounded
                                                    :loading="this.mensage_progress == 'Apagando...' && loader"
                                                    :disabled="index_Selecionado.status === 'Cancelado' ? false : true"
                                                    @click="apagar()"
                                            >
                                                Apagar
                                                <v-icon>delete</v-icon>
                                            </v-btn>
                                            <v-spacer></v-spacer>
                                            <v-btn
                                                    color="blue"
                                                    rounded
                                                    dark
                                                    :to="{ name: 'AgendarRetorno', params: { q: {...this.index_Selecionado}}}"
                                                    :disabled="status_Selecionado === 'Pago' && !index_Selecionado.pacienteObj.retorno ? false : true"
                                                    v-if="index_Selecionado.modalidade !== 'Retorno'"
                                            >Retorno
                                                <v-icon>refresh</v-icon>
                                            </v-btn>
                                            <v-spacer></v-spacer>
                                            <v-btn
                                                    color="success"
                                                    rounded
                                                    :disabled="loader"
                                                    :loading="this.mensage_progress == 'Atualizando...' && loader"
                                                    @click="atualizar()"
                                                    v-if="index_Selecionado.status === 'Pago' && index_Selecionado.num_recibo !== ''"
                                            >Atualizar
                                                <v-icon>done</v-icon>
                                            </v-btn>
                                            <v-spacer></v-spacer>
                                            <v-dialog
                                                    v-model="loader"
                                                    hide-overlay
                                                    persistent
                                                    width="300"
                                            >
                                                <v-card
                                                        color="primary"
                                                        dark
                                                >
                                                    <v-card-text>
                                                        {{this.mensage_progress}}
                                                        <v-progress-linear
                                                                indeterminate
                                                                color="white"
                                                                class="mb-0"
                                                        ></v-progress-linear>
                                                    </v-card-text>
                                                </v-card>
                                            </v-dialog>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </div>
                        </v-layout>
                    </v-container>
                </template>
                ==============

            </v-card>
        </v-layout>
    </v-container>
</template>

<script>
    var moment = require('moment');
    export default {
        data: () => ({
            //--------------------
            menu: false,
            dateFormatted: '',
            date: null,
            dialog: false,
            //-------------
            panel:[true],
            date_choose: '',
            alert: false,
            index_Selecionado: {},
            status_Selecionado:'',
            attendance:'Aguardando Atendimento',
            semanaOptions: [
                "Domingo",
                "Segunda-feira",
                "Terça-feira",
                "Quarta-feira",
                "Quinta-feira",
                "Sexta-feira",
                "Sábado"
            ],
            attendanceOptions:
                [
                    {text: 'Aguardando Atendimento'},
                    {text: 'Atendimento Realizado'},
                ],
            statusOptions:
                [
                    {text: 'Aguardando pagamento'},
                    {text: 'Pago'},
                    {text: 'Cancelado'},
                ],
            messages: [],
            timeout:4000,
            mensage_progress:'',
            especialidade:'',
        }),
        computed: {
            formIsValid() {
                return this.sale && this.cost && this.exams.length > 0
            },
            computedDateFormatted () {
                return this.formatDate(this.date)
            },
            visualizarConsulta: {
                get: function () {
                    return this.index_Selecionado;
                },
                set: function (index) {
                    this.status_Selecionado = index.status
                    this.index_Selecionado = {...index}
                    console.log(this.index_Selecionado)
                    this.dialog = true
                }
            },
            consultas() {
                let consultas = this.$store.getters.consultationsCanceled
                console.log(consultas)
                return consultas;
            },
        },
        async mounted() {
            this.$store.dispatch('getConsultationsCanceled')
            this.date = moment().format('YYYY-MM-DD')
            this.dateFormatted = moment().format('YYYY-MM-DD')
        },
        watch: {
            menu(val) {
                val && setTimeout(() => (this.$refs.picker.activePicker = 'MONTH'))
            }
        },
        methods: {
            formatDate (date) {
                if (!date) return null
                const [year, month, day] = date.split('-')
                return `${day}/${month}/${year}`
            },
            daydate(date) {
                var dateMoment = moment(date);
                return this.semanaOptions[dateMoment.day()];
            },
            save(date) {
                this.$refs.menu.save(date)
            },
            /*
            call(){
                this.$store.dispatch('erase',{... this.index_Selecionado})
            },
            apagar(){
                this.mensage_progress = 'Apagando...'
                this.$store.dispatch('setLoader',{loader:true,view:"ConsultaCancelada"})
                setTimeout(() => (this.call()), 1000)
            }
             */
        },
    }
</script>
<style scoped>
</style>