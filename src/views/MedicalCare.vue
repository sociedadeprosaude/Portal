<template>
    <v-container fluid>
        <v-layout class="align-center " row wrap>
            <v-flex xs12>
                <v-card class="pa-4">
                    <v-layout class="align-center " row wrap>
                        <v-flex xs12 sm4>
                            <v-combobox
                                    prepend-icon="school"
                                    v-model="especialidade"
                                    :items="user.specialties"
                                    item-text="name"
                                    return-object
                                    label="Especialidade"
                                    outlined
                                    rounded
                                    filled
                                    chips
                                    color="blue"
                                    clearable
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
                                        >{{ data.item.name }}
                                        </v-chip>
                                    </template>
                                </v-combobox>
                        </v-flex>
                        <v-spacer/>
                        <v-flex xs12 sm4>
                            <v-menu
                                        ref="menu"
                                        v-model="menu"
                                        :close-on-content-click="false"
                                        :nudge-right="40"
                                        transition="scale-transition"
                                        offset-y
                                        min-width="290px"
                                        disabled
                                >
                                    <template v-slot:activator="{ on }">
                                        <!--disabled-->
                                        <v-text-field
                                                v-model="computedDateFormatted"
                                                label="Data"
                                                prepend-icon="event"
                                                outlined
                                                rounded
                                                filled
                                                chips
                                                disabled
                                                v-on="on">
                                        </v-text-field>
                                    </template>
                                    <v-date-picker
                                            ref="picker"
                                            v-model="date"
                                            locale="pt-br"
                                            @change="save"
                                            disabled>
                                    </v-date-picker>
                                </v-menu>
                        </v-flex>
                        <v-spacer/>
                        <v-flex xs12>
                            <v-btn text>
                                <v-icon color="blue">event</v-icon>
                                :
                                <v-chip small text-color="white" color="blue">Consulta</v-chip>
                            </v-btn>
                            <v-btn text>
                                <v-icon color="blue">restore</v-icon>
                                :
                                <v-chip small text-color="white" color="blue">Retorno</v-chip>
                            </v-btn>
                            <v-btn text>
                                <v-icon class="elevation-6 success" color="success">stop</v-icon>
                                :
                                <v-chip small text-color="white" color="blue">Atendidos</v-chip>
                            </v-btn>
                            <v-btn text>
                                <v-icon class="elevation-6 white" color="white">stop</v-icon>
                                :
                                <v-chip small text-color="white" color="blue">Não Atendidos</v-chip>
                            </v-btn>
                        </v-flex>
                    </v-layout>

                    <v-alert type="warning" :value="consultasByDoctors(consultas).length === 0">
                        Não há consultas marcadas
                    </v-alert>

                    <v-layout column class="align-center justify-center" wrap>
                            <v-subheader v-if="consultasByDoctors(consultas).length !== 0"><b>Data: {{date |
                                dateFilter}} - {{daydate(date)}}</b></v-subheader>

                        <v-expansion-panels>
                            <v-expansion-panel
                                        v-for="(consultation, i) in consultasByDoctors(consultas)"
                                        :key="i"
                                        class="elevation-6"
                                        hide-actions
                                        v-model="panel"
                                        v-if="consultation.doctor.cpf === user.cpf"
                                >
                                    <v-expansion-panel-header>
                                        <v-layout class="align-center" row wrap>

                                            <v-flex xs5 hidden-xs-only>
                                                <strong>Médico:</strong>
                                                <v-chip class="ml-3 mb-1" small color="blue" text-color="white">
                                                    <v-avatar>
                                                        <v-icon>account_circle</v-icon>
                                                    </v-avatar>
                                                    {{consultation.doctor.name}}
                                                </v-chip>
                                            </v-flex>

                                            <v-flex xs3 hidden-xs-only>
                                                <strong>CRM-AM:</strong>
                                                <v-chip class="ml-3 mb-1"  small color="blue" text-color="white">
                                                    <v-avatar>
                                                        <v-icon>payment</v-icon>
                                                    </v-avatar>
                                                    {{consultation.doctor.crm}}
                                                </v-chip>
                                            </v-flex>

                                            <v-flex row wrap xs2 class="blue--text">
                                                <strong>Consultas: </strong>
                                                <v-chip class="ml-3"  small color="blue" text-color="white">
                                                    <v-avatar>
                                                        <v-icon>event</v-icon>
                                                    </v-avatar>
                                                    {{consultation.numConsultations}}
                                                </v-chip>
                                            </v-flex>

                                            <v-flex row wrap xs2 class="blue--text">
                                                <strong>Retornos: </strong>
                                                <v-chip class="ml-3"  small color="blue" text-color="white">
                                                    <v-avatar>
                                                        <v-icon>restore</v-icon>
                                                    </v-avatar>
                                                    {{consultation.numRegress}}
                                                </v-chip>
                                            </v-flex>
                                        </v-layout>
                                    </v-expansion-panel-header>

                                    <v-expansion-panel-content>
                                        <v-divider/>
                                        <v-card class="elevation-0">
                                            <v-list three-line subheader>
                                                <v-layout wrap>
                                                    <v-flex sm3
                                                            xs12
                                                            v-for="item in consultation.consultations"
                                                            :key="item.id"
                                                            v-if="item.status === 'Pago'"
                                                            :class="item.end_at ? 'success' : 'transparent'"
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
                                                            <v-list-item-content>
                                                            <v-list-item-title class="primary--text">
                                                            <span style="font-weight: bolder">
                                                                {{item.user.dependent ? item.user.dependent.name:
                                                                    item.user.name}}
                                                            </span>
                                                            </v-list-item-title>
                                                            <br>
                                                            <v-list-item-subtitle class="text-center">
                                                                {{item.user.dependent ? 'Data de Nascimento:' + item.user.dependent.birthDate
                                                                    : 'CPF:' + item.user.cpf}}
                                                            </v-list-item-subtitle>
                                                            <br>
                                                            <v-list-item-action-text>
                                                                {{item.date.split(' ')[0] | dateFilter}} -
                                                                {{item.date.split(' ')[1]}}
                                                            </v-list-item-action-text>
                                                        </v-list-item-content>
                                                            <br>
                                                            <v-list-item-action class="ml-2">
                                                                <v-btn icon ripple text>
                                                                    <v-icon v-if="item.type === 'Retorno'"
                                                                            color="primary">restore
                                                                    </v-icon>
                                                                    <v-icon v-if="item.type === 'Consulta'"
                                                                            color="primary">event
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
                        <v-row justify="center">
                            <v-dialog v-model="dialog" persistent max-width="350">
                                <v-card>
                                    <v-card-title>Deseja Iniciar o Atendimento do Paciente Selecionado ?</v-card-title>
                                    <v-divider/>
                                    <v-card-actions>
                                        <v-btn color="error" @click="dialog = false">NÃO</v-btn>
                                        <v-spacer/>
                                        <v-btn color="success"
                                               :to="{ name: 'Attendance', params: { q: {...this.index_Selecionado}}}"
                                        >SIM</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-row>
                    </template>

                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    var moment = require('moment');
    export default {
        data: () => ({
            panel: [true],
            date_choose: '',
            dateFormatted: '',
            menu: false,
            documentDialog: false,
            dialog: false,
            alert: false,
            index_Selecionado: {},
            status_Selecionado: '',
            attendance: 'Aguardando Atendimento',
            attendanceOptions:
                [
                    {text: 'Aguardando Atendimento'},
                    {text: 'Atendimento Realizado'},
                ],
            semanaOptions: [
                "Domingo",
                "Segunda-feira",
                "Terça-feira",
                "Quarta-feira",
                "Quinta-feira",
                "Sexta-feira",
                "Sábado"
            ],
            statusOptions:
                [
                    {text: 'Cancelado'},
                    {text: 'Aguardando pagamento'},
                ],
            messages: [],
            timeout: 4000,
            mensage_progress: '',
            especialidade: '',
            doctor: undefined,
        }),
        computed: {

            computedDateFormatted() {
                return this.formatDate(this.date)
            },
            computedDateFormattedSelecionado() {
                return this.formatDate(this.index_Selecionado.data)
            },
            user(){
                return this.$store.getters.user
            },
            consultas() {
                let consultas = this.$store.getters.consultations.filter((a) => {
                    
                    return this.especialidade && this.date ? this.especialidade.name === a.specialty.name && this.date === a.date.split(' ')[0] && a.user && this.user.cpf === a.doctor.cpf: false
                })
                return consultas;
            },
            date: {
                get() {
                    return this.date_choose;
                },
                set(val) {
                    this.date_choose = val
                    //this.$store.dispatch('loadScheduledAppointment', {especialidade: this.especialidade})

                }
            },
            visualizarConsulta: {
                get: function () {
                    return this.index_Selecionado;
                },
                set: function (index) {

                    if (this.especialidade !== '') {
                        this.status_Selecionado = index.status;
                        this.index_Selecionado = {...index};
                        this.statusOptions.splice(1, 1);
                        this.statusOptions.push({text: index.status});
                        this.dialog = true
                    } else {
                        alert('Escolha uma especialidade!')
                    }
                }
            },
        },
        mounted() {
            this.initialConfig();
            this.date = moment().format('YYYY-MM-DD');
            this.dateFormatted = moment().format('YYYY-MM-DD')
        },
        watch: {
            menu(val) {
                val && setTimeout(() => (this.$refs.picker.activePicker = 'MONTH'))
            }
        },
        methods: {
            async initialConfig() {
                this.loading = true;
                this.especialidade = this.user.specialties[0];
                //await this.$store.dispatch('getDoctors')
                await this.$store.dispatch('listenConsultations',
                    {
                        start_date: moment().subtract(10, 'days').format('YYYY-MM-DD'),
                        final_date: moment().add(10, 'days').format('YYYY-MM-DD 23:59:59')
                    });
                this.loading = false
            },

            formatConsultationsArray(consultations) {
                let newArray = [];
                for (let consultation in consultations) {
                    let inArrayIndex = this.checkConsultationIsInArray(newArray, consultations[consultation]);
                    if (inArrayIndex === -1) {
                        newArray.push({
                            ...consultations[consultation],
                            consultations: [consultations[consultation]]
                        })
                    } else {
                        newArray[inArrayIndex].consultations.push(consultations[consultation])
                    }
                }
                for (let i in newArray) {
                    newArray[i].vagas = newArray[i].consultations.filter((a) => {
                        return !a.user
                    }).length
                }
                return newArray
            },

            checkConsultationIsInArray(array, consultation) {
                for (let i in array) {
                    if (array[i].date === consultation.date && array[i].doctor.name === consultation.doctor.name) {
                        return i
                    }
                }
                return -1
            },

            consultasByDoctors(consultations) {
                let res = {};
                for (let cons in consultations) {
                    let targetDate = consultations[cons].doctor.cpf;
                    if (!res[targetDate]) {
                        res[targetDate] = {
                            doctor: consultations[cons].doctor,
                            numConsultations: 0,
                            numRegress: 0,
                            consultations: []
                        }
                    }
                    if (consultations[cons].type === 'Consulta') res[targetDate].numConsultations += 1;
                    else res[targetDate].numRegress += 1;
                    res[targetDate].consultations.push(consultations[cons])
                }
                return res
            },

            daydate(date) {
                var dateMoment = moment(date);
                return this.semanaOptions[dateMoment.day()];
            },
            save(date) {
                this.$refs.menu.save(date)
            },
            formatDate(date) {
                if (!date) return null;
                const [year, month, day] = date.split('-');
                return `${day}/${month}/${year}`
            },
        },
    }
</script>
