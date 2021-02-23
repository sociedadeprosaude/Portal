const state = {
    colabortors: [],
    colaboratorDoctors: [],
};
const mutations = {
    setColaborators(state, payload) { state.colabortors = payload },
    setColaboratorDoctor(state, payload) { state.colaboratorDoctors = payload },
};
const actions = {
    async getColaborators(context) {
        try {
            let colabList = await context.dispatch('searchUser', {
                type: 'COLABORATOR',
                limit: 1000
            });
            context.commit('setColaborators', colabList.sort((a, b) => {
                if (a.name > b.name) return 1;
                return -1
            }));
            return
        } catch (e) {
            console.log(e);
            return e
        }
    },
    async getColaboratorsDoctors(context) {
        try {
            let colabList = await context.dispatch('searchUser', {
                type: 'DOCTOR'
            });
            context.commit('setColaboratorDoctor', colabList.sort((a, b) => {
                if (a.name > b.name) return 1;
                return -1
            }));
            return
        } catch (e) { console.log(e); return e }
    },
};
const getters = {
    colaborators(state) { return state.colabortors },
    colaboratorsDoctors(state) { return state.colaboratorDoctors },
};
export default {
    state,
    mutations,
    actions,
    getters
}
