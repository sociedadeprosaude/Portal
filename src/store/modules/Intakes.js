import firebase, {firestore} from "firebase";
import functions from "../../utils/functions";

const state = {
    intakes: [],
    categories: [],
    intakesClinic: [],
}

const mutations = {

    setIntakesCategories(state, payload) {
        state.categories = payload
    },
    setIntakesClinic(state, payload){
        state.intakesClinic =  payload
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
    async getSpecificIntake({commit}, intake){
        var SpecificIntake = await firebase.firestore().collection('intakes').doc(intake.number).get()
        let exams= []
        let patient= SpecificIntake.data().user.name
        let intakeNumber= intake.number
        let intakeClinic = {}
        for(let exam in SpecificIntake.data().exams){
            if(SpecificIntake.data().exams[exam].clinic.cnpj === intake.cnpj){
                if(SpecificIntake.data().exams[exam].realized){
                    exams.push({
                        name: SpecificIntake.data().exams[exam].name,
                        price: SpecificIntake.data().exams[exam].cost,
                        rules: SpecificIntake.data().exams[exam].rules,
                        realized: SpecificIntake.data().exams[exam].realized,
                    });
                }
            else{
                    exams.push({
                        name: SpecificIntake.data().exams[exam].name,
                        price: SpecificIntake.data().exams[exam].cost,
                        rules: SpecificIntake.data().exams[exam].rules,
                        realized: false,
                    });
                }
            }
            intakeClinic = {
                exams: exams,
                patient: patient,
                intakeNumber: intakeNumber
            }
        }
        commit('setIntakesClinic', intakeClinic)
    },
    async updatingSpecificIntake({commit}, intake){
        var SpecificIntake = await firebase.firestore().collection('intakes').doc(intake.number).get()
        var Exams= SpecificIntake.data().exams
        for(let exam in Exams){
            for(let UpdateExam in intake.exams){
                if (Exams[exam].name === intake.exams[UpdateExam].name){
                    Exams[exam].realized = intake.exams[UpdateExam].realized
                }
            }
        }
        await firebase.firestore().collection('intakes').doc(intake.number).update({exams:Exams})
    }
};

const getters = {

    intakesCategories(state) {
        return state.categories
    },
    intakesClinic(state){
        return state.intakesClinic
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}
