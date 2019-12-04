import firebase from "firebase";

const state = {
    specialties : [],
};

const mutations = {

    setSpecialties (state, payload){
        state.specialties= payload;
    },

};

const actions = {

    async loadSpecialties ({commit}) {
        return new Promise((resolve, reject) => {
            firebase.firestore().collection('specialties').get().then((data) => {

                let allSpecialties = [];
                data.forEach((specDoc) => {

                    let specialtie = specDoc.data();
                    let doctors = [];

                    firebase.firestore().collection('specialties/' + specialtie.name + '/doctors').get()
                        .then((data) => {
                            data.forEach((doc) => {
                                doctors.push({
                                    ...doc.data(),
                                    price: doc.data().price,
                                    cost: doc.data().cost,
                                    payment_method: doc.data().payment_method,
                                });
                            });
                        });



                    allSpecialties.push({
                        name:specialtie.name,
                        id: specialtie.id,
                        doctors: doctors,
                    });

                });
                console.log('especialidades: ', allSpecialties)
                commit('setSpecialties', allSpecialties);

                if (data) resolve (data)
                else reject(console.log('erro ao carregar dados de pacotes', data))

            });
        });
    },


};

const getters = {

    specialties (state) {
        return state.specialties;
    },

};

export default {
    state,
    mutations,
    actions,
    getters,
}
