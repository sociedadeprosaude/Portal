import firebase, {firestore} from "firebase";
import moment from 'moment'

const state = {
    consultations: [],
    consultationsByDate: {},
};

const mutations = {
    setConsultations(state, payload) {
        state.consultations = payload
    },
    // setConsultationsByDate(state, payload) {
    //     state.consultationsByDate = payload
    // },
};

const actions = {

    async getConsultations({commit}) {
        try {
            let consultationsSnap = await firebase.firestore().collection('consultations')
                .where('date', '>=', moment().format('YYYY-MM-DD HH:mm:ss'))
                .where('date', '<=', moment().add(10, 'days').format('YYYY-MM-DD 23:59:59'))
                .get()
            let consultations = []
            let consultationsByDate = {}
            consultationsSnap.forEach(function (document) {
                consultations.push({
                    ...document.data(),
                    id: document.id
                })
                // consultations[document.id] = document.data()
                // let date = document.data().date.split(' ')[0]
                // if (!consultationsByDate[date])
                //     consultationsByDate[date] = {}
                // if (!consultationsByDate[date][document.data().doctor.cpf])
                //     consultationsByDate[date][document.data().doctor.cpf] = []
                // consultationsByDate[date][document.data().doctor.cpf].push({
                //     ...document.data(),
                //     id: document.id
                // })
            })
            // commit('setConsultationsByDate', consultationsByDate)
            commit('setConsultations', consultations)
            return consultations
        } catch (e) {
            throw e
        }
    },
    async createConsultation({commit}, consultation) {
        let startDate = moment(consultation.start_date, 'YYYY-MM-DD')
        let finalDate = moment(consultation.final_date, 'YYYY-MM-DD')
        let daysDiff = finalDate.diff(startDate, 'days')
        let routineId = moment().valueOf()
        for (let i = 0; i <= daysDiff; i++) {
            let day = moment(consultation.start_date, 'YYYY-MM-DD').add(i, 'days')
            if (consultation.weekDays.indexOf(day.weekday()) > -1) {
                for (let j = 0; j < consultation.vacancy; j++) {
                    let consultObject = {
                        specialty: consultation.specialty,
                        date: day.format('YYYY-MM-DD') + ' ' + consultation.hour,
                        routine_id: routineId,
                        clinic: consultation.clinic,
                        doctor: consultation.doctor,
                    }
                    await firebase.firestore().collection('consultations').add(consultObject)
                }
            }
        }
        return
    },
    async addConsultationAppointmentToUser({commit}, payload) {
        try {
            await firebase.firestore().collection('users').doc(payload.user.cpf).collection('consultations').add(payload.consultation)
        } catch (e) {
            throw e
        }
    },
    async addUserToConsultation({commit}, payload) {
        try {
            let obj = {
                user: payload.user,
            }
            await firebase.firestore().collection('consultations').doc(payload.consultation.id).update(obj)
        } catch (e) {
            throw e
        }
    }
};

const getters = {
    consultations(state) {
        return state.consultations
    },
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
