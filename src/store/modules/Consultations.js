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
