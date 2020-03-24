import firebase, {firestore} from "firebase";

const state = {
    associated: {},
};

const mutations = {
    setAssociated(state, payload) {
        state.associated = payload
    },
};

const actions = {
    async listenToOperationalValues({commit}, user) {
        firebase.firestore().collection('operational/').onSnapshot((snap) => {
            let associated = snap.docs.find((s) => {
                return s.id === 'associated'
            });
            commit('setAssociated', associated.data())
        })
    },
};

const getters = {
    associated (state) {
        return state.associated
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}
