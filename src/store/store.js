import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from '../router'
import constants from '@/utils/constants'
import VuexPersistence from 'vuex-persist'

import Users from '@/store/modules/Users'
import Exams from '@/store/modules/Exams'
import Auth from '@/store/modules/Auth'
import Labor from '@/store/modules/Labor'
import Reports from './modules/Reports'

import Localization from "./modules/Localization"
import Bundles from "./modules/Bundles";
import Doctors from "./modules/Doctors"
import Clinics from "./modules/Clinics"
import Consultations from "./modules/Consultations";
import LayoutControl from "./modules/local/LayoutControl";
import Specialties from "./modules/Specialties";
import Saidas from "./modules/Saidas"
import Budget from "./modules/Budget"
import ShoppingCart from "./modules/local/ShoppingCart";
import Operational from "./modules/Operational";
import ItemsPackage from "./modules/local/ItemsPackage";
import LocalUnit from "./modules/local/Unit";


Vue.use(Vuex);

if (process.env.NODE_ENV === 'development') {
    // var AUTH_URL = 'http://prosaude.auth/'
    var AUTH_URL = 'http://caixa.instituicaoprosaude.com:83/'
} else {
    var AUTH_URL = 'http://caixa.instituicaoprosaude.com:83/'
}

const vuexLocal = new VuexPersistence({
    storage: window.localStorage,
    modules: ['LocalUnit']
})

