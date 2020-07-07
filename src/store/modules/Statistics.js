import firebase from "firebase";
import moment from "moment"

const state = {
    statistics: null,
    statisticsOuttakes: null
};

const mutations = {
    setStatistics: (state, payload) => state.statistics = payload,
    setStatisticsOuttakes: (state, payload) => state.statisticsOuttakes = payload
};

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
        // console.log(statistics);
        // console.log(statsYearMonth);
        commit('setStatistics', statsYearMonth)
    },
    async getStatisticsByMonth({ commit }, payload) {
        var statistics = await firebase.firestore().collection('statistics').doc('caixa').collection('month').get();
        var statsYearMonth = {}

        statistics = statistics.docs.map((doc) => {
            const statDay = doc.data();
            let [year, month] = doc.id.match(/\d+/g);
            if (!statsYearMonth[year]) statsYearMonth[year] = {};
            statsYearMonth[year][month] = {};
            statsYearMonth[year][month].arrTotalRaw = statDay.arrTotalRaw;
            statsYearMonth[year][month].totalRaw = statDay.totalRaw;
            statsYearMonth[year][month].totalCost = statDay.totalCost;
            statsYearMonth[year][month].totalProfit = statDay.totalProfit;
            statsYearMonth[year][month].numOfSales = statDay.numOfSales;
            statsYearMonth[year][month].itens = statDay.itens;
            return statDay
        })
        // console.log(statistics);
        // console.log(statsYearMonth);
        commit('setStatistics', statsYearMonth)
    },
    //================================Outtakes======================================================


    async getStatisticsOuttakesByMonth({ commit }, payload) {
        var statistics = await firebase.firestore().collection('statistics').doc('outtakes').collection('month').get();
        var statsYearMonth = {}

        var outtakes = await firebase.firestore().collection('outtakes').get();
        outtakes = outtakes.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log(outtakes)

        statistics = statistics.docs.map((doc) => {
            const statDay = doc.data();
            let [year, month] = doc.id.match(/\d+/g);
            if (!statsYearMonth[year]) statsYearMonth[year] = {};
            statsYearMonth[year][month] = {};
            statsYearMonth[year][month].arrTotalToPay = statDay.arrTotalToPay;
            statsYearMonth[year][month].numOfOuttakesToPay = statDay.numOfOuttakesToPay;
            statsYearMonth[year][month].totalLeftToPay = statDay.totalLeftToPay;
            statsYearMonth[year][month].totalToPay = statDay.totalToPay;
            statsYearMonth[year][month].totalRecurrent = statDay.totalRecurrent;
            statsYearMonth[year][month].itens = statDay.itens;
            return statDay
        })
        // console.log(statistics);
        // console.log(statsYearMonth);
        commit('setStatisticsOuttakes', statsYearMonth)
    }
};

const getters = {
    getStatistics: (state) => state.statistics,
    getStatisticsOuttakes: (state) => state.statisticsOuttakes
};

export default {
    state,
    mutations,
    actions,
    getters
}