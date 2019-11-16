import firebase, {firestore} from "firebase";

const state = {
    clinics: [],
}

const mutations = {
    setClinics(state, payload) {
        state.clinics = payload
    },
}

const actions = {
    async getClinics({commit}) {
        try {
            let clinicsSnap = await firebase.firestore().collection('clinics').get()
            let clinics = []
            clinicsSnap.forEach(function (document) {
                clinics.push({
                    id: document.id,
                    ...document.data()
                })
            })
            commit('setClinics', clinics)
            return clinics
        } catch (e) {
            throw e
        }
    },
    async addClinic({commit}, clinic) {
        try {
            for (let data in clinic) {
                if (!clinic[data]) {
                    delete clinic[data]
                }
            }
            let clinicRef
            if (clinic.id) {
                clinicRef = await firebase.firestore().collection('clinics').doc(clinic.id).set(clinic)
            } else {
                clinicRef = await firebase.firestore().collection('clinics').add(clinic)
            }
            return clinicRef
        } catch (e) {
            throw e
        }
    },
    async deleteClinic({}, clinic) {
        try {
            await firebase.firestore().collection('clinics').doc(clinic.id).delete()
            return
        } catch (e) {
            throw e
        }
    },
}

const getters = {
    clinics(state) {
        return state.clinics
    },
}

export default {
    state,
    mutations,
    actions,
    getters
}
