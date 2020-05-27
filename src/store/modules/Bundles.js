import firebase from "firebase";
import functions from "../../utils/functions";

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

        try {
            for (let data in bundle){
                if (!bundle[data]) {
                    delete bundle[data]
                }
            }
            let bundleRef;
            functions.removeUndefineds(bundle);
            bundleRef = await firebase.firestore().collection('packages').doc(bundle.name).set(bundle);


            for (let i in bundle.exams){

                let examData = {
                    name: bundle.exams[i].name,
                    clinic: bundle.exams[i].clinic,
                    price: bundle.exams[i].price,
                    cost: bundle.exams[i].cost,
                    priceDiscount: bundle.exams[i].priceDiscount,
                };
                functions.removeUndefineds(examData);
                firebase.firestore().collection('packages/' + bundle.name + '/exams').doc(bundle.exams[i].name)
                    .set(examData);

            }
            for (let i in bundle.consultations){

                let examData = {
                    name: bundle.consultations[i].name,
                    clinic: bundle.consultations[i].clinic,
                    price: bundle.consultations[i].price,
                    cost: bundle.consultations[i].cost,
                    priceDiscount: bundle.consultations[i].priceDiscount,
                };
                functions.removeUndefineds(examData);
                firebase.firestore().collection('packages/' + bundle.name + '/specialities').doc(bundle.consultations[i].name)
                    .set(examData);

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
                    allPackages.push({
                        name:bundle.name,
                        id: bundle.id,
                        cost: bundle.cost,
                        price: bundle.price,
                        total: bundle.total,
                        moneyDiscount: bundle.moneyDiscount,
                        percentageDiscount: bundle.percentageDiscount,
                        exams: bundle.exams,
                        consultations: bundle.consultations,
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
