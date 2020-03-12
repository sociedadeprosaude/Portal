import firebase, {firestore} from "firebase";

const state = {
    colaboratorsWarning: {},
};

const mutations = {
    setcolaboratorsWarning(state, payload) {
        state.colaboratorsWarning = payload
    },

};
const actions = {
    async DiscountWarning(context, payload){
        await firebase.firestore().collection('discount').doc(payload.cpf).collection('intakes').
            doc(payload.orcamento.toString()).set(payload)
        console.log('adicionado')
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
                                date: e.data().date,
                                discount: e.data().discont,
                                name: e.data().name,
                                orcamento: e.data().orcamento
                            }
                            WarningColaborators[Snap.docs[document].id.toString()].qtd +=1
                        }
                    })
                console.log('warningColaborators: ', WarningColaborators)
            }
            commit('setcolaboratorsWarning', WarningColaborators);
        })
    }


};
const getters = {
    colaboratorsWarning(state){
        console.log('colaborators',state.colaboratorsWarning)
        return state.colaboratorsWarning
    }
};
0

export default {
    state,
    mutations,
    actions,
    getters
}
