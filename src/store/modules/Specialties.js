import firebase from "firebase";

const state = {
    specialties: [],
};

const mutations = {

    setSpecialties(state, payload) {
        state.specialties = payload;
    },

};

const actions = {

    async loadSpecialties({commit}) {
        let data = await firebase.firestore().collection('specialties').get()

        let allSpecialties = [];
        for (let specDoc in data.docs) {
            let specialty = data.docs[specDoc].data();
            let doctors = [];
            let docsCollection = await firebase.firestore().collection('specialties/' + specialty.name + '/doctors').get()
            for (let doctorDoc in docsCollection.docs) {
                let doctor = docsCollection.docs[doctorDoc].data()
                doctor.clinics = []
                let clinCollection = await firebase.firestore().collection('specialties/' + specialty.name + '/doctors').doc(doctor.cpf).collection('clinics').get()
                clinCollection.forEach((clinDoc) => {
                    doctor.clinics.push(clinDoc.data())
                })
                doctors.push({
                    ...doctor,
                    price: doctor.price,
                    cost: doctor.cost,
                    payment_method: doctor.payment_method,
                });
            }


            allSpecialties.push({
                name: specialty.name,
                id: specDoc.id,
                doctors: doctors,
            })


            commit('setSpecialties', allSpecialties);
        }


        // if (data) return data
        // else reject(console.log('erro ao carregar dados de pacotes', data))


    },


};

const getters = {

    specialties(state) {
        return state.specialties;
    },

};

export default {
    state,
    mutations,
    actions,
    getters,
}
