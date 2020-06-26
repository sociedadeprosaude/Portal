import firebase from "firebase";

const state = {
    statistics: null
};

const mutations = {
    setStatistics: (state, payload) => state.statistics = payload
};

function groupYearMonthDay(year, month, day, unsorted) {
    return unsorted.filter(({ date: d }) => `${year}-${month}-${day}` === d.slice(0, 10));
}

function groupIntakes(intakes) {
    var grouped = {};
    for (let { date } of intakes) {
        let [year, month, day] = date.match(/\d+/g);
        grouped[`${year}-${month}-${day}`] = groupYearMonthDay(year, month, day, intakes)
    }
    return grouped
}

function analyzeIntakes(intakes) {
    var analyzed = {};
    Object.keys(intakes).forEach((date) => {
        var totalRaw = intakes[date].reduce((total, e) => total + Number(e.total), 0);
        var totalCost = intakes[date].reduce((total, e) => total + Number(e.cost), 0);
        var numOfSales = 0
        var arrObjs = {}
        intakes[date].forEach((intake) => {
            if (intake.specialties)
                intake.specialties.forEach((specialty) => {
                    if (!arrObjs[specialty.name]) arrObjs[specialty.name] = {
                        numOfSales: 0,
                        totalRaw: 0,
                        totalCost: 0,
                        totalProfit: 0
                    };
                    numOfSales++;
                    specialty.price = Number(specialty.price);
                    specialty.cost = Number(specialty.cost);
                    arrObjs[specialty.name].numOfSales += 1;
                    arrObjs[specialty.name].totalRaw += specialty.price;
                    arrObjs[specialty.name].totalCost += specialty.cost;
                    arrObjs[specialty.name].totalProfit += specialty.price - specialty.cost;

                })
            if (intake.exams)
                intake.exams.forEach((exam) => {
                    if (!arrObjs[exam.name]) arrObjs[exam.name] = {
                        numOfSales: 0,
                        totalRaw: 0,
                        totalCost: 0,
                        totalProfit: 0
                    };
                    numOfSales++;
                    exam.price = Number(exam.price);
                    exam.cost = Number(exam.cost);
                    arrObjs[exam.name].numOfSales += 1;
                    arrObjs[exam.name].totalRaw += exam.price;
                    arrObjs[exam.name].totalCost += exam.cost;
                    arrObjs[exam.name].totalProfit += exam.price - exam.cost;
                })
        })
        analyzed[date] = {
            date: date,
            totalRaw: totalRaw,
            totalCost: totalCost,
            totalProfit: totalRaw - totalCost,
            numOfSales: numOfSales,
            arrObjs: arrObjs
        }
    })
    return analyzed
}


const actions = {
   
    async getAllIntakes({ commit }, payload) {
        var intakes = await firebase.firestore().collection('intakes').get();
        intakes = await Promise.all(intakes.docs.map(async (doc) => {
            var intake = doc.data();

            var exams = await firebase.firestore().collection('intakes').doc(doc.id).collection('exams').get();
            var specialties = await firebase.firestore().collection('intakes').doc(doc.id).collection('specialties').get();
            if (!exams.empty) intake.exams = exams.docs.map((exam) => exam.data())
            if (!specialties.empty) intake.specialties = specialties.docs.map((specialty) => specialty.data())

            return {
                date: intake.date,
                total: Number(intake.total),
                cost: Number(intake.cost),
                sex: intake.user ? intake.user.sex : "nem tem",
                specialties: intake.specialties,
                exams: intake.exams,
                masculino: intake.user ? intake.user.sex == "Masculino" : false
            }
        }))
        intakes = groupIntakes(intakes);
        intakes = analyzeIntakes(intakes);

        //Salvando
        // Object.keys(intakes).forEach((date) =>
        //     firebase.firestore().collection('statistics').doc(date).set(intakes[date]))
    },

    async getStatistics({ commit }, payload) {
        var statistics = await firebase.firestore().collection('statistics').get();
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
                arrObjs: {},
                arrTotalRaw: Array.from(Array(31).keys()).map(() => 0)
            };
            statsYearMonth[year][month].arrTotalRaw[Number(day) - 1] = statDay.totalRaw;
            statsYearMonth[year][month].totalRaw += statDay.totalRaw;
            statsYearMonth[year][month].totalCost += statDay.totalCost;
            statsYearMonth[year][month].totalProfit += statDay.totalProfit;
            statsYearMonth[year][month].numOfSales += statDay.numOfSales;
            Object.keys(statDay.arrObjs).forEach((obj) => {
                if (!statsYearMonth[year][month].arrObjs[obj]) statsYearMonth[year][month].arrObjs[obj] = {
                    numOfSales: 0,
                    totalRaw: 0,
                    totalCost: 0,
                    totalProfit: 0,
                };
                statsYearMonth[year][month].arrObjs[obj].totalRaw += statDay.arrObjs[obj].totalRaw;
                statsYearMonth[year][month].arrObjs[obj].totalCost += statDay.arrObjs[obj].totalCost;
                statsYearMonth[year][month].arrObjs[obj].totalProfit += statDay.arrObjs[obj].totalProfit;
                statsYearMonth[year][month].arrObjs[obj].numOfSales += statDay.arrObjs[obj].numOfSales;

            })
            return statDay
        })
        console.log(statistics);
        console.log(statsYearMonth);
        commit('setStatistics', statsYearMonth)
    }
};

const getters = {
    getStatistics: (state) => state.statistics
};

export default {
    state,
    mutations,
    actions,
    getters
}