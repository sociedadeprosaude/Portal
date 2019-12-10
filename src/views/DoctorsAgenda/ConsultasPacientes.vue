<template>
    <v-container class="pt-0">
            
            <patient maxWidth="100%"></patient>
            <template>
                <v-container class="my-0 py-0">
                        <v-flex xs12 >
                                <v-btn text>
                                    <v-icon color="blue">event</v-icon>:
                                    <v-chip small text-color="white" color="blue">Consulta</v-chip>
                                </v-btn>
                                <v-btn text>
                                    <v-icon color="warning">event_busy</v-icon>:
                                    <v-chip small text-color="white" color="warning">Consulta Cancelada</v-chip>
                                </v-btn>
                                <v-btn text>
                                    <v-icon color="blue">restore</v-icon>:
                                    <v-chip small text-color="white" color="blue">Retorno</v-chip>
                                </v-btn>
                                <v-btn text>  
                                    <v-icon color="warning">alarm_off</v-icon>:
                                    <v-chip small text-color="white" color="warning">Retorno Cancelado</v-chip>
                                </v-btn>
                                <v-btn text>
                                    <v-icon color="success">attach_money</v-icon>:
                                    <v-chip small text-color="white" color="success">Pago</v-chip>
                                </v-btn>
                                <v-btn text>
                                    <v-icon color="error">money_off</v-icon>:
                                    <v-chip small text-color="white" color="error">Aguardando Pagamento</v-chip>
                                </v-btn>
                        </v-flex>
                        <v-layout column align-center justify-center wrap >
                        <v-subheader>Histórico de Consultas e Retornos:</v-subheader>
                        <v-expansion-panels v-if="patient">
                        <v-expansion-panel >
                            <v-expansion-panel-header>
                                <v-layout align-center row spacer>

                                        <v-flex sm6 md3 hidden-xs-only :class="`${color}--text`">
                                            <strong>Paciente:</strong>
                                            <v-chip small :color="color" text-color="white">
                                                <v-avatar>
                                                    <v-icon>account_circle</v-icon>
                                                </v-avatar>
                                                {{patient.name}}
                                            </v-chip>
                                        </v-flex>

                                        <v-flex sm6 md3 hidden-xs-only :class="`${color}--text`">
                                            <strong>Nº do Associado:</strong>
                                            <v-chip small :color="color" text-color="white">
                                                <v-avatar>
                                                    <v-icon>payment</v-icon>
                                                </v-avatar>
                                                {{patient.association_number}}
                                            </v-chip>
                                        </v-flex>

                                        <v-flex row wrap xs5 sm3 :class="`${color}--text`">
                                            <strong>Consultas: </strong>
                                            <v-chip small :color="color" text-color="white">
                                                <v-avatar>
                                                    <v-icon>event</v-icon>
                                                </v-avatar>
                                            {{qtdConsultas}}
                                            </v-chip>
                                        </v-flex>

                                        <v-flex row wrap xs5 sm3 :class="`${color}--text`">
                                            <strong>Retornos: </strong>
                                            <v-chip small :color="color" text-color="white">
                                                <v-avatar>
                                                    <v-icon>restore</v-icon>
                                                </v-avatar>
                                                {{qtdRetornos}}
                                            </v-chip>
                                        </v-flex>
                                    </v-layout>
                            </v-expansion-panel-header>

                            <v-expansion-panel-content>
                                <v-divider></v-divider>
                                <v-card class="elevation-3">
                                    <v-list three-line subheader>
                                        <v-layout row wrap>
                                            <v-flex sm3
                                                    xs12
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
                                                            especialidade: item.specialty.name,
                                                            status: item.status,
                                                            modalidade: item.type,
                                                            medico:item.doctor.name,
                                                            doctor:item.doctor,
                                                            num_recibo:item.payment_number,
                                                            pacienteObj:patient,
                                                            consultation:item
                                                        }"    
                                                >
                                                    <v-list-tile-content >
                                                        <v-list-tile-title>
                                                            <span :class="`${color}--text`" style="font-weight: bolder">
                                                                Dr(a). {{item.doctor.name}}
                                                            </span>
                                                        </v-list-tile-title>

                                                        <br>
                                                        <v-list-tile-sub-title class="text-left">
                                                            {{item.specialty.name}}
                                                        </v-list-tile-sub-title>
                                                        <br>
                                                        <v-list-tile-sub-title>
                                                            CRM: {{item.doctor.crm}}
                                                        </v-list-tile-sub-title>
                                                        <br>
                                                        <v-list-tile-action-text>
                                                            {{item.date.split(' ')[0] | dateFilter}} -
                                                            {{item.date.split(' ')[1]}}
                                                        </v-list-tile-action-text>
                                                    </v-list-tile-content>
                                                    <br>
                                                    <v-list-tile-action class="ml-1">
                                                        <v-btn icon ripple text>
                                                            <v-icon v-if="item.type === 'Retorno'" :color="color">restore</v-icon>
                                                            <v-icon v-if="item.type === 'Retorno' && item.status === 'Cancelado'" color="warning">alarm_off</v-icon>
                                                            <v-icon v-if="item.type === 'Consulta'" :color="color">event</v-icon>
                                                            <v-icon v-if="item.type === 'Consulta' && item.status === 'Cancelado'" color="warning">event_busy</v-icon>
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
                                                    <v-text-field readonly hide-details outlined prepend-icon="school" label="Especialidade" v-model="index_Selecionado.especialidade">
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
                                                            hide-details
                                                            outlined
                                                    ></v-select>
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
                                                    ></v-text-field>
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
                                                :to="{ name: 'AgendarRetorno', params: { q: {...this.index_Selecionado,consultaPaciente:true}}}"
                                                :disabled="status_Selecionado === 'Pago' && !index_Selecionado.consultation.regress ? false : true"
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
                {{this.mensagem}}<!--
                <v-icon dark>done_all</v-icon> -->
                <v-icon dark>done_outline</v-icon>
                <!-- <v-icon dark>done</v-icon> -->
            </v-snackbar>
    </v-container>
