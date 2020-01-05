const state = {
    selectedUnit: undefined,
};

const mutations = {
    setSelectedUnit(state, payload) {
        state.selectedUnit = payload
    }
};

const getters = {
    selectedUnit(state) {
        return state.selectedUnit
    },
};

export default {
    state,
    mutations,
    getters
}
