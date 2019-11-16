<template>
    <v-container>
        <v-layout row wrap>

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
                                    clearable
                            ></v-select>
                        </v-flex>
                        <v-flex xs12 sm4>
                            <v-select
                                    prepend-icon="account_circle"
                                    v-model="medico"
                                    :items="medicosOptions"
                                    label="Médico"
                                    outline
                                    chips
                                    color="purple"
                                    clearable
                            ></v-select>
                        </v-flex>
                        <v-flex sm4>
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
                                            label="Dia para Deletar"
                                            prepend-icon="event_busy"
                                            outline
                                            hint="Selecione o dia para deletar as consultas do mesmo."
                                            persistent-hint
                                            color="red"
                                            clearable
                                            readonly
                                            v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                        ref="picker"
                                        v-model="date"
                                        min="2019-01-01"
                                        locale="pt-br"
                                        color="red"
                                        @change="save"
                                ></v-date-picker>
                            </v-menu>
                        </v-flex>
                    </v-layout>
                </v-container>
            </template>

                <v-layout align-end justify-end>
                        <v-btn
                                @click="saves"
                                color="error"
                                round
                                :disabled="!formIsValid || loader"
                                :loading="loader"
                        >
                            DELETAR
                            <v-icon right>delete_forever</v-icon>
                            <template v-slot:loader>
                                <span>Aguarde...</span>
                            </template>
                        </v-btn>
                    <v-dialog
                            v-model="loader"
                            hide-overlay
                            persistent
                            width="300"
                    >
                        <v-card
                                color="error"
                                dark
                        >
                            <v-card-text>
                                Deletando...
                                <v-progress-linear
                                        indeterminate
                                        color="white"
                                        class="mb-0"
                                ></v-progress-linear>
                            </v-card-text>
                        </v-card>
                    </v-dialog>
                    <v-snackbar
                            v-model="snackbar"
                            :bottom="y === 'bottom'"
                            :left="x === 'left'"
                            color="success"
                            :multi-line="mode === 'multi-line'"
                            :right="x === 'right'"
                            :top="y === 'top'"
                            :vertical="mode === 'vertical'"
                    >
                        {{this.mensagem}}
                        <v-spacer></v-spacer>
                        <v-icon dark>event_busy</v-icon>
                    </v-snackbar>
                </v-layout>


                <template>
                    <v-container class="align-center justify-center">
                        <v-layout column align-center justify-center wrap>
                            <v-subheader>Hoje: {{date | dateFilter}}</v-subheader>
                            <v-expansion-panel popout>
                                <v-expansion-panel-content
                                        v-for="(message, i) in menssagens"
                                        :key="i"
                                        class="elevation-6"
                                        hide-actions
                                >
                                    <template v-slot:header>
                                        <v-layout align-center row spacer>

                                            <v-flex sm6 md3 hidden-xs-only :class="`${message.color}--text`">
                                                <strong>Médico:</strong>
                                                <v-chip small :color="message.color" text-color="white">
                                                    <v-avatar>
                                                        <v-icon>account_circle</v-icon>
                                                    </v-avatar>
                                                    {{message.medico}}
                                                </v-chip>
                                            </v-flex>

                                            <v-flex sm6 md3 hidden-xs-only :class="`${message.color}--text`">
                                                <strong>CRM-AM:</strong>
                                                <v-chip small :color="message.color" text-color="white">
                                                    <v-avatar>
                                                        <v-icon>payment</v-icon>
                                                    </v-avatar>
                                                    {{message.crm}}
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
                                                            idConsulta:item.idConsulta,
                                                            idPaciente: item.idPaciente,
                                                            paciente: item.paciente,
                                                            cartaoId: item.cartaoId,
                                                            data: item.data,
                                                            hora: item.hora,
                                                            cpf:item.cpf,
                                                            telefone:item.telefone,
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
                                                </v-flex>
                                            </v-layout>
                                        </v-list>
                                    </v-card>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
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
            y: 'top',
            x: null,
            mode: '',
            moment: moment,
            menu: false,
            date_choose: '',
            dateFormatted: '',
            medicoChoose:'',
            especialidade_choose:'',
            messages: [],
            medicosOptions: [],
        }),
        computed:{
            especialidadeOptions() {
                return this.$store.getters.get_especialidades;
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
                    this.medicosOptions = this.$store.getters.medicosPorEspecialidade(val)
                    this.especialidade_choose = val
                    if(this.medico != ''){
                        this.$store.dispatch('loadScheduledAppointmentbyDoctor', {especialidade: val,medico:this.medico})
                    }else{
                        this.$store.dispatch('loadScheduledAppointment', {especialidade: val})
                    }
                    
                }
            },
            
            medico:{
                get(){
                    return this.medicoChoose
                },
                set(val){
                    console.log('->' + val)
                    this.medicoChoose = val
                    this.$store.dispatch('loadScheduledAppointmentbyDoctor', {especialidade: this.especialidade,medico:val})
                }
            },
            date:{
                get(){
                    return this.date_choose;
                },
                set(val){
                    this.date_choose = val
                     if(this.medico != ''){
                        this.$store.dispatch('loadScheduledAppointmentbyDoctor', {especialidade: this.especialidade,medico:this.medico})
                    }else{
                        this.$store.dispatch('loadScheduledAppointment', {especialidade: this.especialidade})
                    }
                }
            },
            computedDateFormatted () {
                return this.formatDate(this.date)
            },
            especialidadeOptions(){
                return this.$store.getters.especialidades
            },
            formIsValid () {
                return this.date  && this.medico && this.especialidade 
            },
            loader(){
                return this.$store.getters.statusLoaderDC
            },
            snackbar(){

                var snack = this.$store.getters.onSnackbarDC

                if(snack){
                    this.dialog = false
                }
                return snack;
            },
            mensagem(){
                return this.$store.getters.onMensagem
            }
        },
        async mounted() {
            await this.$store.dispatch('loadEspecialidades')
            await this.$store.dispatch('loadMedicos')
            this.especialidade = 'Clinico Geral'
            
            this.$store.dispatch('stopSnack',false)
            this.date = moment().format('YYYY-MM-DD')
            this.dateFormatted = moment().format('YYYY-MM-DD')
            
        },
        watch: {
            menu (val) {
                val && setTimeout(() => (this.$refs.picker.activePicker = 'MONTH'))
            }
        },
        methods: {
            save (date) {
                this.$refs.menu.save(date)
            },
            formatDate (date) {
                if (!date) return null
                const [year, month, day] = date.split('-')
                return `${day}/${month}/${year}`
            },
            deleteConsultasDia () {
                var deletar = {
                    data: this.date,
                    medico: this.medico,
                    especialidade: this.especialidade
                }
                this.$store.dispatch('removeAppointmentByDay', deletar)
                this.clear()

            },
            clear () {
                this.date = moment().format('YYYY-MM-DD');
                this.medicos = '';
                this.especialidade = '';
            },

            saves () {
                this.$store.dispatch('setLoader',{loader:true,view:"DeletarConsultas"});
                setTimeout(() => (this.deleteConsultasDia()), 1000);
            },
        },
    }
</script>

<style scoped>
</style>
