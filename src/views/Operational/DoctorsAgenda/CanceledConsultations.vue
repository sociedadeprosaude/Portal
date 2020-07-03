<template>
    <v-container>
        <v-layout v-if="animation === true"  class="align-center justify-center" row wrap>
            <div class="text-center">
                <v-progress-circular
                        :size="350"
                        :width="12"
                        color="primary"
                        indeterminate>
                    <span class="headline">CARREGANGO...</span>
                </v-progress-circular>
            </div>
        </v-layout>

        <v-layout v-else-if="animation === false"  class="align-center justify-center" row wrap>
            <v-card>
                <template>
                    <v-container fluid grid-list-xl>
                        <v-layout class="align-center" wrap>
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
                        <v-layout column class="align-center justify-center" wrap>
                            <v-subheader>Gerenciamento de Consultas Canceladas de Todas as Especilidades e Médicos<br/></v-subheader>

                            <v-expansion-panels>
                                <v-expansion-panel
                                        class="elevation-6"
                                        hide-actions
                                        v-model="panel"
                                >
                                    <v-expansion-panel-header>
                                        <v-layout class="align-center" row wrap>
                                            <v-chip small color="primary" text-color="white">
                                                <v-avatar>
                                                    <v-icon>settings</v-icon>
                                                </v-avatar>
                                                Gerenciamento de Consultas Canceladas
                                            </v-chip>
                                        </v-layout>
                                    </v-expansion-panel-header>

                                    <v-expansion-panel-content>
                                        <v-divider/>
                                        <v-card class="elevation-0">
                                            <v-list three-line subheader>
                                                <v-layout wrap>
                                                    <v-flex sm3
                                                            xs12
                                                            v-for="item in consultations"
                                                    >
                                                        <v-list-item
                                                                class="py-3"
                                                                @click="viewConsultation = {
                                                                    idConsultation:item.id,
                                                                    idPaciente: item.user.cpf,
                                                                    paciente: item.user.name,
                                                                    cartaoId: item.user.association_number,
                                                                    cpf:item.user.cpf,
                                                                    data: item.date.split(' ')[0],
                                                                    hora: item.date.split(' ')[1],
                                                                    crm: item.doctor.crm,
                                                                    especialidade: item.specialty,
                                                                    exame: item.exam,
                                                                    esp:item.specialty ? item.specialty.name : undefined,
                                                                    status: item.status,
                                                                    modalidade: item.type,
                                                                    calls: item.calls,
                                                                    medico:item.doctor.name,
                                                                    doctor:item.doctor,
                                                                    num_recibo:item.payment_number,
                                                                    pacienteObj:item.user,
                                                                    consultation:item
                                                        }">
                                                            <v-list-item-content>
                                                                <v-list-item-title class="primary--text">
                                                                    <span  style="font-weight: bolder">
                                                                        {{item.user.dependent ? item.user.dependent.name:
                                                                    item.user.name}}
                                                                    </span>
                                                                </v-list-item-title>
                                                                <br>
                                                                <v-list-item-subtitle class="text-center font-weight-bold">
                                                                   {{item.user.dependent ? 'Nascimento:' + item.user.dependent.birthDate
                                                                    : 'CPF:' + item.user.cpf}}
                                                                </v-list-item-subtitle>
                                                                <br>
                                                               <v-list-item-subtitle class="text-center font-weight-bold">
                                                                    Telefone: {{item.user.telephones  ? item.user.telephones[0] : 'Número não informado'}}
                                                                </v-list-item-subtitle>
                                                                <br>
                                                                <v-list-item-action-text>
                                                                    {{item.date.split(' ')[0] | dateFilter}} -
                                                                    {{item.date.split(' ')[1]}}
                                                                    <div v-if="item.calls">
                                                                    <v-icon large color="red">phone_disabled</v-icon>
                                                                    <v-icon color="red">arrow_forward</v-icon>
                                                                    <v-chip class="white--text" color="red">{{item.calls.length}}</v-chip>
                                                                    </div>
                                                                </v-list-item-action-text>
                                                            </v-list-item-content>
                                                            <br>
                                                            <v-list-item-action class="ml-2">
                                                                <v-btn icon ripple text>
                                                                    <v-icon v-if="item.type === 'Retorno'" color="primary">restore</v-icon>
                                                                    <v-icon v-if="item.type === 'Consulta'" color="primary">event</v-icon>
                                                                    <v-icon v-if="item.status === 'Pago'" color="success">attach_money</v-icon>
                                                                    <v-icon v-if="item.status === 'Aguardando pagamento'" color="error">money_off</v-icon>
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
                    </v-container>
                </template>
                <template>
                    <v-container>
                        <v-layout>
                            <div class="text-xs-center">
                                <v-dialog v-model="dialog" width="700">
                                    <v-card>
                                        <v-card-title class="headline grey lighten-2" primary-title>
                                            Informações
                                        </v-card-title>
                                        <v-card-text>
                                            <v-container grid-list-md>
                                                <v-layout wrap>
                                                    <v-flex xs12 sm6>
                                                        <v-text-field readonly hide-details outlined prepend-icon="person" label="Nome do Paciente" v-model="indexSelected.paciente">
                                                        </v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12 sm6>
                                                        <v-text-field readonly hide-details outlined prepend-icon="credit_card" label="CPF" v-model="indexSelected.cpf">
                                                        </v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12 sm12 md12 lg12>
                                                        <v-divider/>
                                                    </v-flex>
                                                    <v-flex xs12 sm6>
                                                        <v-text-field readonly hide-details outlined prepend-icon="person" label="Nome do Médico" v-model="indexSelected.medico">
                                                        </v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12 sm6>
                                                        <v-text-field readonly hide-details outlined prepend-icon="credit_card" v-model="indexSelected.crm" label="CRM">
                                                        </v-text-field>
                                                    </v-flex>

                                                    <v-flex xs12 sm6 v-if="indexSelected.exame">
                                                        <v-text-field readonly hide-details outlined prepend-icon="poll" label="Exame" v-model="indexSelected.exame.name"/>
                                                    </v-flex>
                                                    <v-flex xs12 sm6 v-else>
                                                        <v-text-field readonly hide-details outlined prepend-icon="school" label="Especialidade" v-model="indexSelected.esp"/>
                                                    </v-flex>

                                                    <v-flex xs12 sm6>
                                                        <v-text-field readonly hide-details outlined prepend-icon="event" label="Dia da Consulta" v-model="computedDateFormattedSelected">
                                                        </v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12 sm6>
                                                        <v-text-field readonly hide-details outlined prepend-icon="access_alarm" label="Hora da Consulta" v-model="indexSelected.hora">
                                                        </v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12 sm6>
                                                        <v-text-field prepend-icon="assignment_turned_in" v-model="indexSelected.status" label="Status" chips outlined hide-details readonly>
                                                        </v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12 sm6>
                                                        <v-text-field prepend-icon="assignment" v-model="indexSelected.modalidade" readonly outlined hide-details label="Modalidade">
                                                        </v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12 sm6>
                                                        <v-text-field prepend-icon="receipt" label="Nº do Recibo" v-model="indexSelected.num_recibo" outlined hide-details readonly>
                                                        </v-text-field>
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
                                                                readonly>
                                                        </v-select>
                                                    </v-flex>
                                                    <v-flex xs12>
                                                        <v-checkbox
                                                                v-model="call"
                                                                label="Paciente não atendeu ?"
                                                                color="red"
                                                                value="red">
                                                        </v-checkbox>
                                                    </v-flex>
                                                    <v-flex xs12 v-show="call">
                                                        <v-text-field clearable label="ID da ligação" type="number" v-model="idCall" outlined hide-details prepend-icon="call"/>
                                                    </v-flex>
                                                    <v-flex xs12 v-show="call">
                                                        <v-textarea clearable label="Descrição da ligação" v-model="descriptionCall" outlined hide-details prepend-icon="perm_phone_msg"/>
                                                    </v-flex>
                                                    <v-flex xs12 v-if="indexSelected.calls">
                                                        <v-select
                                                                :items="indexSelected.calls"
                                                                item-text="idCall"
                                                                return-object
                                                                multiple
                                                                v-model="indexSelected.calls"
                                                                chips
                                                                outlined
                                                                readonly
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
                                                                        color="info"
                                                                >
                                                                    {{ data.item.dayOfTheWeekCall }}:{{ data.item.dateHourCall }} - {{ data.item.idCall }} - {{ data.item.descriptionCall }}
                                                                </v-chip>
                                                            </template>
                                                        </v-select>
                                                    </v-flex>
                                                </v-layout>
                                            </v-container>
                                        </v-card-text>
                                        <v-divider/>
                                        <v-card-actions>
                                            <v-btn color="warning" rounded @click="dialog = false">Voltar<v-icon right>clear</v-icon></v-btn>
                                            <v-spacer/>
                                            <v-btn color="primary" rounded @click="registerCall" :disabled="!registerCallIsValid">Registrar<v-icon>phone_disabled</v-icon></v-btn>
                                            <v-spacer/>
                                            <v-btn color="error" rounded @click="deleteConsultation">Apagar<v-icon right>delete</v-icon></v-btn>
                                            <v-spacer/>
                                            <v-btn color="success" rounded dark :to="{ name: 'AgendamentoConsultas', params: { q: indexSelected.consultation,reschedule:true}}">Remarcar<v-icon right>assignment_turned_in</v-icon></v-btn>
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
    let moment = require('moment/moment');
    export default {
        data: () => ({
            menu: false,
            call: undefined,
            calls: [],
            descriptionCall: undefined,
            idCall: undefined,
            dateHourCall: undefined,
            dayOfTheWeekCall: undefined,
            exams: ['ULTRASSONOGRAFIA', 'ELETROCARDIOGRAMA', 'ELETROENCEFALOGRAMA', 'ECOCARDIOGRAMA', 'VIDEOLARIGONSCOPIA'],
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
            indexSelected: {},
            statusSelected:'',
            animation: false,
        }),
        computed: {
            computedDateFormattedSelected() {
                return this.formatDate(this.indexSelected.data)
            },
            registerCallIsValid(){
                return this.idCall && this.descriptionCall
            },
            consultations () {
                return this.$store.getters.consultationsCanceled;
            },

            viewConsultation: {
                get: function(){
                    return this.indexSelected;
                },
                set: function (index) {
                    this.statusSelected = index.status;
                    this.indexSelected = {...index};
                    this.dialog = true
                }
            },

        },
        created() {
            this.animation = true
        },
        async mounted() {
            await this.$store.dispatch('getConsultationsCanceled');
            this.date = moment().format('YYYY-MM-DD');
            this.dateFormatted = moment().format('YYYY-MM-DD');
            setTimeout(() => (this.animation = false), 3000)
        },

        methods: {

            formatDate (date) {
                if (!date) return null;
                const [year, month, day] = date.split('-');
                return `${day}/${month}/${year}`
            },

            deleteConsultation () {
                this.$store.dispatch('removeAppointmentForever',{... this.indexSelected});
                this.dialog = false
            },

            formatDataCall () {
                this.dateHourCall = moment().locale('pt-BR').format('DD/MM/YYYY HH:mm:ss');
                this.dayOfTheWeekCall =  moment().format('dddd');
                return {
                    idCall: this.idCall,
                    descriptionCall: this.descriptionCall,
                    dateHourCall: this.dateHourCall,
                    dayOfTheWeekCall: this.dayOfTheWeekCall,
                };
            },

            async registerCall(){
                let val = await this.formatDataCall();
                if (this.indexSelected.calls === undefined){
                    this.calls.push(val);
                    await this.$store.dispatch('addArrayCallsToConsultation', {
                        calls: this.calls,
                        idConsultation: this.indexSelected.idConsultation,
                    });
                    this.calls = []
                } else {
                    this.indexSelected.calls.push(val);
                    await this.$store.dispatch('addArrayCallsToConsultation', {
                        calls: this.indexSelected.calls,
                        idConsultation: this.indexSelected.idConsultation,
                    })
                }

                this.resetData();
            },

            resetData () {
                this.call = undefined;
                this.idCall = undefined;
                this.descriptionCall = undefined;
                this.dateHourCall = undefined;
                this.dayOfTheWeekCall = undefined;
                this.dialog = false
            }
        },
    };
</script>
<style scoped>
</style>