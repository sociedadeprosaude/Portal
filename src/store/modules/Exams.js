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
            let examsSnap = await firebase.firestore().collection('exams').get();
            let exams = [];
            examsSnap.forEach(function (document) {

                let clinics = [];
                firebase.firestore().collection('exams/' + document.data().name + '/clinics').get().then((data) => {
                    data.forEach((doc) => {
                       clinics.push({
                           clinic : doc.data().clinic,
                           cost: doc.data().cost,
                           price: doc.data().price,
                       });
                    });
                });

                exams.push({
                    name: document.data().name,
                    rules: document.data().rules,
                    clinics: clinics,
                });

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
            examRef = await firebase.firestore().collection('exams').doc(exam.name).set(exam);

            return examRef
        } catch (e) {
            throw e
        }
    },
    async loadSelectedExams({commit},payload){
        payload= payload.toUpperCase();
        try {
            let examsSnap = await firebase.firestore().collection('exams').where('name', '>=', payload).get();
            let exams = [];
            examsSnap.forEach(function (document) {

                let clinics = [];
                firebase.firestore().collection('exams/' + document.data().name + '/clinics').get().then((data) => {
                    data.forEach((doc) => {
                        clinics.push({
                            clinic : doc.data().clinic,
                            cost: doc.data().cost,
                            price: doc.data().price,
                        });
                    });
                });

                exams.push({
                    name: document.data().name,
                    rules: document.data().rules,
                    clinics: clinics,
                });

            });
            console.log('exams: ',exams);
            return exams
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
