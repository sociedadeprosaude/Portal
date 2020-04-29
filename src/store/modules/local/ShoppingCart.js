import Vue from 'vue'

const state = {
    items: [],
    budget: undefined
};

const mutations = {
    setSelectedBudget(state, payload) {
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
                    let trocarNumero= a.price;
                    a.price= a.priceDiscount;
                    a.priceAntigo = trocarNumero;
                    return a.clinic
                }
                else{

                    return a.clinic
                }
            }
        });

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