</template>

<script>
    import moment from 'moment/moment'
    import Patient from '../../components/SelectPatientCard'
    export default {
        components: {Patient},
        data: () => ({
            dialog: false,
            y: 'top',
            x: null,
            mode: '',
            /* panel:[true], */
            statusOptions:
                [
                    {text: 'Aguardando pagamento'},
                    {text: 'Pago'},
                    {text: 'Cancelado'},
                ],
            search: '',
            qtdConsultas: '', qtdRetornos: '',
            parametro: 'nome',
            index_Selecionado: {},
            status_Selecionado:null,
            color: 'blue',
            messages: [],
            mensage_progress:'',
            items: [],
            patientChoose:null,
            timeout:4000,
            key:null,
            patientData: Patient.data
        }),
        computed: {
            panel(){
                
                return [true]
            },
            computedDateFormatted() {
                return this.formatDate(this.date)
            },
            computedDateFormattedSelecionado() {
                return this.formatDate(this.index_Selecionado.data)
            },
            visualizarConsulta: {
                get: function () {
                    return this.index_Selecionado;
                },
                set: function (index) {
                        this.status_Selecionado = index.status
                        this.index_Selecionado = {...index}
                        this.dialog = true
                        //this.$store.dispatch('agendarConsulta',{pacienteSelecionado: this.pacienteSelecionado, idConsulta: idConsulta, especialidade:this.especialidade})      
                }
            },

            loader() {
                return this.$store.getters.statusLoaderGCP
            },
            snackbar() {

                var snack = this.$store.getters.onSnackbarGCP
                console.log(snack)
                if (snack) {
                    this.dialog = false
                }
                return snack;
            },
            mensagem() {
                return this.$store.getters.onMensagem
            },
            patient(){
                    var val = this.$store.getters.selectedPatient
                    if(val != null){
                        var consultas = []
                        this.qtdConsultas = 0
                        this.qtdRetornos = 0    
                        console.log({...val})
                        for (const key in val.consultations) {
                                
                                if(val.consultations[key].type === 'Consulta' ){
                                this.qtdConsultas += 1
                                }else{
                                    this.qtdRetornos += 1
                                }
                                consultas.push(val.consultations[key])
                            
                        }
                        val.consultations = consultas
                    }
                    
                    return val
                },/* ,
                set(val){
                    var consultas = []
                    this.qtdConsultas = 0
                    this.qtdRetornos = 0    
                    for (const key in val.consultas) {
                        
                        if(val.consultas[key].status !== 'Cancelado'){
                            if(val.consultas[key].modalidade === 'Consulta' ){
                            this.qtdConsultas += 1
                            }else{
                                this.qtdRetornos += 1
                            }
                            consultas.push(val.consultas[key])
                        }
                    }
                    val.consultas = consultas
                    this.patientChoose = val
                    
                } */
            
        },
        mounted() {
            this.date = moment().format('YYYY-MM-DD')
            this.dateFormatted = moment().format('YYYY-MM-DD')
            //this.$store.dispatch('stopSnack', false)
            //this.$store.dispatch('setLoader',{loader:false,view:"RetornoConsulta"})
        },
        methods: {
            formatDate(date) {
                if (!date) return null
                const [year, month, day] = date.split('-')
                return `${day}/${month}/${year}`
            },
            clearRecibo() {
                this.index_Selecionado.num_recibo = ''
            },
            clear() {
                this.num_recibo = ''
                this.status = 'Aguardando pagamento'
            },
            atualizar() {
    
                this.index_Selecionado.pacienteObj.status = this.index_Selecionado.status
                this.index_Selecionado.pacienteObj.payment_number = this.index_Selecionado.payment_number
                this.$store.dispatch('updateAppointment', {
                    status: this.index_Selecionado.status,
                    payment_number: this.index_Selecionado.num_recibo,
                    idConsultation: this.index_Selecionado.idConsultation,
                    idPatient: this.index_Selecionado.cpf
                })
                this.clear()

            },
            apagar() {
                this.$store.dispatch('eraseAppointment', {
                    idConsultation:this.index_Selecionado.idConsultation,
                    idPatient:this.index_Selecionado.cpf,
                    type:this.index_Selecionado.modalidade,
                    regress:this.index_Selecionado.consultation.regress,
                    previousConsultation:this.index_Selecionado.consultation.previousConsultation
                })
                this.clear()

            },
            modalidades(item) {

                if (this.search === null || this.search === '' || this.search === undefined) {

                    console.log('campo de pesquisa vazio')

                } else {

                    let qtdConsultas = 0;
                    let qtdRetornos = 0;

                    for (let key in item.consultas) {

                        if (item.consultas[key].modalidade === 'Consulta') {
                            qtdConsultas += 1
                        }
                        if (item.consultas[key].modalidade === 'Retorno') {
                            qtdRetornos += 1
                        }
                    }

                    this.qtdConsultas = qtdConsultas
                    this.qtdRetornos = qtdRetornos
                }
            },
            
        }
    }
</script>

<style scoped>
</style>