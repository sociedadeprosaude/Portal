const functions = require('firebase-functions');
const admin = require('firebase-admin');

const gmapsInit = require("../geocode")
var moment = require('moment');

const heavyFunctionsRuntimeOpts = {
    timeoutSeconds: 540,
    memory: '2GB'
}

function outtakeCategoryListDivider(outtake) {

    if ((typeof (outtake.category)) === "object") {
        const valueDivided = outtake.value / outtake.category.length;
        return outtake.category.map((category) => {
            //Tem que ser {...outtake}
            var outtakeDivided = { ...outtake };
            outtakeDivided.value = valueDivided;
            outtakeDivided.category = category;
            return (outtakeDivided)
        })
    } else {
        return [outtake]
    }
}


function groupIntakes(intakes) {
    var grouped = {};
    for (let { date } of intakes) {
        let [year, month, day] = date.match(/\d+/g);
        grouped[`${year}-${month}-${day}`] =
            intakes.filter(({ date: d }) => `${year}-${month}-${day}` === d.slice(0, 10));
    }
    return grouped
}


function analyzeIntakes(intakes) {
    var analyzed = {};
    Object.keys(intakes).forEach((date) => {
        var totalRaw = intakes[date].reduce((total, e) => total + Number(e.total), 0);
        var totalCost = intakes[date].reduce((total, e) => total + Number(e.cost), 0);
        var numOfSales = 0
        var itens = {}
        intakes[date].forEach((intake) => {
            if (intake.specialties)
                intake.specialties.forEach((specialty) => {
                    if (!itens[specialty.name]) itens[specialty.name] = {
                        numOfSales: 0,
                        totalRaw: 0,
                        totalCost: 0,
                        totalProfit: 0
                    };
                    numOfSales++;
                    specialty.price = Number(specialty.price);
                    specialty.cost = Number(specialty.cost);
                    itens[specialty.name].numOfSales += 1;
                    itens[specialty.name].totalRaw += specialty.price;
                    itens[specialty.name].totalCost += specialty.cost;
                    itens[specialty.name].totalProfit += specialty.price - specialty.cost;

                })
            if (intake.exams)
                intake.exams.forEach((exam) => {
                    if (!itens[exam.name]) itens[exam.name] = {
                        numOfSales: 0,
                        totalRaw: 0,
                        totalCost: 0,
                        totalProfit: 0
                    };
                    numOfSales++;
                    exam.price = Number(exam.price);
                    exam.cost = Number(exam.cost);
                    itens[exam.name].numOfSales += 1;
                    itens[exam.name].totalRaw += exam.price;
                    itens[exam.name].totalCost += exam.cost;
                    itens[exam.name].totalProfit += exam.price - exam.cost;
                })
        })
        analyzed[date] = {
            date: date,
            totalRaw: totalRaw,
            totalCost: totalCost,
            totalProfit: totalRaw - totalCost,
            numOfSales: numOfSales,
            itens: itens
        }
    })
    return analyzed
}


exports.analyzePastIntakesByDay = functions.https.onRequest(async (request, response) => {

    var intakes = await admin.firestore().collection('intakes').get();
    intakes = await Promise.all(intakes.docs.map(async (doc) => {
        var intake = doc.data();

        var exams = await admin.firestore().collection('intakes').doc(doc.id).collection('exams').get();
        var specialties = await admin.firestore().collection('intakes').doc(doc.id).collection('specialties').get();
        if (!exams.empty) intake.exams = exams.docs.map((exam) => exam.data())
        if (!specialties.empty) intake.specialties = specialties.docs.map((specialty) => specialty.data())

        return {
            date: intake.date,
            total: Number(intake.total),
            cost: Number(intake.cost),
            sex: intake.user ? intake.user.sex : "nem tem",
            specialties: intake.specialties,
            exams: intake.exams,
            masculino: intake.user ? intake.user.sex === "Masculino" : false
        }
    }))
    intakes = groupIntakes(intakes);
    intakes = analyzeIntakes(intakes);

    //Salvando
    Object.keys(intakes).forEach((date) =>
        admin.firestore().collection('statistics').doc('caixa').collection('days').doc(date).set(intakes[date]))

    response.status(200).send("Analisado, agora ta salvando");
})

function groupByMonth(arr) {
    var grouped = {};
    for (let { date } of arr) {
        let [year, month, day] = date.match(/\d+/g);
        grouped[`${year}-${month}`] =
            arr.filter(({ date: d }) => `${year}-${month}` === d.slice(0, 7));
    }
    return grouped
}

