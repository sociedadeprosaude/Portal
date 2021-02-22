const state = {
    user: undefined,
    listOfPermissions: [],
    permissions: []
};

const mutations = {
    setUser(state, payload) {
        state.user = payload
    },
    setPermissionsList(state, payload) {
        state.permissions = payload
    },
    Setpermissions(state, payload) {
        state.listOfPermissions = payload
    }
};

const actions = {

    async logOut(context) {
        context.commit('setUser', undefined)
        return
    },
    async setCurrentUser({ commit }, user) {
        commit('setUser',user)
        console.log('user: ', user)
        if(user && user.clinic)
            commit('setSelectedUnit', user.clinic)
    }
};

const getters = {
    user(state) {
        return state.user
    },
    permissions(state) {
        return state.listOfPermissions
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}
