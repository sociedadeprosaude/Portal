const state = {
    selectedClinic: null,
    units: [],
    unitsLoaded: false,
};

const mutations = {
    setSelectedClinic(state, payload) {
        state.selectedClinic = payload;
    },

    setUnits(state, payload) {
        state.units = payload;
        state.unitsLoaded = true
    },


};

const actions = {
    selectClinic({commit}, payload) {
        commit('setSelectedClinic', payload);
    },

    async getProSaudeUnits(context,clinics) {
            context.commit('setUnits', clinics);
            if (!this.getters.selectedUnit) {
                context.commit('setSelectedUnit', clinics[0])
            }
    },

};

const getters = {
    selectedClinic(state) {
        return state.selectedClinic;
    },
    units(state) {
        return state.units
    },
    unitsLoaded(state) {
        return state.unitsLoaded
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}
