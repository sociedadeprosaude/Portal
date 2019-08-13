import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.PATIENTS_URL
})

instance.defaults.headers.common['Accept'] = 'application/json'

const state = {
  selectedPatient: {}
}

const mutations = {
  setSelectedPatient(state, payload) {
    state.selectedPatient = payload
  },
}

const actions = {
  searchPatientByName ({commit, getters}, payload) {
    return new Promise((resolve, reject) => {
      instance.get('/api/buscar/paciente', {
        params: {
          query: payload
        }
      })
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          console.log(error)
          reject(error)
        })
    })
  },
  addPatient ({commit}, payload) {
    return new Promise((resolve, reject) => {
      instance.post('/api/paciente', payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          console.log(error)
          reject(error)
        })    })
  },
  editPatient ({commit}, payload) {
    return new Promise((resolve, reject) => {
      instance.put('/api/paciente', payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          console.log(error)
          reject(error)
        })    })
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
