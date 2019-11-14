import firebase from "firebase";

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
    async getColaborators({commit}) {
        try {
            firebase.database().ref('colaboradores/').on('value', (colab) => {
                let colabList = []
                colab = colab.val()
                for (let key in colab) {
                    colabList.push(colab[key])
                }
                commit('setColaborators', colabList.sort((a, b) => {
                    if (a.name > b.name) return 1
                    return -1
                }))
            })
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
