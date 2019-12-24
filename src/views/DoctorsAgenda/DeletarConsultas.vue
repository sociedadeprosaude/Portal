<template>
    <v-container>
        <v-layout row wrap>
            <v-card class="pa-4">
                <v-layout align-center wrap>
                    <v-flex xs12 sm4>
                        <v-select
                                label="Especialidade"
                                prepend-icon="school"
                                v-model="especialidade"
                                :items="specialties"
                                item-text="name"
                                return-object
                                outlined
                                rounded
                                filled
                                chips
                                color="pink"
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
                        </v-select>
                    </v-flex>
                    <v-spacer></v-spacer>
                    <v-flex xs12 sm4>
                        <v-select
                                prepend-icon="account_circle"
                                v-model="doctor"
                                :items="doctors"
                                item-text="name"
                                return-object
                                label="Médico"
                                no-data-text="Nenhum médico para esta especialidade"
                                outlined
                                rounded
                                filled
                                chips
                                color="purple"
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
                        </v-select>
                    </v-flex>
                    <v-flex xs12 sm4>
                        <v-menu
                                ref="menu"
                                v-model="menu"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                        >
                            <template v-slot:activator="{ on }">
                                <v-text-field
                                        v-model="computedDateFormatted"
                                        label="Dia para Deletar"
                                        prepend-icon="event_busy"
                                        outline
                                        hint="Selecione o diak para deletar as consultas do mesmo."
                                        persistent-hint
                                        color="error"
                                        clearable
                                        rounded
                                        outlined
                                        filled
                                        readonly
                                        v-on="on"
                                ></v-text-field>
                            </template>
                            <v-date-picker
                                    ref="picker"
                                    v-model="date"
                                    :min="new Date().toISOString().substr(0, 10)"
                                    locale="pt-br"
                                    color="red"
                                    @change="save"
                            ></v-date-picker>
                        </v-menu>
                    </v-flex>
                </v-layout>

                <v-layout align-center justify-center>
                    <v-btn
                            @click="deleteConsultasDia"
                            color="error"
                            rounded
                            :disabled="!formIsValid"
                    >
                        DELETAR
                        <v-icon right>delete_forever</v-icon>
                    </v-btn>
                </v-layout>

                <v-container v-if="consultas && consultas.lenght == 0">
                    <v-layout
                            row
                            wrap
                            justify-center
                            align-center
                    >
                        <v-alert type="error">
                            Não há Consultas ou Retornos Marcados para a especialidade:
                        </v-alert>
                    </v-layout>
                </v-container>

                <v-layout
                        v-for="(consultation, i) in consultasByDoctors(consultas)"
                        :key="i"
                        row
                        wrap
                        justify-center
                        align-center
                >
                    <v-container class="align-center justify-center py-0">
                        <v-layout row align-center justify-center wrap>
                            <v-spacer></v-spacer>
                            <v-flex xs12 sm12 md12 lg12></v-flex>
                            <v-flex xs12 sm12 md12 lg12></v-flex>
                            <v-flex xs12 sm12 md12 lg12></v-flex>
                            <v-spacer></v-spacer>
                            <v-subheader v-if="consultasByDoctors(consultas).length != 0"><b>Data: {{date | dateFilter}}
                                - {{daydate(date)}}</b></v-subheader>

                            <v-expansion-panels>
                                <v-expansion-panel

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

                                            <v-flex xs2 hidden-xs-only>
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

                                            <v-flex row wrap xs2 class="text-xs-right blue--text">
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
                                        <v-card class="elevation-0">
                                            <v-list three-line subheader>
                                                <v-layout wrap>
                                                    <v-flex sm3
                                                            xs12
                                                            v-for="item in consultation.consultations"
                                                            :key="item.id"
                                                    >
                                                        <v-list-item>
                                                            <v-list-item-content>
                                                                <v-list-item-title class="primary--text">
                                                                         <span style="font-weight: bolder">
                                                                            {{item.user.name}}
                                                                         </span>
                                                                </v-list-item-title>
                                                                <br>
                                                                <v-list-item-subtitle class="text-left">
                                                                    CPF: {{item.user.cpf}}
                                                                </v-list-item-subtitle>
                                                                <br>
                                                                <v-list-item-subtitle>
                                                                    Telefone: {{item.user.telephones[0]}}
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
                                                                    <v-icon v-if="item.status === 'Pago'"
                                                                            color="success">attach_money
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
                    </v-container>


                </v-layout>

            </v-card>
        </v-layout>
    </v-container>
