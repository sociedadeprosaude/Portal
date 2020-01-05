import axios from 'axios'
import firebase, {firestore} from "firebase";
import moment from 'moment'

const state = {
    selectedPatient: undefined
};

const mutations = {
    async setSelectedPatient(state, payload) {
        var consultations
        if (payload) {
            await firebase.firestore().collection('users').doc(payload.cpf).collection('consultations')
                .onSnapshot((querySnapshot) => {
                    consultations = []
                    querySnapshot.forEach((consultation) => {
                        consultations.push({...consultation.data()})
                    })
                    payload = {...payload, consultations: consultations}
                    state.selectedPatient = payload
                })

        } else {
            state.selectedPatient = payload
        }
    },
};

const actions = {
    // async updateUsers() {
    //     let usersSnap = await firestore().collection('users').get()
    //     usersSnap.forEach((doc) => {
    //         let user = doc.data()
    //         firestore().collection('users').doc(user.cpf).update({type: user.type.toUpperCase()})
    //     })
    // },
    async searchUser({commit, getters}, searchFields) {
        let usersRef = firestore().collection('users')
        for (let field in searchFields) {
            if (!searchFields[field] || searchFields[field].length === 0) continue;
            usersRef = usersRef.where(field, field === 'name' ? '>=' : '==', searchFields[field].toUpperCase())
        }
        let querySnapshot = await usersRef.limit(20).get()
        let users = [];
        querySnapshot.forEach(function (doc) {
            // if (doc.data().association_number) {
            users.push(doc.data())
            // }
        });
        return users
    },
    async addUser({getters}, patient) {
        try {
            for (let data in patient) {
                if (!patient[data]) {
                    delete patient[data]
                }
            }
            if (patient.type) {
                patient.type = patient.type.toUpperCase()
            }
            patient.created_at = moment().format('YYYY-MM-DD HH:mm:ss')
            // if (patient.type === 'PATIENT') {
            //     patient.association_number = getters.associated.quantity
            // }
            let user = await firebase.firestore().collection('users').doc(patient.cpf).set(patient)
            return user
        } catch (e) {
            throw e
        }
    },
    async updateUserField(context, payload) {
        let upd = {}
        if (payload.value === 'delete') {
            upd[payload.field] = firebase.firestore.FieldValue.delete()
        } else {
            upd[payload.field] = payload.value
        }
        return await firebase.firestore().collection('users').doc(payload.user.cpf).update(upd)
    },
    async deleteUser({}, user) {
        try {
            await firebase.firestore().collection('users').doc(user.cpf).delete()
            return
        } catch (e) {
            throw e
        }
    },
    editPatient({commit}, payload) {

    },
    async setSelectedPatient({commit}, payload) {
        commit('setSelectedPatient', payload)
        if (payload.name) this.dispatch('getPatientProntuario', payload)
    },
    async searchUserFromOldDatabase(context, numAss) {
        while (numAss.length < 8) {
            numAss = '0' + numAss
        }
        console.log('numAss', numAss)
        let url = 'http://caixa.sociedadeprosaude.com:84/api/buscar/paciente?field=codigo&query=' + numAss /*00060009*/
        let res = await axios.get(url)
        console.log('aa', res.data)
        return res.data[0]
    }
};

const getters = {
    selectedPatient(state) {
        return state.selectedPatient
    },
};

export default {
    state,
    mutations,
    actions,
    getters
}
