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
            let clinicsSnap = await firebase.firestore().collection('clinics').get()
            let clinics = [];
            clinicsSnap.forEach(function (document) {
                clinics.push({
                    id: document.id,
                    ...document.data()
                })
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
            let clinicRef
            if (clinic.id) {
                clinicRef = await firebase.firestore().collection('clinics').doc(clinic.id).set(clinic)
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
            await firebase.firestore().collection('clinics').doc(clinic.id).delete()
            return
        } catch (e) {
            throw e
        }
    },

    addAppointment ({commit}, payload) {

        let appointmentData = {
            clinic: payload.clinic,
            nome: payload.consultation,
            obs: payload.obs,
            custo: payload.cost,
            venda: payload.sale,
            medico: payload.doctor,
            payment: payload.payment,
        };

        let info = {
            nome: payload.consultation,
        };
        /*
        firebase.firestore().collection('clinics/' + payload.clinic.id + '/specialties/')
            .doc(payload.consultation).set(info);

        firebase.firestore().collection('clinics/' + payload.clinic.id + '/specialties/'
            + payload.consultation + '/doctors/').doc(payload.doctor).set(appointmentData);

        firebase.firestore().collection('specialties/' + payload.consultation + '/doctors/')
            .doc(payload.doctor).set(appointmentData);
         */
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
