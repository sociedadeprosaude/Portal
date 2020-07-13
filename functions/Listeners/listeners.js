const functions = require('firebase-functions');
const admin = require('firebase-admin');
const moment = require('moment');
const gmapsInit = require("../geocode")

exports.listenToUserAdded = functions.firestore.document('users/{cpf}').onCreate(async (change, context) => {
    let db = admin.firestore()
    let userRef = db.collection('users').doc(context.params.cpf)
    let user = (await userRef.get()).data()
    if (!user.association_number) {
        let associatedOpRef = db.collection('operational').doc('associated')
        let numAss = (await associatedOpRef.get()).data().quantity
        userRef.update({
            association_number: numAss
        })
        associatedOpRef.update({
            quantity: admin.firestore.FieldValue.increment(1)
        })
    }
    if (user.addresses && user.addresses[0] && user.addresses[0].cep) {
        let newCEP = user.addresses[0].cep.replace(/[.,-]/g,"").substring(0,5)
        admin.firestore().collection('statistics').doc('geopoints').collection('users_by_neighborhood').doc(newCEP)
            .get().then((userGeopoint) => {
                if(!userGeopoint.exists){
                    gmapsInit.geocode([user.addresses[0].street,user.addresses[0].complement].join(" ") + " Manaus Amazonas",
                    (err, coordinates)=>{
                        if(err) 
                            console.log(err)
                        else
                            admin.firestore().collection('statistics').doc('geopoints').collection('users_by_neighborhood').doc(newCEP).set({count:1,geopoint: new admin.firestore.GeoPoint(coordinates.lat, coordinates.lng)})
                    })
                }else{
                    admin.firestore().collection('statistics').doc('geopoints').collection('users_by_neighborhood').doc(newCEP).update({count: admin.firestore.FieldValue.increment(1)})
                }
            })
    }
})

exports.listenChangeInSpecialtiesSubcollections = functions.firestore.document('specialties/{specialtyId}/{collectionId}/{docId}').onWrite(async (change, context) => {
    convertSpecialtySubcollectionInObject((await admin.firestore().collection('specialties').doc(context.params.specialtyId).get()))
})

exports.listenChangeInDoctorsSubcollections = functions.firestore.document('users/{userId}/{collectionId}/{docId}').onWrite(async (change, context) => {
    convertDoctorSubcollectionInObject((await admin.firestore().collection('users').doc(context.params.userId).get()))
})

async function convertDoctorSubcollectionInObject(doctorDoc) {
    let doctor = doctorDoc.data()
    if (doctor.clinics) {
        cleanExamsAndSpecialtiesFromClinics(doctor.clinics)
    }
    let specialties = [];
    // eslint-disable-next-line no-await-in-loop
    let specialtiesCollection = await admin.firestore().collection('users/' + doctor.cpf + '/specialties').get()
    for (let specialtyDoc in specialtiesCollection.docs) {
        let specialty = specialtiesCollection.docs[specialtyDoc].data()
        specialties.push(specialty)
    }
    doctor.specialties = specialties

    doctorDoc.ref.set(doctor)
    return doctor
}

function cleanExamsAndSpecialtiesFromClinics(clinics) {
    for (let clinic in clinics) {
        if (clinics[clinic].exams) {
            delete clinics[clinic].exams
        }
        if (clinics[clinic].specialties) {
            delete clinics[clinic].specialties
        }
    }
}



exports.onUpdateExam = functions.firestore.document('exams/{name}').onUpdate((change, context) => {
    const firestore = admin.firestore();
    const examUpdated = change.after.data();
    const price = examUpdated.price;
    if (price) {
        //Updatando o price das clinicas da subCollection clinics presente dentro da collection /exams
        firestore.collection('exams').doc(examUpdated.name).collection('clinics').get()
            .then((docs) => {
                if (!docs.empty) docs.forEach((doc) => doc.ref.update({ price: price }))
                return null
            })
            .catch(err => console.log(err));

        //Updatando o price dos exames da subCollection exams presente dentro da collection /clinics
        firestore.collection('clinics').get()
            .then((clinics) =>
                clinics.forEach((clinic) => {
                    firestore.collection('clinics').doc(clinic.id).collection('exams').doc(examUpdated.name).get()
                        .then((doc) => {
                            if (doc.exists) doc.ref.update({ price: price })
                            return null
                        })
                        .catch(err => console.log(err));
                }))
            .catch(err => console.log(err));

        //Updatando o price dos exames da subCollection exams presente dentro da collection /packages
        firestore.collection('packages').get()
            .then((packages) =>
                packages.forEach((packageRef) => {
                    firestore.collection('packages').doc(packageRef.id).collection('exams').doc(examUpdated.name).get()
                        .then((doc) => {
                            if (doc.exists) doc.ref.update({ price: price })
                            return null
                        })
                        .catch(err => console.log(err));
                }))
            .catch(err => console.log(err));
    }
});