</template>

<script>
    var moment = require('moment');
    export default {
        data: () => ({
            teste: 0,
            moment: moment,
            menu: false,
            panel: [true],
            date_choose: '',
            especialidade: '',
            dialog: false,
            alert: false,
            doctor: null,
            dateFormatted: '',
            loading: false,
            success: false,
            index_Selecionado: {},
            status_Selecionado: '',
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
            timeout: 4000,
            mensage_progress: '',
        }),

        computed: {

            formIsValid() {
                return this.date && this.doctor && this.especialidade
            },

            specialties() {
                return this.$store.getters.specialties
            },

            doctors() {
                let doctors = Object.values(this.$store.getters.doctors)
                if (this.especialidade) {
                    doctors = doctors.filter((a) => {
                        for (let spe in a.specialties) {
                            if (a.specialties[spe].name === this.especialidade.name) {
                                return true
                            }
                        }
                        return false
                    })
                }
                return doctors
            },

            computedDateFormatted() {
                return this.formatDate(this.date)
            },

            computedDateFormattedSelecionado() {
                return this.formatDate(this.index_Selecionado.data)
            },

            consultas() {
                let consultas = this.$store.getters.consultations.filter((a) => {

                    return this.especialidade && this.date && this.doctor ? this.especialidade.name === a.specialty.name && this.date === a.date.split(' ')[0] && this.doctor.cpf == a.doctor.cpf && a.user : false
                })
                return consultas;
            },

            date: {
                get() {
                    return this.date_choose;
                },
                set(val) {
                    this.date_choose = val
                }
            },
        },
        async mounted() {
            this.getConsultations({
                start_date: moment().format('YYYY-MM-DD 00:00:00'),
                final_date: moment().format('YYYY-MM-DD 23:59:59')
            })
            await this.$store.dispatch('getSpecialties')
            await this.$store.dispatch('getDoctors')
            this.date = moment().format('YYYY-MM-DD')
            this.dateFormatted = moment().format('YYYY-MM-DD')
        },

        watch: {
            menu(val) {
                val && setTimeout(() => (this.$refs.picker.activePicker = 'MONTH'))
            },
            date(val) {
                this.getConsultations({
                    start_date: val + ' 00:00:00',
                    final_date: val + ' 23:59:59'
                })
            }
        },

        methods: {

            async getConsultations(dates) {
                this.loading = true
                await this.$store.dispatch('getConsultations', dates)
                this.loading = false
            },

            formatConsultationsArray(consultations) {
                let newArray = []
                for (let consultation in consultations) {
                    let inArrayIndex = this.checkConsultationIsInArray(newArray, consultations[consultation])
                    if (inArrayIndex === -1) {
                        newArray.push({
                            ...consultations[consultation],
                            // vagas: consultations[consultation].user ? 0 : 1,
                            consultations: [consultations[consultation]]
                        })
                    } else {
                        // newArray[inArrayIndex].vagas++
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

                let res = {}
                for (let cons in consultations) {
                    let targetDate = consultations[cons].doctor.cpf
                    var numConsultations = 0
                    var numRegress = 0
                    if (!res[targetDate]) {
                        res[targetDate] = {
                            doctor: consultations[cons].doctor,
                            numConsultations: 0,
                            numRegress: 0,
                            consultations: []
                        }
                    }
                    if (consultations[cons].type == 'Consulta') res[targetDate].numConsultations += 1
                    else res[targetDate].numRegress += 1
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
                if (!date) return null
                const [year, month, day] = date.split('-')
                return `${day}/${month}/${year}`
            },

            deleteConsultasDia() {

                var deletar = {
                    date: this.date,
                    doctor: this.doctor,
                    specialtie: this.especialidade
                }
                //console.log(deletar)
                this.$store.dispatch('removeAppointmentByDay', deletar)
                this.clear()

            },

            clear() {
                this.date = moment().format('YYYY-MM-DD');
                this.doctor = null;
                this.especialidade = '';
            },
        },
    }
</script>

<style scoped>
</style>
