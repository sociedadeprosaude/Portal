import firebase, {firestore} from "firebase";
const state = { colaboratorsWarning: {}, };
const mutations = { setcolaboratorsWarning(state, payload) { state.colaboratorsWarning = payload }, };
const actions = {
    async DiscountWarning(context, payload){
        await firebase.firestore().collection('discount').doc(payload.uid).collection('intakes').
            doc(payload.orcamento.toString()).set(payload);
        await firebase.firestore().collection('discount').doc(payload.uid).set({exist: true})
    },
    async WarningColaborators({commit}) {
        firebase.firestore().collection('discount').get().then(async (Snap) => {
            let WarningColaborators = {};
            for (let document in  Snap.docs) {
                let warning= await firebase.firestore().collection('discount').doc(Snap.docs[document].id).collection('intakes').get()
                    warning.forEach((e) => {
                        if(!WarningColaborators[Snap.docs[document].id.toString()]){
                            WarningColaborators[Snap.docs[document].id.toString()] = {
                                intakes: {},
                                name: e.data().name,
                                cpf: Snap.docs[document].id,
                                qtd: 0
                            }
                        }
                        if(!WarningColaborators[Snap.docs[document].id.toString()].intakes[e.data().orcamento.toString()]){
                            WarningColaborators[Snap.docs[document].id.toString()].intakes[e.data().orcamento.toString()]= {
                                cpf: e.data().cpf,
                                uid: e.data().uid,
                                date: e.data().date,
                                discount: e.data().discont,
                                name: e.data().name,
                                orcamento: e.data().orcamento
                            };
                            WarningColaborators[Snap.docs[document].id.toString()].qtd +=1
                        }
                    })
            }
            commit('setcolaboratorsWarning', WarningColaborators);
        })
    },
    async DiscountWarningDelete(context, payload){
        await firebase.firestore().collection('discount').doc(payload.uid).delete();
    },
};
const getters = {
    colaboratorsWarning(state){ return state.colaboratorsWarning }
};
export default {
    state,
    mutations,
    actions,
    getters
}