exports.onUpdateSpecialty = functions.firestore.document('specialties/{name}').onUpdate((change, context) => {
    const firestore = admin.firestore();
    const specialtyUpdated = change.after.data();
    const price = specialtyUpdated.price;
    if (price) {
        //Updatando o price dos doctors da subCollection clinics presente dentro da collection /specialties
        firestore.collection('specialties').doc(specialtyUpdated.name).collection('doctors').get()
            .then((docs) => {
                if (!docs.empty) docs.forEach((doc) => doc.ref.update({ price: price }))
                return null
            })
            .catch(err => console.log(err));

        //Updatando o price dos exames da subCollection specialties presente dentro da collection /clinics
        firestore.collection('clinics').get()
            .then((clinics) =>
                clinics.forEach((clinic) => {
                    firestore.collection('clinics').doc(clinic.id).collection('specialties').doc(specialtyUpdated.name).get()
                        .then((doc) => {
                            if (doc.exists) doc.ref.update({ price: price })
                            return null
                        })
                        .catch(err => console.log(err));
                }))
            .catch(err => console.log(err));

        //Updatando o price dos exames da subCollection specialties presente dentro da collection /packages
        // firestore.collection('packages').get()
        //     .then((packages) =>
        //         packages.forEach((packageRef) => {
        //             firestore.collection('packages').doc(packageRef.id).collection('specialties').doc(specialtyUpdated.name).get()
        //                 .then((doc) => {
        //                     if (doc.exists) doc.ref.update({ price: price })
        //                     return null
        //                 })
        //                 .catch(err => console.log(err));
        //         }))
        //     .catch(err => console.log(err));
    }/*  else {
        firestore.collection('specialties').doc(specialtyUpdated.name).collection('doctors').get()
            .then((docs) => {
                if (!docs.empty) {
                    let firstPrice = undefined
                    docs.forEach((doc) => {
                        if (!firstPrice)
                            firstPrice = doc.data().price
                    })

                    firestore.collection('specialties').doc(specialtyUpdated.name).update({ price: firstPrice })
                }
                return null
            })
            .catch(err => console.log(err));
    } */
});


// ================================== Resumo mensal ====================================================================

exports.updateStatistics = functions.firestore.document('intakes/{id}')
    .onCreate(async (snap, context) => {
        const intake = snap.data();
        const total = Number(intake.total);
        const cost = Number(intake.cost);
        const date = intake.date.slice(0, 10);
        const dateMonth = intake.date.slice(0, 7);
        const day = intake.date.slice(8, 10);

        const addTotalRaw = admin.firestore.FieldValue.increment(total);
        const addTotalCost = admin.firestore.FieldValue.increment(cost);
        const addTotalProfit = admin.firestore.FieldValue.increment(total - cost);

        var stats = await admin.firestore().collection('statistics').doc('caixa').collection('days').doc(date).get();
        stats.ref.set({
            date: date,
            totalRaw: addTotalRaw,
            totalCost: addTotalCost,
            totalProfit: addTotalProfit
        }, { merge: true });


        var statsMonth = await admin.firestore().collection('statistics').doc('caixa').collection('month').doc(dateMonth).get();
        var arrTotalRaw = statsMonth.exists && statsMonth.data().arrTotalRaw ?
            statsMonth.data().arrTotalRaw :
            Array.from(Array(moment(date).daysInMonth()).keys()).map(() => 0)


        arrTotalRaw[Number(day) - 1] += total;

        statsMonth.ref.set({
            arrTotalRaw,
            date: dateMonth,
            totalRaw: addTotalRaw,
            totalCost: addTotalCost,
            totalProfit: addTotalProfit
        }, { merge: true });
    });

