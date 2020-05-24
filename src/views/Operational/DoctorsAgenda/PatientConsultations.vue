<template>
    <v-container class="pt-0">
        <v-layout row wrap class="justify-center">
            <patient maxWidth="100%"/>
            <v-flex xs12 class="mt-5">
                <v-layout row wrap class="justify-center align-center">
                    <v-flex xs2>
                        <v-icon color="blue">event</v-icon> : <v-chip small text-color="white" color="blue">Consulta</v-chip>
                    </v-flex>
                    <v-flex xs2>
                        <v-icon color="warning">event_busy</v-icon> : <v-chip small text-color="white" color="warning">Consulta Cancelada</v-chip>
                    </v-flex>
                    <v-flex xs2>
                        <v-icon color="blue">restore</v-icon> : <v-chip small text-color="white" color="blue">Retorno</v-chip>
                    </v-flex>
                    <v-flex xs2>
                        <v-icon color="warning">alarm_off</v-icon> : <v-chip small text-color="white" color="warning">Retorno Cancelado</v-chip>
                    </v-flex>
                    <v-flex xs2>
                        <v-icon color="success">attach_money</v-icon> : <v-chip small text-color="white" color="success">Pago</v-chip>
                    </v-flex>
                    <v-flex xs2>
                        <v-icon color="error">money_off</v-icon> : <v-chip small text-color="white" color="error">Aguardando Pagamento</v-chip>
                    </v-flex>
                </v-layout>



            </v-flex>
            <v-subheader class="mt-4">Histórico de Consultas e Retornos</v-subheader>
            <v-expansion-panels v-if="patient">
                <v-expansion-panel>
                    <v-expansion-panel-header>
                        <v-layout row spacer class="justify-sm-center justify-md-center align-center">
                            <v-flex sm6 md4 hidden-xs-only :class="`${color}--text`">
                                <v-icon left>account_circle</v-icon>
                                <strong>Paciente: </strong>
                                <v-chip small :color="color" text-color="white">
                                    {{patient.name}}
                                </v-chip>
                            </v-flex>

                            <v-flex sm6 md3 hidden-xs-only :class="`${color}--text`">
                                <v-icon left>payment</v-icon>
                                <strong>Nº do Associado: </strong>
                                <v-chip small :color="color" text-color="white">
                                    {{patient.association_number}}
                                </v-chip>
                            </v-flex>

                            <v-flex sm6 md3 sm2 hidden-xs-only :class="`${color}--text`">
                                <v-icon left>call</v-icon>
                                <strong>Contato: </strong>
                                <v-chip small :color="color" text-color="white">
                                    {{patient.telephones ? patient.telephones[0] : 'Número não informado'}}
                                </v-chip>
                            </v-flex>

                            <v-flex row wrap xs5 md3 sm2 :class="`${color}--text`" class="mt-2">
                                <v-icon left>event</v-icon>
                                <strong>Consultas:  </strong>
                                <v-chip small :color="color" text-color="white">
                                    {{qtdConsultas}}
                                </v-chip>
                            </v-flex>

                            <v-flex row wrap xs5 md3 sm2 :class="`${color}--text`" class="mt-2">
                                <v-icon left>restore</v-icon>
                                <strong>Retornos:  </strong>
                                <v-chip small :color="color" text-color="white">
                                    {{qtdRetornos}}
                                </v-chip>
                            </v-flex>
                        </v-layout>
                    </v-expansion-panel-header>

                    <v-expansion-panel-content>
                        <v-divider/>
                        <v-card class="elevation-0">
                            <v-list three-line subheader>
                                <v-layout row wrap>
                                    <v-flex sm3 xs12
                                            v-for="item in patient.consultations"
                                            :key="item.cpf"
                                    >
                                        <v-list-item @click="visualizarConsulta = {
                                                            idConsultation:item.id,
                                                            idPaciente: patient.cpf,
                                                            paciente: patient.name,
                                                            cartaoId: patient.association_number,
                                                            cpf:patient.cpf,
                                                            data: item.date.split(' ')[0],
                                                            hora: item.date.split(' ')[1],
                                                            crm: item.doctor.crm,
                                                            especialidade: item.specialty,
                                                            exame: exames.indexOf(item.specialty.name) !== -1 ? item.exam : undefined,
                                                            esp:item.specialty.name,
                                                            status: item.status,
                                                            modalidade: item.type,
                                                            medico:item.doctor.name,
                                                            doctor:item.doctor,
                                                            num_recibo:item.payment_number,
                                                            pacienteObj:patient,
                                                            consultation:item
                                                        }"
                                        >
                                            <v-list-item-content>
                                                <v-list-item-title>
                                                            <span :class="`${color}--text`" style="font-weight: bolder">
                                                                Dr(a). {{item.doctor.name}}
                                                            </span>
                                                </v-list-item-title>
                                                <v-list-item-subtitle class="text-center">
                                                    {{item.specialty.name}}
                                                </v-list-item-subtitle>
                                                <v-list-item-subtitle>
                                                    CRM: {{item.doctor.crm}}
                                                </v-list-item-subtitle>
                                                <v-list-item-action-text>
                                                    {{item.date.split(' ')[0] | dateFilter}} -
                                                    {{item.date.split(' ')[1]}}
                                                </v-list-item-action-text>
                                            </v-list-item-content>
                                            <v-list-item-action class="ml-1">
                                                <v-btn icon ripple text>
                                                    <v-icon v-if="item.type === 'Retorno'" :color="color">
                                                        restore
                                                    </v-icon>
                                                    <v-icon v-if="item.type === 'Retorno' && item.status === 'Cancelado'"
                                                            color="warning">alarm_off
                                                    </v-icon>
                                                    <v-icon v-if="item.type === 'Consulta'" :color="color">
                                                        event
                                                    </v-icon>
                                                    <v-icon v-if="item.type === 'Consulta' && item.status === 'Cancelado'"
                                                            color="warning">event_busy
                                                    </v-icon>
                                                    <v-icon v-if="item.status === 'Pago'" color="success">
                                                        attach_money
                                                    </v-icon>
                                                    <v-icon v-if="item.status === 'Aguardando pagamento'"
                                                            color="error">money_off
                                                    </v-icon>
                                                </v-btn>
                                            </v-list-item-action>
                                        </v-list-item>
                                    </v-flex>
                                </v-layout>
                            </v-list>
                        </v-card>
                    </v-expansion-panel-content>

                </v-expansion-panel>
            </v-expansion-panels>
        </v-layout>

        <template>
            <v-container>
                <v-layout>
                    <div class="text-xs-center">
                        <v-dialog v-model="dialog" width="560">
                            <v-card>
                                <v-card-title class="headline grey lighten-2" primary-title>
                                    Atualizar Informações
                                    <v-spacer/>
                                    <v-btn @click="dialog = false" text class="transparent">
                                        <v-icon>close</v-icon>
                                    </v-btn>
                                </v-card-title>
                                <v-card-text>
                                    <v-container grid-list-md>
                                        <v-layout wrap>
                                            <v-flex xs12>
                                                <v-text-field readonly hide-details outlined prepend-icon="person"
                                                              label="Nome do Paciente"
                                                              v-model="index_Selecionado.paciente">
                                                </v-text-field>
                                            </v-flex>
                                            <v-flex xs12>
                                                <v-text-field readonly hide-details outlined prepend-icon="credit_card"
                                                              label="CPF" v-model="index_Selecionado.cpf">
                                                </v-text-field>
                                            </v-flex>
                                            <v-flex xs12
                                                    v-if="index_Selecionado.consultation && index_Selecionado.consultation.dependent">
                                                <v-text-field readonly hide-details outlined
                                                              prepend-icon="person" label="Nome do Dependente"
                                                              v-model="index_Selecionado.consultation.dependent.name">
                                                </v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm6
                                                    v-if="index_Selecionado.consultation && index_Selecionado.consultation.dependent">
                                                <v-text-field readonly hide-details outlined
                                                              prepend-icon="person" label="Nascimento do Dependente"
                                                              v-model="computedDateFormattedDependent">
                                                </v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm6
                                                    v-if="index_Selecionado.consultation && index_Selecionado.consultation.dependent">
                                                <v-text-field readonly hide-details outlined
                                                              prepend-icon="credit_card"
                                                              v-model="index_Selecionado.consultation.dependent.dependentDegree"
                                                              label=" Grau do Dependente">
                                                </v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm12 md12 lg12>
                                                <v-divider></v-divider>
                                            </v-flex>
                                            <v-flex xs12 sm6>
                                                <v-text-field readonly hide-details outlined prepend-icon="person"
                                                              label="Nome do Médico" v-model="index_Selecionado.medico">
                                                </v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm6>
                                                <v-text-field readonly hide-details outlined prepend-icon="credit_card"
                                                              v-model="index_Selecionado.crm" label="CRM">
                                                </v-text-field>
                                            </v-flex>

                                            <v-flex xs12 sm6 v-if="index_Selecionado.exame">
                                                <v-text-field readonly hide-details outlined prepend-icon="poll" label="Exame" v-model="index_Selecionado.exame.name"></v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm6 v-else>
                                                <v-text-field readonly hide-details outlined prepend-icon="school" label="Especialidade" v-model="index_Selecionado.esp"></v-text-field>
                                            </v-flex>

                                            <v-flex xs12 sm6>
                                                <v-text-field readonly hide-details outlined prepend-icon="event"
                                                              label="Dia da Consulta"
                                                              v-model="computedDateFormattedSelecionado">
                                                </v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm4>
                                                <v-text-field readonly hide-details outlined prepend-icon="access_alarm"
                                                              label="Hora da Consulta" v-model="index_Selecionado.hora">
                                                </v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm8>

                                                <v-select
                                                        prepend-icon="assignment_turned_in"
                                                        v-model="index_Selecionado.status"
                                                        :items="statusOptions"
                                                        label="Status"
                                                        chips
                                                        hide-details
                                                        outlined
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
                                                                :color="data.item.text === 'Pago' ? 'success' : data.item.text === 'Cancelado' ? 'error': 'warning'"
                                                        >{{ data.item.text }}
                                                        </v-chip>
                                                    </template>
                                                </v-select>
                                            </v-flex>
                                            <v-flex xs12 sm6>
                                                <v-text-field
                                                        prepend-icon="assignment"
                                                        v-model="index_Selecionado.modalidade"
                                                        readonly
                                                        hide-details
                                                        outlined
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
                                                        :disabled="index_Selecionado.status === 'Pago' ? false : true"
                                                        hide-details
                                                        outlined
                                                        readonly
                                                ></v-text-field>
                                            </v-flex>

                                            <v-flex v-if="index_Selecionado.consultation && index_Selecionado.consultation.type === 'Retorno' && index_Selecionado.consultation.justifyReturn" vxs12 md12>
                                                <h1 class="title font-weight-bold">Justificativa do Retorno</h1>
                                                <p class="subtitle-1 font-weight-bold text-justify">{{this.index_Selecionado.consultation.justifyReturn}}</p>
                                            </v-flex>

                                            <v-flex xs12 sm12 md12 lg12>
                                                <v-divider/>
                                            </v-flex>
                                            <v-flex xs12>
                                                <v-select
                                                        prepend-icon="device_unknown"
                                                        v-model="attendance"
                                                        :items="attendanceOptions"
                                                        label="Atendimento"
                                                        chips
                                                        outlined
                                                        hide-details
                                                        :disabled="status_Selecionado === 'Pago' && !index_Selecionado.consultation.regress ? false : true"
                                                ></v-select>
                                            </v-flex>
                                            <v-flex v-if="index_Selecionado.consultation && index_Selecionado.consultation.type === 'Consulta' && returnOutRule()" vxs12 md12>
                                                <p class="subtitle-2 font-italic font-weight-medium text-justify red--text">O retorno não poderá ser marcado, pois o limite de 21 dias após a data da consulta já foi ultrapassado.</p>
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                </v-card-text>
                                <v-divider></v-divider>
                                <v-card-actions>
                                    <v-btn
                                            color="warning"
                                            rounded
                                            @click="documentDialog = !documentDialog"
                                            v-if="(index_Selecionado.data)"
                                           :disabled="!(status_Selecionado === 'Pago'&& index_Selecionado.data >= today)"
                                    >
                                        Prontuario
                                        <v-icon>insert_drive_file</v-icon>
                                    </v-btn>
                                    <v-spacer/>
                                    <v-btn
                                            color="primary"
                                            rounded
                                            @click="showVerifierCard()"
                                    >
                                        Comprovante
                                    </v-btn>
                                    <v-spacer/>
                                    <v-btn
                                            color="error"
                                            rounded
                                            :loading="this.mensage_progress === 'Apagando...' && loader"
                                            :disabled="index_Selecionado.status!=='Cancelado'"
                                            @click="apagar()"
                                    >
                                        Apagar
                                        <v-icon>delete</v-icon>
                                    </v-btn>
                                    <v-spacer/>
                                    <v-btn
                                            color="blue"
                                            rounded
                                            dark
                                            :to="{ name: 'AgendarRetorno', params: { q: {...this.index_Selecionado,consultaPaciente:true}}}"
                                            :disabled="!(status_Selecionado === 'Pago' && !index_Selecionado.consultation.regress && exames.indexOf(index_Selecionado.especialidade.name) == -1)"
                                            v-if="index_Selecionado.modalidade !== 'Retorno'"
                                    >Retorno
                                        <v-icon>refresh</v-icon>
                                    </v-btn>
                                    <v-spacer/>
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
                                                        class="mb-0">
                                                </v-progress-linear>
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
        <v-snackbar
                v-model="snackbar"
                :bottom="y === 'bottom'"
                :left="x === 'left'"
                color="success"
                :multi-line="mode === 'multi-line'"
                :right="x === 'right'"
                :top="y === 'top'"
                :timeout="timeout"
                :vertical="mode === 'vertical'"
        >
            {{this.mensagem}}
            <v-icon dark>done_outline</v-icon>
        </v-snackbar>
        <v-dialog v-model="documentDialog">
            <consultation-document @close="documentDialog = false" :openDocument="documentDialog"
                                   :consultation="index_Selecionado .consultation"/>
        </v-dialog>
        <v-dialog v-model="verifierCard" v-if="index_Selecionado.consultation">
            <consultation-verifier @close="verifierCard = false"
                                   :consultation="index_Selecionado.consultation"/>
        </v-dialog>
    </v-container>
