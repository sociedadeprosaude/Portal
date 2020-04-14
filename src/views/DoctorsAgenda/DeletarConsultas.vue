<template>
    <v-container>
        <v-layout row wrap>
            <v-card class="pa-4">
                <v-layout align-center wrap>
                    <v-flex xs12 sm5>
                        <v-combobox
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
                        </v-combobox>
                    </v-flex>
                    <v-spacer></v-spacer>
                    <v-flex xs12 sm5>
                        <v-combobox
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
                        </v-combobox>
                    </v-flex>
                    <v-flex xs12 md12>
                    <v-select
                            prepend-icon="location_city"
                            v-model="clinic"
                            :items="clinics"
                            item-text="name"
                            return-object
                            label="Clínica"
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
                    <v-flex xs3 sm3>
                        <v-menu
                                ref="menu"
                                v-model="startMenu"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                        >
                            <template v-slot:activator="{ on }">
                                <v-text-field
                                        v-model="startDateFormatted"
                                        label="De"
                                        prepend-icon="event_busy"
                                        outline
                                        hint="Do dia."
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
                                    v-model="start_date"
                                    :min="new Date().toISOString().substr(0, 10)"
                                    locale="pt-br"
                                    color="red"
                                    @change="save"
                            ></v-date-picker>
                        </v-menu>
                    </v-flex>
                    <v-spacer></v-spacer>
                    <v-flex xs3 sm3>
                        <v-menu
                                ref="menu"
                                v-model="finishMenu"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                        >
                            <template v-slot:activator="{ on }">
                                <v-text-field
                                        v-model="finishDateFormatted"
                                        label="Até"
                                        prepend-icon="event_busy"
                                        outline
                                        hint="Até o dia."
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
                                    v-model="final_date"
                                    :min="new Date().toISOString().substr(0, 10)"
                                    locale="pt-br"
                                    color="red"
                                    @change="save"
                            ></v-date-picker>
                        </v-menu>
                    </v-flex>
                    <v-flex xs12>
                    <v-layout class="align-end justify-end">
                        <v-btn color="black" dark @click="filterHour ? filterHour = false: filterHour = true">
                            Filtro de Hora :<v-icon right>alarm</v-icon>
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn color="black" dark @click="filterDayWeek ? filterDayWeek = false: filterDayWeek = true">
                            Filtro de Dia da Semana :<v-icon right>today</v-icon>
                        </v-btn>
                    </v-layout>
                    </v-flex>

                    <v-flex xs12><p></p></v-flex>

                    <v-flex xs12 sm5 v-show="filterHour">
                        <v-select
                                v-model="times"
                                prepend-icon="alarm_add"
                                :items="timesOptions"
                                label="Horários"
                                attach
                                outlined
                                rounded
                                filled
                                hint="Selecione o horario que deseja Apagar"
                                persistent-hint
                                chips
                                color="green"
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
                                >{{ data.item.text }}</v-chip>
                            </template>
                        </v-select>
                    </v-flex>
                    <v-spacer></v-spacer>
                    <v-flex xs12 sm5 v-show="filterDayWeek">
                        <v-select
                                v-model="semana"
                                prepend-icon="event"
                                :items="semanaOptions"
                                label="Dias da Semana"
                                hint="Selecione o(s) dia(s) da semana que deseja apagar"
                                persistent-hint
                                outlined
                                rounded
                                multiple
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
                                >{{ data.item.text }}</v-chip>
                            </template>
                        </v-select>
                    </v-flex>

                </v-layout>

                <v-layout align-center justify-center>
                    <v-spacer></v-spacer>
                    <v-btn
                            @click="getConsultations"
                            color="error"
                            class="mx-3"
                            rounded
                            :disabled="!formIsValid"
                    >
                        Ver consultas
                        <v-icon right>remove_red_eye</v-icon>
                    </v-btn>
                    <v-btn
                            v-if="Object.keys(consultationsDeletionInfo).length === 0"
                            @click="deleteConsultasDia"
                            class="mr-3"
                            :loading="loading"
                            :success="success"
                            color="error"
                            rounded
                            :disabled="!formIsValid"
                    >
                        DELETAR
                        <v-icon right>delete_outline</v-icon>
                    </v-btn>
                    <v-btn
                            v-if="Object.keys(consultationsDeletionInfo).length === 0"
                            @click="deleteAllSchedule"
                            :loading="loading"
                            :success="success"
                            color="error"
                            rounded
                            :disabled="!doctor || !especialidade || !clinic"
                    >
                        DELETAR TUDO
                        <v-icon right>delete_forever</v-icon>
                    </v-btn>
                    <span v-else class="ml-4">
                        Deletando {{consultationsDeletionInfo.removed}}/{{consultationsDeletionInfo.total}}, dia {{consultationsDeletionInfo.day | dateFilter}}
                    </span>
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
                            <v-subheader v-if="consultasByDoctors(consultas).length != 0">
                                <b>
                                    {{start_date | dateFilter}} - {{daydate(start_date)}} até {{final_date | dateFilter}} - {{daydate(final_date)}}
                                </b>
                            </v-subheader>

                            <v-expansion-panels>
                                <v-expansion-panel

                                        class="elevation-6"
                                        hide-actions
                                        v-model="panel"
                                >
                                    <v-expansion-panel-header>
                                        <v-layout align-center row spacer>

                                            <v-flex xs4 hidden-xs-only>
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
                                                <v-layout column wrap>
                                                    <strong>Vagas: </strong>
                                                    <v-chip small color="blue" text-color="white">
                                                        <v-avatar>
                                                            <v-icon>event</v-icon>
                                                        </v-avatar>
                                                        {{consultation.vacancy}}
                                                    </v-chip>
                                                </v-layout>
                                            </v-flex>

                                            <v-flex row wrap xs2 class="text-xs-right blue--text">
                                                <v-layout column wrap>
                                                    <strong>Consultas: </strong>
                                                    <v-chip small color="blue" text-color="white">
                                                        <v-avatar>
                                                            <v-icon>event</v-icon>
                                                        </v-avatar>
                                                        {{consultation.numConsultations}}
                                                    </v-chip>
                                                </v-layout>
                                            </v-flex>

                                            <v-flex row wrap xs2 class="text-xs-right blue--text">
                                                <v-layout column wrap>
                                                    <strong>Retornos: </strong>
                                                    <v-chip small color="blue" text-color="white">
                                                        <v-avatar>
                                                            <v-icon>restore</v-icon>
                                                        </v-avatar>
                                                        {{consultation.numRegress}}
                                                    </v-chip>
                                                </v-layout>
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
                                                            v-if="item.user"
                                                            v-show="filterHour === false && filterDayWeek === false"
                                                    >
                                                        <v-list-item>
                                                            <v-list-item-content>
                                                                <v-list-item-title class="primary--text">
                                                                         <span style="font-weight: bolder">
                                                                            {{item.user.name}}
                                                                         </span>
                                                                </v-list-item-title>
                                                                <br>
                                                                <v-list-item-subtitle class="text-center">
                                                                    CPF: {{item.user.cpf}}
                                                                </v-list-item-subtitle>
                                                                <br>
                                                                <v-list-item-subtitle>
                                                                    Telefone: {{item.user.telephones  ? item.user.telephones[0] : 'Número não informado'}}
                                                                </v-list-item-subtitle>
                                                                <br>
                                                                <v-list-item-action-text>
                                                                    {{item.date.split(' ')[0] | dateFilter}} -
                                                                    {{item.date.split(' ')[1]}} -
                                                                    {{moment(item.date.split(' ')[0],'YYYY-MM-DD').format('dddd')}}
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
                                                    <v-flex sm3
                                                            xs12
                                                            v-for="item in consultation.consultations"
                                                            :key="item.id"
                                                            v-if="item.user"
                                                            v-show="filterHour === true && times === item.date.split(' ')[1]"
                                                    >
                                                        <v-list-item>
                                                            <v-list-item-content>
                                                                <v-list-item-title class="primary--text">
                                                                         <span style="font-weight: bolder">
                                                                            {{item.user.name}}
                                                                         </span>
                                                                </v-list-item-title>
                                                                <br>
                                                                <v-list-item-subtitle class="text-center">
                                                                    CPF: {{item.user.cpf}}
                                                                </v-list-item-subtitle>
                                                                <br>
                                                                <v-list-item-subtitle>
                                                                    Telefone: {{item.user.telephones  ? item.user.telephones[0] : 'Número não informado'}}
                                                                </v-list-item-subtitle>
                                                                <br>
                                                                <v-list-item-action-text>
                                                                    {{item.date.split(' ')[0] | dateFilter}} -
                                                                    {{item.date.split(' ')[1]}} -
                                                                    {{moment(item.date.split(' ')[0],'YYYY-MM-DD').format('dddd')}}
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
                                                    <v-flex sm3
                                                            xs12
                                                            v-for="item in consultation.consultations"
                                                            :key="item.id"
                                                            v-if="item.user"
                                                            v-show="filterDayWeek === true && moment(semana,'e').format('dddd') === moment(item.date.split(' ')[0],'YYYY-MM-DD').format('dddd')"
                                                    >
                                                        <v-list-item>
                                                            <v-list-item-content>
                                                                <v-list-item-title class="primary--text">
                                                                         <span style="font-weight: bolder">
                                                                             {{item.user.name}}
                                                                         </span>
                                                                </v-list-item-title>
                                                                <br>
                                                                <v-list-item-subtitle class="text-center">
                                                                    CPF: {{item.user.cpf}}
                                                                </v-list-item-subtitle>
                                                                <br>
                                                                <v-list-item-subtitle>
                                                                    Telefone: {{item.user.telephones  ? item.user.telephones[0] : 'Número não informado'}}
                                                                </v-list-item-subtitle>
                                                                <br>
                                                                <v-list-item-action-text>
                                                                    {{item.date.split(' ')[0] | dateFilter}} -
                                                                    {{item.date.split(' ')[1]}} -
                                                                    {{moment(item.date.split(' ')[0],'YYYY-MM-DD').format('dddd')}}
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
            <!--<v-progress-circular v-if="loading" indeterminate class="primary&#45;&#45;text"></v-progress-circular>-->
        </v-layout>
    </v-container>