function analyzeIntakesByMonth(intakes) {
    var analyzed = {};
    Object.keys(intakes).forEach((date) => {
        var totalRaw = intakes[date].reduce((total, e) => total + (!isNaN(e.total) ? Number(e.total) : 0), 0);
        var totalCost = intakes[date].reduce((total, e) => total + (!isNaN(e.cost) ? e.cost : 0), 0);
        var numOfSales = 0
        var itens = {}
        var arrTotalRaw = Array.from(Array(moment(date).daysInMonth()).keys()).map(() => 0)

        intakes[date].forEach((intake) => {
            let [year, month, day] = intake.date.match(/\d+/g);
            arrTotalRaw[Number(day) - 1] += !isNaN(intake.total) ? Number(intake.total) : 0;
            if (intake.specialties)
                intake.specialties.forEach((specialty) => {
                    if (!itens[specialty.name]) itens[specialty.name] = {
                        numOfSales: 0,
                        totalRaw: 0,
                        totalCost: 0,
                        totalProfit: 0
                    };
                    numOfSales++;
                    specialty.price = !isNaN(specialty.price) ? Number(specialty.price) : 0;
                    specialty.cost = !isNaN(specialty.cost) ? Number(specialty.cost) : 0;
                    itens[specialty.name].numOfSales = admin.firestore.FieldValue.increment(1);
                    itens[specialty.name].totalRaw = admin.firestore.FieldValue.increment(specialty.price);
                    itens[specialty.name].totalCost = admin.firestore.FieldValue.increment(specialty.cost);
                    itens[specialty.name].totalProfit = admin.firestore.FieldValue.increment(specialty.price - specialty.cost);
                    admin.firestore().collection('statistics').doc('caixa')
                        .collection('month').doc(date).set({ itens: { [`${specialty.name}`]: itens[specialty.name] } }, { merge: true })

                })
            if (intake.exams)
                intake.exams.forEach((exam) => {
                    if (!itens[exam.name]) itens[exam.name] = {
                        numOfSales: 0,
                        totalRaw: 0,
                        totalCost: 0,
                        totalProfit: 0
                    };
                    numOfSales++;
                    exam.price = !isNaN(exam.price) ? Number(exam.price) : 0;
                    exam.cost = !isNaN(exam.cost) ? Number(exam.cost) : 0;
                    itens[exam.name].numOfSales = admin.firestore.FieldValue.increment(1);
                    itens[exam.name].totalRaw = admin.firestore.FieldValue.increment(exam.price);
                    itens[exam.name].totalCost = admin.firestore.FieldValue.increment(exam.cost);
                    itens[exam.name].totalProfit = admin.firestore.FieldValue.increment(exam.price - exam.cost);

                    admin.firestore().collection('statistics').doc('caixa')
                        .collection('month').doc(date).set({ itens: { [`${exam.name}`]: itens[exam.name] } }, { merge: true })
                })

        })


        analyzed[date] = {
            date: date,
            totalRaw: admin.firestore.FieldValue.increment(totalRaw),
            totalCost: admin.firestore.FieldValue.increment(totalCost),
            totalProfit: admin.firestore.FieldValue.increment(totalRaw - totalCost),
            numOfSales: admin.firestore.FieldValue.increment(numOfSales),

            arrTotalRaw: arrTotalRaw
        }
        admin.firestore().collection('statistics').doc('caixa')
            .collection('month').doc(date).set(analyzed[date], { merge: true })

    })
    return analyzed
}

async function analyzePastIntakesByMonth(initialDate, finalDate) {
    var intakes = await admin.firestore().collection('intakes')
        .where("date", ">=", initialDate)
        .where("date", "<=", finalDate).get();
    console.log(intakes.docs.length);
    intakes = await Promise.all(intakes.docs.map(async (doc) => {
        var intake = doc.data();

        var exams = await admin.firestore().collection('intakes').doc(doc.id).collection('exams').get();
        var specialties = await admin.firestore().collection('intakes').doc(doc.id).collection('specialties').get();
        if (!exams.empty) intake.exams = exams.docs.map((exam) => exam.data())
        if (!specialties.empty) intake.specialties = specialties.docs.map((specialty) => specialty.data())
        return {
            date: intake.date,
            total: Number(intake.total),
            cost: Number(intake.cost),
            sex: intake.user ? intake.user.sex : "nem tem",
            specialties: intake.specialties,
            exams: intake.exams,
            masculino: intake.user ? intake.user.sex === "Masculino" : false
        }
    }))
    intakes = groupByMonth(intakes);
    //No analyzeIntakesByMonth ja e salvo.
    intakes = analyzeIntakesByMonth(intakes);


}


