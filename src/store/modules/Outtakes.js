import firebase, { firestore } from "firebase";
import functions from "../../utils/functions";
import moment from "moment";

const state = {
    outtakes: [],

    outtakesPaid: [],
    outtakesPaidMonth: [],
    outtakesPaidToday: [],
    outtakesPending: [],
    categories: [],
    alertOuttakes: [],
};

const mutations = {
    setOuttakes: (state, payload) => state.outtakes = payload,
    setOuttakesPaidMonth: (state, payload) => state.outtakesPaidMonth = payload,
    setOuttakesPaid: (state, payload) => state.outtakesPaid = payload,
    setOuttakesPaidToday: (state, payload) => state.outtakesPaidToday = payload,
    setOuttakesPending: (state, payload) => state.outtakesPending = payload,
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
            context.commit("setOuttakes", outtakes);
        } catch (e) {
            console.log(e)
        }
    },

    async getOuttakesPaid(context, payload) {
        try {
            let query = firebase.firestore().collection('outtakes');
            let outtakesSnap = [];
            if (payload) {
                if (payload.initialDate) {
                    query = query.where('paid', '>=', payload.initialDate)
                }
                if (payload.finalDate) {
                    query = query.where('paid', '<=', payload.finalDate)
                }
                if (payload.category) {
                    query = query.where('category', '==', payload.category)
                }
            }
            // adicionando esse orderBy('paid') faz com que so os docs com o campo paid sejam retornandos
            // assim filtrando ja na query pra so pegar as saidas pagas
            outtakesSnap = await query.orderBy('paid').get();
            let outtakes = [];
            outtakesSnap.forEach(doc => {
                outtakes.push({
                    id: doc.id,
                    ...doc.data()
                })
            });
            context.commit("setOuttakesPaid", outtakes)
        } catch (e) {
            console.log(e)
        }
    },

    async getOuttakesPaidMonth(context, payload) {
        try {
            let query = firebase.firestore().collection('outtakes');
            let outtakesSnap = [];
            if (payload) {
                if (payload.initialDate) {
                    query = query.where('paid', '>=', payload.initialDate)
                }
                if (payload.finalDate) {
                    query = query.where('paid', '<=', payload.finalDate)
                }
                if (payload.category) {
                    query = query.where('category', '==', payload.category)
                }
            }
            // adicionando esse orderBy('paid') faz com que so os docs com o campo paid sejam retornandos
            // assim filtrando ja na query pra so pegar as saidas pagas
            outtakesSnap = await query.orderBy('paid').get();
            let outtakes = [];
            outtakesSnap.forEach(doc => {
                outtakes.push({
                    id: doc.id,
                    ...doc.data()
                })
            });
            context.commit("setOuttakesPaidMonth", outtakes)
        } catch (e) {
            console.log(e)
        }
    },

    async getOuttakesPaidToday(context, payload) {
        try {
            let query = firebase.firestore().collection('outtakes');
            let outtakesSnap = [];
            outtakesSnap = await query
                .where('paid', '>=', moment().format("YYYY-MM-DD 00:00:00"))
                .where('paid', '<=', moment().format("YYYY-MM-DD 23:59:59"))
                .orderBy('paid').get();
            let outtakes = [];
            outtakesSnap.forEach(doc => {
                outtakes.push({
                    id: doc.id,
                    ...doc.data()
                })
            });
            context.commit("setOuttakesPaidToday", outtakes)
        } catch (e) {
            console.log(e)
        }
    },

    async getOuttakesPending(context, payload) {
        try {
            let query = firebase.firestore().collection('outtakes');
            let outtakesSnap = [];
            if (payload) {
                if (payload.initialDate) {
                    query = query.where('created_at', '>=', payload.initialDate)
                }
                if (payload.finalDate) {
                    query = query.where('created_at', '<=', payload.finalDate)
                }
                outtakesSnap = await query.orderBy('created_at').get()
            } else outtakesSnap = await query.get();
            let outtakes = [];
            outtakesSnap.forEach(doc => {
                // Infelizmente não tem uma query que pega os dados se um campo passado for null
                // Entao tem que pegar tudo e filtrar manualmente
                if (!doc.data().paid)
                    outtakes.push({
                        id: doc.id,
                        ...doc.data()
                    })
            });
            context.commit("setOuttakesPending", outtakes)
        } catch (e) {
            console.log(e)
        }
    },

    async getOuttakesCategories({ commit }) {
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
        categories.push({ name: payload.category, subCategories: [] });
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

    async editOuttakes(context, outtake) {
        outtake = functions.removeUndefineds(outtake);
        await firebase.firestore().collection('outtakes/').doc(outtake.id).set(outtake);

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

    async dueDateToday(context, data) {
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

    async addRecurrent(context, outtake) {
        outtake = functions.removeUndefineds(outtake);
        await firebase.firestore().collection('recurrent/').add(outtake);
    }
};

const getters = {
    outtakes(state) {
        return state.outtakes
    },
    outtakesPaid(state) {
        return state.outtakesPaid
    },
    outtakesPaidMonth(state){
        return state.outtakesPaidMonth
    },
    outtakesPaidToday(state) {
        return state.outtakesPaidToday
    },
    outtakesPending(state) {
        return state.outtakesPending
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
