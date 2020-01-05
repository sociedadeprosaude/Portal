import firebase, {firestore} from "firebase";
import router from "../../router";

const state = {
    user: undefined,
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
    // async registerUser({commit}, user) {
    //     user = {
    //         ...user,
    //         status: 'pending'
    //     }
    //     try {
    //     let resp = await firebase.database().ref('colaboradores/').child(user.uid).set(user)
    //         //console.log(resp)
    //     } catch (e) {
    //         console.log(e)
    //     }
    //     commit('setUser', user)
    //     return
    // },
    async logOut(context) {
        firebase.auth().signOut()
        setTimeout(() => {
            context.commit('setUser', undefined)
        }, 500)
        return
    },
    async getUser({commit}, user) {
        let userDoc = await firebase.firestore().collection('users/').where('uid', '==', user.uid).get()
        commit('setUser', userDoc.docs[0].data())
        return userDoc.docs[0].data
        // return firebase.firestore().collection('users/').doc(user.cpf).get('value',(user) => {
        //     commit('setUser', user.val())
        //     return user
        // })
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
