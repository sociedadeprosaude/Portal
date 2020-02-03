import Vue from 'vue'

const state = {
    items: [],
    budget: undefined
};

const mutations = {
    setSelectedBudget(state, payload) {
        //console.log('SetSelectedBudget',payload)
        state.budget = payload
    },
    setShoppingCartItems(state, payload) {
        state.items = payload
    },
    addShoppingCartItem(state, payload) {

        for (let item in state.items) {
            if (state.items[item].name === payload.name) {
                state.items[item] = payload;
                Vue.set(state.items, item, payload);
                return
            }
        }
        state.items.push(payload)
    },
    removeShoppingCartItem(state, payload) {
        state.items.splice(state.items.indexOf(payload), 1)
    },
    clearShoppingCartItens(state) {
        state.items = []
}
};

const actions = {

};

const getters = {
    selectedBudget(state) {
        return state.budget
    },
    getShoppingCartItems(state) {
        return state.items
    },
    getShoppingCartItemsByCategory(state) {
        let consultations = state.items.filter((a) => {
            if(a.doctor){
                return a.doctor
            }
        });
        let exams = state.items.filter((a) => {
            if(a.clinic){
                if(a.priceDiscount){
                    console.log('dentro de um pacote')
                    let trocarNumero= a.price;
                    a.price= a.priceDiscount;
                    a.priceAntigo = trocarNumero;
                    return a.clinic
                }
                else{
                    console.log('fora de um pacote')
                    return a.clinic
                }
            }
        });
     //   let packages = state.items.filter((a) => {
      //      console.log('é um pacote:',a.doctor && a.clinic)
       //     if(!a.clinic && !a.doctor){
         //       let trocarNumero= a.price;
           //     a.price= a.priceDiscount;
             //   a.priceAntigo = trocarNumero;
               // return !a.clinic && !a.doctor
     //       }
   //     });
        console.log('consultas:', consultations)
        console.log('exames:', exams)
        return {
            consultations: consultations,
            exams: exams,
        }
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}
