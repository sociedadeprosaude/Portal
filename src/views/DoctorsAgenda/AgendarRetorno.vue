<template>
    <v-container>
        <v-layout row wrap>

            <template>
                <v-container>
                    <v-layout align-center row wrap>
                        <v-flex>
                            <v-select
                                    prepend-icon="school"
                                    v-model="especialidade"
                                    :items="especialidade"
                                    label="Especialidade"
                                    outline
                                    chips
                                    color="blue"
                            ></v-select>
                        </v-flex>
                    </v-layout>
                </v-container>
            </template>

            <v-flex>
                <v-card class="mx-auto transparent hidden-sm-and-up" flat max-width="450">
                    <v-card-text class="py-0">
                        <v-timeline align-top>
                            <v-timeline-item
                                    small
                                    v-for="(consulta, i) in consultas"
                                    :key="i"
                                    :color="consulta.color"
                            >
                                <template v-slot:icon>
                                    <v-btn icon small dark round :color="consulta.color" class="mx-0" @click="scheduleAppointment = {crm:consulta.crm,medico:consulta.nome, data:consulta.data,hora:consulta.hora}">
                                        <v-icon>touch_app</v-icon>
                                    </v-btn>
                                </template>

                                <template v-slot:opposite>
                                    <v-flex>
                                        <v-chip small :color="consulta.color" text-color="white"><v-icon>person</v-icon>: {{consulta.nome}}</v-chip>
                                        <v-chip small :color="consulta.color" text-color="white"><v-icon>credit_card</v-icon>: {{consulta.crm}}</v-chip>
                                    </v-flex>
                                </template>
                                <v-layout>
                                    <v-flex xs12>
                                        <v-chip :color="consulta.color" text-color="white"><v-icon>event</v-icon>: {{consulta.data | dateFilter}}</v-chip>
                                        <v-chip :color="consulta.color" text-color="white"><v-icon>alarm</v-icon>: {{consulta.hora}}</v-chip>
                                        <v-chip :color="consulta.color" text-color="white"><v-icon>assignment</v-icon>: {{consulta.vaga}}</v-chip>
                                    </v-flex>
                                </v-layout>
                            </v-timeline-item>
                        </v-timeline>
                    </v-card-text>
                </v-card>
            </v-flex>

            <v-container style="width:100%" class="align-center justify-center hidden-xs-only">
                <v-timeline>
                    <v-timeline-item
                            v-for="(consulta, i) in consultas"
                            :key="i"
                            :color="consulta.color"
                    >
                        <template v-slot:opposite>
                            <span :class="`headline font-weight-bold ${consulta.color}--text`">
                                <v-icon :color="consulta.color">assignment</v-icon>
                                Vagas: <v-chip :color="consulta.color" text-color="white">{{consulta.vaga}}</v-chip>
                            </span>
                        </template>
                        <v-card class="mx-3" :color="consulta.color" dark>
                            <v-card-title class="title">
                                <v-icon>event</v-icon>
                                : {{consulta.data | dateFilter}}
                                <v-spacer></v-spacer>
                                <v-icon>alarm</v-icon>
                                : {{consulta.hora}}
                            </v-card-title>
                            <v-card-text class="white text--primary">
                                <v-container>
                                    <v-layout>
                                        <v-flex x2 sm2 dm2 lg2>
                                            <v-avatar>
                                                <v-img :src="consulta.foto"></v-img>
                                            </v-avatar>
                                        </v-flex>
                                        <v-spacer></v-spacer>
                                        <v-flex xs9 sm9 md9 lg9>
                                            <h4>
                                                <p :class="`${consulta.color}--text`">
                                                    Médico: {{consulta.nome}}
                                                    <br>
                                                    CRM-AM: {{consulta.crm}}
                                                </p>
                                            </h4>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <v-btn dark round :color="consulta.color" class="mx-0" @click="agendarConsulta = {crm:consulta.crm,medico:consulta.nome, data:consulta.data,hora:consulta.hora}">
                                    Agendar Consulta
                                </v-btn>
                            </v-card-text>
                        </v-card>
                    </v-timeline-item>
                </v-timeline>
            </v-container>

            <template>
                <v-container>
                    <v-layout>
                        <div class="text-xs-center">
                            <v-dialog v-model="dialog" width="500">
                                <v-card>
                                    <v-card-title class="headline grey lighten-2" primary-title>
                                        Confirmar Agendamento do Retorno
                                    </v-card-title>
                                    <v-card-text>
                                        <v-container grid-list-md>
                                            <v-layout wrap>
                                                <v-flex xs12 sm6>
                                                    <v-text-field readonly prepend-icon="person" v-model="query.paciente" label="Nome do Paciente">
                                                    </v-text-field>
                                                </v-flex>
                                                <v-flex xs12 sm6>
                                                    <v-text-field readonly prepend-icon="credit_card" v-model="query.cartaoId" label="Nº do associado">
                                                    </v-text-field>
                                                </v-flex>
                                                <v-flex xs12 sm12 md12 lg12><v-divider ></v-divider></v-flex>
                                                <v-flex xs12 sm6>
                                                    <v-text-field readonly prepend-icon="person" v-model="query.medico" label="Nome do Médico">
                                                    </v-text-field>
                                                </v-flex>
                                                <v-flex xs12 sm6>
                                                    <v-text-field readonly prepend-icon="credit_card" v-model="query.crm" label="CRM">
                                                    </v-text-field>
                                                </v-flex>
                                                <v-flex xs12 sm6>
                                                    <v-text-field readonly prepend-icon="school" v-model="this.especialidade" label="Especialidade" ></v-text-field>
                                                </v-flex>
                                                <v-flex xs12 sm6>
                                                    <v-text-field readonly prepend-icon="event" v-model="computedDateFormatted" label="Dia da Consulta">
                                                    </v-text-field>
                                                </v-flex>
                                                <v-flex xs12 sm6>
                                                    <v-text-field readonly prepend-icon="access_alarm" v-model="index_Selecionado.hora" label="Hora da Consulta">
                                                    </v-text-field>
                                                </v-flex>
                                                <v-flex xs12 sm6>
                                                    <v-text-field
                                                            prepend-icon="assignment_turned_in"
                                                            v-model="query.status"
                                                            label="Status"
                                                            readonly
                                                    ></v-text-field>
                                                </v-flex>
                                                <v-flex  xs12 sm6>
                                                    <v-text-field
                                                            prepend-icon="assignment"
                                                            readonly
                                                            v-model="modalidade"
                                                            label="Modalidade"
                                                    ></v-text-field>
                                                </v-flex>
                                                <v-flex xs12 sm6>
                                                    <v-text-field
                                                            prepend-icon="receipt"
                                                            label="Nº do Recibo"
                                                            v-model="query.num_recibo"
                                                            readonly
                                                    ></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                        </v-container>
                                    </v-card-text>
                                    <v-divider></v-divider>
                                    <v-card-actions>
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
                                                    Salvando...
                                                    <v-progress-linear
                                                            indeterminate
                                                            color="white"
                                                            class="mb-0"
                                                    ></v-progress-linear>
                                                </v-card-text>
                                            </v-card>
                                        </v-dialog>
                                        <v-btn round color="error" @click="dialog = false">
                                            Cancelar
                                            <v-icon right>clear</v-icon>
                                        </v-btn>
                                        <v-spacer></v-spacer>
                                        <v-btn color="success"
                                               round
                                               :disabled="loader"
                                               :loading="loader"
                                               @click="confirmar()"
                                        >
                                            Confirmar
                                            <v-icon right>done</v-icon>
                                            <template v-slot:loader>
                                                <span>Aguarde...</span>
                                            </template>
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </div>
                    </v-layout>
                </v-container>
            </template>
            
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        data: () => ({
            y: 'top',
            x: null,
            mode: '',
            alert: false,
            menu: false,
            dialog: false,
            dialog2: false,
            num_recibo: '',
            type: '',
            index_Selecionado: {},
            modalidade: 'Retorno',
            date: '',
            datas: [],
            times: '',
            timesOptions: [],
            medicos: '',
            medicosOptions: [],
            especialidade: '',
            pacientes: '',
            query:'',
            pacienteSelecionado: '',
            timeout:4000,
        }),
        computed: {
            consultas() {
                if(this.especialidade != ''){
                    this.alert = false
                    return this.$store.getters.consultas
                }
            },
            computedDateFormatted () {
                return this.formatDate(this.index_Selecionado.data)
            },
            agendarConsulta:{
                get: function(){
                    return this.index_Selecionado;
                },
                set: function (index) {
                    
                    if(this.pacienteSelecionado != null){
                        if(this.especialidade != ''){
                            this.index_Selecionado = {paciente: this.pacienteSelecionado.nome, ...index}
                            this.dialog = true
                            //this.mensagem = 'Você deseja confirmar o agendamento para o dia '+ index.data + '?'
                            //this.$store.dispatch('agendarConsulta',{pacienteSelecionado: this.pacienteSelecionado, idConsulta: idConsulta, especialidade:this.especialidade})
                        }
                        else{
                            alert('Escolha uma especialidade!')
                        }
                    }else{
                        alert('Não Salvar!')
                    }
                }
            },
            loader(){
                return this.$store.getters.statusLoaderRC
            },
            mensagem(){
                return this.$store.getters.onMensagem
            }
        },
        watch: {
            especialidade: async function (value) {
                await this.$store.dispatch('loadReturnAppointment', {especialidade: value,data_inicial: this.query.data,medico:this.query.medico})
                //this.consultas = this.$store.getters.get_consultas
            },
            medicos: function (value) {
                var crm = this.$store.getters.getCRM({especialidade: this.especialidade, medico: value})
                console.log(crm)
                this.$store.dispatch('load_datas', {especialidade: this.especialidade, crm: crm})
                this.datas = this.$store.getters.get_Datas({especialidade: this.especialidade, medico: value, crm: crm})
                console.log(this.datas)
            },
            date: function (value) {
                this.timesOptions = this.$store.getters.get_Horas({data: value})
            }
        },
        mounted() {
            //this.$store.dispatch('load_especialidades')
            //this.$store.dispatch('load_medicos')
            //this.$store.dispatch('setLoader',{loader:false,view:"RetornoConsulta"})
            this.query = this.$route.params.q
            console.log( {...this.query})
            if(!this.query){
               this.$router.push('/GerenciamentoConsultas')
            }
            this.especialidade = this.query.especialidade
            this.pacienteSelecionado = this.query.pacienteObj
            this.$store.dispatch('stopSnack',false)
        },
        methods: {
            call(){
                var consulta = this.$store.getters.idConsultation({data: this.index_Selecionado.data,hora: this.index_Selecionado.hora,crm: this.index_Selecionado.crm})
                this.$store.dispatch('scheduleAppointment',{pacienteSelecionado: {...this.pacienteSelecionado,modalidade:this.query.modalidade,status:this.query.status,num_recibo:this.query.num_recibo},status:this.query.status,modalidade:'Retorno', consulta: consulta, especialidade:this.especialidade,num_recibo: this.query.num_recibo,consulta_anterior:this.query.idConsultation,crm:this.query.crm,data_inicial:this.query.data+'T'+this.query.hora,medico:this.query.medico})          
                if(!this.query.consultaPaciente ){
                    this.$router.push('/GerenciamentoConsultas')
                }else{
                   this.$router.push('/ConsultasPacientes')
                }
                
            },
            formatDate (date) {
                if (!date) return null
                const [year, month, day] = date.split('-')
                return `${day}/${month}/${year}`
            },
            clear () {
                this.num_recibo = ''
                this.status = 'Aguardando pagamento'
            },
            confirmar() {
                this.$store.dispatch('setLoader',{loader:true,view:"RetornoConsulta"})
                setTimeout(() => (this.call()), 1000)
                this.clear()
            }
        }
    }
</script>