exports.analyzePastIntakesByMonth = functions.runWith(heavyFunctionsRuntimeOpts).https.onRequest(async (request, response) => {
    analyzePastIntakesByMonth("2020-01", "2020-02")
    analyzePastIntakesByMonth("2020-02", "2020-03")
    analyzePastIntakesByMonth("2020-03", "2020-04")
    analyzePastIntakesByMonth("2020-04", "2020-05")
    analyzePastIntakesByMonth("2020-05", "2020-06")
    analyzePastIntakesByMonth("2020-06", "2020-07")
    analyzePastIntakesByMonth("2020-07", "2020-08")
    analyzePastIntakesByMonth("2020-08", "2020-09")
    analyzePastIntakesByMonth("2020-09", "2020-10")
    analyzePastIntakesByMonth("2020-10", "2020-11")
    analyzePastIntakesByMonth("2020-11", "2020-12")
    // analyzePastIntakesByMonth("2020-12","2021-01")
    response.status(200).send("Aguarde");


});
exports.setGeopoints = functions.https.onRequest(async (request, response) => {
    try {
        admin.firestore().collection('users')
            .get().then((users) => {
            users.forEach((user) => {
                let data = user.data()
                if (data.addresses && data.addresses[0] && data.addresses[0].cep) {
                    console.log('->')
                    admin.firestore().collection('statistics').doc('geopoints').collection('users').doc(data.addresses[0].cep)
                        .get().then((userGeopoint) => {
                            if (!userGeopoint.exists) {
                                gmapsInit.geocode([data.addresses[0].street, data.addresses[0].complement].join(" ") + " Manaus Amazonas",
                                    (err, coordinates) => {
                                        if (!err) {
                                            console.log('->', coordinates)
                                            admin.firestore().collection('statistics').doc('geopoints').collection('users').doc(data.addresses[0].cep).set({ geopoint: new admin.firestore.GeoPoint(coordinates.lat, coordinates.lng) })
                                        }
                                    })
                            }
                            return ''
                        })
                        .catch(error => error)
                }
                return
            })
            return
        }).catch((err) => {
            console.error(err)
        })
        response.status(200).send("Salvando geopoint para os usuários");
    } catch (e) {
        response.status(200).send("Erro salvando geopoint para os usuários", e);
    }
})
// ==================================== Outtakes ===================================================

function analyzeOuttakesByMonth(outtakes) {
    var analyzed = {};
    Object.keys(outtakes).forEach((date) => {
        var totalToPay = outtakes[date].reduce((total, e) => total + e.cost, 0);
        var totalLeftToPay = outtakes[date].reduce((total, e) => total + (e.paid ? 0 : e.cost), 0);
        var numOfOuttakesToPay = outtakes[date].filter((outtake) => !outtake.paid).length;

        var totalRecurrent = outtakes[date].filter((outtake) => outtake.recurrent).reduce((total, e) => total + e.cost, 0);

        var arrTotalToPay = Array.from(Array(moment(date).daysInMonth()).keys()).map(() => 0)
        var numOfOuttakes = 0
        var itens = {}
        outtakes[date].forEach((outtake) => {
            let [year, month, day] = outtake.date.match(/\d+/g);
            arrTotalToPay[Number(day) - 1] += outtake.cost;

            if (!itens[outtake.name]) itens[outtake.name] = {
                totalToPay: 0,
                totalLeftToPay: 0,
                numOfOuttakesToPay: 0,
                numOfOuttakes: 0
            };
            itens[outtake.name].totalToPay += outtake.cost;
            itens[outtake.name].totalLeftToPay += outtake.paid ? 0 : outtake.cost;
            itens[outtake.name].numOfOuttakesToPay += outtake.paid ? 0 : 1;
            itens[outtake.name].numOfOuttakes += 1;
            numOfOuttakes++;
        })
        analyzed[date] = {
            date: date,
            totalRecurrent: totalRecurrent,
            totalToPay: totalToPay,
            totalLeftToPay: totalLeftToPay,
            numOfOuttakesToPay: numOfOuttakesToPay,
            numOfOuttakes: numOfOuttakes,
            itens: itens,
            arrTotalToPay: arrTotalToPay
        }
    })
    return analyzed
}

