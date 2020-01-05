<template>
    <v-layout row wrap>
        <v-flex xs8>
            <v-layout align-center row wrap class="ml-6">
                <v-flex xs12 md4>
                    <v-select
                            prepend-icon="school"
                            v-model="especialidade"
                            :items="specialties"
                            item-text="name"
                            return-object
                            label="Especialidade"
                            outlined
                            rounded
                            chips
                            color="blue"
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
                            >{{ data.item.name }}</v-chip>
                        </template>
                    </v-select>
                </v-flex>
                <v-flex xs12 md4>
                    <v-select
                            prepend-icon="person"
                            v-model="selectedDoctor"
                            :items="doctors"
                            return-object
                            item-text="name"
                            label="Médicos"
                            outlined
                            rounded
                            chips
                            color="blue"

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
                            >{{ data.item.name }}</v-chip>
                        </template>
                    </v-select>
                </v-flex>

                <v-flex xs12 md4>
                    <v-select
                            prepend-icon="location_city"
                            v-model="clinic"
                            :items="clinics"
                            item-text="name"
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
                            >{{ data.item.name }}</v-chip>
                        </template>
                    </v-select>
                </v-flex>
            </v-layout>
            <v-container
                    style="width:100%"
                    class="align-center justify-center hidden-xs-only py-0"
                    v-for="(consultaGroup, i) in consultasByDate(consultas)"
                    :key="i"

            >
                <v-flex xs12>
                    <div v-bind:id="'group-' + i">
                        <v-card dark color="primary_dark" class="title">
                            <v-card-text
                                    class="px-3 text-left my-sub-headline"
                            >
                                {{i | dateFilter}} - {{daydate(i)}}
                            </v-card-text>
                        </v-card>
                    </div>
                </v-flex>
                <v-container fluid grid-list-sm class="py-0 my-3">
                    <v-layout row wrap>
                        <v-flex v-for="(consulta, j) in consultaGroup" :key="j" xs4>
                            <v-card class="elevation-12" dark style="border-radius:20px">
                                <v-card-text class="white text--primary">
                                    <v-container class="py-0 px-0">
                                        <v-layout row wrap>
                                            <v-flex x2 sm2 dm2 lg2>
                                                <v-avatar>
                                                    <v-btn icon large color="primary_dark">
                                                        <v-icon medium color="white">person</v-icon>
                                                    </v-btn>
                                                </v-avatar>
                                            </v-flex>

                                            <v-flex id="teste" xs10 sm10 md10 lg10 hidden-xs-only class="pl-3 py-2">
                                                <div style="height:60px">
                                                    <h4>
                                                        <span class="subheading font-weight-bold">{{consulta.doctor.name}}</span>
                                                        <br/>
                                                        <span
                                                                class="body-2 font-weight-bold grey--text"
                                                        >{{consulta.specialty.name}}</span>
                                                        <br/>
                                                        <span
                                                                class="body-2 font-weight-bold grey--text"
                                                        >CRM-AM: {{consulta.doctor.crm}}</span>
                                                    </h4>
                                                </div>
                                            </v-flex>

                                            <v-flex class="my-0" xs12>
                                                <v-layout row wrap>
                                                    <v-chip class="mx-2" color="primary_dark" text-color="white">
                                                        {{consulta.date.split(' ')[1]}}
                                                    </v-chip>
                                                    <v-chip
                                                            color="primary_dark"
                                                            text-color="white"
                                                    >Vagas : {{consulta.vagas}}
                                                    </v-chip>
                                                    <v-chip
                                                            class="mt-1"
                                                            color="primary_dark"
                                                            text-color="white"
                                                    >Clinica : {{consulta.clinic.name}}
                                                    </v-chip>
                                                </v-layout>
                                            </v-flex>
                                            <!-- <v-flex x3 sm3 dm3 lg3 class="ml-4">
                                              <v-chip
                                                :color="consultaGroup.color"
                                                text-color="white"
                                              >Vagas : {{consulta.vaga}}</v-chip>
                                            </v-flex>-->
                                            <v-flex xs12 class="text-right">
                                                <v-btn
                                                        rounded
                                                        color="primary_dark"
                                                        class="mx-0"
                                                        :disabled="consulta.vagas === 0"
                                                        @click="scheduleAppointment(consulta)"
                                                >Agendar
                                                </v-btn>
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-container>
        </v-flex>
        <!--      <v-divider vertical></v-divider>-->
        <v-flex id="lknlknlk" v-if="!showAlert" xs4 class="text-center">
            <v-layout row wrap class="align-center justify-center">
                <!-- <v-flex xs12 class="text-center">
                    <select-patient-card ref="patientCard" max-width="1000px"></select-patient-card>
                </v-flex> -->
                <v-flex xs12 class="text-center">
                    <v-date-picker landscape full-width class="mx-4" v-model="date" :allowed-dates="allowedDates"
                                   locale="pt-br"></v-date-picker>
                </v-flex>
            </v-layout>
        </v-flex>
        <template>
            <v-container>
                <v-layout>
                    <div class="text-xs-center">
                        <v-dialog v-model="dialog" v-if="createConsultationForm" width="500">
                            <v-card>
                                <v-card-title
                                        class="headline grey lighten-2"
                                        primary-title
                                >Confirmar Agendamento da Consulta
                                </v-card-title>
                                <v-card-text>
                                    <v-container grid-list-md>
                                        <v-layout wrap row class="align-center">
                                            <v-flex xs12 sm6>
                                                <v-text-field
                                                        readonly
                                                        prepend-icon="person"
                                                        v-model="createConsultationForm.user.name"
                                                        label="Nome do Paciente"
                                                ></v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm6>
                                                <v-text-field
                                                        readonly
                                                        prepend-icon="credit_card"
                                                        v-model="createConsultationForm.user.cpf"
                                                        label="CPF"
                                                ></v-text-field>
                                            </v-flex>
                                            <v-flex xs12>
                                                <v-text-field
                                                        v-if="createConsultationForm.user.association_number"
                                                        readonly
                                                        prepend-icon="credit_card"
                                                        v-model="createConsultationForm.user.association_number"
                                                        label="Nº do associado"
                                                ></v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm12 md12 lg12>
                                                <v-divider></v-divider>
                                            </v-flex>
                                            <v-flex xs12 sm6>
                                                <v-text-field
                                                        readonly
                                                        prepend-icon="person"
                                                        v-model="createConsultationForm.consultation.doctor.name"
                                                        label="Nome do Médico"
                                                ></v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm6>
                                                <v-text-field
                                                        readonly
                                                        prepend-icon="credit_card"
                                                        v-model="createConsultationForm.consultation.doctor.crm"
                                                        label="CRM"
                                                ></v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm6>
                                                <v-text-field
                                                        readonly
                                                        prepend-icon="school"
                                                        v-model="createConsultationForm.consultation.specialty.name"
                                                        label="Especialidade"
                                                ></v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm6 class="text-left" style="position: relative; top: -12px">
                                                <v-layout row wrap class="align-end ma-0">
                                                    <v-flex xs2>
                                                    <v-icon style="position: relative; bottom: -4px">event</v-icon>
                                                    </v-flex>
                                                    <v-layout column wrap>
                                                        <span style="font-size: 0.9em">Dia</span>
                                                        <span style="font-size: 1.2em" class="black--text">
                                                    {{createConsultationForm.consultation.date.split(' ')[0] | dateFilter}}
                                                </span>
                                                        <v-divider class="mt-1 grey"></v-divider>
                                                    </v-layout>
                                                </v-layout>
                                            </v-flex>

                                            <v-flex xs12 sm4 class="text-left" style="position: relative; top: -12px">
                                                <v-layout row wrap class="align-end ma-0">
                                                    <v-flex xs4>
                                                        <v-icon style="position: relative; bottom: -4px">access_alarm</v-icon>
                                                    </v-flex>
                                                    <v-flex xs8>
                                                    <v-layout column wrap>
                                                        <span style="font-size: 0.9em">Hora</span>
                                                        <span style="font-size: 1.2em" class="black--text">
                                                    {{createConsultationForm.consultation.date.split(' ')[1]}}
                                                </span>
                                                        <v-divider class="mt-1 grey"></v-divider>
                                                    </v-layout>
                                                    </v-flex>
                                                </v-layout>
                                            </v-flex>

                                            <!--                                            <v-flex xs12 sm6>-->
                                            <!--                                                <v-text-field-->
                                            <!--                                                        readonly-->
                                            <!--                                                        prepend-icon="event"-->
                                            <!--                                                        v-model="getConsultationDate(createConsultationForm.consultation.date)"-->
                                            <!--                                                        label="Dia da Consulta"-->
                                            <!--                                                ></v-text-field>-->
                                            <!--                                            </v-flex>-->
                                            <!--                                            <v-flex xs12 sm6>-->
                                            <!--                                                <v-text-field-->
                                            <!--                                                        readonly-->
                                            <!--                                                        prepend-icon="access_alarm"-->
                                            <!--                                                        v-model="createConsultationForm.hora"-->
                                            <!--                                                        label="Hora da Consulta"-->
                                            <!--                                                ></v-text-field>-->
                                            <!--                                            </v-flex>-->
                                            <v-flex xs12 sm8>
                                                <v-select
                                                        readonly
                                                        prepend-icon="assignment_turned_in"
                                                        v-model="status"
                                                        :items="statusOptions"
                                                        label="Status"
                                                        chips
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
                                                            >{{ data.item.text }}</v-chip>
                                                    </template>
                                                </v-select>
                                            </v-flex>
                                            <v-flex xs12 sm6>
                                                <v-text-field
                                                        prepend-icon="assignment"
                                                        v-model="modalidade"
                                                        readonly
                                                        label="Modalidade"
                                                        chips
                                                ></v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm6>
                                                <v-text-field
                                                        readonly
                                                        prepend-icon="receipt"
                                                        label="Nº do Recibo"
                                                        v-model="num_recibo"
                                                        type="number"
                                                        :disabled="status === 'Pago' ? false : true"
                                                ></v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm12 md12 lg12>
                                                <v-divider></v-divider>
                                            </v-flex>
                                            <v-flex xs12>
                                                <v-select
                                                        prepend-icon="device_unknown"
                                                        v-model="attendance"
                                                        :items="attendanceOptions"
                                                        label="Atendimento"
                                                        chips
                                                        disabled
                                                ></v-select>
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                </v-card-text>
                                <v-divider></v-divider>
                                <v-card-actions>
                                    <v-dialog v-model="loader" hide-overlay persistent width="300">
                                        <v-card color="primary" dark>
                                            <v-card-text>
                                                Salvando...
                                                <v-progress-linear indeterminate color="white"
                                                                   class="mb-0"></v-progress-linear>
                                            </v-card-text>
                                        </v-card>
                                    </v-dialog>
                                    <v-btn rounded class="error" @click="dialog = false">
                                        Cancelar
                                        <v-icon right>clear</v-icon>
                                    </v-btn>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                            color="success"
                                            :disabled="loader"
                                            :loading="loader"
                                            rounded
                                            @click="save"
                                            v-if="status === 'Pago' && num_recibo !== ''"
                                    >
                                        Confirmarkk
                                        <v-icon right>done</v-icon>
                                        <template v-slot:loader>
                                            <span>Aguarde...</span>
                                        </template>
                                    </v-btn>
                                    <submit-button
                                            color="success"
                                            rounded
                                            @reset="success = false"
                                            :success="success"
                                            :loading="loading"
                                            @click="save"
                                            text="Confirmarkk"
                                            v-if="status === 'Aguardando pagamento' && num_recibo === ''"
                                    >
                                    </submit-button>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </div>
                    <v-dialog v-model="dialogPaciente" width="1000">
                        <pacientes></pacientes>
                    </v-dialog>
                </v-layout>
            </v-container>
        </template>

        <!-- <v-snackbar
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
        </v-snackbar>-->
        <v-dialog v-model="snackbar" hide-overlay max-width="500px">
            <v-card color="white">
                <v-card-title class="text-xs-center ma-1">
                    <h3>
                        {{this.mensagem}}
                        <v-icon dark color="success">done_outline</v-icon>
                    </h3>
                </v-card-title>
                <v-card-text class="text-xs-center">
                    <div>
                        <h4 class="text--primary">Você deseja continuar com o paciente selecionado?</h4>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="keepPatient">Sim</v-btn>
                    <v-btn color="primary" flat @click="clearPatient">Não</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-btn v-if="offsetTop > 2" class="mr-2" fixed dark fab bottom right color="primary" @click="backTop">
            <v-icon>keyboard_arrow_up</v-icon>
        </v-btn>
    </v-layout>
