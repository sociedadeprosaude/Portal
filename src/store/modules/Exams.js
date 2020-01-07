import functions from "../../utils/functions";
import firebase from "firebase";

const state = {
    exams: [],
    examesSelected: []
};

const mutations = {
    setExams(state, payload) {
        state.exams = payload
    },
    setExamsSelected(state, payload) {
        state.examesSelected = payload
    }
};

const actions = {

    async loadExam({commit}) {
        try {
            await firebase.firestore().collection('exams').onSnapshot((examsSnap) => {
                let exams = [];
                examsSnap.forEach(function (document) {

                    let clinics = [];
                    firebase.firestore().collection('exams/' + document.data().name + '/clinics').get().then((data) => {
                        data.forEach((doc) => {
                            clinics.push({
                                clinic: doc.data().clinic,
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
                //console.log(exams);
                commit('setExams', exams);
                return exams
            })
        } catch (e) {
            throw e
        }
    },
    async searchExam(context, search) {
        let examsSnap
        if (!search) {
            examsSnap = await firebase.firestore().collection('exams').limit(30).get()
        } else {
            examsSnap = await firebase.firestore().collection('exams').where('name', '>=', search).limit(30).get()
        }
        let exams = [];
        examsSnap.forEach((doc) => {
            exams.push(doc.data())
        });
        return exams
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

    async removeClinicFromExam({commit}, payload) {//apagar exames da clinica e clinica do exames
        delete payload.clinic.id;
        try {
            firebase.firestore().collection('exams/' + payload.product + '/clinics').doc(payload.clinic.name).delete();
        } catch (e) {
            throw e
        }
    },

    async addExamToClinic({commit}, payload) {
        let examData = {
            name: payload.exam,
            cost: payload.cost,
            price: payload.sale,
            rules: payload.rules,
            obs: payload.obs,
        };

        let examAndClinic = {
            ...payload.clinic,
            cost: payload.cost,
            price: payload.sale,
            rules: payload.rules,
            obs: payload.obs,
        };

        examData = functions.removeUndefineds(examData);
        delete payload.clinic.id;
        examAndClinic = functions.removeUndefineds(examAndClinic);

        firebase.firestore().collection('clinics/' + payload.clinic.name + '/exams').doc(payload.exam).set(examData);

        firebase.firestore().collection('exams/').doc(payload.exam).collection('clinics').doc(payload.clinic.name)
            .set(examAndClinic);
    },

    async loadSelectedExams({commit}, payload) {
        payload = payload.toUpperCase();
        try {
            let examsSnap = await firebase.firestore().collection('exams').where('name', '>=', payload).limit(5).get();
            let exams = [];
            for (let doc in examsSnap.docs) {
                let clinics = [];
                let clinSnap = await firebase.firestore().collection('exams/' + examsSnap.docs[doc].data().name + '/clinics').get()
                clinSnap.forEach((document) => {
                    clinics.push(document.data())
                });
                exams.push({
                    ...examsSnap.docs[doc].data(),
                    clinics: clinics,
                });
            }
            commit('setExamsSelected', exams);
        } catch (e) {
            throw e
        }
    },
    async deleteExam(context, examKey) {
        let examClinicsCol = await firebase.firestore().collection('exams').doc(examKey).collection('clinics').get()
        for(let doc in examClinicsCol.docs) {
            firebase.firestore().collection('clinics').doc(examClinicsCol.docs[doc].name).collection('exams').doc(examKey).delete()
        }
        firebase.firestore().collection('exams').doc(examKey).delete()
        return
    }
};

const getters = {
    exams(state) {
        return state.exams
    },
    examsSelected(state) {
        return state.examesSelected
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}