var emptyItem = () => ({
    numOfSales: 0,
    totalRaw: 0,
    totalCost: 0,
    totalProfit: 0
})
//Sempre vai ser chamado, tanto para as specialties como exams
exports.updateStatisticsItem = functions.firestore.document('intakes/{id}/{type}/{specId}')
    .onCreate(async (snap, context) => {
        const item = snap.data();
        const date = moment(Number(context.params.id)).format("YYYY-MM-DD")
        const dateMonth = moment(Number(context.params.id)).format("YYYY-MM")

        var stats = await admin.firestore().collection('statistics').doc('caixa').collection('days').doc(date).get();
        var statsMonth = await admin.firestore().collection('statistics').doc('caixa').collection('month').doc(dateMonth).get();

        var itens = stats.exists ? stats.data().itens : {};
        var itensMonth = statsMonth.exists ? statsMonth.data().itens : {};

        var itemStat = !itens[item.name] ? emptyItem() : itens[item.name];
        var itemStatMonth = !itensMonth[item.name] ? emptyItem() : itensMonth[item.name];

        if (!itens[item.name]) itens[item.name] = emptyItem();
        if (!itensMonth[item.name]) itensMonth[item.name] = emptyItem();

        itemStat.numOfSales += 1;
        itemStat.totalRaw += Number(item.price);
        itemStat.totalCost += Number(item.cost)
        itemStat.totalProfit += Number(item.price) - Number(item.cost);
        itemStatMonth.numOfSales += 1;
        itemStatMonth.totalRaw += Number(item.price);
        itemStatMonth.totalCost += Number(item.cost)
        itemStatMonth.totalProfit += Number(item.price) - Number(item.cost);

        stats.ref.set({
            itens: { [`${item.name}`]: itemStat },
            numOfSales: admin.firestore.FieldValue.increment(1)
        }, { merge: true });
        statsMonth.ref.set({
            itens: { [`${item.name}`]: itemStatMonth },
            numOfSales: admin.firestore.FieldValue.increment(1)
        }, { merge: true });
    });

// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }
// async function mock(name) {
//     await sleep(100);
//     var id = moment();
//     admin.firestore().collection('intakes').doc(String(id.valueOf())).set({
//         total: 15,
//         cost: 5,
//         date: id.format("YYYY-MM-DD hh:mm:ss")
//     })
//     id = String(id.valueOf());
//     admin.firestore().collection('intakes').doc(id).collection('specialties').doc(name).set({
//         name: name,
//         price: 15,
//         cost: 5,
//         date: moment(Number(id)).format("YYYY-MM-DD hh:mm:ss")
//     })
// }

// exports.tstCreateIntake = functions.https.onRequest(async (req, res) => {
//     await mock("CARDIOLOGIA");
//     await mock("CARDIOLOGIA TELEATENDIMENTO");
//     await mock("DERMATOLOGIA TELEATENDIMENTO");
//     await mock("NEUROLOGIA");
//     await mock("TESTANDO NOVA ESPECIALIDADE");
//     await mock("TESTE 2");
//     res.status(200).send("sdasd")
// });

// ==================================== funcs usadas por varios =======================================================
async function convertSpecialtySubcollectionInObject(specialtyDoc) {
    let specialty = specialtyDoc.data();
    let doctors = [];
    // eslint-disable-next-line no-await-in-loop
    let docsCollection = await admin.firestore().collection('specialties/' + specialty.name + '/doctors').get()
    for (let doctorDoc in docsCollection.docs) {
        let doctor = docsCollection.docs[doctorDoc].data()
        doctor.clinics = []
        // eslint-disable-next-line no-await-in-loop
        let clinCollection = await admin.firestore().collection('specialties/' + specialty.name + '/doctors').doc(doctor.cpf).collection('clinics').get()
        clinCollection.forEach((clinDoc) => {
            let clinic = clinDoc.data()
            if (clinic.exams) {
                delete clinic.exams
            }
            if (clinic.specialties) {
                delete clinic.specialties
            }
            doctor.clinics.push(clinic)
        })
        doctors.push({
            ...doctor,
            price: doctor.price,
            cost: doctor.cost,
            payment_method: doctor.payment_method,
        });
    }
    specialtyDoc.ref.set(
        {
            ...specialty,
            doctors: doctors,
        }
    )
    return {
        ...specialty,
        doctors: doctors,
    }
}
//==================================================================================================================

exports.ListenUpdateClinic = functions.firestore.document('clinics/{name}').onUpdate(async (change, context) => {
    const firestore = admin.firestore();
    const clinicUpdated = change.after.data();
    let examSnap = await firestore.collection('clinics').doc(clinicUpdated.name).collection('exams').get()
    let exams = [];
    examSnap.forEach((doc) => {
        exams.push(doc.data().name)
    });
    for (let i in exams) {
        firestore.collection('exams').doc(exams[i]).collection('clinics').doc(clinicUpdated.name).update(clinicUpdated);
    }
});
