import firebase from "firebase";

const state = {
    user: {}
}

const mutations = {
    setUser(state, payload) {
        state.user = payload
    },
}

const actions = {
    async registerUser({commit}, user) {
        console.log(user)
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
    setUser({commit}, user) {
        firebase.database().ref('colaboradores/').child(user.email).on((user) => {
            commit('setUser', user)
        })
        return
    },
}

const getters = {
    user(state) {
        return state.user
    },
}

export default {
    state,
    mutations,
    actions,
    getters
}
