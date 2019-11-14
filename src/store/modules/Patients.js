import axios from 'axios'
import firebase, {firestore} from "firebase";

const state = {
}

const mutations = {
  setSelectedPatient(state, payload) {
    state.selectedPatient = payload
  },
}

const actions = {
  async searchPatient ({commit, getters}, searchFields) {
    let usersRef = firestore().collection('users')
    for (let field in searchFields) {
      if (!searchFields[field]) continue
      usersRef = usersRef.where(field, field === 'name' ? '>=' : '==', searchFields[field].toUpperCase())
      console.log(field, searchFields[field])
    }
    let querySnapshot = await usersRef.get()
    let users = []
    querySnapshot.forEach(function(doc) {
      users.push(doc.data())
    })
    console.log(users)
    return users
  },
  async addPatient ({commit}, patient) {
    try {
      for (let data in patient) {
        if (!patient[data]) {
          delete patient[data]
        }
      }
      console.log(patient)
      let user = await firebase.firestore().collection('users').doc(patient.cpf).set(patient)
      return user
    } catch (e) {
      throw e
    }
  },
  editPatient ({commit}, payload) {

  },
  setSelectedPatient ({commit}, payload) {
    commit('setSelectedPatient', payload)
    if (payload.name) this.dispatch('getPatientProntuario', payload)
  }
}

const getters = {
  selectedPatient (state) {
    return state.selectedPatient
  },
}

export default {
  state,
  mutations,
  actions,
  getters
}
