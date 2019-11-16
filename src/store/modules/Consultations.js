import firebase, {firestore} from "firebase";
import moment from 'moment'

const state = {
    consultations: {},
}

const mutations = {
    setConsultations(state, payload) {
        state.doctors = payload
    },
}

const actions = {

    async getConsultations({commit}) {
        try {
            let consultationsSnap = await firebase.firestore().collection('consultations')
                .where('date', '>=', moment().format('YYYY-MM-DD HH:mm:ss'))
                .where('date', '<=', moment().add(10, 'days').format('YYYY-MM-DD 23:59:59'))
                .get()
            let consultations = {}
            consultationsSnap.forEach(function (document) {
                consultations[document.id] = document.data()
            })
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
    }
}

const getters = {
    consultations(state) {
        return state.consultations
    },
}

export default {
    state,
    mutations,
    actions,
    getters
}
