const state = {
    showDoctorsAgendaToolbar: false,
}

const mutations = {
    setDoctorsAgendaToolbar(state, payload) {
        state.showDoctorsAgendaToolbar = payload
    },
}

const getters = {
    showDoctorsAgendaToolbar(state) {
        return state.showDoctorsAgendaToolbar
    },
}

export default {
    state,
    mutations,
    getters
}
