const state = {
    showDoctorsAgendaToolbar: false,
    showOverviewToggle: false,
    overviewDrawer: false,
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
    },
    showOverviewToggle: (state, payload) => state.showOverviewToggle = payload,
    overviewToggle: (state, payload) => state.overviewDrawer = payload,
};

const actions = {
    overviewToggle: ({ commit }, payload) => commit('overviewToggle', payload)

}

const getters = {
    showDoctorsAgendaToolbar(state) {
        return state.showDoctorsAgendaToolbar
    },
    systemDialog(state) {
        return state.dialog
    },
    showOverviewToggle: (state) => state.showOverviewToggle,
    overviewDrawer: (state) => state.overviewDrawer
};

export default {
    state,
    mutations,
    actions,
    getters
}
