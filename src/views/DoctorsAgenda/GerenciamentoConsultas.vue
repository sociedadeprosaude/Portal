<template>
    <v-container>
        <v-layout align-center row wrap>
            <v-flex xs12>
            <v-card>
            <template>
                <v-container fluid grid-list-xl>
                    <v-layout align-center wrap>
                        <v-flex xs12 sm4>
                            <v-select
                                    prepend-icon="school"
                                    v-model="especialidade"
                                    :items="especialidadeOptions"
                                    label="Especialidade"
                                    outline
                                    chips
                                    color="pink"
                            ></v-select>
                        </v-flex>
                        <v-flex xs12 sm4>
                            <v-menu
                                    ref="menu"
                                    v-model="menu"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    lazy
                                    transition="scale-transition"
                                    offset-y
                                    full-width
                                    min-width="290px"
                            >
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                            v-model="computedDateFormatted"
                                            label="Data"
                                            prepend-icon="event"
                                            readonly
                                            outline
                                            clearable
                                            hint="Selecione uma data para pesquisar"
                                            persistent-hint
                                            v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                        ref="picker"
                                        v-model="date"
                                        locale="pt-br"
                                        @change="save"
                                ></v-date-picker>
                            </v-menu>
                        </v-flex>
                        <v-flex sm4>
                            <v-list-tile-action>
                                <v-btn flat>
                                    <v-icon color="blue">event</v-icon>:
                                    <v-chip small text-color="white" color="blue">Consulta</v-chip>
                                </v-btn>
                                <v-btn flat>
                                    <v-icon color="blue">restore</v-icon>:
                                    <v-chip small text-color="white" color="blue">Retorno</v-chip>
                                </v-btn>
                                <v-btn flat>
                                    <v-icon color="success">attach_money</v-icon>:
                                    <v-chip small text-color="white" color="success">Pago</v-chip>
                                </v-btn>
                                <v-btn flat>
                                    <v-icon color="error">money_off</v-icon>:
                                    <v-chip small text-color="white" color="error">Aguardando Pagamento</v-chip>
                                </v-btn>
                            </v-list-tile-action>
                        </v-flex>
                    </v-layout>
                </v-container>
            </template>

            <template>
                <v-container class="align-center justify-center py-0">
                    <v-alert type="warning" :value="menssagens.length == 0">
                            Não há consultas marcadas
                    </v-alert>
                    <v-layout column align-center justify-center wrap>
                        <v-subheader v-if="menssagens.length != 0"><b>Data: {{date | dateFilter}} - {{daydate(date)}}</b></v-subheader>
                        
                        <v-expansion-panel popout>
                            <v-expansion-panel-content
                                    v-for="(message, i) in menssagens"
                                    :key="i"
                                    class="elevation-6"
                                    hide-actions
                                    v-model="panel"
                            >
                                <template v-slot:header>
                                    <v-layout align-center row spacer>

                                        <v-flex xs6 hidden-xs-only :class="`${message.color}--text`">
                                            <strong>Médico:</strong>
                                            <v-chip small :color="message.color" text-color="white">
                                                <v-avatar>
                                                    <v-icon>account_circle</v-icon>
                                                </v-avatar>
                                                {{message.medico}}
                                            </v-chip>
                                        </v-flex>

                                        <v-flex xs2 hidden-xs-only :class="`${message.color}--text`">
                                            <strong>CRM-AM:</strong>
                                            <v-chip small :color="message.color" text-color="white">
                                                <v-avatar>
                                                    <v-icon>payment</v-icon>
                                                </v-avatar>
                                                {{message.crm}}
                                            </v-chip>
                                        </v-flex>

                                        <v-flex row wrap xs2 class="text-xs-right blue--text">
                                            <strong>Consultas: </strong>
                                            <v-chip small :color="message.color" text-color="white">
                                                <v-avatar>
                                                    <v-icon>event</v-icon>
                                                </v-avatar>
                                                {{message.consultas}}
                                            </v-chip>
                                        </v-flex>

                                        <v-flex row wrap xs2  class="text-xs-right blue--text" >
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
                                            <v-card class="mt-2 ml-2 elevation-5 py-2 px-1" style="border-radius:15px" >
                                                <v-list-tile
                                                        @click="visualizarConsulta = {
                                                            idConsultation:item.idConsultation,
                                                            idPaciente: item.idPaciente,
                                                            paciente: item.paciente,
                                                            id: item.id,
                                                            cpf:item.cpf,
                                                            telefone: item.telefone,
                                                            data: item.data,
                                                            hora: item.hora,
                                                            crm: message.crm,
                                                            status: item.status,
                                                            modalidade: item.modalidade,
                                                            medico:message.medico,
                                                            num_recibo:item.num_recibo,
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
                                            </v-card>
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
                                        Atualizar Informações
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
                                                    <v-text-field readonly prepend-icon="school" label="Especialidade" v-model="especialidade">
                                                    </v-text-field>
                                                </v-flex>
                                                <v-flex xs12 sm6>
                                                    <v-text-field readonly prepend-icon="event" label="Dia da Consulta" v-model="computedDateFormattedSelecionado">
                                                    </v-text-field>
                                                </v-flex>
                                                <v-flex xs12 sm6>
                                                    <v-text-field readonly prepend-icon="access_alarm" label="Hora da Consulta" v-model="index_Selecionado.hora">
                                                    </v-text-field>
                                                </v-flex>
                                                <v-flex xs12 sm6>
                                                    <v-select
                                                            prepend-icon="assignment_turned_in"
                                                            v-model="index_Selecionado.status"
                                                            :items="statusOptions"
                                                            label="Status"
                                                            chips
                                                    ></v-select>
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
                                                            @click:clear="clearRecibo"
                                                            prepend-icon="receipt"
                                                            label="Nº do Recibo"
                                                            v-model="index_Selecionado.num_recibo"
                                                            type="number"
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
                                                            :disabled="status_Selecionado.status === 'Pago' && index_Selecionado.num_recibo !== ''"
                                                    ></v-select>
                                                </v-flex>
                                            </v-layout>
                                        </v-container>
                                    </v-card-text>
                                    <v-divider></v-divider>
                                    <v-card-actions>
                                        <v-btn color="warning" round @click="dialog = false">
                                            Voltar
                                            <v-icon>clear</v-icon>
                                        </v-btn>
                                        <v-spacer></v-spacer>
                                        <v-btn
                                                color="error"
                                                round
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
                                                round
                                                dark
                                                :to="{ name: 'AgendarRetorno', params: { q: {...this.index_Selecionado,especialidade:this.especialidade}}}"
                                                :disabled="status_Selecionado === 'Pago' && !index_Selecionado.pacienteObj.retorno ? false : true"
                                                v-if="index_Selecionado.modalidade !== 'Retorno'"
                                        >Retorno
                                            <v-icon>refresh</v-icon>
                                        </v-btn>
                                        <v-spacer></v-spacer>
                                        <v-btn
                                                color="success"
                                                round
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
            </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import moment from 'moment/moment'
    export default {
        data: () => ({
            y: 'top',
            x: null,
            mode: '',
            panel:[true],
            date_choose: '',
            dateFormatted: '',
            menu: false,
            dialog: false,
            alert: false,
            especialidade_choose:'',
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
            mensage_progress:''
        }),
        computed: {
            especialidadeOptions() {
                return this.$store.getters.especialidades;
            },
            computedDateFormatted () {
                return this.formatDate(this.date)
            },
            computedDateFormattedSelecionado () {
                return this.formatDate(this.index_Selecionado.data)
            },
            menssagens:{
                set(val){
                    this.messages = val
                    
                },
                get(){

                    return this.$store.getters.consultationsBySpecialties({data:this.date,especialidade:this.especialidade})

                }
                 
            },
            especialidade:{
                get(){
                    return this.especialidade_choose
                },
                 set(val){
                    this.especialidade_choose = val

                    this.$store.dispatch('loadScheduledAppointment', {especialidade: val})

                }
            },
            date:{
                get(){
                    return this.date_choose;
                },
                 set(val){
                    this.date_choose = val
                    this.$store.dispatch('loadScheduledAppointment', {especialidade: this.especialidade})

                }
            },
            visualizarConsulta:{
                get: function(){
                    return this.index_Selecionado;
                },
                set: function (index) {

                    if(this.especialidade != ''){
                        this.status_Selecionado = index.status
                        this.index_Selecionado = {...index}
                        console.log(this.index_Selecionado)
                        this.dialog = true

                        //this.$store.dispatch('agendarConsulta',{pacienteSelecionado: this.pacienteSelecionado, idConsulta: idConsulta, especialidade:this.especialidade})
                    }
                    else{
                        alert('Escolha uma especialidade!')
                    }
                }
            },

            loader(){
                return this.$store.getters.statusLoaderGC
            },
            snackbar(){
                
                var snack = this.$store.getters.onSnackbarGC
               
                if(snack){
                    this.dialog = false
                }
                return snack;
            },
            mensagem(){
                return this.$store.getters.onMensagem
            }
        },
        mounted() {
            this.$store.dispatch('loadEspecialidades')
            this.especialidade = 'Clinico Geral'
            this.date = moment().format('YYYY-MM-DD')
            //this.$store.dispatch('stopSnack',false)
            this.dateFormatted = moment().format('YYYY-MM-DD')
            //this.$store.dispatch('setLoader',{loader:false,view:"RetornoConsulta"})
        },
        watch: {
            menu(val) {
                val && setTimeout(() => (this.$refs.picker.activePicker = 'MONTH'))
            }
        },
        methods: {
            daydate(date) {
                var dateMoment = moment(date);
                return this.semanaOptions[dateMoment.day()];
            },
            save(date) {
                this.$refs.menu.save(date)
            },
            formatDate (date) {
                if (!date) return null
                const [year, month, day] = date.split('-')
                return `${day}/${month}/${year}`
            },
            clearRecibo(){
                this.index_Selecionado.num_recibo = ''
            },
            call(){

                this.$store.dispatch('eraseAppointment',{... this.index_Selecionado,especialidade:this.especialidade})
                this.clear() 
            },
            call_atualizar(){
                this.index_Selecionado.pacienteObj.status = this.index_Selecionado.status
                this.index_Selecionado.pacienteObj.num_recibo = this.index_Selecionado.num_recibo
                this.$store.dispatch('updateAppointment',{... this.index_Selecionado,especialidade:this.especialidade})
                this.clear()
            },
            clear () {
                this.num_recibo = ''
                this.status = 'Aguardando pagamento'
            },
            atualizar(){
                this.mensage_progress = 'Atualizando...'
                this.$store.dispatch('setLoader',{loader:true,view:"GerenciamentoConsulta"})
                setTimeout(() => (this.call_atualizar()), 1000)
                
            },
            apagar () {
                this.mensage_progress = 'Apagando...'
                this.$store.dispatch('setLoader',{loader:true,view:"GerenciamentoConsulta"})
                setTimeout(() => (this.call()), 1000)
                
            }
        },
    }
</script>
<style scoped>
</style>