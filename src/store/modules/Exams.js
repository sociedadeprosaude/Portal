import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'
import firebase from "firebase";

const state = {
    exams: [],
    examesSelected: []
};

const mutations = {
    setExams(state, payload) {
        state.exams = payload
    },
    setExamsSelected(state, payload){
        state.examesSelected= payload
    }
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

    async removeClinicFromExam({commit}, payload){//apagar exames da clinica e clinica do exames
        /*
        try {
            firebase.firestore().collection('clinics').doc(payload.idConsultation).delete()
        } catch (e) {
            throw e
        }
         */
    },

    async addExamToClinic({commit}, payload) {
        let examData = {
            name: payload.exam,
            cost: payload.cost,
            price: payload.sale,
            obs: payload.obs,
            clinic: payload.clinic.name,
            telephone: payload.clinic.telephone,
            address: payload.clinic.address,
            cnpj: payload.clinic.cnpj,
            //email: payload.clinic.email,
            agenda: payload.clinic.agenda,

        };
        firebase.firestore().collection('clinics/' + payload.clinic.name + '/exams').doc(payload.exam).set(examData);

        firebase.firestore().collection('exams/' + payload.exam + '/clinics').doc(examData.clinic).set(examData);
    },

    async loadSelectedExams({commit},payload){
        return new Promise( async (resolve,reject) => {
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
                commit('setExamsSelected', exams);
                resolve()
            } catch (e) {
                throw e
            }
        })
    }
};

const getters = {
    exams(state) {
        return state.exams
    },
    examsSelected(state){
        return state.examesSelected
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}
