import firebase from "firebase";

const state = {
    categoria: []
};

const mutations = {
    setCategorias(state, payload) {
        state.categoria = payload;
    }


};

const actions = {
    async AddSaida({ commit }, payload) {
        try {
            //let res = await firebase.firestore().collection('outtakes/').doc(payload.id.toString()).set({ ...payload });
            let res = await firebase.firestore().collection('outtakes').add(payload);
        } catch (e) {
            throw e
        }
    },


};

const getters = {
    categoria(state) {
        return state.categoria;
    }

};

export default {
    state,
    mutations,
    actions,
    getters
}
