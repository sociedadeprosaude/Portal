import firebase, { firestore } from "firebase";
import moment from 'moment'
import axios from 'axios'
import Vue from 'vue'
import functions from "../../utils/functions";

let cloudFunctionInstance = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? 'https://us-central1-prosaude-36f66.cloudfunctions.net/'
        : 'https://us-central1-prosaudedev.cloudfunctions.net/',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
});

const state = {
    medicines: [],
    cids: [],
    consultations: [],
    schedules: [],
    consultationsCanceled: [],
    consultationsByDate: {},
    consultationsCreationInfo: {
    },
    consultationsDeletionInfo: {
        // removed: 2,
        // total: 300,
        // day: '2020-03-23'
    },
    loaded: false,
    loading: false
};

const mutations = {
    setConsultations(state, payload) {
        state.consultations = payload;
        state.loaded = true
    },
    setSchedules(state, payload) {
        state.schedules = payload;
        state.loaded = true
    },
    setMedicines(state, payload) {
        state.medicines = payload
    },
    setCids(state, payload) {
        state.cids = payload
    },
    setConsultationsCanceled(state, payload) {
        state.consultationsCanceled = payload
    },
    setConsultationsLoaded(state, payload) {
        state.loaded = payload
    },
    setConsultationCreationTotalDays(state, payload) {
        state.consultationsCreationInfo.total = payload
    },
    setConsultationCreationDaysCreated(state, payload) {
        Vue.set(state.consultationsCreationInfo, 'created', payload)
        // state.consultationsCreationInfo.created = payload
    },
    setConsultationCreationActualDay(state, payload) {
        Vue.set(state.consultationsCreationInfo, 'day', payload)
        // state.consultationsCreationInfo.day = payload
    },
    setConsultationDeletionInfo(state, payload) {
        state.consultationsDeletionInfo = payload
    },
    setConsultationLoading(state, payload) {
        state.loading = payload
    }
    // setConsultationsByDate(state, payload) {
    //     state.consultationsByDate = payload
    // },
};

