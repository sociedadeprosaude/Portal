import firebase, {firestore} from "firebase";
import functions from '../../utils/functions'
import Vue from 'vue'
import moment from "moment";

const state = {
    doctors: {},
    specialties: [],
    loaded: false
};

const mutations = {
    setDoctors(state, payload) {
        state.doctors = payload;
        state.loaded = true
    },
    setSpecialties(state, payload) {
        state.specialties = payload
    },
    deleteDoctor(state, payload) {
        Vue.delete(state.doctors, payload.cpf)
    }
};

const actions = {
    async addDoctor({commit}, doctor) {
        try {
            doctor = functions.removeUndefineds(doctor);
            doctor.type = "DOCTOR";
            doctor.status = "DESACTIVATE";
            let docCopy = JSON.parse(JSON.stringify(doctor));
            delete docCopy.specialties;
            let foundUser = await firebase.firestore().collection('users').doc(doctor.cpf).get();
            if (foundUser.exists) {
                firebase.firestore().collection('users').doc(doctor.cpf).update(docCopy)
            } else {
                await firebase.firestore().collection('users').doc(doctor.cpf).set(docCopy)
            }
            for (let spec in doctor.specialties) {
                let details = {
                    cost: doctor.specialties[spec].cost,
                    price: doctor.specialties[spec].price,
                    payment_method: doctor.specialties[spec].payment_method
                };
                let holder = {
                    ...docCopy,
                    ...details
                };
                delete doctor.specialties[spec].doctors;
                firebase.firestore().collection('users/' + doctor.cpf + '/specialties').doc(doctor.specialties[spec].name)
                    .set({
                        ...details,
                        ...doctor.specialties[spec]
                    });
                doctor.specialties[spec] = functions.removeUndefineds(doctor.specialties[spec])
                delete holder.clinics;
                await firebase.firestore().collection('specialties').doc(doctor.specialties[spec].name).collection('doctors').doc(doctor.cpf).set(holder)
            }
            return
        } catch (e) {
            throw e
        }
    },

    async deleteConsultations({}, doctor) {
        let hoje = moment().locale('pt-BR').format('YYYY-MM-DD HH:mm');
        try {
            let snapshot = await firebase.firestore().collection('consultations')
                .where('doctor.cpf', "==", doctor.cpf)
                .where('date', ">=", hoje)
                .get();
            snapshot.forEach(doc => {
                firebase.firestore().collection('consultations').doc(doc.id).delete();
                if (doc.data().user) {
                    firebase.firestore().collection('users').doc(doc.data().user.cpf).collection('consultations').doc(doc.id).delete()
                    firebase.firestore().collection('canceled').doc(doc.id).set(doc.data())
                }
            })
        } catch (e) {
            throw e
        }
        return
    },

    async deleteDoctor({commit}, doctor) {
        try {
            (await firebase.firestore().collection('users').doc(doctor.cpf).collection('specialties').get()).forEach((doc) => {
                firebase.firestore().collection('users').doc(doctor.cpf).collection('specialties').doc(doc.id).delete()
            });

            (await firebase.firestore().collection('users').doc(doctor.cpf).collection('clinics').get()).forEach((doc) => {
                firebase.firestore().collection('users').doc(doctor.cpf).collection('clinics').doc(doc.id).delete()
            });

            await firebase.firestore().collection('users').doc(doctor.cpf).delete()
            for (let spec in doctor.specialties) {
                await firebase.firestore().collection('specialties').doc(doctor.specialties[spec].name).collection('doctors').doc(doctor.cpf).delete()
            }
            for (let clinic in doctor.clinics) {
                await firebase.firestore().collection('clinics').doc(doctor.clinics[clinic].name).collection('doctors').doc(doctor.cpf).delete()
            }
            commit('deleteDoctor', doctor);
            return
        } catch (e) {
            throw e
        }
    },
    async getDoctors({commit}) {
        firebase.firestore().collection('users').where('type', '==', 'DOCTOR').onSnapshot(async (doctorsSnap) => {
            let doctors = {};
            for (let document in doctorsSnap.docs) {
                doctors[doctorsSnap.docs[document].id] = doctorsSnap.docs[document].data()
            }
            commit('setDoctors', doctors);
        })
    },
    async addSpecialty({}, specialty) {
        try {
            let speRef = await firebase.firestore().collection('specialties').doc(specialty.name).set(specialty);
            return speRef
        } catch (e) {
            throw e
        }
    },
    async getSpecialties({commit}) {
        try {
            let specialtySnapt = await firebase.firestore().collection('specialties').get();
            let specialties = [];
            specialtySnapt.forEach(function (document) {
                let doctors = [];
                firebase.firestore().collection('specialties').doc(document.data().name).collection('doctors').get()
                    .then((snapshot) => {
                        snapshot.forEach((doctor) => {
                            doctors.push({...doctor.data()})
                        })
                    });
                specialties.push({
                    id: document.id,
                    ...document.data(),
                    doctors: doctors
                })
            });
            commit('setSpecialties', specialties);
            return specialties
        } catch (e) {
            throw e
        }
    }
};

const getters = {
    doctors(state) {
        return state.doctors
    },
    doctorsLoaded(state) {
        return state.loaded
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}
