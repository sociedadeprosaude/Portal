const state = {
    exams: [],
};

const mutations = {
    setExams(state, payload) {
        state.exams = payload
        state.loaded = true
    }
};

const getters = {
    exams(state) {
        return state.exams
    },

};

export default {
    state,
    mutations,
    getters
}
