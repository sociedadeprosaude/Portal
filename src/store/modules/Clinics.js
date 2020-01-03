import firebase, {firestore} from "firebase";

const state = {
    clinics: [],
    allClinics: [],
    selectedClinic: null,
    units: []
};

const mutations = {
    setClinics(state, payload) {
        state.clinics = payload
    },
    setAllClinics (state, payload){
        state.allClinics = payload;
    },
    setSelectedClinic (state, payload){
        state.selectedClinic = payload;
    },
    setUnits (state, payload) {
        state.units = payload
    }
};

const actions = {

    async getClinics({commit}) {
        try {
            await firebase.firestore().collection('clinics').onSnapshot(async function (clinicsSnap) {
                let clinics = [];
                clinicsSnap.forEach(function (document) {
                    clinics.push({
                        id: document.id,
                        ...document.data()
                    });
                });

                let exams = [];
                for (let clinic in clinics){
                    let examsSnap = await firebase.firestore().collection('clinics').doc(clinics[clinic].name)
                        .collection('exams').get();

                    examsSnap.forEach(function (doc) {
                        exams.push({
                            id: doc.id,
                            ...doc.data(),
                        });
                    });
                }

                //console.log('#exams', exams);
                commit('setClinics', clinics);
                //console.log(clinics);
            })

        } catch (e) {
            throw e
        }
    },

    async addClinic({commit}, clinic) {


        try {
            for (let data in clinic) {
                if (!clinic[data]) {
                    delete clinic[data]
                }
            }
            let clinicRef;
            if (clinic.name) {
                clinicRef = await firebase.firestore().collection('clinics').doc(clinic.name).set(clinic)
            } else {
                clinicRef = await firebase.firestore().collection('clinics').add(clinic)
            }
            return clinicRef
        } catch (e) {
            throw e
        }
    },

    async deleteClinic({}, clinic) {
        try {
            await firebase.firestore().collection('clinics').doc(clinic.name).delete();
            return
        } catch (e) {
            throw e
        }
    },

    async removeExamFromClinic({commit}, payload){//apagar exames da clinica e clinica do exames
        delete payload.clinic.id
        try {
            firebase.firestore().collection('clinics/' + payload.clinic.name + '/exams').doc(payload.product).delete();
        } catch (e) {
            throw e
        }
    },

    addAppointment ({commit}, payload) {

        console.log('payload', payload);

        let data = {
            name: payload.doctor,
            specialtie: payload.specialtie,
            rules: payload.obs,
            cost: payload.cost,
            price: payload.price,
            payment_method: payload.payment,
            crm: payload.crm,
            cpf: payload.cpf

        };

        let info = {
            name: payload.specialtie,
        };

        let details = {
            id: payload.specialtie,
            name: payload.specialtie,
            cost: payload.cost,
            price: payload.price,
            payment_method: payload.payment,
        };
        delete payload.clinic.id
        firebase.firestore().collection('clinics/' + payload.clinic.name + '/specialties/' + payload.specialtie
            + '/doctors').doc(payload.cpf).set(data);

        firebase.firestore().collection('clinics/' + payload.clinic.name + '/specialties').doc(payload.specialtie)
            .set(info);

        firebase.firestore().collection('users/' + payload.cpf + '/specialties').doc(payload.specialtie)
            .set(details);

        firebase.firestore().collection('users/' + payload.cpf + '/specialties').doc(payload.specialtie).collection('clinics/').doc(payload.clinic.name)
            .set(payload.clinic);

        firebase.firestore().collection('specialties/' + payload.specialtie + '/doctors').doc(payload.cpf)
            .set(data);

        firebase.firestore().collection('specialties/' + payload.specialtie + '/doctors').doc(payload.cpf).collection('clinics/').doc(payload.clinic.name)
            .set(payload.clinic);
    },

    addAppointmentFromDoctors ({commit}, payload) {

        //console.log('antes:', payload);

        let data = {
            name: payload.doctor,
            specialtie: payload.specialtie,
            rules: payload.obs,
            cost: payload.cost,
            price: payload.price,
            payment_method: payload.paymentMethod,
            crm: payload.crm,
            cpf: payload.cpf
        };

        //console.log("me mostra formatado:", data)

        let info = {
            name: payload.specialtie,
        };

        firebase.firestore().collection('clinics/' + payload.clinic.name + '/specialties').doc(payload.specialtie)
            .set(info);

        firebase.firestore().collection('clinics/' + payload.clinic.name + '/specialties/' + payload.specialtie + '/doctors')
            .doc(payload.cpf).set(data);

        firebase.firestore().collection('users/' + payload.cpf + '/specialties').doc(payload.specialtie).collection('clinics/')
            .doc(payload.clinic.name).set(payload.clinic);

        //firebase.firestore().collection('specialties/' + payload.specialtie + '/doctors').doc(payload.cpf).set(data);

        firebase.firestore().collection('specialties/' + payload.specialtie + '/doctors').doc(payload.cpf).collection('clinics/')
            .doc(payload.clinic.name).set(payload.clinic);
    },

    deleteAppointment ({commit}, payload) {
        //console.log('payload', payload);
        delete payload.clinic.id
        firebase.firestore().collection('clinics/' + payload.clinic.name + '/specialties/' + payload.specialtie + '/doctors').doc(payload.cpf)
            .delete();

        firebase.firestore().collection('specialties/' + payload.specialtie + '/doctors').doc(payload.cpf).collection('clinics/').doc(payload.clinic.name)
            .delete();

        firebase.firestore().collection('users/' + payload.cpf + '/specialties').doc(payload.specialtie).collection('clinics/').doc(payload.clinic.name)
            .delete();
        //firebase.firestore().collection('users/' + payload.cpf + '/specialties').doc(payload.specialtie).delete();
    },

    selectClinic ({commit}, payload) {
        commit('setSelectedClinic' , payload);
    },

    loadClinics ({commit}) {
        return new Promise((resolve, reject) => {
            let clinics = [];
            firebase.firestore().collection('clinics').onSnapshot((doc) => {

                doc.forEach((doc) => {

                    let specialties = [];
                    let nameClinic = doc.data().name;

                    firebase.firestore().collection('clinics').doc(nameClinic).collection('specialties')
                        .get().then((data) => {

                        data.forEach((doc) => {

                            let doctors = [];
                            let nameSpecialtie = doc.data().name;

                            firebase.firestore().collection('clinics').doc(nameClinic).collection('specialties').doc(nameSpecialtie).collection('doctors')
                                .get().then((info) => {

                                info.forEach((doc) => {
                                    doctors.push({
                                        cost: doc.data().cost,
                                        cpf: doc.data().cpf,
                                        crm: doc.data().crm,
                                        name: doc.data().name,
                                        payment_method: doc.data().payment_method,
                                        price: doc.data().price,
                                        rules: doc.data().rules,
                                        specialtie: doc.data().specialtie,
                                    });
                                });
                            });

                            specialties.push({
                                name: doc.data().name,
                                doctors: doctors,
                            });

                        });
                    });

                    let exams = [];
                    firebase.firestore().collection('clinics').doc(nameClinic).collection('exams')
                        .get().then((data) => {
                        data.forEach((doc) => {
                            exams.push({
                                name: doc.data().name,
                                cost: doc.data().cost,
                                price: doc.data().price,
                                obs: doc.data().obs,
                            });
                        });
                    });

                    clinics.push({

                        id: doc.data().id,
                        ...doc.data(),
                        exams: exams,
                        specialties: specialties,
                    });
                });

                commit('setClinics', clinics);

                if (doc) {
                    resolve(doc)
                } else {
                    reject(console.log('erro ao carregar dados das clinicas', doc))
                }
            })
        })
    },
    async getProSaudeUnits(context) {
        firebase.firestore().collection('clinics').where('property', '==', 'true').onSnapshot(clinCollection => {
            let pros = []
            clinCollection.forEach(doc => {
                pros.push(doc.data())
            })
            context.commit('setUnits', pros)
        })
    },
    async setClinProperty(context, clin) {
        if (clin.property) {
            firebase.firestore().collection('clinics').doc(clin.name).update({property: firebase.firestore.FieldValue.delete()})
            return
        }
        firebase.firestore().collection('clinics').doc(clin.name).update({property: true})
    }
};

const getters = {
    clinics(state) {
        return state.clinics
    },

    allClinics (state) {
        return state.allClinics;
    },

    selectedClinic (state){
        return state.selectedClinic;
    },
    units(state) {
        return state.units
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}
