import firebase, {firestore} from "firebase";

const state = {
    colabortors: []
}

const mutations = {
    setColaborators(state, payload) {
        state.colabortors = payload
    },
}

const actions = {
    async getColaboratorsPermissions({commit}, user) {
        //console.log(user)
        user = {
            ...user,
            status: 'pending'
        }
        try {
        let resp = await firebase.database().ref('colaboradores/').child(user.uid).set(user)
            //console.log(resp)
        } catch (e) {
            console.log(e)
        }
        commit('setUser', user)
        return
    },
    async getColaborators(context) {
        try {
            let colabList = await context.dispatch('searchUser', {
                type: 'colaborator'
            })
            context.commit('setColaborators', colabList.sort((a, b) => {
                if (a.name > b.name) return 1
                return -1
            }))
            return
        } catch (e) {
            console.log(e)
            return e
        }
    },
    async setColaboratorGroup(context) {
        try {
            let colabList = await context.dispatch('searchUser', {
                type: 'colaborator'
            })
            context.commit('setColaborators', colabList.sort((a, b) => {
                if (a.name > b.name) return 1
                return -1
            }))
            return
        } catch (e) {
            console.log(e)
            return e
        }
    },
}

const getters = {
    colaborators(state) {
        return state.colabortors
    },
}

export default {
    state,
    mutations,
    actions,
    getters
}