</template>

<script>
    import Pacientes from "./Patient";
    import SelectPatientCard from "../../components/SelectPatientCard";
    import SubmitButton from "../../components/SubmitButton";

    var moment = require("moment");
    // import * as easings from "vuetify/es5/util/easing-patterns";
    export default {
        components: {Pacientes, SelectPatientCard, SubmitButton},

        data: () => ({
            y: "top",
            x: null,
            mode: "",
            alert: false,
            menu: false,
            dialog: false,
            dialog2: false,
            dialogPaciente: false,
            selectedDoctor: undefined,
            clinic:undefined,
            num_recibo: "",
            type: "",
            createConsultationForm: undefined,
            attendance: "Aguardando Atendimento",
            attendanceOptions: [
                {text: "Aguardando Atendimento"},
                {text: "Atendimento Realizado"}
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
            status: "Aguardando pagamento",
            statusOptions: [{text: "Aguardando pagamento"}, {text: "Pago"}],
            modalidade: "Retorno",
            date: moment().format("YYYY-MM-DD"),
            dates: [],
            times: "",
            timesOptions: [],
            medicosOptions: ["Todos"],
            pacientes: "",
            timeout: 4000,
            especialidadeOption: "",
            especialidade: undefined,
            showAlert: false,
            snackDialogDone: false,
            snack: false,
            changeDoctorsOptions: true,
            success : false,
            loading: false,
            pacienteSelecionado:undefined,

            //-------------------------------------------Scroll------------------------------------------------
            type: "number",
            number: 9999,
            selector: "#first",
            selected: "Button",
            elements: ["Button", "Radio group"],
            duration: 500,
            offset: 15,
            easing: "easeInQuint",
            // easings: Object.keys(easings),
            offsetTop: 0,
            //---------------------------------------------------------------------------------------------------
        }),

        computed: {
            clinics() {
                return this.$store.getters.clinics
            },
            specialties() {
                return this.$store.getters.specialties;
            },
            computedDateFormatted() {
                // return this.formatDate(this.index_Selecionado.data);
            },
            consultas() {
                //console.log('Especialidade',this.especialidade)
                let consultas = this.formatConsultationsArray(this.$store.getters.consultations).filter((a) => {

                    /* return this.especialidade && this.selectedDoctor ? this.especialidade.name === a.specialty.name &&
                           this.selectedDoctor.cpf === a.doctor.cpf :  false */

                    let response = true
                    if(this.selectedDoctor){
                        if(this.selectedDoctor.cpf !== a.doctor.cpf){
                            response = false
                        }
                    }
                    if(this.especialidade){
                        if(this.especialidade.name !== a.specialty.name ){
                            response = false
                        }
                    }
                    if(this.clinic){
                        if(this.clinic !== a.clinic){
                            response = false
                        }
                    }
                    return response
                })
                return consultas;
            },
            doctors: {
                get: function () {
                    /* let docs = {
                        0: {
                            name: 'Todos'
                        },
                        ...this.$store.getters.doctors
                    }
                    return Object.values(docs) */
                    let docArray = Object.values(this.$store.getters.doctors)
                    docArray = docArray.filter((doctor) => {
                        if(!this.especialidade) {
                            return true
                        }
                        var find = false
                        doctor.specialties.forEach((specialty)=>{
                            //console.log(doctor.name,specialty.name)
                            if(specialty.name === this.especialidade.name){
                                find = true
                                return true
                            }

                        })

                        return find
                    })
                    //docArray.unshift({name:'Todos'})
                    return docArray
                }
            },
            selectedPatient() {
                let paciente = this.$store.getters.selectedPatient;
                return paciente;
            },
            loader() {
                return this.$store.getters.statusLoaderAC;
            },
            snackbar: {
                get: function () {
                    var snack = this.$store.getters.onSnackbarAC;
                    if (!this.snack && this.snackDialogDone) {
                        this.snackDialogDone = false;
                    } else if (snack) {
                        this.dialog = false;
                        this.snack = snack;
                    }
                    return this.snack;
                },
                set: function (val) {
                    this.snack = val;
                }
            },
            mensagem() {
                return this.$store.getters.onMensagem;
            },
            // especialidade: {
            //     set: function (value) {
            //         this.especialidadeOption = value;
            //         this.dates = [];
            //     },
            //     get: function () {
            //         return this.especialidadeOption;
            //     }
            // },
            //------------------------------------------Scroll-------------------------------------------------
            target() {
                const value = this[this.type];
                if (!isNaN(value)) return Number(value);
                else return value;
            },
            options() {
                return {
                    duration: this.duration,
                    offset: this.offset,
                    easing: this.easing
                };
            },
            element() {
                if (this.selected === "Button") return this.$refs.button;
                else if (this.selected === "Radio group") return this.$refs.radio;
            }
            //-----------------------------------------------------------------------------------------------------
        },
        watch: {
            medico(value) {
                this.dates = [];
                this.$store.dispatch("loadAppointment", {
                    especialidade: this.especialidadeOption,
                    medico: value
                });
            },
            date(val) {
                /* window.scrollTo(
                  0,
                  this.findPos(document.getElementById("group-" + val), "group-" + val)
                ); */
                if (val == this.consultas[0].date)
                    this.$vuetify.goTo(0, this.options)
                else
                    this.$vuetify.goTo("#group-" + val, this.options);
            }
        },

        mounted() {
            this.showAlert = false;
            this.initialConfig()
        },
        created() {
            window.addEventListener("scroll", this.handleScroll);
        },
        methods: {
            scheduleAppointment(consultation) {

                this.fillConsultationForm(consultation)
                this.dialog = true
            },
            fillConsultationForm(consultation) {
                let patient = this.query.pacienteObj
                let form = {
                    user: patient,
                    consultation: consultation.consultations.find((a) => {
                        return !a.user
                    })
                }
                this.createConsultationForm = form
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
            consultasByDate(consultations) {
                let res = {}
                for (let cons in consultations) {
                    let targetDate = consultations[cons].date.split(' ')[0]
                    if (!res[targetDate]) {
                        res[targetDate] = []
                    }
                    res[targetDate].push(consultations[cons])
                }
                return res
            },
            async initialConfig() {
                this.loading = true
                await this.$store.dispatch('getDoctors')
                await this.$store.dispatch('getConsultations',{
                    start_date: moment().format('YYYY-MM-DD 00:00:00'),
                    final_date: moment().add(10, 'days').format('YYYY-MM-DD 23:59:59')
                })
                await this.$store.dispatch("getSpecialties")

                this.query = this.$route.params.q
                console.log( {...this.query})
                if(!this.query){
                //this.$router.push('agenda/GerenciamentoConsultas')
                }
                this.especialidade = this.query.especialidade
                this.pacienteSelecionado = this.query.pacienteObj
                this.selectedDoctor = this.query.doctor
                this.status = this.query.status
                this.num_recibo = this.query.num_recibo
                this.loading = false
            },
            backTop() {
                this.$vuetify.goTo(0, this.options)
                this.date = this.consultas[0].date
            },
            handleScroll(event) {
                var scrollPos = window.scrollY;
                var winHeight = window.innerHeight;
                var docHeight = document.documentElement.scrollHeight; // instead document.body.clientHeight
                this.offsetTop = (100 * scrollPos) / (docHeight - winHeight);

            },
            findPos(obj, elementId) {
                var curtop = 0;
                if (elementId == "group-" + this.dates[0]) {
                    return [0];
                } else if (obj.offsetParent) {
                    do {
                        curtop += obj.offsetTop;
                    } while ((obj = obj.offsetParent));
                    return [curtop - 70];
                }
            },
            allowedDates(val) {
                return Object.keys(this.consultasByDate(this.consultas)).indexOf(val) !== -1;
            },
            daydate(date) {
                var dateMoment = moment(date);
                return this.semanaOptions[dateMoment.day()];
            },
            keepPatient() {
                this.snackDialogDone = true;
                this.snackbar = false;
            },
            clearPatient() {
                this.snackDialogDone = true;
                this.snackbar = false;
                this.$store.dispatch("selecionarPaciente", null);
            },
            clearRecibo() {
                this.num_recibo = "";
            },
            // formatDate(date) {
            //     if (!date) return null;
            //     const [year, month, day] = date.split("-");
            //     return `${day}/${month}/${year}`;
            // },
            call() {
                var consulta = this.$store.getters.idConsultation({
                    data: this.index_Selecionado.data,
                    hora: this.index_Selecionado.hora,
                    crm: this.index_Selecionado.crm,
                    status: this.status,
                    modalidade: this.modalidade,
                    num_recibo: this.num_recibo
                });

                this.$store.dispatch("scheduleAppointment", {
                    pacienteSelecionado: this.pacienteSelecionado,
                    status: this.status,
                    modalidade: this.modalidade,
                    consulta: consulta,
                    especialidade: this.especialidade,
                    num_recibo: this.num_recibo
                });
                this.clear();
            },
            clear() {
                this.num_recibo = "";
                this.status = "Aguardando pagamento";
            },
            async save() {
                let form = this.createConsultationForm
                form.user = {
                    ...form.user,
                    status: this.status,
                    type: this.modalidade,
                    payment_number: this.num_recibo,

                }
                form.consultation = {
                    ...form.consultation,
                    status: this.status,
                    type: this.modalidade,
                    payment_number: this.num_recibo,
                    previousConsultation:this.query.idConsultation
                }
                // return
                this.loading = true
                await this.$store.dispatch('addConsultationAppointmentToUser', form)
                //Realizar essa funcao pelo cloud functions
                await this.$store.dispatch('addUserToConsultation', form)
                this.loading = false
                this.success = true
                this.dialog = false
                this.$router.back()
            }
        }
    };
</script>

<style scoped>
</style>