exports.analyseStatisticsOuttakesCategoryByMonth = functions.https.onRequest(async (request, response) => {
    var outtakes = await admin.firestore().collection('outtakes').get();
    outtakes = outtakes.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

    var outtakesCategoryUndivided = outtakes.filter((doc) => (doc.category))
    //flat() tranforma a lista de listas gerada em so uma lista
    var outtakesCategory = outtakesCategoryUndivided.map((outtake) => outtakeCategoryListDivider(outtake)).flat();

    var outtakesCategoryPaid = outtakesCategory.filter((doc) => (doc.paid))
        .map((outtake) => ({
            cost: Number(outtake.value),
            name: outtake.category,
            date: outtake.created_at,
            paid: true,
            recurrent: outtake.recurrent === "true"
        }))

    var outtakesCategoryToPay = outtakesCategory.filter((doc) => (!doc.paid))
        .map((outtake) => ({
            cost: Number(outtake.value),
            name: outtake.category,
            date: outtake.created_at,
            paid: false,
            recurrent: outtake.recurrent === "true"
        }))

    var groupedCategory = {}
    var outtakesToGroup = [...outtakesCategoryPaid, ...outtakesCategoryToPay].filter((outtake) => outtake.date);
    outtakesToGroup.forEach(({ date }) => {
        let [year, month, day] = date.match(/\d+/g);
        groupedCategory[`${year}-${month}`] =
            outtakesToGroup.filter(({ date: d }) => `${year}-${month}` === d.slice(0, 7));
    })
    var outtakesCategoryAnalyzed = analyzeOuttakesByMonth(groupedCategory);


    Object.keys(outtakesCategoryAnalyzed).forEach((date) =>
        admin.firestore().collection('statistics').doc('outtakes-category').collection('month').doc(date).set(outtakesCategoryAnalyzed[date]))

    response.status(200).send("Analisado, salvando");
});

exports.analyseStatisticsOuttakesClinicByMonth = functions.https.onRequest(async (request, response) => {
    var outtakes = await admin.firestore().collection('outtakes').get();
    outtakes = outtakes.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

    var outtakesClinic = outtakes.filter((doc) => (doc.exams || doc.specialties) && doc.intake_id && !doc.root)

    var outtakesClinicToPay = []
    outtakesClinic.filter((doc) => !doc.paid)
        .forEach((outtake) => {
            if (outtake.exams && typeof outtake.exams !== 'object') outtake.exams.forEach((exam) =>
                outtakesClinicToPay.push({

                    cost: exam.cost,
                    name: exam.name,
                    date: moment(Number(outtake.intake_id)).format("YYYY-MM-DD"),
                    paid: false,
                    recurrent: false
                }))
            if (outtake.specialties && typeof outtake.specialties !== 'object') outtake.specialties.forEach((specialty) =>
                outtakesClinicToPay.push({
                    cost: specialty.cost,
                    name: specialty.name,
                    date: moment(Number(outtake.intake_id)).format("YYYY-MM-DD"),
                    paid: false,
                    recurrent: false
                }))
        })

    var outtakesClinicPaid = []
    outtakesClinic.filter((doc) => doc.paid)
        .forEach((outtake) => {
            if (outtake.exams) outtake.exams.forEach((exam) =>
                outtakesClinicPaid.push({
                    cost: exam.cost,
                    name: exam.name,
                    date: moment(Number(outtake.intake_id)).format("YYYY-MM-DD"),
                    paid: true,
                    recurrent: false
                }))
            if (outtake.specialties) outtake.specialties.forEach((specialty) =>
                outtakesClinicPaid.push({
                    cost: specialty.cost,
                    name: specialty.name,
                    date: moment(Number(outtake.intake_id)).format("YYYY-MM-DD"),
                    paid: true,
                    recurrent: false
                }))
        })

    var groupedClinic = {}
    var outtakesToGroup = [...outtakesClinicToPay, ...outtakesClinicPaid].filter((outtake) => outtake.date);
    outtakesToGroup.forEach(({ date }) => {
        let [year, month, day] = date.match(/\d+/g);
        groupedClinic[`${year}-${month}`] =
            outtakesToGroup.filter(({ date: d }) => `${year}-${month}` === d.slice(0, 7));
    })
    var outtakesClinicAnalyzed = analyzeOuttakesByMonth(groupedClinic);

    Object.keys(outtakesClinicAnalyzed).forEach((date) =>
        admin.firestore().collection('statistics').doc('outtakes-clinic').collection('month').doc(date).set(outtakesClinicAnalyzed[date]))

    response.status(200).send("Analisado, salvando");
});