</template>

<script>
    import SubmitButton from "../../components/SubmitButton";
    var moment = require('moment');
    export default {
        components: {
            SubmitButton
        },
        data: () => ({
            start_date: undefined,
            final_date: undefined,
            teste: 0,
            filterHour: false,
            filterDayWeek: false,
            moment: moment,
            startMenu: false,
            finishMenu: false,
            panel: [true],
            date_choose: '',
            especialidade: undefined,
            clinic:undefined,
            dialog: false,
            alert: false,
            doctor: null,
            dateFormatted: '',
            success: false,
            index_Selecionado: {},
            status_Selecionado: '',
            times: undefined,
            semana: undefined,
            timesOptions: [
                { text: '06:00'},
                { text: '06:30'},
                { text: '07:00'},
                { text: '07:30'},
                { text: '08:00'},
                { text: '08:30'},
                { text: '09:00'},
                { text: '09:30'},
                { text: '10:00'},
                { text: '10:30'},
                { text: '11:00'},
                { text: '11:30'},
                { text: '12:00'},
                { text: '12:30'},
                { text: '13:00'},
                { text: '13:30'},
                { text: '14:00'},
                { text: '14:30'},
                { text: '15:00'},
                { text: '15:30'},
                { text: '16:00'},
                { text: '16:30'},
                { text: '17:00'}
            ],
            semanas: [
                "Domingo",
                "Segunda-feira",
                "Terça-feira",
                "Quarta-feira",
                "Quinta-feira",
                "Sexta-feira",
                "Sábado"
            ],
            semanaOptions: [
                { text: 'segunda-feira', value: 1},
                { text: 'terça-feira', value: 2},
                { text: 'quarta-feira', value: 3},
                { text: 'quinta-feira', value: 4},
                { text: 'sexta-feira', value: 5},
                { text: 'sábado', value: 6},
                { text: 'domingo', value: 0}
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
            loading: false
        }),

        computed: {
            clinics() {
                let val = this.$store.getters.clinics.filter(a => {
                    return a.property;
                });
                return val;
                //return this.$store.getters.clinics;
            },

            consultationsDeletionInfo() {
              return this.$store.getters.consultationsDeletionInfo
            },

            formIsValid() {
                return this.start_date && this.final_date && this.doctor && this.especialidade && this.clinic
            },

            specialties() {
                //return this.$store.getters.specialties;

                let espArray = Object.values(this.$store.getters.specialties);
                espArray = espArray.filter(specialty => {
                    //console.log('Teeeee',specialty)
                    if (!this.doctor) {
                        return true;
                    }
                    var find = false;
                    specialty.doctors.forEach(doctor => {
                        if (doctor.cpf === this.doctor.cpf) {
                            find = true;
                            return true;
                        }
                    });

                    return find;
                });
                //docArray.unshift({name:'Todos'})
                return espArray;
            },

            doctors () {
                let doctors = Object.values(this.$store.getters.doctors)
                if(this.especialidade) {
                    doctors = doctors.filter((a) => {
                        for (let spe in a.specialties) {
                            if (a.specialties[spe].name === this.especialidade.name) {
                                return true
                            }
                        }
                        return false
                        // return a.specialties.indexOf(this.especialidade.name) > -1
                    })
                }
                return doctors
            },

            startDateFormatted() {
                return this.formatDate(this.start_date)
            },
            finishDateFormatted() {
                return this.formatDate(this.final_date)
            },

            computedDateFormattedSelecionado() {
                return this.formatDate(this.index_Selecionado.start_date)
            },

            consultas(){
                return this.$store.getters.consultations
            },

            // consultas() {
            //     let consultas = this.$store.getters.consultations
            //      // .filter((a) => {
            //      //
            //      //     let response = true
            //      //    if(this.doctor){
            //      //        if(this.doctor.cpf !== a.doctor.cpf){
            //      //            response = false
            //      //        }
            //      //    }
            //      //    if(this.especialidade){
            //      //        if(this.especialidade.name !== a.specialty.name ){
            //      //            response = false
            //      //        }
            //      //    }
            //      //    if(!a.user){
            //      //        response = false
            //      //    }
            //      //    else{
            //      //        console.log(a.user)
            //      //    }
            //      //    //console.log("resposta:", response)
            //      //    return response
            //      //
            //      //     //return this.especialidade && this.start_date && this.doctor ? this.especialidade.name === a.specialty.name && this.date === a.date.split(' ')[0] && this.doctor.cpf == a.doctor.cpf && a.user : false
            //      // })
            //     return consultas;
            // },

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
            // this.start_date = moment().format('YYYY-MM-DD')
            // this.final_date = moment().format('YYYY-MM-DD')
            // this.getConsultations({
            //     start_date: moment().format('YYYY-MM-DD 00:00:00'),
            //     final_date: moment().format('YYYY-MM-DD 23:59:59')
            // })
            await this.$store.dispatch('getSpecialties')
            await this.$store.dispatch('getDoctors')
            this.start_date = moment().format('YYYY-MM-DD')
            this.dateFormatted = moment().format('YYYY-MM-DD')
        },

        watch: {
            menu(val) {
                val && setTimeout(() => (this.$refs.picker.activePicker = 'MONTH'))
            },
        },

        methods: {

            async getConsultations() {
                let payload = {
                    start_date: this.start_date + ' 00:00',
                    final_date: this.final_date ? this.final_date  + ' 23:59' : undefined,
                    doctor: this.doctor,
                    specialty: this.especialidade,
                }
                this.loading = true
                await this.$store.dispatch('listenConsultations', payload)
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
                    if (array[i].start_date === consultation.start_date && array[i].doctor.name === consultation.doctor.name) {
                        return i
                    }
                }
                return -1
            },

            consultasByDoctors(consultations) {

                let res = {}
                for (let cons in consultations) {
                    let targetDate = consultations[cons].doctor.cpf
                    if (!res[targetDate]) {
                        res[targetDate] = {
                            doctor: consultations[cons].doctor,
                            numConsultations: 0,
                            numRegress: 0,
                            vacancy: 0,
                            consultations: []
                        }
                    }
                    if (consultations[cons].type == 'Consulta') res[targetDate].numConsultations += 1
                    else if (consultations[cons].type == 'Retorno') res[targetDate].numRegress += 1
                    else res[targetDate].vacancy += 1
                    res[targetDate].consultations.push(consultations[cons])


                }
                return res
            },

            daydate(date) {
                var dateMoment = moment(date);
                return this.semanas[dateMoment.day()];
            },

            save(date) {
                this.$refs.menu.save(date)
            },
            formatDate(date) {
                if (!date) return null
                const [year, month, day] = date.split('-')
                return `${day}/${month}/${year}`
            },

            async deleteAllSchedule(){
                this.loading = true
                var payload = {
                    doctor: this.doctor,
                    specialty: this.especialidade,
                    clinic: this.clinic
                }
                await this.$store.dispatch('deleteAllSchedule', payload)
                this.success = true
                this.loading = false
            },

            async deleteConsultasDia() {
                this.loading = true
                var deletar = {
                    start_date: this.start_date,
                    final_date: this.final_date,
                    doctor: this.doctor,
                    specialty: this.especialidade,
                    hour: this.times,
                    weekDays: this.semana,
                    clinic:this.clinic
                }
                await this.$store.dispatch('removeAppointmentByDay', deletar)
                // this.clear()
                this.success = true
                this.loading = false
                //this.$router.push('/agenda/agendamento')
            },

            clear() {
                this.start_date = moment().format('YYYY-MM-DD');
                this.doctor = null;
                this.especialidade = '';
            },
        },
    }
</script>

<style scoped>
</style>
