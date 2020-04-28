<template>
    <v-container>
        <v-layout row wrap>
            <v-card>
                <v-card-title class="headline grey lighten-2" primary-title>
                    <v-btn
                            @click="dialog = false"
                            text
                            class="transparent"
                            style="width: 32px; min-width: 0"
                    >
                        <v-icon>close</v-icon>
                    </v-btn>
                    <span class="hidden-xs-only">Confirmar Agendamento da Consulta</span>
                    <span class="hidden-sm-and-up"
                          style="font-size: 0.8em">Agendamento da Consulta</span>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap row class="align-center">
                            <v-flex xs12>
                                <v-text-field
                                        readonly
                                        hide-details
                                        outlined
                                        prepend-icon="person"
                                        v-model="createConsultationForm.user.name"
                                        label="Nome do Paciente">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 v-if="foundDependents && foundDependents.length > 0">
                                <v-select
                                        prepend-icon="person"
                                        v-model="createConsultationForm.user.dependent"
                                        :items="foundDependents"
                                        return-object
                                        item-text="name"
                                        label="Selecionar dependente"
                                        outlined
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
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm6>
                                <v-text-field
                                        readonly
                                        hide-details
                                        outlined
                                        prepend-icon="credit_card"
                                        v-model="createConsultationForm.user.cpf"
                                        label="CPF">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6>
                                <v-text-field
                                        v-if="createConsultationForm.user.association_number"
                                        readonly
                                        hide-details
                                        outlined
                                        prepend-icon="credit_card"
                                        v-model="createConsultationForm.user.association_number"
                                        label="Nº do associado">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md12 lg12>
                                <v-divider/>
                            </v-flex>
                            <v-flex xs12 sm6>
                                <v-text-field
                                        readonly
                                        hide-details
                                        outlined
                                        prepend-icon="person"
                                        v-model="createConsultationForm.consultation.doctor.name"
                                        label="Nome do Médico">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6>
                                <v-text-field
                                        readonly
                                        hide-details
                                        outlined
                                        prepend-icon="credit_card"
                                        v-model="createConsultationForm.consultation.doctor.crm"
                                        label="CRM">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6>
                                <v-text-field
                                        readonly
                                        hide-details
                                        outlined
                                        prepend-icon="school"
                                        v-model="createConsultationForm.consultation.specialty.name"
                                        label="Especialidade">
                                </v-text-field>
                            </v-flex>

                            <v-flex xs12 sm6>
                                <v-text-field
                                        prepend-icon="event"
                                        label="Dia da Consulta"
                                        v-model="computedDateFormatted"
                                        readonly
                                        hide-details
                                        outlined>
                                </v-text-field>
                            </v-flex>

                            <v-flex xs12 v-show="exams.indexOf(createConsultationForm.consultation.specialty.name) !== -1">
                                <v-combobox
                                        prepend-icon="poll"
                                        v-model="exam"
                                        :items="listExam"
                                        item-text="name"
                                        return-object
                                        label="Exame"
                                        outlined
                                        chips
                                        color="blue"
                                        clearable
                                        hide-details
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

                            <v-flex xs12 sm4>
                                <v-text-field
                                        v-model="createConsultationForm.consultation.date.split(' ')[1]"
                                        prepend-icon="access_alarm"
                                        label="Hora da Consulta"
                                        readonly
                                        hide-details
                                        outlined>
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm8>
                                <v-progress-circular
                                        v-if="loaderPaymentNumber"
                                        indeterminate
                                        color="primary">
                                </v-progress-circular>
                                <v-select
                                        v-else
                                        prepend-icon="assignment_turned_in"
                                        v-model="status"
                                        :items="statusOptions"
                                        label="Status"
                                        chips
                                        hide-details
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
                                                :color="data.item.text === 'Pago' ? 'success' : data.item.text === 'Cancelado' ? 'error': 'warning'"
                                        >{{ data.item.text }}
                                        </v-chip>
                                    </template>
                                </v-select>
                            </v-flex>
                            <v-flex xs12 sm6>
                                <v-text-field
                                        prepend-icon="assignment"
                                        v-model="modalidade"
                                        readonly
                                        hide-details
                                        outlined
                                        label="Modalidade"
                                        chips>
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6>
                                <v-text-field
                                        readonly
                                        prepend-icon="receipt"
                                        label="Nº do Recibo"
                                        v-model="numberReceipt"
                                        type="number"
                                        :disabled="status === 'Pago' ? false : true"
                                        hide-details
                                        outlined>
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
                                        readonly
                                        hide-details
                                        outlined>
                                </v-select>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-divider/>
                <v-card-actions>
                    <v-btn rounded class="error" @click="dialog = false">
                        Cancelar
                        <v-icon right>clear</v-icon>
                    </v-btn>
                    <v-spacer/>
                    <submit-button
                            color="success"
                            rounded
                            :disabled="loaderPaymentNumber || (exams.indexOf(createConsultationForm.consultation.specialty.name) !== -1 && !exam)"
                            @reset="resetSchedule"
                            :success="success"
                            :loading="scheduleLoading"
                            @click="save"
                            text="Confirmar">
                    </submit-button>
                </v-card-actions>
            </v-card>
        </v-layout>
    </v-container>
