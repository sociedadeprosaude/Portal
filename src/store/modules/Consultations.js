import firebase, {firestore} from "firebase";
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
    consultations: [],
    AllSchedules: [],
    schedules: [],
    consultationsCanceled: [],
    consultationsByDate: {},
    consultationsCreationInfo: {},
    consultationsDeletionInfo: {},
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
    setAllSchedules(state, payload) {
        state.AllSchedules = payload;
    },

    setConsultationsCanceled(state, payload) {
        state.consultationsCanceled = payload
    },
    setConsultationsLoaded(state, payload) {
        state.loaded = payload
    },

    setConsultationLoading(state, payload) {
        state.loading = payload
    }
};

const actions = {

    async listenConsultations({commit}, payload) {
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

    async getAllSchedules({commit}) {
        try {
            firebase.firestore().collection('schedules').onSnapshot(async function (AllSchedulesSnap) {
                let AllSchedules = [];
                AllSchedulesSnap.forEach(function (document) {
                    AllSchedules.push({
                        ...document.data(),
                        id: document.id
                    });
                });
                commit('setAllSchedules', AllSchedules);
            })
            return
        } catch (e) {
            throw e
        }
    },

    async getSchedules({commit, dispatch}, payload) {
        console.log('oi:', payload)
        try {
            commit('setConsultationsLoaded', false);
            let schedules = [];
            let start_date = moment(payload.start_date);
            let final_date = moment(payload.final_date);
            let weekStart = start_date.year().toString() + start_date.week().toString();
            let weekFinal = final_date.year().toString() + final_date.week().toString();
            let query = firebase.firestore().collection('schedules');

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
            dispatch('listenConsultations', payload);
            return query.onSnapshot((querySnapshot) => {
                schedules = [];
                querySnapshot.forEach((schedule) => {
                    let data = schedule.data();
                    let cancelations_schedules = data.cancelations_schedules ? functions.datesOfInterval(data.cancelations_schedules) : []
                    schedules.push({
                        clinic: data.clinic,
                        doctor: data.doctor,
                        days: data.days,
                        routine_id: data.routine_id,
                        specialty: data.specialty,
                        cancelations_schedules: cancelations_schedules,
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

    async getConsultationsCanceled({commit}) {//pegar todas as consultas deletadas pela clinica
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

        } catch (e) {
            throw e
        }
    },

    async createConsultation({commit, dispatch}, consultation) {
        consultation = functions.removeUndefineds(consultation);
        delete consultation.doctor.clinics;
        delete consultation.doctor.specialties;
        delete consultation.specialty.doctors;
        let days = functions.makeWeekSchedule(consultation.weekDays, consultation.vacancy, consultation.hour);
        let routineId = moment().valueOf();
        let consultObject;
        let scheduleFound = await firebase.firestore().collection('schedules')
            .where('clinic.name', '==', consultation.clinic.name)
            .where('doctor.cpf', '==', consultation.doctor.cpf)
            .where('specialty.name', '==', consultation.specialty.name)
            .get();
        if (scheduleFound.empty) {
            consultObject = {
                specialty: consultation.specialty, days: days, routine_id: routineId,
                clinic: consultation.clinic, doctor: consultation.doctor,
            };
            await firebase.firestore().collection('schedules').add(consultObject)
        } else {
            scheduleFound.forEach(async (doc) => {
                let data = doc.data()
                consultation.weekDays.forEach((day) => {
                    if (data.days[day])
                        data.days[day].vacancy = Number(data.days[day].vacancy) + Number(consultation.vacancy)
                    else {
                        data.days[day] = {vacancy: Number(consultation.vacancy), hour: consultation.hour}
                    }
                })
                await firebase.firestore().collection('schedules').doc(doc.id).update(data)
            })
        }
    },


    /* async addConsultationAppointmentToUser({commit}, payload) {
        try {
            let copyPayload = Object.assign({}, payload);
            functions.removeUndefineds(copyPayload);
            await firebase.firestore().collection('users').doc(copyPayload.user.cpf).collection('consultations').doc(copyPayload.consultation.id).set(copyPayload.consultation);
            if (copyPayload.consultation.type === "Retorno") {
                await firebase.firestore().collection('users').doc(copyPayload.user.cpf).collection('consultations').doc(copyPayload.consultation.previousConsultation).update({regress: copyPayload.consultation.id})
                let procedure = await firebase.firestore().collection('users').doc(copyPayload.user.cpf).collection('procedures').where('type', '==', 'Consultation')
                    .where('consultation', '==', copyPayload.consultation.previousConsultation).get()
                procedure.forEach(doc => {

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

                let obj = {
                    status: ['Agendado'],
                    startAt: moment().format('YYYY-MM-DD hh:ss'),
                    consultation: copyPayload.consultation.id,
                    specialty: copyPayload.consultation.specialty.name
                };
                if (copyPayload.consultation.exam) {
                    obj.type = 'Exam';
                    obj.exam = copyPayload.consultation.exam
                } else
                    obj.type = 'Consultation';

                firebase.firestore().collection('users').doc(copyPayload.user.cpf).collection('procedures').add(obj)
            }
        } catch (e) {
            throw e
        }
    }, */

    async addUserToConsultation(context, payload) {

        try {
            let copyPayload = Object.assign({}, payload);
            functions.removeUndefineds(copyPayload);
            let id_schedule = copyPayload.consultation.id_schedule
            delete copyPayload.consultation.id
            delete copyPayload.consultation.vacancy
            delete copyPayload.consultation.qtd_consultations
            delete copyPayload.consultation.qtd_returns
            copyPayload.consultation.id_schedule = id_schedule
            console.log('kjbkj', copyPayload)
            var appointmentFunction = firebase.functions().httpsCallable('addUserToConsultation');
            var response = await appointmentFunction({payload: {...copyPayload}})
            
            
        } catch (e) {
            throw e
        }
    },

    async addUserToConsultationReschedule(context, payload) {
        try {
            let copyPayload = Object.assign({}, payload);
            functions.removeUndefineds(copyPayload);
            let id_schedule = copyPayload.consultation.id_schedule;
            let idConsultationCanceled = copyPayload.consultation.idConsultationCanceled
            delete copyPayload.consultation.id;
            delete copyPayload.consultation.vacancy;
            delete copyPayload.idConsultationCanceled;
            delete copyPayload.consultation.qtd_consultations;
            delete copyPayload.consultation.qtd_returns;
            copyPayload.consultation.id_schedule = id_schedule;
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
                await firebase.firestore().collection('consultations').doc(copyPayload.consultation.previousConsultation).update({regress: resp.id})
            }
            copyPayload.consultation.id = resp.id
            await context.dispatch('addConsultationAppointmentToUserReschedule', {...copyPayload})

            return (await firebase.firestore().collection('consultations').doc(resp.id).get()).data()

        } catch (e) {
            throw e
        }
    },

    async addConsultationAppointmentToUserReschedule({commit}, payload) {
        try {
            let copyPayload = Object.assign({}, payload);
            functions.removeUndefineds(copyPayload);
            await firebase.firestore().collection('users').doc(copyPayload.user.cpf).collection('consultations').doc(copyPayload.consultation.id).set(copyPayload.consultation);
            if (copyPayload.consultation.type === "Retorno") {
                await firebase.firestore().collection('users').doc(copyPayload.user.cpf).collection('consultations').doc(copyPayload.consultation.previousConsultation).update({regress: copyPayload.consultation.id})
            }

        } catch (e) {
            throw e
        }
    },


    async SearchCosultation({commit}) {
        try {
            firebase.firestore().collection('consultations').doc()
        } catch (e) {
            throw e
        }
    },

    async eraseAppointment({commit}, payload) { // apagarConsulta
        try {

            functions.removeUndefineds(payload);
            var cancelAppointment = firebase.functions().httpsCallable('cancelAppointment');
            var response = await cancelAppointment({payload: payload})

        } catch (e) {
            throw e
        }
    },

    async removeAppointmentForever({commit}, payload) {

        try {
            firebase.firestore().collection('canceled').doc(payload.idConsultation).delete()
        } catch (e) {
            throw e
        }
    },

    async deleteAllSchedule({commit}, payload) {
        functions.removeUndefineds(payload);
        let schedule = await firebase.firestore().collection('schedules')
            .where('specialty.name', '==', payload.specialty.name)
            .where('doctor.cpf', '==', payload.doctor.cpf)
            .where('clinic.cnpj', '==', payload.clinic.cnpj)
            .get();

        if (!schedule.empty) {
            schedule.forEach((snap) => {
                firebase.firestore().collection('schedules').doc(snap.id).delete()
            })
        }

    },

    async updateCanceledSchedules ({commit},payload) {
        functions.removeUndefineds(payload)
        if(payload.cancelations_schedules){
            firebase.firestore().collection('schedules').doc(payload.id).update({cancelations_schedules: payload.cancelations_schedules})
        } else {
            firebase.firestore().collection('schedules').doc(payload.id).set(payload.schedule)
        }
    },

    async copyCanceledSchedules ({commit},payload) {
        functions.removeUndefineds(payload)
        let copy = {
            cancelations_schedules: payload.cancelations_schedules,
            id: payload.schedule.id,
            clinic: payload.schedule.clinic,
            days: payload.schedule.days,
            doctor: payload.schedule.doctor,
            routine_id: payload.schedule.routine_id,
            specialty: payload.schedule.specialty,
        }
        firebase.firestore().collection('historyOfCanceledSchedules').add(copy)
    },

    async removeAppointmentByDay(context, payload) {
        try {
            let deleteScheduleByDay = firebase.functions().httpsCallable('deleteScheduleByDay');
            await deleteScheduleByDay({payload: payload})
        } catch (e) {
            throw e
        }
        return
    },

    setConsultationHour({commit}, payload) {
        return new Promise((resolve, reject) => {
            firebase.firestore().collection('consultations').doc(payload.consultation).get()
                .then((doc) => {
                    if (!doc.data().consultationHour) {
                        firebase.firestore().collection('consultations').doc(payload.consultation).update({consultationHour: payload});
                        firebase.firestore().collection('users').doc(payload.patient).collection('consultations').doc(payload.consultation).update({consultationHour: payload});
                        reject('Não tem!')

                    } else {

                        resolve(doc.data().consultationHour)
                    }
                })
        })

    },

};

const getters = {
    consultations(state) {
        return state.consultations
    },
    schedules(state) {
        return state.schedules
    },
    AllSchedules(state) {
        return state.AllSchedules
    },

    consultationsCanceled(state) {
        return state.consultationsCanceled
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
};

export default {
    state,
    mutations,
    actions,
    getters
}
