import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from "firebase";

const state = {
  doctorsList: [],
  examsList: [],
  budgetCodeList: []
}

const mutations = {
  setExamsList(state, payload) {
    state.examsList = payload
  },
  setDoctorsList(state, payload) {
    state.doctorsList = payload
  },
  setBudgetCodeList(state, payload) {
    state.budgetCodeList = payload
  }
}

const actions = {
  getDoctorsList({commit}) {
    firebase.database().ref('analise-exames/').child('doctors').on('value', function (snapshot) {
      let doctorsList = []
      for (let key in snapshot.val()) {
        doctorsList.push(
          snapshot.val()[key])
      }
      commit('setDoctorsList', doctorsList)
    })
  },
  getExamsList({commit}) {
    firebase.database().ref('analise-exames/').child('exams').on('value', function (snapshot) {
      let examsList = []
      for (let key in snapshot.val()) {
        examsList.push(snapshot.val()[key])
      }
      commit('setExamsList', examsList)
    })
  },
  addBudget({commit}, payload) {
    if (!this.getters.doctors.includes(payload.doctor)) {
      firebase.database().ref('analise-exames/').child('doctors').push(payload.doctor)
    }
    for (let item in payload.budget) {
      if (!this.getters.exams.includes(payload.budget[item])) {
        firebase.database().ref('analise-exames/').child('exams').push(payload.budget[item])
      }
    }
    firebase.database().ref('analise-exames/').child('budget').child(payload.doctor)
      .child(data)
      .set(moment().format('DD-MM-YYYY HH:mm'))
    return database.child('budget').child(payload.doctor)
      .child(payload.budgetNumber)
      .set(payload.budget)
  },
  getBudgets({commit}, payload) {
    firebase.database().ref('analise-exames/').child('budget')
      .once('value')
      .then((snap) => {
        let budgetCodeList = []
        for (let key in snap.val()) {
          for (let budgetKey in snap.val()[key]) {
            budgetCodeList.push(budgetKey)
          }
        }
        commit('setBudgetCodeList', budgetCodeList)
      })
  }
}

const getters = {
  exams(state) {
    return state.examsList
  },
  doctors(state) {
    return state.doctorsList
  },
  registeredBudgetCodes(state) {
    return state.budgetCodeList
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
