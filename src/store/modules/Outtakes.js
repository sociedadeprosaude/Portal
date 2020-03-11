import firebase, { firestore } from "firebase";
import functions from "../../utils/functions";

const state = {
    outtakes: [],
    categories: []
}

const mutations = {
    setOuttakes(state, payload) {
        state.outtakes = payload
    },
    setOuttakesCategories(state, payload) {
        state.categories = payload
    },
}

const actions = {
    async getOuttakes({ commit }) {
        let outtakes = []
        try {
            let outtakesCol = await firebase.firestore().collection('outtakes/').get()
            outtakesCol.forEach((doc) => {
                outtakes.push({
                    id: doc.id,
                    ...doc.data()
                })
            })
            //console.log(resp)
        } catch (e) {
            console.log(e)
        }
        commit('setOuttakes', outtakes)
        return
    },
    async getOuttakesCategories({ commit }) {
        // let outtakesDoc = await
        firebase.firestore().collection('operational/').doc('outtakes2').onSnapshot((outtakesDoc) => {
            let categories = []
            if (!outtakesDoc.exists) {
                firebase.firestore().collection('operational/').doc('outtakes2').set({
                    categories: []
                })
            } else {
                categories = outtakesDoc.data().categories
                // outtakesCol.forEach((doc) => {
                //     categories.push(doc.data())
                // })
            }
            commit('setOuttakesCategories', categories)
        })
    },
    async addOuttakesCategory(context, category) {
        await context.dispatch('getOuttakesCategories')
        let categories = context.getters.outtakesCategories
        categories.push({ name: category, subCategories: [] })
        await firebase.firestore().collection('operational/').doc('outtakes2').update({
            categories: categories
        })
    },
    async addOuttakeSubcategory(context, payload) {
        await context.dispatch('getOuttakesCategories')
        let categories = context.getters.outtakesCategories
        let categoriesName = categories.map(e => e.name);
        const index = categoriesName.indexOf(payload.category.name);
        categories[index].subCategories.push(payload.newSubcategory);
        await firebase.firestore().collection('operational/').doc('outtakes2').update({
            categories: categories
        })
    },


    async addOuttakes(context, outtake) {
        outtake = functions.removeUndefineds(outtake)
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
    }
}

const getters = {
    outtakes(state) {
        return state.outtakes
    },
    outtakesCategories(state) {
        return state.categories
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}
