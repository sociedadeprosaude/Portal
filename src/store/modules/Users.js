import axios from 'axios'
import firebase, {firestore} from "firebase";

const state = {
  selectedPatient: undefined
};

const mutations = {
  async setSelectedPatient(state, payload) {
    var consultations
    if(payload){
      await firebase.firestore().collection('users').doc(payload.cpf).collection('consultations')
      .onSnapshot((querySnapshot)=>{
        consultations = []
        querySnapshot.forEach((consultation)=>{
          consultations.push({...consultation.data()})
        })
        payload = {...payload,consultations:consultations}
        state.selectedPatient = payload
      })

    } else {
      state.selectedPatient = payload
    }
  },
};

const actions = {
  async searchUser ({commit, getters}, searchFields) {
    let usersRef = firestore().collection('users')
    console.log(searchFields)
    for (let field in searchFields) {
      if (!searchFields[field] || searchFields[field].length === 0) continue;
      usersRef = usersRef.where(field, field === 'name' ? '>=' : '==', searchFields[field].toUpperCase())
    }
    console.log('query', usersRef)
    let querySnapshot = await usersRef.get()
    let users = [];
    querySnapshot.forEach(function(doc) {
      // if (doc.data().association_number) {
        users.push(doc.data())
      // }
    });
    console.log('user', users)
    return users
  },
  async addUser ({commit}, patient) {
    try {
      for (let data in patient) {
        if (!patient[data]) {
          delete patient[data]
        }
      }
      if (patient.type){
        patient.type = patient.type.toLowerCase()
      }
      let user = await firebase.firestore().collection('users').doc(patient.cpf).set(patient)
      return user
    } catch (e) {
      throw e
    }
  },
  async updateUserField(context, payload) {
    let upd = {}
    if(payload.value === 'delete') {
      upd[payload.field] = firebase.firestore.FieldValue.delete()
    } else {
      upd[payload.field] = payload.value
    }
    return await firebase.firestore().collection('users').doc(payload.user.cpf).update(upd)
  },
  async deleteUser ({}, user) {
    try {
      await firebase.firestore().collection('users').doc(user.cpf).delete()
      return
    } catch (e) {
      throw e
    }
  },
  editPatient ({commit}, payload) {

  },
  async setSelectedPatient ({commit}, payload) {
    commit('setSelectedPatient', payload)
    if (payload.name) this.dispatch('getPatientProntuario', payload)
  }
};

const getters = {
  selectedPatient (state) {
    return state.selectedPatient
  },
};

export default {
  state,
  mutations,
  actions,
  getters
}
