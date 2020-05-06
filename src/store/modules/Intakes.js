import firebase, {firestore} from "firebase";
import functions from "../../utils/functions";

const state = {
    intakes: [],
    categories: []
}

const mutations = {
    // setOuttakes(state, payload) {
    //     state.outtakes = payload
    // },
    setIntakesCategories(state, payload) {
        state.categories = payload
    },
};

const actions = {

    async getIntakesCategories({commit}) {

        firebase.firestore().collection('operational/').doc('intakes').onSnapshot((outtakesDoc) => {
            let categories = [];
            if (!outtakesDoc.exists) {
                firebase.firestore().collection('operational/').doc('intakes').set({
                    categories: []
                })
            } else {
                categories = outtakesDoc.data().categories
                // outtakesCol.forEach((doc) => {
                //     categories.push(doc.data())
                // })
            }
            commit('setIntakesCategories', categories)
        })
    },
    async addIntakesCategory(context, category) {
        await context.dispatch('getIntakesCategories')
        let categories = context.getters.intakesCategories
        if(categories.indexOf(category) > -1) {
            return
        }
        categories.push(category)
        try {
            await firebase.firestore().collection('operational/').doc('intakes').update({
                categories: categories
            })
        } catch (e) {
            console.log(e)
        }
    },
    async addFinancialSupportIntake(context, intake) {
        intake = functions.removeUndefineds(intake)
        await context.dispatch('addIntakesCategory', intake.category)
        await firebase.firestore().collection('intakes/').add(intake)
    },

};

const getters = {

    intakesCategories(state) {
        return state.categories
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}
