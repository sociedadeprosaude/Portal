import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'
import firebase from "firebase";

const state = {
    doctorsList: [],
    examsList: [],
    budgetCodeList: [],
    budgetList: []
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
    },
    setBudgetList(state, payload) {
        state.budgetList = payload
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
    addBudget({}, payload) {
        if (!this.getters.doctors.includes(payload.doctor)) {
            firebase.database().ref('analise-exames/').child('doctors').push(payload.doctor)
        }
        for (let item in payload.budget) {
            if (!this.getters.exams.includes(payload.budget[item])) {
                firebase.database().ref('analise-exames/').child('exams').push(payload.budget[item])
            }
        }
        let budgetObj = {
            'doctor': payload.doctor,
            'date': moment().format('DD-MM-YYYY HH:mm'),
            colaborator: payload.colaborator,
            'exams': payload.budget,
            'verified': false
        }
        return firebase.database().ref('analise-exames/').child('budgets').child(payload.budgetNumber)
            .set(budgetObj)
    },
    getBudgets({commit}, payload) {
        firebase.database().ref('analise-exames/').child('budgets')
            .orderByKey()
            .startAt(payload)
            .limitToFirst(50)
            .on('value', (snap) => {
                let budgetCodeList = []
                for (let key in snap.val()) {
                    budgetCodeList.push({
                        code: key,
                        verified: snap.val()[key].verified
                    })
                }
                commit('setBudgetCodeList', budgetCodeList)
            })
    },
    getBudgetsByDate({commit}, payload) {
        return firebase.database().ref('analise-exames/').child('budgets')
            .orderByChild('date')
            // .startAt(payload.initialDate)
            .once('value')
            .then((snap) => {
                commit('setBudgetList', snap.val())
            })
    },
    registerBudget({}, payload) {
        firebase.database().ref('analise-exames/').child('budgets').child(payload.budgetCode)
          .child('verified')
          .set(payload.verified)
      if (payload.verified) {
        firebase.database().ref('analise-exames/').child('budgets').child(payload.budgetCode)
            .child('verified_by')
            .set(payload.user.name)
        firebase.database().ref('analise-exames/').child('budgets').child(payload.budgetCode)
            .child('verification')
            .set({
              user: payload.user,
              date: moment().format('YYYY-MM-DD HH:mm:ss')
            })
      } else {
        firebase.database().ref('analise-exames/').child('budgets').child(payload.budgetCode)
            .child('verified_by').remove()
        firebase.database().ref('analise-exames/').child('budgets').child(payload.budgetCode)
            .child('verification')
            .remove()
      }
    }

}

const getters = {
    exams(state) {
        return state.examsList
    },
    doctorss(state) {
        return state.doctorsList
    },
    registeredBudgetCodes(state) {
        return state.budgetCodeList
    },
    budgetList(state) {
        return state.budgetList
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}
