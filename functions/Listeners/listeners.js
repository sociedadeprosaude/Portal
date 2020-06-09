const functions = require('firebase-functions');
const admin = require('firebase-admin');
try { admin.initializeApp(functions.config().firebase); } catch (e) { }


var axios = require("axios");
var xml2js = require('xml2js');


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
    } else {
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
    }
});

//ta como onRequest mas basicamente essa functio e uma callback que fica escutando o pagSeguro
exports.pagSeguroCreditCallback = functions.https.onRequest(async (request, response) => {
    const firestore = admin.firestore();
    var url = "https://ws.sandbox.pagseguro.uol.com.br/v3/transactions/notifications/" + request.body.notificationCode
    var credentials = "?email=andrebluee96@gmail.com&token=A97F0051D0A3452C939DCE51C37B1872";
    console.log(request.body);
    return axios
        .get(url + credentials)
        .then(async res =>
            xml2js.parseString(res.data, async function (err, result) {
                console.log(err);
                console.log(result);
                if (!err) {
                    const status = result.transaction.status[0];
                    const transactionCode = result.transaction.code[0];
                    console.log(result);
                    if (status === "3") {
                        console.log("pago");
                        firestore.collection('budgets').where("pagSeguroCode", "==", transactionCode)
                            .get()
                            .then(async (querySnapshot) => querySnapshot.forEach(async (doc) => {
                                var specialties = await firestore.collection('budgets').doc(doc.id).collection('specialties').get();
                                var exams = await firestore.collection('budgets').doc(doc.id).collection('exams').get();

                                firestore.collection('intakes').doc(doc.id).set(doc.data());

                                if (!specialties.empty) {
                                    specialties.docs.forEach((specialty) => firestore.collection('intakes').doc(doc.id)
                                        .collection('specialties').doc(specialty.data().name).set(specialty.data()));
                                }
                                if (!exams.empty) {
                                    exams.docs.forEach((exam) => firestore.collection('intakes').doc(doc.id)
                                        .collection('exams').doc(exam.data().name).set(exam.data()));
                                }
                                // return null

                                // Deletando o budget que ta em /users e em /budgets
                                // const cpf = doc.data().user.cpf;
                                // const budgetInUser = await firestore.collection('users').doc(cpf)
                                //     .collection('budgets').where("pagSeguroCode", "==", transactionCode)
                                //     .get()
                                // budgetInUser.forEach((docBudget) => docBudget.ref.delete());
                                // doc.ref.delete();
                            }))
                            .then(() => response.send("notificacao recebida com sucesso"))
                            .catch((e) => response.send("erro na notificacao recebida"));
                    } else {
                        response.send("notificacao mas nao foi paga");
                    }
                } else {
                    response.send("erro na notificacao");
                }

            })
        )
        .catch(e => response.send(e))
});
//ta como onRequest mas basicamente essa functio e uma callback que fica escutando o pagSeguro
exports.pagSeguroBillCallback = functions.https.onRequest(async (request, response) => {
    const firestore = admin.firestore();
    var url = "https://ws.sandbox.pagseguro.uol.com.br/v3/transactions/notifications/" + request.body.notificationCode
    var credentials = "?email=andrebluee96@gmail.com&token=A97F0051D0A3452C939DCE51C37B1872";
    return axios
        .get(url + credentials)
        .then(res =>
            xml2js.parseString(res.data, function (err, result) {
                if (!err) {
                    const status = result.transaction.status[0];
                    const transactionCode = result.transaction.code[0];
                    if (status === "3") {
                        firestore.collection('budgets').where("pagSeguroCode", "==", transactionCode)
                            .get()
                            .then((querySnapshot) => querySnapshot.forEach(async (doc) => {
                                var specialties = await firestore.collection('budgets').doc(doc.id).collection('specialties').get();
                                var exams = await firestore.collection('budgets').doc(doc.id).collection('exams').get();

                                firestore.collection('intakes').doc(doc.id).set(doc.data());

                                if (!specialties.empty) {
                                    specialties.docs.forEach((specialty) => firestore.collection('intakes').doc(doc.id)
                                        .collection('specialties').doc(specialty.data().name).set(specialty.data()));
                                }
                                if (!exams.empty) {
                                    exams.docs.forEach((exam) => firestore.collection('intakes').doc(doc.id)
                                        .collection('exams').doc(exam.data().name).set(exam.data()));
                                }
                                return null

                                // Deletando o budget que ta em /users e em /budgets
                                // const cpf = doc.data().user.cpf;
                                // const budgetInUser = await firestore.collection('users').doc(cpf)
                                //     .collection('budgets').where("pagSeguroCode", "==", code)
                                //     .get()
                                // budgetInUser.forEach((docBudget) => docBudget.ref.delete());
                                //doc.ref.delete();
                            }))
                            .catch((e) => e);
                    }
                }
                response.send("Notificacao recebida");
            })
        )
        .catch(e => response.send(e))
});


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