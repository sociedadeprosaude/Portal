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
            let res = await firebase.firestore().collection('outtakes/').add(payload);
        } catch (e) {
            throw e
        }
    },
    async AddCategorie({commit}, payload) {
        try {
            let res = await firebase.firestore().collection('outtakes/outtakes/categories').doc(payload.categoria).set({categoria: payload.categoria});
        } catch (e) {
            throw e
        }
    },
    async LoadCategories({ commit }) {
        try {
            var categorias = firebase.firestore().collection('outtakes/outtakes/categories').get().then((data) => {
                let Categorias = [];
                data.forEach((doc) => {
                    Categorias.push(doc.id);
                    //console.log('doc',doc.id)
                });
                commit('setCategorias', Categorias)
            })
        }
        catch (e) {
            throw e
        }

    }
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
