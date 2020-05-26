import firebase, {firestore} from "firebase";

const state = {
    cids: [],

};

const mutations = {
    setCids(state, payload) {
        state.cids = payload
    },
};

const actions = {

    async getCids({commit}) {
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

    async addArrayOfCidsToBanc({commit}, payload) {
        try {
            firebase.firestore().collection('cids').doc('cids').set({cids: payload.cids})
        } catch (e) {
            throw e
        }
    },

};

const getters = {
    cids (state) {
        return state.cids
    },
};

export default {
    state,
    mutations,
    actions,
    getters
}
