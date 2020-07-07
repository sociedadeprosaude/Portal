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
    outtakeClinic: [],
    OuttakesConsultationDoctor:[]
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
    setOuttakeClinic(state, payload) {
        state.outtakeClinic = payload
    },
    setOuttakesConsultationDoctor(state, payload){
        state.OuttakesConsultationDoctor= payload
    }
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

    //=============================== Categorias Outtakes ======================================================

    async addOuttakesCategory({ commit, getters }, payload) {
        let categories = getters.outtakesCategories;
        categories.push({ name: payload.category, subCategories: [] });
        await firebase.firestore().collection('operational/').doc('outtakes').update({
            categories: categories
        });
        commit('setOuttakesCategories', categories);
    },
    async addOuttakeSubcategory({ commit, getters }, payload) {
     
        let categories = getters.outtakesCategories;
        let categoriesName = categories.map(e => e.name);
        const index = categoriesName.indexOf(payload.category);
        categories[index].subCategories.push(payload.subCategory);
        await firebase.firestore().collection('operational/').doc('outtakes').update({
            categories: categories
        });
        commit('setOuttakesCategories', categories);
    },

    async getOuttakesCategories({ commit }) {
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
                }
                commit('setOuttakesCategories', categories);
                resolve();
            })
        });
    },

    async removeOuttakeCategory({ dispatch, getters }, payload) {
        var categories = getters.outtakesCategories;
        var updatedCategories = categories.filter((category) => category.name != payload.category)
        await firebase.firestore().collection('operational/').doc('outtakes').update({
            categories: updatedCategories
        })
        //dispatch('getOuttakesCategories');
    },
    async CalculedValuePaymentDoctor(context, payload) {
        let cost=0
        let NumberConsultations=0
        console.log('payload: ', payload)
        await firebase.firestore().collection('outtakes').where('crm','==',payload.crm)
            .where('paid','==',false).get().then((querySnapshot) =>{
                querySnapshot.forEach((doc) => {
                    console.log('doc :', doc.data())
                    if (!doc.data().cancelled_by && doc.data().specialties) {
                        if (doc.data().doctor.name === payload.name) {
                            console.log('entrei')
                            NumberConsultations += 1;
                            cost += parseFloat(doc.data().specialties.cost)
                        }
                    }
                })
            });
        let doctor = {
            cost: cost,
            NumberExams: NumberConsultations
        }
        return doctor
    },

    async GetReceiptsDoctor(context, payload) {

        await firebase.firestore().collection('outtakes').where('crm','==',payload.crm)
            .where('paid','==',false).get().then((querySnapshot) =>{
                let outtakes= []
                querySnapshot.forEach((doc) =>{
                    if(!doc.data().cancelled_by && doc.data().specialties){
                        let consultations= {}
                        let patient= doc.data().user.name
                        let intakeNumber= doc.data().intake_id
                        let outtakesDoctor = {}
                        consultations = ({
                            name: doc.data().specialties.name,
                            price: doc.data().specialties.cost,
                            realized: doc.data().specialties.realized,

                        })
                        if(consultations.name){
                            outtakesDoctor = {
                                consultations: consultations,
                                patient: patient,
                                intakeNumber: intakeNumber
                            }
                            outtakes.push(outtakesDoctor)
                        }
                    }
                })
                context.commit('setOuttakesConsultationDoctor',outtakes)
            });
    },


    async removeOuttakeSubcategory({ getters, dispatch }, payload) {
        let categories = getters.outtakesCategories;
        let index = categories.map(c => c.name).indexOf(payload.category);
        categories[index].subCategories = categories[index].subCategories.filter((sub) => sub != payload.subCategory)
      
        await firebase.firestore().collection('operational/').doc('outtakes').update({
            categories: categories
        })
        //dispatch('getOuttakesCategories');
    },
    //==========================================================================================

    async addOuttakes(context, outtake) {
        outtake = functions.removeUndefineds(outtake);
        await firebase.firestore().collection('outtakes/').add(outtake)
    },
    async addSpecialtyOuttakes(context, outtake) {
        outtake = functions.removeUndefineds(outtake);
        var item=0;
        let SpecificOuttake = await firebase.firestore().collection('outtakes').where('intake_id','==', outtake.intake_id).where('crm','==',outtake.crm).get();
        SpecificOuttake.forEach(doc => {
            if(doc.data().specialties.name === outtake.specialties.name){
                item +=1
            }
        });
        if(item === 0){
            await firebase.firestore().collection('outtakes/').add(outtake)
        }
    },
    async getSpecificOuttake({commit}, intake) {
        let outtakes = []
        let SpecificOuttake = await firebase.firestore().collection('outtakes').where('intake_id','==', parseInt(intake.number)).where('cnpj','==',intake.cnpj).get();
        SpecificOuttake.forEach(doc => {
            console.log('doc: ', doc.data())
            outtakes.push(doc.data())
        })
        console.log('outtake: ', outtakes)
        commit('setOuttakeClinic',  outtakes)

    },
    async updatingSpecificOuttake({commit}, outtake) {
        if(outtake.exams.filter( (exam) => exam.realized === true)){
            let NewOuttake = {
                    intake_id: outtake.outtake.intake_id,
                    user: outtake.outtake.user,
                    unit: outtake.outtake.unit,
                    clinic: outtake.outtake.clinic,
                    exams: outtake.outtake.exams.filter( (exam) => exam.realized === true),
                    paid: false,
                    root:false,
                    cnpj: outtake.outtake.cnpj
            }
            NewOuttake = functions.removeUndefineds(NewOuttake);
            await firebase.firestore().collection('outtakes/').add(NewOuttake)
        }
        if(outtake.outtake.exams.filter( (exam) => exam.realized !== true).length === 0 ){
            let SpecificOuttake = await firebase.firestore().collection('outtakes')
                .where('intake_id','==', parseInt(outtake.outtake.intake_id)).where('cnpj','==',outtake.outtake.cnpj)
                .where('root', '==', true).get();
            SpecificOuttake.forEach((doc) => {
                firebase.firestore().collection('outtakes').doc(doc.id).delete()
            })
        }
        else{
            let SpecificOuttake = await firebase.firestore().collection('outtakes')
                .where('intake_id','==', parseInt(outtake.outtake.intake_id)).where('cnpj','==',outtake.outtake.cnpj)
                .where('root', '==', true).get();
            SpecificOuttake.forEach((doc) => {
                firebase.firestore().collection('outtakes').doc(doc.id).update({
                    exams: outtake.outtake.exams.filter( (exam) => !exam.realized)
                })
            })
        }


        /*  let SpecificOuttake = await firebase.firestore().collection('outtakes').where('intake_id','==', parseInt(outtake.number)).where('cnpj','==',outtake.cnpj).get();
        SpecificOuttake.forEach(async doc => {
            console.log('doc data: ', doc.data())
            let Exams = doc.data().exams
            for (let exam in Exams) {
                for (let UpdateExam in outtake.exams) {
                    if (Exams[exam].name === outtake.exams[UpdateExam].name) {
                        Exams[exam].realized = outtake.exams[UpdateExam].realized
                    }
                }
            }
            let id = doc.id;
            console.log('exams: ', Exams)
            await firebase.firestore().collection('outtakes').doc(id).update({exams: Exams})
        }) */


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
    outtakesPaidMonth(state) {
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
    },
    outtakeClinic(state) {
        return state.outtakeClinic
    },
    OuttakesConsultationDoctor(state){
        return state.OuttakesConsultationDoctor
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}
