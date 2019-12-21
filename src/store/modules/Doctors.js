import firebase, {firestore} from "firebase";

const state = {
    doctors: {},
    specialties: []
};

const mutations = {
    setDoctors(state, payload) {
        state.doctors = payload
    },
    setSpecialties(state, payload) {
        state.specialties = payload
    }
};

const actions = {
    // async searchUser({commit, getters}, searchFields) {
    //     let usersRef = firestore().collection('users')
    //     for (let field in searchFields) {
    //         if (!searchFields[field]) continue
    //         usersRef = usersRef.where(field, field === 'name' ? '>=' : '==', searchFields[field].toUpperCase())
    //     }
    //     let querySnapshot = await usersRef.get()
    //     let users = []
    //     querySnapshot.forEach(function (doc) {
    //         users.push(doc.data())
    //     })
    //     return users
    // },
    async addDoctor ({commit}, doctor) {
        try {
            for (let data in doctor) {
                if (!doctor[data]) {
                    delete doctor[data]
                }
            }
            doctor.type = "doctor"
            let docCopy = Object.assign({}, doctor)
            delete docCopy.specialties;
            await firebase.firestore().collection('users').doc(doctor.cpf).set(docCopy)
            for (let spec in doctor.specialties) {
                let holder = {
                    ...docCopy,
                    cost: doctor.specialties[spec].cost,
                    price: doctor.specialties[spec].price,
                    payment_method: doctor.specialties[spec].payment_method
                }
                for (let data in doctor.specialties[spec]) {
                    if (!doctor.specialties[spec][data]) {
                        delete doctor.specialties[spec][data]
                    }
                }
                delete holder.clinics
                await firebase.firestore().collection('specialties').doc(doctor.specialties[spec].name).collection('doctors').doc(doctor.cpf).set(holder)
            }
            return
        } catch (e) {
            throw e
        }
    },
    async deleteDoctor ({}, doctor) {
        try {
            await firebase.firestore().collection('users').doc(doctor.cpf).delete()
            for (let spec in doctor.specialties) {
                await firebase.firestore().collection('specialties').doc(doctor.specialties[spec].name).collection('doctors').doc(doctor.cpf).delete()
            }
            return
        } catch (e) {
            throw e
        }
    },
    async getDoctors({commit}) {
        try {
            let doctorsSnap = await firebase.firestore().collection('users').where('type', '==', 'doctor').get();
            let doctors = {};
            doctorsSnap.forEach(function (document) {
                doctors[document.id] = document.data()
            });
            commit('setDoctors', doctors);
            return doctors
        } catch (e) {
            throw e
        }
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
            let specialtySnapt = await firebase.firestore().collection('specialties').get()
            let specialties = []
            specialtySnapt.forEach(function (document) {
                let doctors = []
                firebase.firestore().collection('specialties').doc(document.data().name).collection('doctors').get()
                .then((snapshot)=>{
                    snapshot.forEach((doctor)=>{
                        doctors.push({...doctor.data()})
                    })
                })
                specialties.push({
                  id: document.id,
                  ...document.data(),
                  doctors:doctors
                })
            })
            commit('setSpecialties', specialties)
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
};

export default {
    state,
    mutations,
    actions,
    getters
}