const actions = {

    async listenConsultations({ commit }, payload) {
        try {
            commit('setConsultationsLoaded', false);
            let consultations = [];
            let query = firebase.firestore().collection('consultations')
                .where('date', '>=', payload.start_date);
            if (payload.final_date) {
                query = query.where('date', '<=', payload.final_date)
            }
            if (payload.doctor) {
                query = query.where('doctor.cpf', '==', payload.doctor.cpf)
            }
            if (payload.specialty) {
                query = query.where('specialty.name', '==', payload.specialty.name)
            }

            if (payload.clinic) {
                query = query.where('clinic.name', '==', payload.clinic.name)
            }
            commit('setConsultationLoading', true);
            return query.onSnapshot((querySnapshot) => {
                consultations = [];
                querySnapshot.forEach((document) => {
                    consultations.push({
                        ...document.data(),
                        id: document.id
                    })
                });
                commit('setConsultations', consultations);
                commit('setConsultationLoading', false)
            })
        } catch (e) {
            throw e
        }
    },

    async getSchedules({ commit,dispatch }, payload) {
        try {
            commit('setConsultationsLoaded', false);
            let schedules = [];
            let start_date = moment(payload.start_date)
            let final_date = moment(payload.final_date)
            let weekStart = start_date.year().toString() + start_date.week().toString()
            let weekFinal = final_date.year().toString() + final_date.week().toString()
            let query = firebase.firestore().collection('schedules')

            if (payload.doctor) {
                query = query.where('doctor.cpf', '==', payload.doctor.cpf)
            }
            if (payload.specialty) {
                query = query.where('specialty.name', '==', payload.specialty.name)
            }

            if (payload.clinic) {
                query = query.where('clinic.name', '==', payload.clinic.name)
            }
            commit('setConsultationLoading', true);
            dispatch('listenConsultations',payload)
            return query.onSnapshot((querySnapshot) => {
                schedules = []
                querySnapshot.forEach((schedule) => {
                    let data = schedule.data()
                    let cancelations_schedules = data.cancelations_schedules ? functions.datesOfInterval(data.cancelations_schedules) : []
                    schedules.push({
                        clinic: data.clinic,
                        doctor: data.doctor,
                        days:data.days,
                        routine_id : data.routine_id,
                        specialty: data.specialty,
                        cancelations_schedules : cancelations_schedules,
                        id: schedule.id
                    })
                });
                commit('setSchedules', schedules);
                commit('setConsultationLoading', false)
            })
        } catch (e) {
            throw e
        }
    },

    async getConsultationsCanceled({ commit }) {//pegar todas as consultas deletadas pela clinica
        try {
            let canceledSnap = await firebase.firestore().collection('canceled').orderBy('date', 'asc')
                .onSnapshot((querySnapshot) => {
                    let consultationsCanceled = [];
                    querySnapshot.forEach((document) => {
                        consultationsCanceled.push({
                            ...document.data(),
                            id: document.id
                        })
                    });
                    commit('setConsultationsCanceled', consultationsCanceled)
                })
            /*.get()
        let consultationsCanceled = []
        canceledSnap.forEach(function (document) {
            //console.log(document.data())
            consultationsCanceled.push({
                ...document.data(),
                id: document.id
            })
        })
        console.log(consultationsCanceled)
        commit('setConsultationsCanceled', consultationsCanceled)
        return consultationsCanceled
             */
        } catch (e) {
            throw e
        }
    },

    async createConsultation({ commit, dispatch }, consultation) {
        consultation = functions.removeUndefineds(consultation);
        delete consultation.doctor.clinics;
        delete consultation.doctor.specialties;
        delete consultation.specialty.doctors;
        let days = functions.makeWeekSchedule( consultation.weekDays,consultation.vacancy,consultation.hour )
        let routineId = moment().valueOf();
        let consultObject
        var scheduleFound = await firebase.firestore().collection('schedules')
                 .where('clinic.name','==',consultation.clinic.name)
                 .where('doctor.cpf','==',consultation.doctor.cpf)
                 .where('specialty.name','==',consultation.specialty.name) 
                 .get()
            if(scheduleFound.empty){
                consultObject = {
                    specialty: consultation.specialty,days: days,routine_id: routineId,
                    clinic: consultation.clinic,doctor: consultation.doctor,
                };
                await firebase.firestore().collection('schedules').add(consultObject)
            }else{
                scheduleFound.forEach(async (doc)=>{
                    let data  = doc.data()
                    consultation.weekDays.forEach((day)=>{
                        if(data.days[day])
                            data.days[day].vacancy = Number(data.days[day].vacancy) + Number(consultation.vacancy)
                        else
                            data.days[day].vacancy = Number(consultation.vacancy)
                    })
                    await firebase.firestore().collection('schedules').doc(doc.id).update(data)
                })
            }
    },

    /* if(data.days[day]){
        let obj = {vacancy:consultation.vacancy,hour:consultation.hour}
        if(Array.isArray(data.days[day]))
          
        data.days[day] = Array.isArray(data.days[day]) ? data.days[day].push(obj) : [data.days[day],obj]
    }
    else
        data.days[day].vacancy = Number(consultation.vacancy) */

    async addConsultationAppointmentToUser({ commit }, payload) {
        try {
            let copyPayload = Object.assign({}, payload);
            functions.removeUndefineds(copyPayload);
            await firebase.firestore().collection('users').doc(copyPayload.user.cpf).collection('consultations').doc(copyPayload.consultation.id).set(copyPayload.consultation);
            if (copyPayload.consultation.type === "Retorno") {
                await firebase.firestore().collection('users').doc(copyPayload.user.cpf).collection('consultations').doc(copyPayload.consultation.previousConsultation).update({ regress: copyPayload.consultation.id })
                let procedure = await firebase.firestore().collection('users').doc(copyPayload.user.cpf).collection('procedures').where('type','==','Consultation')
                .where('consultation','==',copyPayload.consultation.previousConsultation).get()
                procedure.forEach(doc=>{
                    console.log('Procedure retorno',doc.id)
                    firebase.firestore().collection('users').doc(copyPayload.user.cpf).collection('procedures').doc(doc.id)
                    .update({
                        status: firebase.firestore.FieldValue.arrayUnion('Retorno agendado'),
                    })
                })

            } else if (copyPayload.payment_numberFound) {
                firebase.firestore().collection('users').doc(copyPayload.user.cpf).collection('procedures').doc(copyPayload.payment_numberFound.procedureId)
                    .update({
                        status: firebase.firestore.FieldValue.arrayUnion('Agendado'),
                        consultation: copyPayload.consultation.id,
                    })
            } else {
                //Não havendo encontrado um recibo, há a necessidade adicionar uma nova procedure para quando pagar, criar um intake e atualizar o procedure adicionando Consulta paga no array do status
                console.log("Criando procedure");
                //let status = payload.consultation.exam ? 'Consulta Paga' : 'Exame Pago'

                let obj = {
                    status: ['Agendado'],
                    startAt: moment().format('YYYY-MM-DD hh:ss'),
                    consultation: copyPayload.consultation.id,
                    specialty: copyPayload.consultation.specialty.name
                };
                if (copyPayload.consultation.exam) {
                    obj.type = 'Exam';
                    obj.exam = copyPayload.consultation.exam
                }
                else
                    obj.type = 'Consultation';

                firebase.firestore().collection('users').doc(copyPayload.user.cpf).collection('procedures').add(obj)
            }
        } catch (e) {
            throw e
        }
    },

    async addUserToConsultation(context, payload) {

        try {
            let copyPayload = Object.assign({}, payload);
            functions.removeUndefineds(copyPayload);
            let id_schedule = copyPayload.consultation.id_schedule
            /* let vacancy = copyPayload.consultation.vacancy
            let qtd_returns = copyPayload.consultation.qtd_returns ? copyPayload.consultation.qtd_returns : 0
            let qtd_consultations = copyPayload.consultation.qtd_consultations ? copyPayload.consultation.qtd_consultations : 0 */
            delete copyPayload.consultation.id
            delete copyPayload.consultation.vacancy
            delete copyPayload.consultation.qtd_consultations
            delete copyPayload.consultation.qtd_returns
            copyPayload.consultation.id_schedule = id_schedule
            let obj = {
                ...copyPayload.consultation,
                user: copyPayload.user
            }

           /*  let objUpdateSchedule = copyPayload.consultation.type == "Retorno" ? { qtd_returns: Number(qtd_returns) + 1 } : { qtd_consultations: Number(qtd_consultations) + 1 }
            objUpdateSchedule.vacancy = Number(vacancy - 1) */
            //await firebase.firestore().collection('schedules').doc(idSchedule).update(objUpdateSchedule);
            let resp = await firebase.firestore().collection('consultations').add(obj);
            if (copyPayload.consultation.type == "Retorno") {
                await firebase.firestore().collection('consultations').doc(copyPayload.consultation.previousConsultation).update({ regress: resp.id })
            }
            copyPayload.consultation.id = resp.id
            await context.dispatch('addConsultationAppointmentToUser', { ...copyPayload })

            return (await firebase.firestore().collection('consultations').doc(resp.id).get()).data()
        } catch (e) {
            throw e
        }
    },

    async addUserToConsultationReschedule(context, payload) {
        try {
            let copyPayload = Object.assign({}, payload);
            console.log('reschedule', copyPayload)
            functions.removeUndefineds(copyPayload);
            let id_schedule = copyPayload.consultation.id_schedule
            /* let vacancy = copyPayload.consultation.vacancy
            let qtd_returns = copyPayload.consultation.qtd_returns ? copyPayload.consultation.qtd_returns : 0
            let qtd_consultations = copyPayload.consultation.qtd_consultations ? copyPayload.consultation.qtd_consultations : 0 */
            let idConsultationCanceled = copyPayload.consultation.idConsultationCanceled
            delete copyPayload.consultation.id
            delete copyPayload.consultation.vacancy
            delete copyPayload.idConsultationCanceled
            delete copyPayload.consultation.qtd_consultations
            delete copyPayload.consultation.qtd_returns
            copyPayload.consultation.id_schedule = id_schedule
            let obj = {
                ...copyPayload.consultation,
                user: copyPayload.user
            }

            /* let objUpdateSchedule = copyPayload.consultation.type == "Retorno" ? { qtd_returns: Number(qtd_returns) + 1 } : { qtd_consultations: Number(qtd_consultations) + 1 }
            objUpdateSchedule.vacancy = Number(vacancy - 1)
            await firebase.firestore().collection('schedules').doc(idSchedule).update(objUpdateSchedule); */

            if (copyPayload.consultation.type == "Retorno")
                obj.previousConsultation = copyPayload.consultation.previousConsultation;
            let resp = await firebase.firestore().collection('consultations').add(obj);
            await firebase.firestore().collection('canceled').doc(idConsultationCanceled).delete();

            if (copyPayload.consultation.type == "Retorno") {
                await firebase.firestore().collection('consultations').doc(copyPayload.consultation.previousConsultation).update({ regress: resp.id })
            }
            copyPayload.consultation.id = resp.id
            await context.dispatch('addConsultationAppointmentToUserReschedule', { ...copyPayload })

            return (await firebase.firestore().collection('consultations').doc(resp.id).get()).data()

        } catch (e) {
            throw e
        }
    },

    async addConsultationAppointmentToUserReschedule({ commit }, payload) {
        try {
            let copyPayload = Object.assign({}, payload);
            console.log('reschedule2', copyPayload)
            functions.removeUndefineds(copyPayload);
            await firebase.firestore().collection('users').doc(copyPayload.user.cpf).collection('consultations').doc(copyPayload.consultation.id).set(copyPayload.consultation);
            if (copyPayload.consultation.type === "Retorno") {
                await firebase.firestore().collection('users').doc(copyPayload.user.cpf).collection('consultations').doc(copyPayload.consultation.previousConsultation).update({ regress: copyPayload.consultation.id })
            }

        } catch (e) {
            throw e
        }
    },

    async updateAppointment({ commit }, payload) { //atualizarConsulta
        //console.log(payload)
        try {
            let obj = {
                payment_number: payload.payment_number,
                status: payload.status
            };
            await firebase.firestore().collection('consultations').doc(payload.idConsultation).update(obj);
            await firebase.firestore().collection('users').doc(payload.idPatient).collection('consultations').doc(payload.idConsultation)
                .update(obj)
        } catch (e) {
            throw e
        }
    },

    async SearchCosultation({ commit }) {
        try {
            firebase.firestore().collection('consultations').doc()
        } catch (e) {
            throw e
        }
    },

    async eraseAppointment({ commit }, payload) { // apagarConsulta
        try {
            console.log(payload.consultation);
            functions.removeUndefineds(payload);
            let FieldValue = firebase.firestore.FieldValue;
            await firebase.firestore().collection('consultations').doc(payload.idConsultation).update({
                user: FieldValue.delete()
            });
            await firebase.firestore().collection('users').doc(payload.idPatient).collection('consultations').doc(payload.idConsultation).update({ status: 'Cancelado' })

            //Para consultas que são do tipo Retorno
            if (payload.type === 'Retorno') {
                //console.log('É um retorno')
                await firebase.firestore().collection('consultations').doc(payload.previousConsultation).update({
                    regress: FieldValue.delete()
                });
                await firebase.firestore().collection('users').doc(payload.idPatient).collection('consultations').doc(payload.previousConsultation).update({
                    regress: FieldValue.delete()
                })
            }

            firebase.firestore().collection('users').doc(payload.idPatient).collection('procedures')
                .where('consultation', '==', payload.idConsultation).get()
                .then((procedure) => {
                    procedure.forEach((doc) => {
                        let data = doc.data();

                        if (payload.type === "Consulta" && payload.payment_number !== "") {
                            let thereIsExam = payload.consultation.exam ? payload.consultation.exam : payload.consultation.user && payload.consultation.user.exam ? payload.consultation.user.exam : undefined
                            let status = thereIsExam ? 'Exame Pago' : 'Consulta Paga';
                            let type = thereIsExam ? 'Exam' : 'Consultation';
                            let obj = {
                                status: [status],
                                payment_number: data.payment_number,
                                startAt: data.startAt,
                                type: type,
                                specialty: data.specialty
                            };

                            if (thereIsExam)
                                obj = { ...obj, exam: thereIsExam };
                            firebase.firestore().collection('users').doc(payload.idPatient).collection('procedures').add(
                                { ...obj }
                            )
                        }

                        firebase.firestore().collection('users').doc(payload.idPatient).collection('procedures').doc(doc.id).delete()
                        data.status.push('Cancelado');
                        firebase.firestore().collection('users').doc(payload.idPatient).collection('proceduresFinished').doc(doc.id)
                            .set(data);
                        return;
                    })
                });



            //Para consultas do tipo Consulta e possuem um retorno associado. É necessário remover o agendamento do retorno associado
            if (payload.regress != undefined) {

                //console.log('É uma consulta e possui um retorno')

                await firebase.firestore().collection('consultations').doc(payload.regress).update({
                    user: FieldValue.delete(),
                    previousConsultation: FieldValue.delete()
                });
                await firebase.firestore().collection('users').doc(payload.idPatient).collection('consultations').doc(payload.regress).update({ status: 'Cancelado' })

            }

        } catch (e) {
            throw e
        }
    },

    async removeAppointmentForever({ commit }, payload) {//apagar consulta de cancelados para semopre.
        //console.log(payload.idConsultation)
        try {
            firebase.firestore().collection('canceled').doc(payload.idConsultation).delete()
        } catch (e) {
            throw e
        }
    },

    async addArrayCallsToConsultation({ commit }, payload) {
        /*console.log("vector:", payload)*/
        try {
            firebase.firestore().collection('canceled').doc(payload.idConsultation).update({ calls: payload.calls })
        } catch (e) {
            throw e
        }
    },

    async addArrayOfMedicinesToBanc({ commit }, payload) {
        console.log("banco:", payload.medicines)
        try {
            firebase.firestore().collection('medicines').doc('sus').set({ medicines: payload.medicines })
        } catch (e) {
            throw e
        }
    },

    async getMedicines ({commit}) {
        firebase.firestore().collection('medicines').onSnapshot(async function (clinicsSnap) {
            let medicines = [];
            clinicsSnap.forEach(function (document) {
                medicines.push({
                    //.medicines
                    ...document.data().medicines
                });
            });
            commit('setMedicines', medicines);
        })
    },
    async addArrayOfCidsToBanc({ commit }, payload) {
        console.log("banco:", payload.cids)
        try {
            firebase.firestore().collection('cids').doc('cids').set({ cids: payload.cids })
        } catch (e) {
            throw e
        }
    },

    async getCids ({commit}) {
        firebase.firestore().collection('cids').onSnapshot(async function (clinicsSnap) {
            let cids = [];
            clinicsSnap.forEach(function (document) {
                cids.push({
                    //.medicines
                    ...document.data().cids
                });
            });
            commit('setCids', cids);
        })
    },

    async removeAppointments({ commit }, consultations) {
        for (let consultation in consultations) {
            commit('setConsultationDeletionInfo', {
                total: consultations.length,
                day: consultations[consultation].date,
                removed: consultation
            });
            await firebase.firestore().collection('consultations').doc(consultations[consultation].id).delete();
            if (consultations[consultation].user) {
                await firebase.firestore().collection('users').doc(consultations[consultation].user.cpf).collection('consultations').doc(consultations[consultation].id).delete();
                await firebase.firestore().collection('canceled').doc(consultations[consultation].id).set(consultations[consultation])
            }
        }
        commit('setConsultationDeletionInfo', {})
    },

    async removeScheduleByDay(context,payload){
        let schedule = await firebase.firestore().collection('schedules')
            .where('specialty.name', "==", payload.specialty.name).where('doctor.cpf', "==", payload.doctor.cpf).get()
        schedule.forEach((doc)=>{
            let data = doc.data()
            let cancelations_schedules = data.cancelations_schedules ? data.cancelations_schedules : []
            let obj = {start_date:payload.start_date,final_date:payload.final_date}
            if(payload.hour)
                obj.hour = payload.hour
            if(payload.weekDays)
                obj.week_days = payload.weekDays  
            cancelations_schedules.push({...obj})
            firebase.firestore().collection('schedules').doc(doc.id).update({cancelations_schedules:cancelations_schedules})
        })
    },

    async removeAppointmentByDay(context, payload) { // ApagarTodasAsConsultasDoDiaDoMedico

        let start = moment(payload.start_date, 'YYYY-MM-DD').format('YYYY-MM-DD 00:00');
        let end = moment(payload.final_date, 'YYYY-MM-DD').format('YYYY-MM-DD 23:59');
        payload = functions.removeUndefineds(payload);
        try {
            let snapshot = await firebase.firestore().collection('consultations')
                .where('specialty.name', "==", payload.specialty.name).where('doctor.cpf', "==", payload.doctor.cpf)
                .where('date', ">=", start).where('date', "<=", end).get();
            snapshot.forEach(async doc => {

                let dateConsultation = moment(doc.data().date);
                let filterHour = payload.hour ? doc.data().date.split(' ')[1] === payload.hour ? true : false : true
                let filterDayWeek = payload.weekDays ? payload.weekDays.indexOf(dateConsultation.weekday()) > -1 ? true : false : true

                if (filterHour && filterDayWeek){
                    firebase.firestore().collection('consultations').doc(doc.id).delete();
                }
                if (filterHour && filterDayWeek && doc.data().user) {
                    firebase.firestore().collection('users').doc(doc.data().user.cpf).collection('consultations').doc(doc.id).delete();
                    firebase.firestore().collection('canceled').doc(doc.id).set(doc.data())
                }
            })

            await context.dispatch('removeScheduleByDay',payload)
        } catch (e) {
            throw e
        }
        return
    },
    setConsultationHour({ commit }, payload) {
        return new Promise((resolve, reject) => {
            firebase.firestore().collection('consultations').doc(payload.consultation).get()
                .then((doc) => {
                    if (!doc.data().consultationHour) {
                        firebase.firestore().collection('consultations').doc(payload.consultation).update({ consultationHour: payload });
                        firebase.firestore().collection('users').doc(payload.patient).collection('consultations').doc(payload.consultation).update({ consultationHour: payload });
                        reject('Não tem!')
                        //console.log('Não tem!')
                    } else {
                        //console.log('Tem sim!',doc.data())
                        resolve(doc.data().consultationHour)
                    }
                })
        })

    },
    //======================================================atendimento===============================
    async addProntuarioToConsultation({ commit }, payload) {
        firebase.firestore().collection('users').doc(payload.patient).collection('consultations').doc(payload.consultation).update({ prontuario: payload.prontuario })
    },
    async addReceitaToConsultation({ commit }, payload) {
        firebase.firestore().collection('users').doc(payload.patient).collection('consultations').doc(payload.consultation).update({ receita: payload.receita })
    },
    async addSolicitacaoToConsultation({ commit }, payload) {
        payload = functions.removeUndefineds(payload);
        firebase.firestore().collection('users').doc(payload.patient).collection('consultations').doc(payload.consultation).update({ solicitacao: payload.solicitacao })
    },
    async addLaudoToConsultation({ commit }, payload) {
        //console.log(payload)
        firebase.firestore().collection('users').doc(payload.patient).collection('consultations').doc(payload.consultation).update({ laudo: payload.laudo })
    },
    async addAtestadoToConsultation({ commit }, payload) {
        firebase.firestore().collection('users').doc(payload.patient).collection('consultations').doc(payload.consultation).update({ atestado: payload.atestado })
    },
    async addOrientacaoToConsultation({ commit }, payload) {
        //console.log(payload)
        firebase.firestore().collection('users').doc(payload.patient).collection('consultations').doc(payload.consultation).update({ orientacao: payload.orientacao })
    },
    async addTimesToConsultation({ commit }, payload) {
        firebase.firestore().collection('consultations').doc(payload.consultation).update({ start_at: payload.start });
        firebase.firestore().collection('consultations').doc(payload.consultation).update({ end_at: payload.end });
        firebase.firestore().collection('consultations').doc(payload.consultation).update({ duration: payload.durantion });
        firebase.firestore().collection('users').doc(payload.patient).collection('consultations').doc(payload.consultation).update({ start_at: payload.start });
        firebase.firestore().collection('users').doc(payload.patient).collection('consultations').doc(payload.consultation).update({ end_at: payload.end });
        firebase.firestore().collection('users').doc(payload.patient).collection('consultations').doc(payload.consultation).update({ duration: payload.durantion })
    }
    //======================================================atendimento===============================
};

const getters = {
    consultations(state) {
        return state.consultations
    },
    schedules(state) {
        return state.schedules
    },
    medicines(state) {
        return state.medicines
    },
    cids(state) {
        return state.cids
    },
    consultationsCanceled(state) {
        return state.consultationsCanceled
    },
    consultationsLoaded(state) {
        return state.loaded
    },
    consultationsCreationInfo(state) {
        return state.consultationsCreationInfo
    },
    consultationsDeletionInfo(state) {
        return state.consultationsDeletionInfo
    },
    consultationsLoading(state) {
        return state.loading
    }
    // consultationsByDate(state) {
    //     return state.consultationsByDate
    // },
};

export default {
    state,
    mutations,
    actions,
    getters
}