</template>

<script>

    import SelectPatientCard from "../../../components/SelectPatientCard";
    import SubmitButton from "../../../components/SubmitButton";

    let moment = require("moment/moment");

    export default {
        components: {SelectPatientCard, SubmitButton},

        data: () => ({
            y: "top",
            x: null,
            mode: "",
            alert: false,
            exam: undefined,
            exams: ['ULTRASSONOGRAFIA', 'ELETROCARDIOGRAMA', 'ELETROENCEFALOGRAMA', 'ECOCARDIOGRAMA', 'VIDEOLARIGONSCOPIA'],
            loaderPaymentNumber: false,
            menu: false,
            clinic: undefined,
            dialog: false,
            dialog2: false,
            selectedDoctor: undefined,
            numberReceipt: "",
            type: "",
            createConsultationForm: undefined,
            payment_numberFound: undefined,
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
            modalidade: "Consulta",
            date: moment().format("YYYY-MM-DD"),
            dates: [],
            times: "",
            timesOptions: [],
            medicosOptions: ["Todos"],
            pacientes: "",
            timeout: 4000,
            dateFormatted: "",
            especialidadeOption: "",
            especialidade: undefined,
            showAlert: false,
            snackDialogDone: false,
            snack: false,
            changeDoctorsOptions: true,
            success: false,
            loading: false,
            scheduleLoading: false,
            dependent: undefined,
            consultationsListenerUnsubscriber: undefined,
            daysToListen: 3,
            selectedForm: undefined,

            //-------------------------------------------Scroll------------------------------------------------
            type: "number",
            number: 9999,
            selector: "#first",
            selected: "Button",
            elements: ["Button", "Radio group"],
            duration: 500,
            offset: 80,
            easing: "easeInQuint",
            // easings: Object.keys(easings),
            offsetTop: 0,
            scrollPos:0
            //---------------------------------------------------------------------------------------------------
        }),

        computed: {
            isOnline() {
                return this.$store.getters.isOnline
            },

            consultationLoading() {
                return this.$store.getters.consultationsLoading;
            },

            clinics() {
                let val = this.$store.getters.clinics.filter(a => {
                    return a.property;
                });
                return val;
            },

            listExam() {
                let val = this.$store.getters.exams.filter(a => {
                    return a.type === this.createConsultationForm.consultation.specialty.name;
                });
                return val;
            },

            specialties() {
                let espArray = Object.values(this.$store.getters.specialties);
                espArray = espArray.filter(specialty => {

                    if (!this.selectedDoctor) {
                        return true;
                    }
                    let find = false;
                    if (specialty.doctors) {
                        specialty.doctors.forEach(doctor => {
                            if (doctor.cpf === this.selectedDoctor.cpf) {
                                find = true;
                                return true;
                            }
                        });
                    }

                    return find;
                });
                return espArray;
            },

            computedDateFormatted() {
                return this.formatDate(
                    this.createConsultationForm.consultation.date.split(" ")[0]
                );
            },

            schedules() {
                let schedules = this.$store.getters.schedules.filter(a => {
                    let response = true;
                    if (this.selectedDoctor) {
                        if (this.selectedDoctor.cpf !== a.doctor.cpf) {
                            response = false;
                        }
                    }
                    if (this.especialidade) {
                        if (this.especialidade.name !== a.specialty.name) {
                            response = false;
                        }
                    }
                    if (this.clinic) {
                        if (this.clinic !== a.clinic.name) {
                            response = false;
                        }
                    }
                    return response;
                });
                return this.consultationsOfSchedules(schedules);
            },
            consultas() {
                let consultas =
                    this.$store.getters.consultations.filter(a => {
                        let response = true;
                        if (this.selectedDoctor) {
                            if (this.selectedDoctor.cpf !== a.doctor.cpf) {
                                response = false;
                            }
                        }
                        if (this.especialidade) {
                            if (this.especialidade.name !== a.specialty.name) {
                                response = false;
                            }
                        }
                        if (this.clinic) {
                            if (this.clinic !== a.clinic.name) {
                                response = false;
                            }
                        }
                        return response;
                    });
                return consultas;
            },
            doctors: {
                get: function () {

                    let docArray = Object.values(this.$store.getters.doctors);
                    docArray = docArray.filter(doctor => {
                        if (!this.especialidade) {
                            return true;
                        }
                        let find = false;
                        doctor.specialties.forEach(specialty => {
                            //console.log(doctor.name,specialty.name)
                            if (specialty.name === this.especialidade.name) {
                                find = true;
                                return true;
                            }
                        });

                        return find;
                    });
                    //docArray.unshift({name:'Todos'})
                    return docArray;
                }
            },
            selectedPatient() {
                let paciente = this.$store.getters.selectedPatient;
                return paciente;
            },
            foundDependents() {
                return this.selectedPatient ? this.selectedPatient.dependents:undefined;
            },
            mensagem() {
                return this.$store.getters.onMensagem;
            },

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
                if (val == this.consultas[0].date) this.$vuetify.goTo(0, this.options);
                else this.$vuetify.goTo("#group-" + val, this.options);
            },
            exam(value){
                if(!value){
                    this.payment_numberFound = undefined;
                    this.numberReceipt = "";
                    this.status = "Aguardando pagamento";
                }else if( !value.notFindPayment){
                    this.thereIsPaymentNumber()
                }
            }
        },

        mounted() {
            this.showAlert = false;
            this.initialConfig();
        },

        created() {
            window.addEventListener("scroll", this.handleScroll);
        },

        beforeDestroy() {
            this.consultationsListenerUnsubscriber();
        },

        methods: {

            datesOfInterval(payload) {
                let weekDays = payload.weekDays;
                let startDate = moment();
                let dates = [];
                weekDays = weekDays.map((day)=>{ return Number(day)});
                let day = startDate;
                for (let i = 0; i < this.daysToListen; i++) {
                    if (weekDays.indexOf(day.weekday()) > -1 ) {
                        dates.push(day.format('YYYY-MM-DD'))
                    }
                    day = startDate.add(1, 'days');
                }
                return dates
            },

            numberVacancyAndReturns(schedule) {
                let consultations = this.consultas;
                return consultations.reduce((obj,item)=>{

                    if (schedule.clinic.name === item.clinic.name && schedule.specialty.name === item.specialty.name
                        && schedule.doctor.cpf === item.doctor.cpf && schedule.date === item.date  && item.user){
                        if (item.type === 'Consulta') {
                            obj.qtd_consultations = obj.qtd_consultations +  1
                        } else
                            obj.qtd_returns += 1
                    }
                    return obj
                },{qtd_consultations:0,qtd_returns:0})
            },

            consultationsOfSchedules(schedules){
                let consultations = [];
                schedules.forEach((schedule)=>{
                    let keys = Object.keys(schedule.days);
                    let dates = this.datesOfInterval({weekDays:keys/* ,cancelations_schedules:schedule.cancelations_schedules */});

                    dates.forEach((date)=>{
                        let hourConsultation = schedule.days[moment(date).weekday()].hour;
                        if(schedule.cancelations_schedules.indexOf(date) == -1 && schedule.cancelations_schedules.indexOf(date + ' ' +hourConsultation) == -1){
                            let scheduleObj = {
                                clinic: schedule.clinic,
                                doctor: schedule.doctor,
                                date: date + ' ' + hourConsultation,
                                routine_id : schedule.routine_id,
                                specialty: schedule.specialty,
                                vacancy: schedule.days[moment(date).weekday()].vacancy,
                                id_schedule: schedule.id,

                            };
                            let obj = {...scheduleObj,...this.numberVacancyAndReturns(scheduleObj)}
                            obj.vacancy = obj.vacancy - obj.qtd_consultations - obj.qtd_returns
                            consultations.push(obj)
                        }
                    })
                });
                return consultations
            },
            formatDate(date) {
                if (!date) return null;
                const [year, month, day] = date.split("-");
                return `${day}/${month}/${year}`;
            },
            scheduleAppointment(consultation) {
                if (!this.selectedPatient) {
                    this.$refs.patientCard.$el.classList.add("shaking-ease-anim");
                    setTimeout(() => {
                        this.$refs.patientCard.$el.classList.remove("shaking-ease-anim");
                    }, 1000);
                    return;
                }
                this.exam = undefined;
                this.fillConsultationForm(consultation);
                this.dialog = true;
            },

            async fillConsultationForm(consultation) {
                this.selectedForm = {
                    user: this.selectedPatient,
                    consultation: consultation
                };

                this.thereIsPaymentNumber();
                this.createConsultationForm = this.selectedForm;
            },

            specialtyCost() {
                let espArray = Object.values(this.$store.getters.specialties);
                let cost = undefined;
                espArray.forEach(specialty => {
                    if (specialty.name === this.selectedForm.consultation.specialty.name && specialty.doctors) {
                        specialty.doctors.forEach(doctor => {
                            if (doctor.cpf === this.selectedForm.consultation.doctor.cpf) {
                                cost = {
                                    cost: doctor.cost,
                                    price: doctor.price,
                                    doctorConsultation: doctor
                                };
                                return cost
                            }
                        });
                    }
                });
                return cost
            },

            async thereIsPaymentNumber() {
                this.payment_numberFound = undefined;
                this.numberReceipt = "";
                this.status = "Aguardando pagamento";

                this.loaderPaymentNumber = true;

                this.$store.dispatch("thereIsIntakes", {
                    user: this.selectedForm.user,
                    doctor: this.selectedForm.consultation.doctor,
                    specialty: this.selectedForm.consultation.specialty,
                    exam:this.exam
                })
                    .then(obj => {
                        this.payment_numberFound = obj;
                        this.numberReceipt = obj.payment_number;
                        this.exam = obj.exam ?{ ... obj.exam,notFindPayment:true}:undefined;
                        this.status = "Pago";
                        this.loaderPaymentNumber = false
                    })
                    .catch(response => {
                        let cost = this.specialtyCost();
                        console.log(cost);
                        if (cost && cost.price === 0) {
                            this.status = "Pago";
                            this.loaderPaymentNumber = false
                        }
                        this.loaderPaymentNumber = false
                    });

            },

            consultationsByDate(consultations) {
                let res = {};
                consultations.sort((a,b)=>{
                    return a.date > b.date ? 1 : a.date < b.date ? -1 : 0
                });
                for (let cons in consultations) {
                    let targetDate = consultations[cons].date.split(" ")[0];
                    if (!res[targetDate]) {
                        res[targetDate] = [];
                    }
                    res[targetDate].push(consultations[cons]);
                }
                return res;
            },

            async initialConfig() {
                this.loading = true;
                await this.listenConsultations();
                this.loading = false;
            },

            async listenConsultations() {
                this.consultationsListenerUnsubscriber = await this.$store.dispatch(
                    "getSchedules",
                    {
                        start_date: moment()
                            .subtract(5, "hours")
                            .format("YYYY-MM-DD HH:mm:ss"),
                        final_date: moment()
                            .add(this.daysToListen, "days")
                            .format("YYYY-MM-DD 23:59:59")
                    }
                );
            },

            async listenMoreConsultations() {
                if (this.consultationsListenerUnsubscriber) {
                    this.consultationsListenerUnsubscriber();
                }
                this.daysToListen += 3;
                this.listenConsultations();
            },

            backTop() {
                this.$vuetify.goTo(0, this.options);
                this.date = this.consultas[0].date;
            },

            handleScroll() {
                this.scrollPos = window.scrollY;
                let winHeight = window.innerHeight;
                let docHeight = document.documentElement.scrollHeight;
                this.offsetTop = (100 * this.scrollPos) / (docHeight - winHeight);
            },

            allowedDates(val) {
                return (
                    Object.keys(this.consultationsByDate(this.consultas)).indexOf(val) !== -1
                );
            },

            dayDate(date) {
                let dateMoment = moment(date);
                return this.semanaOptions[dateMoment.day()];
            },

            resetSchedule() {
                this.dialog = false;
                this.success = false;
            },

            async finalizeSaveConsultation() {
                let form = this.createConsultationForm;
                form.user = {
                    ...form.user,
                    status: this.status,
                    type: this.modalidade,
                    payment_number: this.numberReceipt,
                    exam:this.exam
                };
                form.consultation = {
                    ...form.consultation,
                    status: this.status,
                    type: this.modalidade,
                    payment_number: this.numberReceipt,
                    exam:this.exam
                };

                if (this.payment_numberFound)
                    form = {...form, payment_numberFound: this.payment_numberFound};
                if (form.user.dependent)
                    form.consultation = {
                        ...form.consultation,
                        dependent: form.user.dependent
                    };
                // return
                this.loading = true;
                //await this.$store.dispatch("addConsultationAppointmentToUser", form);
                //Realizar essa funcao pelo cloud functions
                await this.$store.dispatch("addUserToConsultation", form);
                this.scheduleLoading = false;
                this.success = true;
                this.dependent = undefined;
            },

            async save() {
                this.scheduleLoading = true;
                this.finalizeSaveConsultation()
            }
        }
    };
</script>
