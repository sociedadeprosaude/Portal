import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'
import firebase from "firebase";

const state = {
    exams: []
};

const mutations = {
    setExams(state, payload) {
        state.exams = payload
    },
};

const actions = {
    async loadExam({commit}) {
        try {
            let examsSnap = await firebase.firestore().collection('exams').get()
            let exams = {};
            examsSnap.forEach(function (document) {
                exams[document.id] = document.data()
            });
            console.log(exams);
            commit('setExams', exams);
            return exams
        } catch (e) {
            throw e
        }
    },
    async addExam({commit}, exam) {
        try {
            for (let data in exam) {
                if (!exam[data]) {
                    delete exam[data]
                }
            }
            let examRef;
            if (exam.id) {
                examRef = await firebase.firestore().collection('exams').doc(exam.id).set(exam)
            } else {
                examRef = await firebase.firestore().collection('exams').add(exam)
            }
            return examRef
        } catch (e) {
            throw e
        }
    }
};

const getters = {
    exams(state) {
        return state.exams
    },
};

export default {
    state,
    mutations,
    actions,
    getters
}
