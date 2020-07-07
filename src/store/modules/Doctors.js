import firebase from "firebase";
import functions from '../../utils/functions'
import Vue from 'vue'
import moment from "moment";

const state = {
    doctors: {},
    doctor: {},
    specialties: [],
    loaded: false,
    doctorSelected: null,
};

const mutations = {
    setDoctors(state, payload) {
        state.doctors = payload;
        state.loaded = true
    },
    setDoctor(state, payload) {
        state.doctor = payload
    },
    setSpecialties(state, payload) {
        state.specialties = payload
    },
    deleteDoctor(state, payload) {
        Vue.delete(state.doctors, payload.cpf)
    },
    setDoctorSelected(state, payload) {
        state.doctorSelected = payload;
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
                doctor.specialties[spec] = functions.removeUndefineds(doctor.specialties[spec]);
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

            await firebase.firestore().collection('users').doc(doctor.cpf).delete();
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
    },
    async getDoctor({commit}, payload) {
        firebase.firestore().collection('users').doc(payload).onSnapshot(async (doctorsSnap) => {
            let doctor = doctorsSnap.data();
            commit('setDoctor', doctor);
            return doctor
        })
    },
    async AddPaymentDayDoctor(context,payload){
        let doctor= firebase.firestore().collection('users').doc(payload.doctor.cpf);
        let setMerge= doctor.set({
            period: payload.period
        },{merge:true})
    },
    async PayDoctor(context, payload) {
        if (!payload.period) {
            payload.period = 30
        }
        if (!payload.last_payment) {
            await firebase.firestore().collection('users').doc(payload.cpf).update({
                last_payment: moment().format('YYYY-MM-DD'),
                period: payload.period
            })
        } else {
            await firebase.firestore().collection('users').doc(payload.cpf).update({
                last_payment: moment().format('YYYY-MM-DD'),
                period: payload.period
            })
        }
        await firebase.firestore().collection('outtakes').where('crm', '==', payload.crm)
            .where('paid', '==', false).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    let outtake= firebase.firestore().collection('outtakes').doc(doc.id);
                    outtake.update({
                        paid: moment().format('YYYY-MM-DD')})
                })
            })

    },
    async PayAllDoctor(context, payload) {
        let doctor = []
        await firebase.firestore().collection('outtakes').where('paid', '==', false).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if(doc.data().crm){
                        let outtake= firebase.firestore().collection('outtakes').doc(doc.id);
                        outtake.update({
                            paid: moment().format('YYYY-MM-DD')
                        })
                        let docto = payload.filter( (doct) => doct.crm === doc.data().crm)
                        if(doctor.indexOf(docto[0]) < 0 && docto.length > 0){
                            doctor.push(docto[0])
                        }
                    }
                })
            })
        for(let i=0; i < doctor.length; i++){
            if (!doctor[i].period) {
                doctor[i].period = 30
            }
            if (!doctor[i].last_payment) {
                await firebase.firestore().collection('users').doc(doctor[i].cpf).update({
                    last_payment: moment().format('YYYY-MM-DD'),
                    period: doctor[i].period
                })
            } else {
                await firebase.firestore().collection('users').doc(doctor[i].cpf).update({
                    last_payment: moment().format('YYYY-MM-DD'),
                    period: doctor[i].period
                })
            }
        }

    },
    async selectDoctor({commit}, doctor) {
        commit('setDoctorSelected', doctor)
    }
};

const getters = {
    doctors(state) {
        return state.doctors
    },
    doctor(state) {
        return state.doctor
    },
    doctorsLoaded(state) {
        return state.loaded
    },
    doctorSelected(state) {
        return state.doctorSelected
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}
