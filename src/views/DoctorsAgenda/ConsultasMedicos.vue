<template>
    <v-container>
        <v-layout align-center row wrap>
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
                    <v-container class="align-center justify-center">
                         <v-alert type="warning" :value="menssagens.length == 0">
                                Não há consultas marcadas
                        </v-alert>
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
    import moment from 'moment/moment'
    export default {
        data: () => ({
            date_choose: '',
            dateFormatted: '',
            menu: false,
            dialog: false,
            alert: false,
            especialidade_choose:'',
            messages: [],
        }),
        computed: {
            especialidadeOptions() {
                return this.$store.getters.especialidades;
            },
            computedDateFormatted () {
                return this.formatDate(this.date)
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
                async set(val){
                    this.especialidade_choose = val

                    if(this.date != ''){
                        await this.$store.dispatch('loadScheduledAppointment', {especialidade: val})

                        this.messages = this.$store.getters.consultationsBySpecialties({data:this.date})
                    }

                }
            },
            date:{
                get(){
                    return this.date_choose;
                },
                async set(val){
                    this.date_choose = val

                    if(this.especialidade !== ''){
                        this.$store.dispatch('loadScheduledAppointment', {especialidade: this.especialidade})
                        this.messages = this.$store.getters.consultationsBySpecialties({data:val})
                    }

                   
                }
            },
        },
        mounted() {
            this.$store.dispatch('loadEspecialidades')
            this.especialidade = 'Clinico Geral'
            this.date = moment().format('YYYY-MM-DD')
            this.dateFormatted = moment().format('YYYY-MM-DD')
        },
        watch: {

            especialidade: function(value){
                this.medicosOptions = this.$store.getters.medicosPorEspecialidade(value)
            },

            menu(val) {
                val && setTimeout(() => (this.$refs.picker.activePicker = 'MONTH'))
            }
        },
        methods: {
            save(date) {
                this.$refs.menu.save(date)
            },
            formatDate (date) {
                if (!date) return null
                const [year, month, day] = date.split('-')
                return `${day}/${month}/${year}`
            },
        },
    }
</script>
<style scoped>
</style>