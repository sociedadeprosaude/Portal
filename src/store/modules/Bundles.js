import firebase from "firebase";

const state = {
    bundles : [],
    selectedBundle : null,
};

const mutations = {

    setBundles (state, payload){
        state.bundles = payload;
    },

    setSelectedBundle (state, payload){
        state.selectedBundle = payload;
    }
};

const actions = {

    async addBundle (bundle){

        try {
            for (let data in bundle){
                if (!bundle[data]) {
                    delete bundle[data]
                }
            }
            let bundleRef;
            if (bundle.id){
                bundleRef = await firebase.firestore().collection('packages').doc(bundle.id).set({bundle});
            } else {
                bundleRef = await firebase.firestore().collection('packages').add(bundle);
            }
            for (let i in bundle.exams){
                firebase.firestore().collection('package/exams').add(bundle.exams);
            }
            return bundleRef;

        } catch (e) {
            throw e;
        }

    },

    async loadBundle ({commit}) {
        return new Promise((resolve, reject) => {
            firebase.firestore().collection('packages').get().then((data) => {

                let allPackages = [];
                data.forEach((doc) => {

                    let bundle = doc.data();
                    let specialties = [];
                    let exams = [];

                    firebase.firestore().collection('package/' + bundle.name + '/specialities').get()
                        .then((data) => {
                            data.forEach((doc) => {
                                specialties.push({
                                    name: doc.data().name,
                                    clinic: doc.data().clinic,
                                    price: doc.data().price,
                                    cost: doc.data().cost,
                                    doctor: doc.data().doctor,
                                });
                            });
                        });

                    firebase.firestore().collection('packages/' + bundle.name + '/exams').get()
                        .then((data) => {
                            data.forEach((doc) => {
                                exams.push({
                                    name: doc.data().name,
                                    clinic: doc.data().clinic,
                                    price: doc.data().price,
                                    cost: doc.data().cost,
                                })
                            })
                        });

                    allPackages.push({
                        name:bundle.name,
                        id: bundle.id,
                        cost: bundle.id,
                        price: bundle.id,
                        moneyValue: bundle.moneyValue,
                        percentageValue: bundle.percentageValue,
                        total: bundle.total,
                        exams: exams,
                        specialties: specialties,
                    });

                });


                console.log(allPackages);
                commit('setBundles', allPackages);

                if (data) resolve (data);
                else reject(console.log('erro ao carregar dados de pacotes', data));

            });
        });
    },

    selectedBundle ({commit}, bundle){
        commit('setSelectedBundle', bundle);
    }

};

const getters = {

    bundles (state) {
        return state.bundles;
    },

    selectedBundle (state) {
        return state.selectedBundle;
    },
};

export default {
    state,
    mutations,
    actions,
    getters
}