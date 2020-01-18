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
}

const actions = {
    // async getOuttakes({commit}) {
    //     let outtakes = []
    //     try {
    //         let outtakesCol = await firebase.firestore().collection('outtakes/').get()
    //         outtakesCol.forEach((doc) => {
    //             outtakes.push({
    //                 id: doc.id,
    //                 ...doc.data()
    //             })
    //         })
    //         //console.log(resp)
    //     } catch (e) {
    //         console.log(e)
    //     }
    //     commit('setOuttakes', outtakes)
    //     return
    // },
    async getIntakesCategories({commit}) {
        // let outtakesDoc = await
        firebase.firestore().collection('operational/').doc('intakes').onSnapshot((outtakesDoc) => {
            let categories = []
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
    // async updateOuttake(context, payload) {
    //     if (payload.value === 'delete') {
    //         payload.value = firebase.firestore.FieldValue.delete()
    //     }
    //     await firebase.firestore().collection('outtakes/').doc(payload.outtake.id).update({
    //         [payload.field]: payload.value
    //     })
    // },
    // async deleteOuttake(context, outtake) {
    //     await firebase.firestore().collection('outtakes/').doc(outtake.id).delete()
    // }
}

const getters = {
    // outtakes(state) {
    //     return state.outtakes
    // },
    intakesCategories(state) {
        return state.categories
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}
