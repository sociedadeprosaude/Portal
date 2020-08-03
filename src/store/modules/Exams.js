import functions from "../../utils/functions";
import firebase from "firebase";

const state = {
    exams: [],
    loaded: false,
    examesSelected: [],
    examsTypes:[],
    selectExamType:undefined,
    selectExamTypeCheck: false
};

const mutations = {
    setExams(state, payload) {
        state.exams = payload
        state.loaded = true
    },
    setExamClinics(state, payload) {
        state.exams.find((exam) => {
            return exam.name === payload.exam
        }).clinics = payload.clinics
    },
    setExamsSelected(state, payload) {
        state.examesSelected = payload
    },
    setExamesLoaded(state, payload) {
        state.loaded = payload
    },
    setExamsTypes(state,payload){
        state.examsTypes = payload
    },
    selectExamType(state,payload){
        state.selectExamType = payload
    },
    selectExamTypeCheck(state,payload){
        state.selectExamTypeCheck = payload
    },
    deleteExamType(state,payload){
        let index = state.examsTypes.findIndex((type)=>type.name == payload)
        state.examsTypes.splice(index,1)
    },
    editExamType(state,payload){
        let index = state.examsTypes.findIndex((type)=>type.name == payload)
        state.examsTypes[index] = {...payload}
    },
    addExamType(state,payload){
        state.examsTypes.push(payload)
    }
};

const actions = {

    async loadExam({ commit }) {
        await firebase.firestore().collection('exams').onSnapshot(async (examsSnap) => {
            let exams = [];
            for (let exam in examsSnap.docs) {
                let document = examsSnap.docs[exam];

                exams.push({
                    name: document.data().name,
                    rules: document.data().rules,
                    type: document.data().type,
                    price: document.data().price
                    // clinics: clinics,
                });
            }

            commit('setExams', exams);
            return exams
        })
    },
    async searchExam(context, search) {

        let exams = [];
        if (search) {
            exams = functions.search(search, context.getters.exams).slice(0, 100)
        }
        return exams
    },
    async addExam({ commit }, exam) {
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

    async removeClinicFromExam({ commit }, payload) {//apagar exames da clinica e clinica do exames
        delete payload.clinic.id;
        try {
            firebase.firestore().collection('exams/' + payload.product + '/clinics').doc(payload.clinic.name).delete();
        } catch (e) {
            throw e
        }
    },

    async addExamToClinic({ commit }, payload) {
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

        let exam = await firebase.firestore().collection('clinics/' + payload.clinic.name + '/exams').doc(payload.exam).get()
        if (exam.exists)
            firebase.firestore().collection('clinics/' + payload.clinic.name + '/exams').doc(payload.exam).update(examData);
        else
            firebase.firestore().collection('clinics/' + payload.clinic.name + '/exams').doc(payload.exam).set(examData);

        exam = await firebase.firestore().collection('exams/').doc(payload.exam).collection('clinics').doc(payload.clinic.name)
        if (exam.exists)
            firebase.firestore().collection('exams/').doc(payload.exam).collection('clinics').doc(payload.clinic.name)
                .update(examAndClinic);
        else
            firebase.firestore().collection('exams/').doc(payload.exam).collection('clinics').doc(payload.clinic.name)
                .set(examAndClinic);
    },

    async loadSelectedExams({ commit, getters }, payload) {
        try {

            let exams = functions.search(payload, getters.exams).slice(0, 8)

            let results = []
            for (let doc in exams) {
                let clinics = [];
                let clinSnap = await firebase.firestore().collection('exams/' + exams[doc].name + '/clinics').get()
                clinSnap.forEach((document) => {
                    clinics.push(document.data())
                });
                results.push({
                    ...exams[doc],
                    clinics: clinics,
                });
            }
            commit('setExamsSelected', results);
        } catch (e) {
            throw e
        }
    },
    async deleteExam(context, examKey) {
        let examClinicsCol = await firebase.firestore().collection('exams').doc(examKey).collection('clinics').get()
        for (let doc in examClinicsCol.docs) {
            firebase.firestore().collection('clinics').doc(examClinicsCol.docs[doc].name).collection('exams').doc(examKey).delete()
        }
        firebase.firestore().collection('exams').doc(examKey).delete()
        return
    },
    async deleteExamType({commit}, examKey) {
        await firebase.firestore().collection('exams_types').doc(examKey).delete()
        commit('deleteExamType',examKey)
    },
    async setClinicOnExams(context, payload) {
        for (let exam in payload.exams) {
            let holder = {
                ...payload.clinic,
                price: payload.exams[exam].price,
                cost: payload.exams[exam].cost,
                rules: payload.exams[exam].rules
            }
            holder = functions.removeUndefineds(holder)
            firebase.firestore().collection('exams').doc(payload.exams[exam].name).collection('clinics').doc(payload.clinic.id).set(holder)
        }
    },
    async getExamClinics(context, exam) {
        let clinicSnap = await firebase.firestore().collection('exams').doc(exam.name).collection('clinics').get()
        let clinics = []
        clinicSnap.forEach((doc) => {
            clinics.push(doc.data())
        })
        return clinics
    },

    async setPricesExams(context, payload) {
        const firestore = firebase.firestore()
        var num = 0;
        firestore.collection('exams').get()
            .then(async (exams) => {
                await Promise.all(exams.docs.map(async (examRef) => {
                    return new Promise(async (resolve, reject) => {
                        let queryClinics = firestore.collection('exams').doc(examRef.id).collection('clinics');
                        let clinics = await queryClinics.get();
                        if (!clinics.empty) {
                            examRef.ref.update({ price: clinics.docs[0].data().price })
                            num++;
                        }
                        resolve();
                    });
                }));
                console.log(num + ' preços de exames atualizados.');
            }).catch((err) => response.send('erro ' + err));
    },

    async getExamsTypes({commit},payload){
        firebase.firestore().collection('exams_types').get()
            .then((snapshot)=>{
                let exams = []
                snapshot.forEach((doc)=>{
                    let obj = {
                        id:doc.id,
                        ...doc.data()
                    }

                    exams.push(obj)
                })

                commit('setExamsTypes',exams)
            })
    },
    async addExamType({ commit }, payload) {
        functions.removeUndefineds(payload)
        await firebase.firestore().collection('exams_types').add(payload);
        commit('addExamType',payload)
    },
    async editExamType({ commit }, payload) {
        await firebase.firestore().collection('exams_types').doc(payload.id).update(payload);
        //commit('editExamType',{...payload})
    },
    async selectExamType({commit}, payload) {
        commit('selectExamType', payload)
    },
    async selectExamTypeCheck({commit}, payload) {
        commit('selectExamTypeCheck', payload)
    }
};

const getters = {
    exams(state) {
        return state.exams
    },
    examsSelected(state) {
        return state.examesSelected
    },
    examsLoaded(state) {
        return state.loaded
    },
    examsTypes(state){
        return state.examsTypes
    },
    scheduleExamSelected(state) {
        return state.selectExamType
    },
    scheduleExamSelectedCheck(state){
        return state.selectExamTypeCheck
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}
