import firebase from "firebase";

const state = {
    medicines: [],
};

const mutations = {
    setMedicines(state, payload) {
        state.medicines = payload
    },


};

const actions = {
    async addArrayOfMedicinesToBanc({commit}, payload) {

        try {
            firebase.firestore().collection('medicines').doc('sus').set({medicines: payload.medicines})
        } catch (e) {
            throw e
        }
    },

    async getMedicines({commit}) {
        firebase.firestore().collection('medicines').onSnapshot(async function (clinicsSnap) {
            let medicines = [];
            clinicsSnap.forEach(function (document) {
                medicines.push({
                    ...document.data().medicines
                });
            });
            commit('setMedicines', medicines);
        })
    },

};

const getters = {
    medicines(state) {
        return state.medicines
    },
};

export default {
    state,
    mutations,
    actions,
    getters
}