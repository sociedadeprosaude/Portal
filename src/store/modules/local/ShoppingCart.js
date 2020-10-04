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
            if(a.doctor){
                console.log('a: ', a)
                return a
            }
        });
        let exams = state.items.filter((a) => {
            if(!a.doctor){
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
        console.log('aaa', state.items)
        state.items.forEach((element) => {
            let clinicName = element.clinic ? element.clinic.name : element.doctor.clinic.name
            if(!clinics[clinicName]) {
                clinics[clinicName] = []
            }
                clinics[clinicName].push(element)
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
