const functions = require('firebase-functions');
const admin = require('firebase-admin');


var moment = require('moment');


const heavyFunctionsRuntimeOpts = {
    timeoutSeconds: 540,
    memory: '2GB'
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
        var totalRaw = intakes[date].reduce((total, e) => total + Number(e.total), 0);
        var totalCost = intakes[date].reduce((total, e) => total + (!isNaN(e.cost) ? e.cost : 0), 0);
        console.log(date, totalCost);
        var numOfSales = 0
        var itens = {}
        var arrTotalRaw = Array.from(Array(moment(date).daysInMonth()).keys()).map(() => 0)

        intakes[date].forEach((intake) => {
            let [year, month, day] = intake.date.match(/\d+/g);
            arrTotalRaw[Number(day) - 1] += intake.total;
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
                    specialty.cost = !isNaN(specialty.cost) ? Number(specialty.cost) : 0;
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
                    exam.cost = !isNaN(exam.cost) ? Number(exam.cost) : 0;
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
            itens: itens,
            arrTotalRaw: arrTotalRaw
        }
    })
    return analyzed
}


exports.analyzePastIntakesByMonth = functions.https.onRequest(async (request, response) => {

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
    intakes = groupByMonth(intakes);
    intakes = analyzeIntakesByMonth(intakes);



    //Salvando
    Object.keys(intakes).forEach((date) =>
        admin.firestore().collection('statistics').doc('caixa').collection('month').doc(date).set(intakes[date]))

    response.status(200).send(intakes);
});

// ==================================== Outtakes ===================================================
function analyzeOuttakesByMonth(outtakes) {
    var analyzed = {};
    Object.keys(outtakes).forEach((date) => {
        var totalRaw = outtakes[date].reduce((total, e) => total + Number(e.total), 0);
        var totalCost = outtakes[date].reduce((total, e) => total + (!isNaN(e.cost) ? e.cost : 0), 0);
        console.log(date, totalCost);
        var numOfSales = 0
        var itens = {}
        var arrTotalRaw = Array.from(Array(moment(date).daysInMonth()).keys()).map(() => 0)

        outtakes[date].forEach((outtake) => {
            let [year, month, day] = outtake.date.match(/\d+/g);
            arrTotalRaw[Number(day) - 1] += outtake.total;
            if (outtake.specialties)
                outtake.specialties.forEach((specialty) => {
                    if (!itens[specialty.name]) itens[specialty.name] = {
                        numOfSales: 0,
                        totalRaw: 0,
                        totalCost: 0,
                        totalProfit: 0
                    };
                    numOfSales++;
                    specialty.price = Number(specialty.price);
                    specialty.cost = !isNaN(specialty.cost) ? Number(specialty.cost) : 0;
                    itens[specialty.name].numOfSales += 1;
                    itens[specialty.name].totalRaw += specialty.price;
                    itens[specialty.name].totalCost += specialty.cost;
                    itens[specialty.name].totalProfit += specialty.price - specialty.cost;

                })
            if (outtake.exams)
                outtake.exams.forEach((exam) => {
                    if (!itens[exam.name]) itens[exam.name] = {
                        numOfSales: 0,
                        totalRaw: 0,
                        totalCost: 0,
                        totalProfit: 0
                    };
                    numOfSales++;
                    exam.price = Number(exam.price);
                    exam.cost = !isNaN(exam.cost) ? Number(exam.cost) : 0;
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
            itens: itens,
            arrTotalRaw: arrTotalRaw
        }
    })
    return analyzed
}
exports.analyzePastOuttakesByMonth = functions.https.onRequest(async (request, response) => {

    var outtakes = await admin.firestore().collection('outtakes').get();
    outtakes = await Promise.all(outtakes.docs.map(async (doc) => {
        var intake = doc.data();

        var exams = await admin.firestore().collection('outtakes').doc(doc.id).collection('exams').get();
        var specialties = await admin.firestore().collection('outtakes').doc(doc.id).collection('specialties').get();
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
    outtakes = groupByMonth(outtakes);
    outtakes = analyzeOuttakesByMonth(outtakes);



    //Salvando
    Object.keys(outtakes).forEach((date) =>
        admin.firestore().collection('statistics').doc('caixaOuttakes').collection('month').doc(date).set(outtakes[date]))

    response.status(200).send(outtakes);
});