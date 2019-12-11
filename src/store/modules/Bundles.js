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

    async addBundle ({commit}, bundle){

        let dataBundle = {
            name : bundle.name,
            cost: bundle.cost,
            price: bundle.price,
            discountMoney: bundle.discountMoney,
            discountPercentage: bundle.discountPercentage,
        };

        try {
            for (let data in bundle){
                if (!bundle[data]) {
                    delete bundle[data]
                }
            }
            let bundleRef;
            if (bundle.name){
                bundleRef = await firebase.firestore().collection('packages').doc(bundle.name).set(dataBundle);
            } else {
                bundleRef = await firebase.firestore().collection('packages').add(bundle);
            }

            for (let i in bundle.exams){

                let examData = {
                    name: bundle.exams[i].product,
                    clinic: bundle.exams[i].clinic,
                    price: bundle.exams[i].price,
                    cost: bundle.exams[i].cost,
                };
                firebase.firestore().collection('packages/' + bundle.name + '/exams').doc(bundle.exams[i].product)
                    .set(examData);

            }

            for (let i in bundle.specialties) {
                let specialtieData = {
                    name: bundle
                };
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
                        cost: bundle.cost,
                        price: bundle.price,
                        moneyValue: bundle.discountMoney,
                        percentageValue: bundle.discountPercentage,
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
