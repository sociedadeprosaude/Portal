import firebase from "firebase";

const state = {
    specialties: [],
    loaded: false
};

const mutations = {

    setSpecialties(state, payload) {
        state.specialties = payload;
    },
    setSpecialtiesLoaded(state, payload) {
        state.loaded = payload
    }

};

const actions = {

    async loadSpecialties({commit}) {
        firebase.firestore().collection('specialties').onSnapshot(async function(data) {
            let allSpecialties = [];
            for (let specDoc in data.docs) {
                let specialty = data.docs[specDoc].data();
                // let doctors = [];
                // let docsCollection = await firebase.firestore().collection('specialties/' + specialty.name + '/doctors').get()
                // for (let doctorDoc in docsCollection.docs) {
                //     let doctor = docsCollection.docs[doctorDoc].data()
                //     doctor.clinics = []
                //     let clinCollection = await firebase.firestore().collection('specialties/' + specialty.name + '/doctors').doc(doctor.cpf).collection('clinics').get()
                //     clinCollection.forEach((clinDoc) => {
                //         doctor.clinics.push(clinDoc.data())
                //     })
                //     doctors.push({
                //         ...doctor,
                //         price: doctor.price,
                //         cost: doctor.cost,
                //         payment_method: doctor.payment_method,
                //     });
                // }


                allSpecialties.push({
                    ...specialty,
                    id: specDoc.id,
                });


                commit('setSpecialties', allSpecialties);
            }
            commit('setSpecialtiesLoaded', true);

        })

    },
    /* specialtyCost(context,payload) {
        return new Promise(async (resolve, reject) => {
            var findCostSpecialty = firebase.functions().httpsCallable('specialtyCost');
            findCostSpecialty({specialtyName: payload.specialtyName,doctorCPF:payload.doctorCPF}).then((result)=> {
                console.log('Success',result)
                resolve({ ...result.data})
            }).catch(function(error) {
                console.log('Error',error)
                reject('specialty cost not found')
            });
        })
    }, */

};

const getters = {

    specialties(state) {
        return state.specialties;
    },
    specialtiesLoaded(state) {
        return state.loaded
    }

};

export default {
    state,
    mutations,
    actions,
    getters,
}
