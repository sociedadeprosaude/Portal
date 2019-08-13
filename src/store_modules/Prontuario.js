import axios from 'axios'
import constants from '@/utils/constants'
import * as firebase from 'firebase/app'
import 'firebase/storage'
import Vue from 'vue'

const instance = axios.create({
  baseURL: process.env.PATIENTS_URL
})

instance.defaults.headers.common['Accept'] = 'application/json'

const state = {
  prontuarios: {},
  loading: false,
  newProntuarioInfo: {
    date: new Date().toISOString().substring(0, 10),
    todaySwitch: true,
    history: '' +
      '<p class="title">Anamnese:</p><br><br>' +
      '<p class="title">Exames:</p><br><br>' +
      '<p class="title">Hipóteses Diagnosticas:</p><br><br>' +
      '<p class="title">Diagnósticos Definitivos:</p><br><br>' +
      '<p class="title">Tratamentos Efetuados:</p><br><br>' +
      ''
  }
}

const mutations = {
  setLoading(state, payload) {
    state.loading = payload
  },
  setPatientProntuario(state, payload) {
    let prontuarios = {}
    for (let pront in payload.data) {
      prontuarios[payload.data[pront].id] = payload.data[pront]
    }
    Vue.set(state.prontuarios, payload.patient_id, prontuarios)
  },
  setProntuario(state, payload) {
    state.prontuarios[this.getters.selectedPatient.id][payload.id] = payload
  },
  setNewProntuarioInfo(state, payload) {
    state.newProntuarioInfo = setNewProntuarioInfo
  },
  removeFile (state, payload) {
    console.log(payload)
    console.log(state.prontuarios)
    Vue.delete(state.prontuarios[this.getters.selectedPatient.id][payload.prontuario.id].urls,
      state.prontuarios[this.getters.selectedPatient.id][payload.prontuario.id].urls.indexOf(payload.file))
    console.log(state.prontuarios)

  }
}

const actions = {
  getPatientProntuario({commit, getters}, payload) {
    return new Promise((resolve, reject) => {
      commit('setLoading', true)
      instance.get('/api/paciente/' + payload.id + '/prontuario')
        .then(response => {
          let data = {
            patient_id: payload.id,
            data: response.data
          }
          commit('setPatientProntuario', data)
          resolve(response.data)
        })
        .catch(error => {
          console.log(error)
          reject(error)
        })
        .finally(() => {
          commit('setLoading', false)
        })
    })
  },
  addPatientProntuario({commit, getters}, payload) {
    return new Promise((resolve, reject) => {
      instance.post('/api/paciente/' + payload.user.id + '/prontuario', payload.prontuario)
        .then(response => {
          commit('setPatientProntuario', response.data)
          this.dispatch('getPatientProntuario', payload.user)
          resolve(response.data)
        })
        .catch(error => {
          console.log(error)
          reject(error)
        })
    })
  },
  updatePatientProntuario({commit}, payload) {
    return new Promise((resolve, reject) => {
      instance.put('/api/paciente/' + payload.id + '/prontuario', payload)
        .then(response => {
          commit('setProntuario', response.data)
          resolve(response.data)
        })
        .catch(error => {
          console.log(error)
          reject(error)
        })
    })
  },
  deleteFile({commit}, payload) {
    return new Promise((resolve, reject) => {
      instance.delete('/api/prontuario/' + payload.file.id + '/arquivo')
        .then(response => {
          commit('removeFile', payload)
          firebase.storage().refFromURL(response.data).delete()
            .then(response => {
              console.log(response)
            })
          resolve(response.data)
        })
        .catch(error => {
          console.log(error)
          reject(error)
        })
    })
  },
  setProntuario({commit}, payload) {
    commit('setProntuario', payload)
  },
  setNewProntuarioInfo({commit}, payload) {
    commit('setNewProntuarioInfo', payload)
  }
}

const getters = {
  prontuarios(state) {
    return state.prontuarios
  },
  newProntuarioInfo(state) {
    return state.newProntuarioInfo
  },
  prontuarioLoading(state) {
    return state.loading
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
