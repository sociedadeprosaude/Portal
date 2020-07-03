import firebase from "firebase";
import moment from "moment"
import Users from "./Users";
import { ADDRGETNETWORKPARAMS } from "dns";

const state = {
    statistics: null,
    clientsServed:{},
    newClients:{},
    ageClientsServed:{}
};

const mutations = {
    setStatistics: (state, payload) => state.statistics = payload,
    setClientsServed:(state,payload) => state.clientsServed = payload,
    setNewClients:(state,payload) => state.newClients = payload,
    setAgeClientsServed:(state,payload) => state.ageClientsServed = payload
};

var emptyItem = () => ({
    numOfSales: 0,
    totalRaw: 0,
    totalCost: 0,
    totalProfit: 0
})

const actions = {
    async getStatistics({ commit }, payload) {
        var statistics = await firebase.firestore().collection('statistics').doc('caixa').collection('days').get();
        var statsYearMonth = {}

        statistics = statistics.docs.map((doc) => {
            const statDay = doc.data();
            let [year, month, day] = statDay.date.match(/\d+/g);
            if (!statsYearMonth[year]) statsYearMonth[year] = {};
            if (!statsYearMonth[year][month]) statsYearMonth[year][month] = {
                numOfSales: 0,
                totalRaw: 0,
                totalCost: 0,
                totalProfit: 0,
                itens: {},
                arrTotalRaw: Array.from(Array(moment(statDay.date).daysInMonth()).keys()).map(() => 0)
            };
            statsYearMonth[year][month].arrTotalRaw[Number(day) - 1] = statDay.totalRaw;
            statsYearMonth[year][month].totalRaw += statDay.totalRaw;
            statsYearMonth[year][month].totalCost += statDay.totalCost;
            statsYearMonth[year][month].totalProfit += statDay.totalProfit;
            statsYearMonth[year][month].numOfSales += statDay.numOfSales;
            Object.keys(statDay.itens).forEach((obj) => {
                if (!statsYearMonth[year][month].itens[obj]) statsYearMonth[year][month].itens[obj] = {
                    numOfSales: 0,
                    totalRaw: 0,
                    totalCost: 0,
                    totalProfit: 0,
                };
                statsYearMonth[year][month].itens[obj].totalRaw += statDay.itens[obj].totalRaw;
                statsYearMonth[year][month].itens[obj].totalCost += statDay.itens[obj].totalCost;
                statsYearMonth[year][month].itens[obj].totalProfit += statDay.itens[obj].totalProfit;
                statsYearMonth[year][month].itens[obj].numOfSales += statDay.itens[obj].numOfSales;

            })
            return statDay
        })
        console.log(statistics);
        console.log(statsYearMonth);
        commit('setStatistics', statsYearMonth)
    },
    async getStatisticsByMonth({ commit }, payload) {
        var statistics = await firebase.firestore().collection('statistics').doc('caixa').collection('month').get();
        var statsYearMonth = {}

        statistics = statistics.docs.map((doc) => {
            const statDay = doc.data();
            let [year, month] = doc.id.match(/\d+/g);
            if (!statsYearMonth[year]) statsYearMonth[year] = {};
            if (!statsYearMonth[year][month]) statsYearMonth[year][month] = {
                numOfSales: 0,
                totalRaw: 0,
                totalCost: 0,
                totalProfit: 0,
                itens: {},
                arrTotalRaw: Array.from(Array(moment(doc.id).daysInMonth()).keys()).map(() => 0)
            };
            statsYearMonth[year][month].arrTotalRaw = statDay.arrTotalRaw;
            statsYearMonth[year][month].totalRaw = statDay.totalRaw;
            statsYearMonth[year][month].totalCost = statDay.totalCost;
            statsYearMonth[year][month].totalProfit = statDay.totalProfit;
            statsYearMonth[year][month].numOfSales = statDay.numOfSales;
            statsYearMonth[year][month].itens = statDay.itens;
            return statDay
        })
        console.log('1->',statistics);
        console.log('2->',statsYearMonth);
        commit('setStatistics', statsYearMonth)
    },
    loadClientsServed({commit},payload){
        let attended = {}
        let ageAttended = {}
        firebase.firestore().collection('users').where('accessed_to','>=',payload.initialDate)
        .where('accessed_to','<=',payload.finalDate)
        .get().then((users)=>{
            users.forEach((user)=>{
                let data = user.data()
                let date = moment(data.accessed_to,'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY')
                let age = moment().diff(moment(data.birth_date),'years')
                if(!attended[date]) attended[date] = 0
                attended[date] += 1

                if(!ageAttended[age]) ageAttended[age] = 0
                ageAttended[age] += 1
                /* console.log('age->',age)
                console.log('qtd->',ageAttended[age]) */
            })
            console.log('ages lista->',ageAttended)
            commit('setClientsServed',attended)
            commit('setAgeClientsServed',ageAttended)
        })
    },
    loadNewClients({commit},payload){
        let newClients = {}
        firebase.firestore().collection('users').where('created_at','>=',payload.initialDate)
        .where('created_at','<=',payload.finalDate)
        .get().then((users)=>{
            users.forEach((user)=>{
                let data = user.data()
                let date = moment(data.created_at,'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY')
                if(!newClients[date]) newClients[date] = 0
                newClients[date] += 1
            })
            console.log('news->',newClients)
            commit('setNewClients',newClients)
        })
    }
};

const getters = {
    getStatistics: (state) => state.statistics,
    getClientsServed:(state) => state.clientsServed,
    getNewClients:(state) => state.newClients,
    getAgeClientsServed:(state) => state.ageClientsServed,
};

export default {
    state,
    mutations,
    actions,
    getters
}