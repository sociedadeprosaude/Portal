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
        firebase.auth().signOut();
        setTimeout(() => {
            context.commit('setUser', undefined)
        }, 500);
        return
    },
    async getUser({ commit }, user) {

        try {
            let userDoc = await firebase.firestore().collection('users/').where('uid', '==', user.uid).get()
            commit('setUser', userDoc.docs[0].data());
            if (userDoc.docs[0].data().clinic) {
                this.commit('setSelectedUnit', userDoc.docs[0].data().clinic)
            }
            console.log('user: ', userDoc.docs[0].data())
            return userDoc.docs[0].data()
        }
        catch (e) {
            if (e.code === 'permission-denied') {
                await firebase.auth().signOut();
                await router.push('/login');
                return
            }
        }

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
