import firebase from "firebase";

const state = {
    bundles : [],
    selectedBundle : null,
};

const mutations = {

    setBundles (state, payload){
        state.bundles = payload;
    },

    setSelectedBundle (state, payload) {
        state.selectedBundle = payload
    },

};

const actions = {

    async addBundle ({commit}, bundle){

        let dataBundle = {
            name : bundle.name,
            cost: bundle.cost,
            price: bundle.price,
            total: bundle.total,
            moneyDiscount: bundle.moneyDiscount,
            percentageDiscount: bundle.percentageDiscount,

        };

        console.log('dataBundle', dataBundle);

        try {
            for (let data in bundle){
                if (!bundle[data]) {
                    delete bundle[data]
                }
            }
            let bundleRef;

            bundleRef = await firebase.firestore().collection('packages').doc(bundle.name).set(bundle);


            for (let i in bundle.exams){

                let examData = {
                    name: bundle.exams[i].name,
                    clinic: bundle.exams[i].clinic,
                    price: bundle.exams[i].price,
                    cost: bundle.exams[i].cost,
                    priceDiscount: bundle.exams[i].priceDiscount,
                };
                firebase.firestore().collection('packages/' + bundle.name + '/exams').doc(bundle.exams[i].name)
                    .set(examData);

            }

            return bundleRef;

        } catch (e) {
            throw e;
        }

    },

    async getBundle ({ }, search) {

        let bundleSnap;

        if (!search) {
            bundleSnap = await firebase.firestore().collection('packages').limit(30).get()
        } else {
            bundleSnap = await firebase.firestore().collection('packages').where('name', '>=', search).limit(30).get()
        }

        let bundle = [];
        bundleSnap.forEach((doc) => {
            bundle.push(doc.data());
        });

        for (let item in bundle) {
            let name = bundle[item].name;
            let exams = [];
            let examSnap = await firebase.firestore().collection('packages/' + name + '/exams').get();

            examSnap.forEach((e) => {
                exams.push(e.data());
            });

            bundle[item].exams = exams;
        }

        console.log(bundle);
        
        return bundle;
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
                                    priceDiscount: doc.data().priceDiscount,
                                })
                            })
                        });

                    allPackages.push({
                        name:bundle.name,
                        id: bundle.id,
                        cost: bundle.cost,
                        price: bundle.price,
                        total: bundle.total,
                        moneyDiscount: bundle.moneyDiscount,
                        percentageDiscount: bundle.percentageDiscount,
                        exams: exams,
                        specialties: specialties,
                    });

                });

                commit('setBundles', allPackages);

                if (data) resolve (data);
                else reject(console.log('erro ao carregar dados de pacotes', data));

            });
        });
    },

    async deletePackage({}, bundle) {

        try {
            await firebase.firestore().collection('packages').doc(bundle.name).delete();
            return
        } catch (e) {
            throw e
        }
    },

    selectBundle ({commit}, bundle){
        commit('setSelectedBundle', bundle);
    }

};

const getters = {

    bundles (state) {
        return state.bundles;
    },

    selectedBundle (state) {
        return state.selectedBundle;
    }

};

export default {
    state,
    mutations,
    actions,
    getters
}
