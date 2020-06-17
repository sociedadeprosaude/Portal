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
    consultationReturn:{},
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
                        expiration_date:data.expiration_date,
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
        let snapshot = firebase.firestore().collection('schedules')
                        .where('clinic.cnpj', '==', payload.clinic.cnpj)

        if(payload.specialty){
            snapshot = snapshot.where('specialty.name', '==', payload.specialty.name)
        }
        if(payload.doctor){
            snapshot = snapshot.where('doctor.cpf', '==', payload.doctor.cpf)
        }

        let schedule = await snapshot.get()
        if (!schedule.empty) {
            schedule.forEach((snap) => {
                firebase.firestore().collection('schedules').doc(snap.id).delete()
            })
        }

    },

    async updateCanceledSchedules({commit}, payload) {
        functions.removeUndefineds(payload)
        if (payload.cancelations_schedules) {
            firebase.firestore().collection('schedules').doc(payload.id).update({cancelations_schedules: payload.cancelations_schedules})
        } else {
            firebase.firestore().collection('schedules').doc(payload.id).set(payload.schedule)
        }
    },

    async copyCanceledSchedules({commit}, payload) {
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
    async addConsultationHourInConsultation({commit}, data) {

        firebase.firestore().collection('consultations').doc(data.id).update({
            consultation_hour: data.consultation_hour,
        });
        firebase.firestore().collection('users').doc(data.consultation.user.cpf)
            .collection('consultations').doc(data.id).update({
            consultation_hour: data.consultation_hour,
        })

    },

    async addMedicalRecordsToConsultation({commit}, payload) {
        firebase.firestore().collection('consultations').doc(payload.consultation).update({MedicalRecords: payload.MedicalRecords});
        firebase.firestore().collection('users').doc(payload.patient).collection('consultations').doc(payload.consultation).update({MedicalRecords: payload.MedicalRecords})
    },
    async addPrescriptionToConsultation({commit}, payload) {
        firebase.firestore().collection('consultations').doc(payload.consultation).update({Prescription: payload.Prescription});
        firebase.firestore().collection('users').doc(payload.patient).collection('consultations').doc(payload.consultation).update({Prescription: payload.Prescription})
    },
    async addSolicitationsToConsultation({commit}, payload) {
        payload = functions.removeUndefineds(payload);
        firebase.firestore().collection('consultations').doc(payload.consultation).update({Solicitations: payload.Solicitations});
        firebase.firestore().collection('users').doc(payload.patient).collection('consultations').doc(payload.consultation).update({Solicitations: payload.Solicitations})
    },
    async addReportToConsultation({commit}, payload) {
        firebase.firestore().collection('consultations').doc(payload.consultation).update({Report: payload.Report});
        firebase.firestore().collection('users').doc(payload.patient).collection('consultations').doc(payload.consultation).update({Report: payload.Report})
    },
    async addAttestationsToConsultation({commit}, payload) {
        firebase.firestore().collection('consultations').doc(payload.consultation).update({Attestations: payload.Attestations});
        firebase.firestore().collection('users').doc(payload.patient).collection('consultations').doc(payload.consultation).update({Attestations: payload.Attestations})
    },
    async addOrientationsToConsultation({commit}, payload) {
        firebase.firestore().collection('consultations').doc(payload.consultation).update({Orientations: payload.Orientations});
        firebase.firestore().collection('users').doc(payload.patient).collection('consultations').doc(payload.consultation).update({Orientations: payload.Orientations})
    },
    async addTimesToConsultation({commit}, payload) {
        firebase.firestore().collection('consultations').doc(payload.consultation).update({start_at: payload.start});
        firebase.firestore().collection('consultations').doc(payload.consultation).update({end_at: payload.end});
        firebase.firestore().collection('consultations').doc(payload.consultation).update({duration: payload.durantion});
        firebase.firestore().collection('users').doc(payload.patient).collection('consultations').doc(payload.consultation).update({start_at: payload.start});
        firebase.firestore().collection('users').doc(payload.patient).collection('consultations').doc(payload.consultation).update({end_at: payload.end});
        firebase.firestore().collection('users').doc(payload.patient).collection('consultations').doc(payload.consultation).update({duration: payload.durantion})

    }
}

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
