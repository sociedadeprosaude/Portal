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
            await firebase.firestore().collection('schedules').add(consultObject);
            let idFound = await firebase.firestore().collection('schedules')
                .where('clinic.name', '==', consultation.clinic.name)
                .where('doctor.cpf', '==', consultation.doctor.cpf)
                .where('specialty.name', '==', consultation.specialty.name)
                .get();
            idFound.forEach(async (doc) => {
                await firebase.firestore().collection('users').doc(consultation.doctor.cpf)
                    .collection('specialties').doc(consultation.specialty.name)
                    .collection('clinics').doc(consultation.clinic.name)
                    .collection('schedules').doc(doc.id).set(consultObject);
                await firebase.firestore().collection('specialties').doc(consultation.specialty.name).update({
                    "status" : "ACTIVATE"
                });
                await firebase.firestore().collection('users').doc(consultation.doctor.cpf).update({
                    "status" : "ACTIVATE"
                });
            });

        } else {
            scheduleFound.forEach(async (doc) => {
                let data = doc.data();
                consultation.weekDays.forEach((day) => {
                    if (data.days[day])
                        data.days[day].vacancy = Number(data.days[day].vacancy) + Number(consultation.vacancy);
                    else {
                        data.days[day] = {vacancy: Number(consultation.vacancy), hour: consultation.hour}
                    }
                });
                await firebase.firestore().collection('schedules').doc(doc.id).update(data);
                await firebase.firestore().collection('users').doc(consultation.doctor.cpf)
                    .collection('specialties').doc(consultation.specialty.name)
                    .collection('clinics').doc(consultation.clinic.name)
                    .collection('schedules').doc(doc.id).update(data);
            })
        }
    },
    async deactivateScheduleDoctor ({commit}, payload){
        payload = functions.removeUndefineds(payload);
        for (let i in payload.specialties) {
          let scheduleFound = await firebase.firestore().collection('schedules')
                .where('clinic.name', '==', payload.clinic.name)
                .where('doctor.cpf', '==', payload.doctor.cpf)
                .where('specialty.name', '==', payload.specialties[i])
                .get();

            scheduleFound.forEach(async (doc) => {
                await firebase.firestore().collection('schedules').doc(doc.id).delete();
                await firebase.firestore().collection('users').doc(payload.doctor.cpf)
                    .collection('specialties').doc(payload.specialties[i])
                    .collection('clinics').doc(payload.clinic.name)
                    .collection('schedules').doc(doc.id).delete();
            });

            await this.dispatch('checkStatusSpecialty', payload.specialties[i]);
        }
        await this.dispatch('checkStatusDoctor', payload.doctor);
    },

    async checkStatusDoctor ({commit}, doctor){

        let scheduleFound = await firebase.firestore().collection('schedules')
            .where('doctor.cpf', '==', doctor.cpf)
            .get();
        if (scheduleFound.empty){
            await firebase.firestore().collection('users').doc(doctor.cpf).update({
                "status": "DESACTIVATE"
            });
        }
    },

    async checkStatusSpecialty ({commit}, specialty) {
        let scheduleFound = await firebase.firestore().collection('schedules')
            .where('specialty.name', '==', specialty)
            .get();
        if (scheduleFound.empty){
            await firebase.firestore().collection('specialties').doc(specialty).update({
                "status" : "DESACTIVATE"
            });
        }
    },

    async addConsultationAppointmentToUser({commit}, payload) {
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
    },

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
            let obj = {
                ...copyPayload.consultation,
                user: copyPayload.user
            };


            let resp = await firebase.firestore().collection('consultations').add(obj);
            if (copyPayload.consultation.type === "Retorno") {
                await firebase.firestore().collection('consultations').doc(copyPayload.consultation.previousConsultation).update({regress: resp.id})
            }
            copyPayload.consultation.id = resp.id;
            await context.dispatch('addConsultationAppointmentToUser', {...copyPayload})

            return (await firebase.firestore().collection('consultations').doc(resp.id).get()).data()
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

    async eraseAppointment({commit}, payload) { 
        try {

            functions.removeUndefineds(payload);
            let FieldValue = firebase.firestore.FieldValue;
            await firebase.firestore().collection('consultations').doc(payload.idConsultation).delete();
            await firebase.firestore().collection('users').doc(payload.idPatient).collection('consultations').doc(payload.idConsultation).update({status: 'Cancelado'})

            if (payload.type === 'Retorno') {

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
                            let thereIsExam = payload.consultation.exam ? payload.consultation.exam : payload.consultation.user && payload.consultation.user.exam ? payload.consultation.user.exam : undefined;
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
                                obj = {...obj, exam: thereIsExam};
                            firebase.firestore().collection('users').doc(payload.idPatient).collection('procedures').add(
                                {...obj}
                            )
                        }

                        firebase.firestore().collection('users').doc(payload.idPatient).collection('procedures').doc(doc.id).delete();
                        data.status.push('Cancelado');
                        firebase.firestore().collection('users').doc(payload.idPatient).collection('proceduresFinished').doc(doc.id)
                            .set(data);
                        return;
                    })
                });


            if (payload.regress !== undefined) {


                await firebase.firestore().collection('consultations').doc(payload.regress).delete();
                await firebase.firestore().collection('users').doc(payload.idPatient).collection('consultations').doc(payload.regress).update({status: 'Cancelado'})

            }

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

    async removeScheduleByDay(context, payload) {
        let schedule = await firebase.firestore().collection('schedules')
            .where('specialty.name', "==", payload.specialty.name)
            .where('doctor.cpf', "==", payload.doctor.cpf)
            .where('clinic.cnpj', '==', payload.clinic.cnpj).get()
        schedule.forEach((doc) => {
            let data = doc.data()
            let cancelations_schedules = data.cancelations_schedules ? data.cancelations_schedules : []
            let obj = {start_date: payload.start_date, final_date: payload.final_date}
            if (payload.hour)
                obj.hour = payload.hour
            if (payload.weekDays)
                obj.week_days = payload.weekDays
            cancelations_schedules.push({...obj})
            firebase.firestore().collection('schedules').doc(doc.id).update({cancelations_schedules: cancelations_schedules})
        })
    },

    async removeConsultations(context, payload) {
        let start = moment(payload.start_date, 'YYYY-MM-DD').format('YYYY-MM-DD 00:00');
        let end = moment(payload.final_date, 'YYYY-MM-DD').format('YYYY-MM-DD 23:59');
        payload = functions.removeUndefineds(payload);
        try {
            let snapshot = await firebase.firestore().collection('consultations')
                .where('specialty.name', "==", payload.specialty.name)
                .where('doctor.cpf', "==", payload.doctor.cpf).where('clinic.name', '==', payload.clinic.cnpj)
                .where('date', ">=", start).where('date', "<=", end).get();

            snapshot.forEach(async doc => {

                let dateConsultation = moment(doc.data().date);
                let filterHour = payload.hour ? doc.data().date.split(' ')[1] === payload.hour ? true : false : true
                let filterDayWeek = payload.weekDays ? payload.weekDays.indexOf(dateConsultation.weekday()) > -1 ? true : false : true

                if (filterHour && filterDayWeek) {
                    firebase.firestore().collection('consultations').doc(doc.id).delete();
                }
                if (filterHour && filterDayWeek && doc.data().user) {
                    firebase.firestore().collection('users').doc(doc.data().user.cpf).collection('consultations').doc(doc.id).delete();
                    firebase.firestore().collection('canceled').doc(doc.id).set(doc.data())
                }
            })
        } catch (e) {
            throw e
        }
        return
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
