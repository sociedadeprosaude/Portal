const state = {
    showDoctorsAgendaToolbar: false,
    dialog: {
        header: '',
        body: '',
        show: false,
        functionToRun: undefined
    }
};

const mutations = {
    setDoctorsAgendaToolbar(state, payload) {
        state.showDoctorsAgendaToolbar = payload
    },
    setSystemDialog(state, payload) {
        state.dialog = payload
    }
};

const getters = {
    showDoctorsAgendaToolbar(state) {
        return state.showDoctorsAgendaToolbar
    },
    systemDialog(state) {
        return state.dialog
    }
};

export default {
    state,
    mutations,
    getters
}