const store = new Vuex.Store({
    plugins: [vuexLocal.plugin],
    modules: {
        Auth,
        Users,
        Reports,
        Labor,
        Localization,
        Doctors,
        Clinics,
        Exams,
        Consultations,
        LayoutControl,
        Bundles,
        Specialties,
        Saidas,
        Budget,
        ShoppingCart,
        ItemsPackage,
        Operational,
        LocalUnit
    },

    state: {
        categories: [],
        expenses: [],
        intakes: [],
        user: null,
        currentDate: (new Date()).toISOString().substring(0, 10),
        loading: false,
        expensesIntakesListener: false,
        token: localStorage.getItem('token'),
    },

    mutations: {
        setToken(state, payload) {
            state.token = payload.token;
            state.tokenStatus = payload.status;
            if (payload.status === constants.TOKEN_STATUS_VALID) {
                localStorage.setItem('token', payload.token);
                axios.defaults.headers.common['token'] = payload.token
            } else {
                localStorage.removeItem('token')
            }
            router.push('/')
        },
        setUser(state, payload) {
            state.user = payload
        },
        setDate(state, payload) {
            state.currentDate = payload
        },
        setCategories(state, payload) {
            state.categories = payload
        },
        setExpenses(state, payload) {
            state.expenses = payload
        },
        setIntakes(state, payload) {
            state.intakes = payload
        },
        setLoading(state, payload) {
            state.loading = payload
        },
        addExpensive(state, payload) {
            state.expenses.push(payload)
        },
        addIntake(state, payload) {
            state.intakes.push(payload)
        },
        deleteExpense(state, payload) {
            for (let expense in state.expenses) {
                if (state.expenses[expense].id === payload) {
                    Vue.delete(state.expenses, expense)
                }
            }
        },
        deleteIntake(state, payload) {
            for (let intake in state.intakes) {
                if (state.intakes[intake].id === payload) {
                    Vue.delete(state.intakes, intake)
                }
            }
        },
        setExpensesIntakesListener(state, payload) {
            state.expensesIntakesListener = payload
        }
    },
    actions: {
        login({commit}, payload) {
            return new Promise((resolve, reject) => {
                axios.post(AUTH_URL + 'auth/authenticate', payload)
                    .then(response => {
                        commit('setToken', response.data);
                        localStorage.setItem('credential', payload.credential);
                        this.dispatch('getUser');
                        resolve(response)
                    })
                    .catch(error => {
                        console.log(error);
                        reject(error)
                    })
            })
        },
        logout({commit}) {
            return new Promise((resolve, reject) => {
                localStorage.removeItem('token');
                router.go()
            })
        },
        // getUser({commit}) {
        //   return new Promise((resolve, reject) => {
        //     commit('setLoading', true)
        //     axios.get(AUTH_URL + "auth/user", {
        //       params: {
        //         credential: localStorage.getItem('credential')
        //       }
        //     })
        //         .then(response => {
        //           commit('setUser', response.data)
        //           commit('setLoading', false)
        //           resolve(response.data)
        //         })
        //         .catch(error => {
        //           if (error.response.status === 401) {
        //             router.push('/login')
        //           }
        //           console.log(error.response.status)
        //         })
        //   })
        // },
        // addUser({commit}, payload) {
        //   return new Promise((resolve, reject) => {
        //     axios.post(AUTH_URL + "auth/user/adicionar", payload)
        //         .then(response => {
        //           resolve(response.data)
        //         })
        //   })
        // }
        // ,
        getCategories({commit, getters}) {
            axios.get('api/despesas/categorias')
                .then(response => {
                    commit('setCategories', response.data.categories)
                })
                .catch(error => {
                    console.log(error)
                })
        },
        getExpenses({commit, getters}, date) {
            return new Promise((resolve, reject) => {
                // axios.get('api/despesas/hoje')
                axios.get('api/despesas/data', {params: {date: (date).substring(0, 10)}})
                    .then(response => {
                        commit('setExpenses', response.data.expenses)
                        resolve(response.data.expenses)
                    })
                    .catch(error => {
                        console.log(error);
                        reject(error)
                    })
            })
        },
        // getIntakes({commit, getters}, date) {
        //   return new Promise((resolve, reject) => {
        //     // axios.get('api/entradas/hoje')
        //     axios.get('api/entradas/data', {params: {date: (date).substring(0, 10)}})
        //         .then(response => {
        //           commit('setIntakes', response.data.intakes)
        //           resolve(response.data.intakes)
        //         })
        //         .catch(error => {
        //           console.log(error);
        //           reject(error)
        //         })
        //   })
        // },
        addExpense({commit, getters}, payload) {
            axios.post('api/despesa/adicionar', payload)
                .then(response => {
                    commit('addExpensive', response.data.expense);
                    if (getters.categoriesNames.indexOf(response.data.expense.category) < 0) {
                        this.dispatch('getCategories')
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        deleteExpense({commit, getters}, payload) {
            axios.delete('api/despesa/apagar', {params: payload})
                .then(response => {
                    commit('deleteExpense', payload.expense.id)
                })
                .catch(error => {
                    console.log(error)
                })
        },
        deleteIntake({commit, getters}, payload) {
            axios.delete('api/entrada/apagar', {params: payload})
                .then(response => {
                    commit('deleteIntake', payload.intake.id)
                })
                .catch(error => {
                    console.log(error)
                })
        },
        setLoading({commit}, payload) {
            commit('setLoading', payload)
        },
        setDate({commit}, payload) {
            commit('setDate', payload)
        },
        setExpensesIntakesListener({commit}, payload) {
            commit('setExpensesIntakesListener', payload)
        },
        startExpensesIntakesListener({commit, getters}, payload) {
            window.setTimeout(requestInfo => {
                if (getters.expensesIntakesListener) {
                    this.dispatch('getExpenses', getters.currentDate);
                    this.dispatch('getIntakes', getters.currentDate);
                    this.dispatch('startExpensesIntakesListener')
                }
            }, 5000)
        },
        stopExpensesIntakesListener({commit}) {
            commit('setExpensesIntakesListener', false)
        }
    },
    getters: {
        categories(state) {
            return state.categories
        },
        categoriesNames(state) {
            let names = []
            for (let category in state.categories) {
                names.push(state.categories[category].name)
            }
            return names
        },
        expenses(state) {
            return state.expenses
        },
        intakes(state) {
            return state.intakes
        },
        loading(state) {
            return state.loading
        },
        expensesIntakesListener(state) {
            return state.expensesIntakesListener
        },
        currentDate(state) {
            return state.currentDate
        },
        isAuthenticated(state) {
            return !!state.token
        },
        // user(state) {
        //   return state.user
        // }
    }
});

export default store
