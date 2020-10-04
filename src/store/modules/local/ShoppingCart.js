import Vue from 'vue'

const state = {
    items: [],
    test: {},
    budget: undefined,
    doctor: undefined
};

const mutations = {
    setSelectedDoctor(state, doctor) {
        state.doctor = doctor
    },
    setSelectedBudget(state, payload) {
        state.budget = payload
    },
    setShoppingCartItems(state, payload) {
        state.items = payload
    },
    addShoppingCartItem(state, payload) {
        console.log('items: ', state.items)
        console.log('payload: ', payload)
        for (let item in state.items) {
            if (state.items[item].name === payload.name) {
                state.items[item] = payload;
                Vue.set(state.items, item, payload);
                return
            }
        }
        state.items.push(payload);
    },
    removeShoppingCartItem(state, payload) {
        state.items.splice(state.items.indexOf(payload), 1);
    },
    clearShoppingCartItens(state) {
        state.items = [];
    }
};

const actions = {

};

const getters = {
    selectedBudget(state) {
        return state.budget
    },
    shoppingCartSelectedDoctor(state) {
      return state.doctor
    },
    getShoppingCartItems(state) {
        return state.items
    },
    getShoppingCartItemsByCategory(state) {
        let consultations = state.items.filter((a) => {
            if(a.type === 'appointment'){
                console.log('a: ', a)
                return a
            }
        });
        let exams = state.items.filter((a) => {
            if(a.type === 'exam'){
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
        let clinics = {}
        state.items.forEach((element) => {
            if(!clinics[element.clinic.name]) {
                clinics[element.clinic.name] = []
            }
                clinics[element.clinic.name].push(element)
        })
        return {
            consultations: consultations,
            exams: exams,
            clinics: clinics
        }
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}
