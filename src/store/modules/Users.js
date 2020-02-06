import axios from 'axios'
import firebase, { firestore } from "firebase";
import moment from 'moment'

const state = {
    selectedPatient: undefined,
    selectedDependent: undefined,
};

const mutations = {
    async setSelectedPatient(state, payload) {
        var consultations
        console.log('Clear USER')
        if (payload) {
            await firebase.firestore().collection('users').doc(payload.cpf).collection('consultations')
                .onSnapshot((querySnapshot) => {
                    consultations = []
                    querySnapshot.forEach((consultation) => {
                        consultations.push({ ...consultation.data() })
                    })
                    payload = { ...payload, consultations: consultations }
                    state.selectedPatient = payload
                })

        } else {
            state.selectedPatient = payload
        }
    },
    setSelectedDependent(state, payload) {
        state.selectedDependent = payload
    },
    clearSelectedDependent(state) {
        console.log('Cleanup')
        state.selectedDependent = undefined
    }
};

const actions = {
    // async updateUsers() {
    //     let usersSnap = await firestore().collection('users').get()
    //     usersSnap.forEach((doc) => {
    //         let user = doc.data()
    //         firestore().collection('users').doc(user.cpf).update({type: user.type.toUpperCase()})
    //     })
    // },
    async searchUser({ commit, getters }, searchFields) {
        let usersRef = firestore().collection('users')
        for (let field in searchFields) {
            if (!searchFields[field] || searchFields[field].length === 0) continue;
            usersRef = usersRef.where(field, field === 'name' ? '>=' : '==', searchFields[field].toUpperCase())
        }
        let querySnapshot = await usersRef.get()
        let users = [];
        querySnapshot.forEach(function (doc) {
            // if (doc.data().association_number) {
            users.push(doc.data())
            // }
        });
        return users
    },
    async addUser({ getters }, patient) {
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
            let user
            let foundUser = await firebase.firestore().collection('users').doc(patient.cpf).get()
            if (foundUser.exists) {
                // delete patient.type
                user = await firebase.firestore().collection('users').doc(patient.cpf).update({ ...patient, group: 'admin' })
            } else if (patient.type === 'DOCTOR') {
                let oldDoctor = await firebase.firestore().collection('users').doc(patient.crm).get()
                if (oldDoctor.exists) {
                    let specialties = await firebase.firestore().collection('users').doc(patient.crm).collection('specialties').get()
                    user = await firebase.firestore().collection('users').doc(patient.cpf).set({ ...patient, group: 'admin', clinics: oldDoctor.data().clinics })

                    specialties.forEach(async (doc) => {
                        await firebase.firestore().collection('users').doc(patient.cpf).collection('specialties').doc(doc.data().name).set({ ...doc.data() })
                        let clinics = await firebase.firestore().collection('users').doc(patient.crm).collection('specialties').doc(doc.data().name).collection('clinics').get()
                        clinics.forEach((clinic) => {
                            firebase.firestore().collection('users').doc(patient.cpf).collection('specialties').doc(doc.data().name).collection('clinics').doc(clinic.data().name).set({ ...clinic.data() })
                        })
                    })

                    firebase.firestore().collection('users').doc(oldDoctor.data().cpf).delete()
                } else { //Estado crítico
                    user = await firebase.firestore().collection('users').doc(patient.cpf).set({ ...patient, group: 'admin' })
                }
            } else {
                user = await firebase.firestore().collection('users').doc(patient.cpf).set({ ...patient, group: 'admin' })
            }

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
    async deleteUser({ }, user) {
        try {
            await firebase.firestore().collection('users').doc(user.cpf).delete()
            return
        } catch (e) {
            throw e
        }
    },
    editPatient({ commit }, payload) {

    },
    async setSelectedPatient({ commit }, payload) {
        commit('setSelectedPatient', payload)
        if (payload.name) this.dispatch('getPatientProntuario', payload)
    },
    async searchUserFromOldDatabase(context, numAss) {
        while (numAss.length < 8) {
            numAss = '0' + numAss
        }
        let url = 'http://caixa.sociedadeprosaude.com:84/api/buscar/paciente?field=codigo&query=' + numAss /*00060009*/
        let res = await axios.get(url)
        console.log('aa', res.data)
        return res.data[0]
    },

    setSelectedDependent({ commit }, payload) {
        commit('setSelectedDependent', payload)
    }
};

const getters = {
    selectedPatient(state) {
        return state.selectedPatient
    },
    selectedDependent(state) {
        console.log('limpando')
        return state.selectedDependent
    },
};

export default {
    state,
    mutations,
    actions,
    getters
}
