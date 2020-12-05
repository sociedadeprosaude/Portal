import firebase, { firestore } from "firebase";
import router from "../../router";
import { relativeTimeRounding } from "moment";

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
        //firebase.auth().signOut();
        /* setTimeout(() => {
            context.commit('setUser', undefined)
        }, 500); */
        context.commit('setUser', undefined)
        return
    },
    async setCurrentUser({ commit }, user) {
        commit('setUser',user)
        console.log('user: ', user)
        if(user && user.clinic)
            commit('setSelectedUnit', user.clinic)

    },

    async updateAccount({ commit }, payload) {
        try {
            let id = payload.uid;
            await firebase.firestore().collection('users').doc(id).update({
                name: payload.name,
                telephones: payload.telephones,
                address: payload.address,
                bankData: payload.bank,
            });
            commit('setUser', payload)
        } catch (e) {
            console.log(e)
        }
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
