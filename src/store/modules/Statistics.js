import firebase from "firebase";

const state = {
    statistics: null
};

const mutations = {
    setStatistics: (state, payload) => state.statistics = payload
};


function groupYearMonth(year, month, unsorted) {
    return unsorted.filter(({ date: d }) => `${year}-${month}` === d.slice(0, 7));
}

function groupDay(day, array) {
    const sameDay = array.filter(({ date }) => {
        return `${day}` === date.slice(8, 10)
    });
    return sameDay
}

function groupIntakes(intakes) {
    var grouped = {};
    for (let { date } of intakes) {
        let [year, month, day] = date.match(/\d+/g);
        if (!grouped[year]) grouped[year] = {};
        grouped[year][month] = groupYearMonth(year, month, intakes)
    }
    return grouped
}

const days = Array.from(Array(31).keys())

function analyzeIntakes(intakes) {
    var analyzed = {};
    Object.keys(intakes).forEach((year) => {
        analyzed[year] = {};
        Object.keys(intakes[year]).forEach((month) => {
            var total = intakes[year][month].reduce((total, e) => total + Number(e.total), 0);
            var cost = intakes[year][month].reduce((total, e) => total + Number(e.cost), 0);
            var arrDay = {}
            for (let day of days) {
                var sameDate = groupDay(day, intakes[year][month])
                arrDay[day] = sameDate.reduce((total, e) => total + Number(e.total), 0)
            }
            var arrSelled = {};
            var arrProfit = {}
            // console.log(year,month)
            intakes[year][month].forEach((intake) => {
                if (intake.specialties) {
                    intake.specialties.forEach((specialty) => {
                        arrSelled[specialty.name] = (arrSelled[specialty.name] || 0) + 1;
                        arrProfit[specialty.name] = (arrProfit[specialty.name] || 0) + Number(specialty.price) - Number(specialty.cost)
                    })
                }


                if (intake.exams) {
                    intake.exams.forEach((exam) => {
                        arrSelled[exam.name] = (arrSelled[exam.name] || 0) + 1;
                        arrProfit[exam.name] = (arrProfit[exam.name] || 0) + Number(exam.price) - Number(exam.cost);
                    })
                }

            })

            //  console.log(arrProfit)



            analyzed[year][month] = {
                total: total,
                cost: cost,
                profit: total - cost,
                num: intakes[year][month].length,
                arrFaturamento: arrDay,
                arrSelled: arrSelled,
                arrProfit: arrProfit
            }
        })
    })
    return analyzed
}


const actions = {
    async getAllIntakes({ commit }, payload) {


        var intakes = await firebase.firestore().collection('intakes').limit(100).get();
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
        console.log(intakes);
        intakes = analyzeIntakes(intakes);
        console.log(intakes)
        commit('setStatistics', intakes)
    },
    async getIntakesTeste({ commit }, payload) {

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