</template>

<script>
    import moment from 'moment/moment'
    import Patient from '../../../components/Patient/SelectPatientCard'
    import ConsultationDocument from "../../../components/doctorsAgenda/ConsultationDocument";
    import ConsultationVerifier from "../../../components/doctorsAgenda/ConsultationVerifier";
    
    export default {
        components: {Patient, ConsultationDocument, ConsultationVerifier},
        data: () => ({
            verifierCard: false,
            today: moment().locale('pt-BR').format('YYYY-MM-DD'),
            dialog: false,
            exames: ['ULTRASSONOGRAFIA', 'ELETROCARDIOGRAMA', 'ELETROENCEFALOGRAMA', 'ECOCARDIOGRAMA', 'VIDEOLARIGONSCOPIA'],
            documentDialog: false,
            y: 'top',
            x: null,
            mode: '',
            attendance: 'Aguardando Atendimento',
            attendanceOptions:
                [
                    {text: 'Aguardando Atendimento'},
                    {text: 'Atendimento Realizado'},
                ],
            statusOptions:
                [
                    {text: 'Cancelado'},
                    {text: 'Aguardando pagamento'},
                ],
            search: '',
            qtdConsultas: '', qtdRetornos: '',
            parametro: 'nome',
            index_Selecionado: {},
            status_Selecionado: null,
            color: 'blue',
            messages: [],
            mensage_progress: '',
            items: [],
            patientChoose: null,
            timeout: 4000,
            key: null,
            patientData: Patient.data
        }),
        computed: {
            panel() {

                return [true]
            },
            computedDateFormatted() {
                return this.formatDate(this.date)
            },
            computedDateFormattedSelecionado() {
                return this.formatDate(this.index_Selecionado.data)
            },
            computedDateFormattedDependent() {
                return this.formatDate(this.index_Selecionado.consultation.dependent.birthDate)
            },
            visualizarConsulta: {
                get: function () {
                    return this.index_Selecionado;
                },
                set: function (index) {
                    this.status_Selecionado = index.status
                    this.index_Selecionado = {...index}
                    this.statusOptions.splice(1, 1)
                    this.statusOptions.push({text: index.status})
                    this.dialog = true
                }
            },

            loader() {
                return this.$store.getters.statusLoaderGCP
            },
            snackbar() {

                var snack = this.$store.getters.onSnackbarGCP
                if (snack) {
                    this.dialog = false
                }
                return snack;
            },
            mensagem() {
                return this.$store.getters.onMensagem
            },
            patient() {
                var val = this.$store.getters.selectedPatient
                if (val != null) {
                    var consultas = []
                    this.qtdConsultas = 0
                    this.qtdRetornos = 0
                    for (const key in val.consultations) {

                        if (val.consultations[key].type === 'Consulta') {
                            this.qtdConsultas += 1
                        } else {
                            this.qtdRetornos += 1
                        }
                        consultas.push(val.consultations[key])

                    }
                    val.consultations = consultas
                     val.consultations.sort(function(a, b) {
                           
                            if (a.date < b.date) {
                                return 1;
                            }
                            if (a.date > b.date) {
                                return -1;
                            }
                            return 0;
                        });
                }

                return val
            },
        },
        mounted() {
            this.date = moment().format('YYYY-MM-DD')
        },
        methods: {
            returnOutRule(){
                let dateConsultation = moment(this.index_Selecionado.consultation.date);
                let today = moment();
                let diff = today.diff(dateConsultation,'days');
                return diff > 21
            },
            formatDate(date) {
                if (!date) return null;
                let patt = new RegExp(/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/);

                if (!patt.test(date)) {
                    const [year, month, day] = date.split('-');
                    return `${day}/${month}/${year}`
                }
                return date

            },

            clearRecibo() {
                this.index_Selecionado.num_recibo = ''
            },
            clear() {
                this.num_recibo = '';
                this.status = 'Aguardando pagamento'
            },

            apagar() {
                this.$store.dispatch('eraseAppointment', {
                    id:this.index_Selecionado.idConsultation,
                    idPatient:this.index_Selecionado.cpf,
                    type:this.index_Selecionado.modalidade,
                    status:this.index_Selecionado.status,
                    payment_number:this.index_Selecionado.num_recibo,
                    specialty:this.index_Selecionado.especialidade,
                    regress:this.index_Selecionado.consultation.regress,
                    previousConsultation:this.index_Selecionado.consultation.previousConsultation,
                    exam:this.index_Selecionado.consultation.exam
                })
                this.clear()
                this.dialog = false

            },
            showVerifierCard() {
                this.index_Selecionado.consultation.user = {}
                this.index_Selecionado.consultation.user.name = this.index_Selecionado.paciente
                this.index_Selecionado.consultation.user.cpf = this.index_Selecionado.cpf
                this.verifierCard = true
            },
        }
    }
</script>

