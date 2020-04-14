import axios from 'axios'
import firebase, { firestore } from "firebase";

const state = {

};

const mutations = {
    setSelectedDependent(state, payload) {
        state.selectedDependent = payload
    },

};

const actions = {

    async getUsers(context, payload) {
        try {
            let selectedUnit = context.getters.selectedUnit;
            let query = firebase.firestore().collection('users');
            let usersSnap = [];
            if (payload) {
                if (payload.initialDate) {
                    query = query.where('created_at', '>=', payload.initialDate)
                }
                if (payload.finalDate) {
                    query = query.where('created_at', '<=', payload.finalDate)
                }
                if (payload.type) {
                    query = query.where('type', '==', payload.type)
                }
                query = query.orderBy('created_at');
            }
            usersSnap = await query.get();
            let users = [];
            usersSnap.forEach(doc => {
                users.push({
                    id: doc.id,
                    ...doc.data()
                })
            });
            context.commit("setUsers", users);
        } catch (e) {
            console.log(e)
        }
    }
};

const getters = {
    selectedPatient(state) {
        return state.selectedPatient
    },
    selectedDependent(state) {
        return state.selectedDependent
    },
    users(state) {
        return state.users;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}
