import firebase from "firebase";

const state = {
    user: {},
    permissions: []
}

const mutations = {
    setUser(state, payload) {
        state.user = payload
    },
    setPermissionsList(state, payload) {
        state.permissions = payload
    },
}

const actions = {
    async registerUser({commit}, user) {
        user = {
            ...user,
            status: 'pending'
        }
        try {
        let resp = await firebase.database().ref('colaboradores/').child(user.uid).set(user)
            console.log(resp)
        } catch (e) {
            console.log(e)
        }
        commit('setUser', user)
        return
    },
    async getUser({commit}, user) {
        return firebase.database().ref('colaboradores/').child(user.uid).once('value',(user) => {
            commit('setUser', user.val())
            return user
        })
    },
    async setUserPermissions({}, payload) {
        try {
            firebase.database().ref('colaboradores/').child(payload.user.uid).child('permissions').set(payload.permissions)
        } catch (e) {
            console.log(e)
        }
    },
    getPermissionList({commit}) {
        firebase.database().ref('permissions/').once('value',(permissions) => {
            commit('setPermissionsList', permissions.val())
        })
    }
}

const getters = {
    permissionsList(state) {
        return state.permissions
    },
    user (state) {
        return state.user
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}