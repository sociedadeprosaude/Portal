const state = {
    bundles : [],
    selectedBundle : null,
};

const mutations = {

    setBundles (state, payload){
        state.bundles = payload;
    },

    setSelectedBundle (state, payload) {
        state.selectedBundle = payload
    },

};

const actions = {
    selectBundle ({commit}, bundle){
        commit('setSelectedBundle', bundle);
    }

};

const getters = {
    bundles (state) {
        return state.bundles;
    },
    selectedBundle (state) {
        return state.selectedBundle;
    }

};

export default {
    state,
    mutations,
    actions,
    getters
}
