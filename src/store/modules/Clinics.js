import firebase, {firestore} from "firebase";

const state = {
    clinics: [],
    allClinics: [],
    selectedClinic: null,
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
    }
};

const actions = {

    async getClinics({commit}) {
        try {
            let clinicsSnap = await firebase.firestore().collection('clinics').get();
            let clinics = [];
            clinicsSnap.forEach(function (document) {

                console.log(document.data().name);


                let examsSnap = firebase.firestore().collection('clinics/' + document.data().name + '/exams').get();
                console.log(examsSnap);

                let exams = [];
                examsSnap.forEach(function (doc) {
                    exams.push({
                        ...doc.data(),
                    });
                });

                let specialtiesSnap = firebase.firestore().collection('clinics/' + document.data().name + '/specialties').get();
                let specialties  = [];
                specialtiesSnap.forEach (function (doc) {
                    specialties.push({
                        ...doc.data(),
                    });
                });

                clinics.push({
                    id: document.id,
                    exams : exams,
                    specialties: specialties,
                    ...document.data()
                });
            });
            commit('setClinics', clinics);
            console.log(clinics);
            return clinics
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
            await firebase.firestore().collection('clinics').doc(clinic.name).delete()
            return
        } catch (e) {
            throw e
        }
    },

    addAppointment ({commit}, payload) {

        console.log('payload', payload);

        let data = {
            clinic: payload.clinic,
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

        firebase.firestore().collection('clinics/' + payload.clinic + '/specialties/' + payload.specialtie
            + '/doctors').doc(payload.cpf).set(data);

        firebase.firestore().collection('clinics/' + payload.clinic + '/specialties').doc(payload.specialtie)
            .set(info);

        firebase.firestore().collection('users/' + payload.cpf + '/specialties').doc(payload.specialtie)
            .set(data);

        firebase.firestore().collection('specialties/' + payload.specialtie + '/doctors').doc(payload.cpf)
            .set(data);
    },

    selectClinic ({commit}, payload) {
        commit('setSelectedClinic' , payload);
    },
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
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}
