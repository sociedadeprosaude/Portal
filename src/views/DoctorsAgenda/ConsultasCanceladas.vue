<template>
    <v-container>
        <v-layout align-center justify-center row wrap>
            <v-card>

                <v-flex v-for="(option, i) in options" :key="i">
                    <strong>{{option.doctor.name}}</strong>
                    <v-text-field v-html="option.doctor.name"></v-text-field>
                </v-flex>

                <!--
                <template>
                    <v-container fluid grid-list-xl>
                        <v-layout align-center wrap>
                            <v-flex sm3>
                                    <v-btn flat>
                                        <v-icon color="blue">event</v-icon>:
                                        <v-chip small text-color="white" color="blue">Consulta</v-chip>
                                    </v-btn>
                            </v-flex>
                            <v-flex sm3>
                                    <v-btn flat>
                                        <v-icon color="blue">restore</v-icon>:
                                        <v-chip small text-color="white" color="blue">Retorno</v-chip>
                                    </v-btn>
                            </v-flex>
                            <v-flex sm2>
                                    <v-btn flat>
                                        <v-icon color="success">attach_money</v-icon>:
                                        <v-chip small text-color="white" color="success">Pago</v-chip>
                                    </v-btn>
                            </v-flex>
                            <v-flex sm4>
                                    <v-btn flat>
                                        <v-icon color="error">money_off</v-icon>:
                                        <v-chip small text-color="white" color="error">Aguardando Pagamento</v-chip>
                                    </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </template>

                <template>
                    <v-container class="align-center justify-center">
                        <v-layout column align-center justify-center wrap>
                            <v-subheader>Gerenciamento de Consultas Canceladas de Todas as Especilidades</v-subheader>
                            <v-expansion-panel v-model="panel" expand>
                                <v-expansion-panel-content
                                        v-for="(message, i) in menssagens"
                                        :key="i"
                                        class="elevation-6"
                                        hide-actions
                                >
                                    <template v-slot:header>
                                        <v-layout align-center row spacer>

                                            <v-flex row wrap :class="`${message.color}--text`">
                                                <v-chip small :color="message.color" text-color="white">
                                                    <v-avatar>
                                                        <v-icon>settings</v-icon>
                                                    </v-avatar>
                                                    Gerenciamento de Consultas Canceladas de Todas as Especilidades
                                                </v-chip>
                                            </v-flex>

                                            <v-flex row wrap xs5 sm3 :class="`${message.color}--text`">
                                                <strong>Consultas: </strong>
                                                <v-chip small :color="message.color" text-color="white">
                                                    <v-avatar>
                                                        <v-icon>event</v-icon>
                                                    </v-avatar>
                                                    {{message.consultas}}
                                                </v-chip>
                                            </v-flex>

                                            <v-flex row wrap xs5 sm3 :class="`${message.color}--text`">
                                                <strong>Retornos: </strong>
                                                <v-chip small :color="message.color" text-color="white">
                                                    <v-avatar>
                                                        <v-icon>restore</v-icon>
                                                    </v-avatar>
                                                    {{message.retornos}}
                                                </v-chip>
                                            </v-flex>

                                        </v-layout>
                                    </template>
                                <v-card>
                                    <v-divider></v-divider>
                                    <v-list three-line subheader>
                                        <v-layout row wrap>
                                            <v-flex sm3
                                                    xs12
                                                    v-for="item in message.pacientes"
                                                    :key="item.paciente"
                                            >
                                                <v-list-tile
                                                        @click="visualizarConsulta = {
                                                            idConsultation:item.idConsultation,
                                                            idPaciente: item.idPaciente,
                                                            paciente: item.paciente,
                                                            telefone: item.telefone,
                                                            cpf:item.cpf,
                                                            especialidade:item.especialidade,
                                                            id: item.id,
                                                            data: item.data,
                                                            hora: item.hora,
                                                            crm: message.crm,
                                                            status: item.status,
                                                            modalidade: item.modalidade,
                                                            medico:message.medico,
                                                            num_recibo:item.num_recibo,
                                                            especialidade:item.especialidade,
                                                            pacienteObj:item.pacienteObj
                                                        }"
                                                    >
                                                        <v-list-tile-content>
                                                            <v-list-tile-title>
                                                                <span :class="`${message.color}--text`" style="font-weight: bolder">{{item.paciente}}</span>
                                                            </v-list-tile-title>
                                                            <v-list-tile-sub-title>
                                                                {{item.cpf}}
                                                            </v-list-tile-sub-title>
                                                            <v-list-tile-sub-title>
                                                                {{item.telefone}}
                                                            </v-list-tile-sub-title>
                                                            <v-list-tile-action-text>
                                                                {{item.data | dateFilter}} -
                                                                {{item.hora}}
                                                            </v-list-tile-action-text>
                                                        </v-list-tile-content>

                                                        <v-list-tile-action>
                                                            <v-btn icon ripple flat>
                                                                <v-icon v-if="item.modalidade === 'Retorno'" :color="message.color">restore</v-icon>
                                                                <v-icon v-if="item.modalidade === 'Consulta'" :color="message.color">event</v-icon>
                                                                <v-icon v-if="item.status === 'Pago'" color="success">attach_money</v-icon>
                                                                <v-icon v-if="item.status === 'Aguardando pagamento'" color="error">money_off</v-icon>
                                                            </v-btn>
                                                        </v-list-tile-action>
                                                    </v-list-tile>
                                                </v-flex>
                                            </v-layout>
                                        </v-list>
                                    </v-card>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
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
                                                        <v-text-field readonly prepend-icon="person" label="Nome do Paciente" v-model="index_Selecionado.paciente">
                                                        </v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12 sm6>
                                                        <v-text-field readonly prepend-icon="credit_card" label="CPF" v-model="index_Selecionado.cpf">
                                                        </v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12 sm12 md12 lg12><v-divider ></v-divider></v-flex>
                                                    <v-flex xs12 sm6>
                                                        <v-text-field readonly prepend-icon="person" label="Nome do Médico" v-model="index_Selecionado.medico">
                                                        </v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12 sm6>
                                                        <v-text-field readonly prepend-icon="credit_card" v-model="index_Selecionado.crm" label="CRM">
                                                        </v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12 sm6>
                                                        <v-text-field readonly prepend-icon="school" label="Especialidade" v-model="index_Selecionado.especialidade">
                                                        </v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12 sm6>
                                                        <v-text-field readonly prepend-icon="event" label="Dia da Consulta" v-model="computedDateFormatted">
                                                        </v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12 sm6>
                                                        <v-text-field readonly prepend-icon="access_alarm" label="Hora da Consulta" v-model="index_Selecionado.hora">
                                                        </v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12 sm6>
                                                        <v-text-field
                                                                prepend-icon="assignment_turned_in"
                                                                v-model="index_Selecionado.status"
                                                                label="Status"
                                                                chips
                                                        ></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12 sm6>
                                                        <v-text-field
                                                                prepend-icon="assignment"
                                                                v-model="index_Selecionado.modalidade"
                                                                readonly
                                                                label="Modalidade"
                                                        ></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12 sm6>
                                                        <v-text-field
                                                                prepend-icon="receipt"
                                                                label="Nº do Recibo"
                                                                v-model="index_Selecionado.num_recibo"
                                                                readonly
                                                        ></v-text-field>
                                                    </v-flex>
                                                </v-layout>
                                            </v-container>
                                        </v-card-text>
                                        <v-divider></v-divider>
                                        <v-card-actions>
                                            <v-btn color="warning" round @click="dialog = false">
                                                Voltar
                                                <v-icon right>clear</v-icon>
                                            </v-btn>
                                            <v-spacer></v-spacer>
                                            <v-btn color="error"
                                                   round
                                                   @click="apagar"
                                            >
                                                Apagar
                                                <v-icon right>delete</v-icon>
                                            </v-btn>
                                            <v-spacer></v-spacer>
                                            <v-btn
                                                    color="success"
                                                    round
                                                    dark
                                                    :to="{ name: 'RemarcarConsultas', params: { q: {...index_Selecionado}}}"
                                            >Remarcar
                                                <v-icon right>assignment_turned_in</v-icon>
                                            </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </div>
                        </v-layout>
                    </v-container>
                </template>
                -->
            </v-card>
        </v-layout>
    </v-container>
</template>

<script>
    var moment = require('moment');
    export default {
        data: () => ({
            //--------------------
            moment: moment,
            menu: false,
            dateFormatted: '',
            date: null,
            dialog: false,
            //-------------
            /*
            panel: [true],
            alert: false,
            menssagem:'',
            especialidade_choose:'',
            index_Selecionado: {},
            status_Selecionado:'',
            timeout:4000,
            mensage_progress:''
            */
        }),
        computed: {
            formIsValid() {
                return this.sale && this.cost && this.exams.length > 0
            },
            computedDateFormatted () {
                return this.formatDate(this.date)
            },
            options() {
                let cancel = this.$store.getters.consultationsCanceled
                return cancel
            },
            /*
            canceleds () {
                this.$store.getters.consultationsCanceled
            }
            */
        },
        async mounted() {
            this.$store.dispatch('getConsultationsCanceled')
            this.date = moment().format('YYYY-MM-DD')
            this.dateFormatted = moment().format('YYYY-MM-DD')
        },
        watch: {
            //
        },
        methods: {
            formatDate (date) {
                if (!date) return null
                const [year, month, day] = date.split('-')
                return `${day}/${month}/${year}`
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