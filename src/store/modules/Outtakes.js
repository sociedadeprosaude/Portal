import firebase, {firestore} from "firebase";
import functions from "../../utils/functions";

const state = {
    outtakes: [],
    categories: [],
    alertOuttakes: [],
};

const mutations = {
    setOuttakes: (state, payload) => state.outtakes = payload,
    setOuttakesCategories: (state, payload) => state.categories = payload,
    setOuttakesReport: (state, payload) => state.outtakesReport = payload,
    setAlertOuttakes: (state, payload) => state.alertOuttakes = payload,
};

const actions = {
    async getOuttakes(context, payload) {
        try {
            let selectedUnit = context.getters.selectedUnit;
            let base = firebase.firestore().collection('outtakes');
            let outtakesSnap = [];
            if (payload) {
                if (payload.initialDate) {
                    base = base.where('created_at', '>=', payload.initialDate)
                }
                if (payload.finalDate) {
                    base = base.where('created_at', '<=', payload.finalDate)
                }
                outtakesSnap = await base.orderBy('created_at').get()
            } else outtakesSnap = await base.get();
            let outtakes = [];
            outtakesSnap.forEach(doc => {
                outtakes.push({
                    id: doc.id,
                    ...doc.data()
                })
            });
            context.commit("setOuttakes", outtakes)
        } catch (e) {
            console.log(e)
        }
    },

    async getOuttakesCategories({commit}) {
        // let outtakesDoc = await
        return new Promise((resolve, reject) => {
            firebase.firestore().collection('operational/').doc('outtakes').onSnapshot((outtakesDoc) => {
                let categories = [];
                if (!outtakesDoc.exists) {
                    firebase.firestore().collection('operational/').doc('outtakes').set({
                        categories: []
                    })
                } else {
                    categories = outtakesDoc.data().categories;
                    if (!categories) categories = [];

                    // outtakesCol.forEach((doc) => {
                    //     categories.push(doc.data())
                    // })
                }
                commit('setOuttakesCategories', categories);
                resolve();
            })
        });
    },
    async addOuttakesCategory(context, payload) {
        await context.dispatch('getOuttakesCategories');
        let categories = context.getters.outtakesCategories;
        categories.push({name: payload.category, subCategories: []});
        await firebase.firestore().collection('operational/').doc('outtakes').update({
            categories: categories
        });
        context.commit('setOuttakesCategories', categories);


    },
    async addOuttakeSubcategory(context, payload) {
        await context.dispatch('getOuttakesCategories');
        let categories = context.getters.outtakesCategories;
        let categoriesName = categories.map(e => e.name);
        const index = categoriesName.indexOf(payload.category.name);
        if (!categories[index].subCategories) {
            categories[index].subCategories = []
        }
        categories[index].subCategories.push(payload.newSubcategory);
        await firebase.firestore().collection('operational/').doc('outtakes').update({
            categories: categories
        });
        context.commit('setOuttakesCategories', categories);
    },

    async removeOuttakeSubcategory(context, payload) {
        await context.dispatch('getOuttakesCategories');
        let categories = context.getters.outtakesCategories;
        let categoriesName = categories.map(e => e.name);
        const index = categoriesName.indexOf(payload.category.name);
        // categories[index].subCategories.push(payload.newSubcategory);
        const aux = categories[index].subCategories.splice(payload.subIndex, 1);

        await firebase.firestore().collection('operational/').doc('outtakes').update({
            categories: categories
        })
    },


    async addOuttakes(context, outtake) {
        outtake = functions.removeUndefineds(outtake);
        await firebase.firestore().collection('outtakes/').add(outtake)
    },
    async updateOuttake(context, payload) {
        if (payload.value === 'delete') {
            payload.value = firebase.firestore.FieldValue.delete()
        }
        await firebase.firestore().collection('outtakes/').doc(payload.outtake.id).update({
            [payload.field]: payload.value
        })
    },
    async deleteOuttake(context, outtake) {
        await firebase.firestore().collection('outtakes/').doc(outtake.id).delete()
    },

    async dueDateToday (context, data) {
        let date = data.date;
        let outtakes = data.outtakes;
        let listOuttakes = [];

        outtakes.forEach((outtake) => {
            if (outtake.date_to_pay === date && !outtake.paid) {
                listOuttakes.push({
                    outtake
                })
            }
        });

        context.commit('setAlertOuttakes', listOuttakes);
    },
};

const getters = {
    outtakes(state) {
        return state.outtakes
    },
    outtakesCategories(state) {
        return state.categories
    },
    alertOuttakes(state) {
        return state.alertOuttakes
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}
