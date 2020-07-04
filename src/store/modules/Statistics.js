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

var emptyItem = () => ({
    numOfSales: 0,
    totalRaw: 0,
    totalCost: 0,
    totalProfit: 0
})

function mapOuttakeCategory(outtake) {
    return {
        cost: Number(outtake.value),
        name: outtake.category,
        date: outtake.created_at,
        paid: outtake.paid
    }
}

function analyzeOuttakesByMonth(outtakes) {
    var analyzed = {};
    Object.keys(outtakes).forEach((date) => {
        var totalToPay = outtakes[date].reduce((total, e) => total + e.cost, 0);
        var totalLeftToPay = outtakes[date].reduce((total, e) => total + (e.paid ? 0 : e.cost), 0);
        var numLeftToPay = outtakes[date].filter((outtake) => !outtake.paid).length;

        var totalRecurrent = outtakes[date].filter((outtake) => outtake.recurrent).reduce((total, e) => total + e.cost, 0);

        var arrTotalToPay = Array.from(Array(moment(date).daysInMonth()).keys()).map(() => 0)

        var itens = {}
        outtakes[date].forEach((outtake) => {
            let [year, month, day] = outtake.date.match(/\d+/g);
            arrTotalToPay[Number(day) - 1] += outtake.cost;

            if (!itens[outtake.name]) itens[outtake.name] = {
                totalToPay: 0,
                totalLeftToPay: 0,
                numLeftToPay: 0
            };
            itens[outtake.name].totalToPay += outtake.cost;
            itens[outtake.name].totalLeftToPay += outtake.paid ? 0 : outtake.cost;
            itens[outtake.name].numLeftToPay += outtake.paid ? 0 : 1;
        })
        analyzed[date] = {
            date: date,
            totalRecurrent: totalRecurrent,
            totalToPay: totalToPay,
            totalLeftToPay: totalLeftToPay,
            numLeftToPay: numLeftToPay,
            itens: itens,
            arrTotalToPay: arrTotalToPay
        }
    })
    return analyzed
}


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
        // console.log(statistics);
        // console.log(statsYearMonth);
        commit('setStatistics', statsYearMonth)
    },
    //================================Outtakes======================================================
    async analyseStatisticsOuttakesByMonth({ commit }, payload) {
        var outtakes = await firebase.firestore().collection('outtakes').get();
        outtakes = outtakes.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        console.log(outtakes)



        var outtakesCategory = outtakes.filter((doc) => (doc.category))

        var outtakesCategoryRecurrent = outtakesCategory.filter((doc) => doc.recurrent == "true")
        console.log('recurrent', outtakesCategoryRecurrent.reduce((total, e) => total + Number(e.value), 0))
        var outtakesCategoryOnce = outtakesCategory.filter((doc) => doc.recurrent != "true")
        console.log('notRecurrent', outtakesCategoryOnce.reduce((total, e) => total + Number(e.value), 0))

        var outtakesCategoryPaid = outtakesCategory.filter((doc) => (doc.paid))
            .map((outtake) => ({
                cost: Number(outtake.value),
                name: outtake.category,
                date: outtake.created_at,
                paid: true,
                recurrent: outtake.recurrent == "true"
            }))

        var outtakesCategoryToPay = outtakesCategory.filter((doc) => (!doc.paid))
            .map((outtake) => ({
                cost: Number(outtake.value),
                name: outtake.category,
                date: outtake.created_at,
                paid: false,
                recurrent: outtake.recurrent == "true"
            }))

        var groupedCategory = {}
        var outtakesToGroup = [...outtakesCategoryPaid, ...outtakesCategoryToPay]
        outtakesToGroup.forEach(({ date }) => {
            let [year, month, day] = date.match(/\d+/g);
            groupedCategory[`${year}-${month}`] =
                outtakesToGroup.filter(({ date: d }) => `${year}-${month}` === d.slice(0, 7));
        })
        var outtakesCategoryAnalyzed = analyzeOuttakesByMonth(groupedCategory);

        var outtakesClinic = outtakes.filter((doc) => (doc.exams || doc.specialties))
        var outtakesClinicToPay = outtakesClinic.filter((doc) => !doc.paid)
        var outtakesClinicPaid = outtakesClinic.filter((doc) => doc.paid)

        // var grouped = {}
        // outtakesCategory.forEach(({ created_at }) => {
        //     let [year, month, day] = created_at.match(/\d+/g);
        //     grouped[`${year}-${month}`] =
        //         outtakesCategory.filter(({ created_at: d }) => `${year}-${month}` === d.slice(0, 7));
        // })

        //console.log(outtakesCategoryToPay)
        //console.log(outtakesCategoryPaid)
        //console.log(groupedCategory)
        //console.log(outtakesClinicToPay)
        //console.log(outtakesClinicPaid)

        console.log(outtakesCategoryAnalyzed)
    },
    async getStatisticsOuttakesByMonth({ commit }, payload) {
        var statistics = await firebase.firestore().collection('statistics').doc('caixaOuttakes').collection('month').get();
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