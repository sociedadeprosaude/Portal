const functions = require('firebase-functions');
const admin = require('firebase-admin');
try { admin.initializeApp(functions.config().firebase); } catch (e) { console.log(e) }
const moment = require('moment');
const gmapsInit = require("../geocode")

/* exports.setUidToUserWhenCreated = functions.firestore.document('users/{id}').onCreate((doc, context) => {
    let firestore = admin.firestore();
    let id = doc.id;
    let uid = doc.data().uid
    let type = doc.data().type
    if (type === 'PATIENT' && !uid) { firestore.collection('users').doc(id).update({ uid: id }) }
    if (type === 'DOCTOR' && !uid) { firestore.collection('users').doc(id).update({ uid: id }) }
    if (type === 'COLABORATOR' && id !== uid) {
        firestore.collection('users').doc(uid).set(doc.data())
        firestore.collection('users').doc(id).delete()
    }
}); */

async function UpdateUidOfUserPatientWhenHeCreateLoginAndPassword(change){
    let firestore = admin.firestore();
    let uidOld = change.before.data().uid;//antes
    let uidNew = change.after.data().uid;//depois
    let user = change.after.data();
    let type = change.after.data().type
    if (uidNew !== uidOld && type === 'PATIENT') {
        //raiz: user NEW
        await firestore.collection('users').doc(uidNew).set(user)
        //SubCollections:
        let consultations = '/consultations';
        let consult = await firestore.collection('users/' + uidOld + consultations).get();
        let arrayOfConsultations = [];
        consult.forEach(doc => {
            arrayOfConsultations.push(doc.data())
        });
        if (arrayOfConsultations) {
            for (let consultation in arrayOfConsultations) {
                firestore.collection('users/' + uidNew + consultations).doc(arrayOfConsultations[consultation].id).set(arrayOfConsultations[consultation]);
            }
        }

        let procedures = '/procedures';
        let proced = await firestore.collection('users/' + uidOld + procedures).get();
        let arrayOfProcedures = [];
        proced.forEach(doc => {
            let obj = doc.data()
            obj.id = doc.id
            arrayOfProcedures.push(obj)
        });
        if (arrayOfProcedures) {
            for (let procedure in arrayOfProcedures) {
                firestore.collection('users/' + uidNew + procedures).doc(arrayOfProcedures[procedure].id).set(arrayOfProcedures[procedure]);
            }
        }

        let proceduresFinished = '/proceduresFinished';
        let procedF = await firestore.collection('users/' + uidOld + proceduresFinished).get();
        let arrayOfProceduresFinished = [];
        procedF.forEach(doc => {
            let obj = doc.data()
            obj.id = doc.id
            arrayOfProceduresFinished.push(obj)
        });
        if (arrayOfProceduresFinished) {
            for (let procedureF in arrayOfProceduresFinished) {
                firestore.collection('users/' + uidNew + proceduresFinished).doc(arrayOfProceduresFinished[procedureF].id).set(arrayOfProceduresFinished[procedureF]);
            }
        }

        let budgets = '/budgets';
        let budg = await firestore.collection('users/' + uidOld + budgets).get();
        let arrayOfBudgets = [];
        budg.forEach(doc => {
            arrayOfBudgets.push(doc.data())
        });
        if (arrayOfBudgets) {
            for (let budget in arrayOfBudgets) {
                firestore.collection('users/' + uidNew + budgets).doc(arrayOfBudgets[budget].id.toString()).set(arrayOfBudgets[budget]);
            }
        }

        let intakes = '/intakes';
        let intak = await firestore.collection('users/' + uidOld + intakes).get();
        let arrayOfIntakes = [];
        intak.forEach(doc => {
            arrayOfIntakes.push(doc.data())
        });
        if (arrayOfIntakes) {
            for (let intake in arrayOfIntakes) {
                firestore.collection('users/' + uidNew + intakes).doc(arrayOfIntakes[intake].id.toString()).set(arrayOfIntakes[intake]);
            }
        }
        //raiz: user OLD
        await firestore.collection('users').doc(uidOld).delete()
    }
}

async function UpdateUidOfUserDoctorWhenHeCreateLoginAndPassword(change){
    let firestore = admin.firestore();
    let uidOld = change.before.data().uid;//antes
    let uidNew = change.after.data().uid;//depois
    let user = change.after.data();//tudo do user depois da atualização*
    let type = change.after.data().type
    if (uidOld !== uidNew && type === 'DOCTOR') {
        //raiz: user
        await firestore.collection('users').doc(uidNew).set(user)
        await firestore.collection('users').doc(uidOld).delete()
        //subcollections of doctor
        for (let specialtie in user.specialties) {
            for (let clinic in user.clinics) {
                firestore.collection('users/' + uidNew + '/specialties').doc(user.specialties[specialtie].name).set(user.specialties[specialtie]);
                firestore.collection('users/' + uidNew + '/specialties/' + user.specialties[specialtie].name + '/clinics').doc(user.clinics[clinic].name).set(user.clinics[clinic]);
            }
        }
        //raiz: specialites
        for (let specialtie in user.specialties) {
            let objEdited = {
                name: user.name,
                type: user.type,
                cpf: user.cpf,
                uid: user.uid,
                crm: user.crm,
                cost: user.specialties[specialtie].cost,
                price: user.specialties[specialtie].price,
                payment_method: user.specialties[specialtie].payment_method
            }
            firestore.collection('specialties/' + user.specialties[specialtie].name + '/doctors').doc(uidNew).set(objEdited);
            firestore.collection('specialties/' + user.specialties[specialtie].name + '/doctors').doc(uidOld).delete();
            for (let clinic in user.clinics) {
                firestore.collection('specialties/' + user.specialties[specialtie].name + '/doctors/' + uidNew + '/clinics').doc(user.clinics[clinic].name).set(user.clinics[clinic]);
                firestore.collection('specialties/' + user.specialties[specialtie].name + '/doctors/' + uidOld + '/clinics').doc(user.clinics[clinic].name).delete();
            }
        }

        //raiz: clinics
        for (let clinic in user.clinics) {
            for (let specialtie in user.specialties) {
                let objEdited = {
                    name: user.name,
                    cpf: user.cpf,
                    crm: user.crm,
                    uid: user.uid,
                    cost: user.specialties[specialtie].cost,
                    price: user.specialties[specialtie].price,
                    payment_method: user.specialties[specialtie].payment_method,
                    specialtie: user.specialties[specialtie].name
                }
                firestore.collection('clinics/' + user.clinics[clinic].name + '/specialties/' + user.specialties[specialtie].name + '/doctors').doc(uidNew).set(objEdited);
                firestore.collection('clinics/' + user.clinics[clinic].name + '/specialties/' + user.specialties[specialtie].name + '/doctors').doc(uidOld).delete();
            }
        }

        //schedules uid on doctor equlas === uid user.doc da raiz
        let schedule = await firestore.collection('schedules').get();
        schedule.forEach(doc => {
            if (doc.data().doctor.cpf === user.cpf) {
                if (doc.data().doctor.uid === user.uid) {
                    let modified = doc.data()
                    modified.doctor.uid = user.uid
                    firestore.collection('schedules').doc(doc.id).update(modified)
                }
            }
        });
    }
}

function setGeopointsFromUserAddress(user){
    if (user.addresses && user.addresses[0] && user.addresses[0].cep) {
        let newCEP = user.addresses[0].cep.replace(/[.,-]/g, "").substring(0, 5)
        admin.firestore().collection('statistics').doc('geopoints').collection('users_by_neighborhood').doc(newCEP)
            .get().then(async (userGeopoint) => {
                let ref = admin.firestore().collection('statistics').doc('geopoints').collection('users_by_neighborhood').doc(newCEP)
                if (!userGeopoint.exists) {
                    gmapsInit.geocode([user.addresses[0].street, user.addresses[0].complement].join(" ") + " Manaus Amazonas",
                        async (err, coordinates) => {
                            if (err)
                                console.log(err)
                            else {
                                await ref.set({ count: 1, geopoint: new admin.firestore.GeoPoint(coordinates.lat, coordinates.lng) })
                                updateGeopointMonthlyReport(ref)
                            }
                        })
                } else {
                    let data = userGeopoint.data()
                    if(!data.geopoint){
                        gmapsInit.geocode([user.addresses[0].street, user.addresses[0].complement].join(" ") + " Manaus Amazonas",
                            async (err, coordinates) => {
                                if (err){
                                    console.log(err)
                                    await ref.update({ count: admin.firestore.FieldValue.increment(1) })
                                }  
                                else {
                                    await ref.update({ count: admin.firestore.FieldValue.increment(1), geopoint: new admin.firestore.GeoPoint(coordinates.lat, coordinates.lng) })
                                }

                                updateGeopointMonthlyReport(ref)
                            })
                    }else{
                        await ref.update({ count: admin.firestore.FieldValue.increment(1) })
                        updateGeopointMonthlyReport(ref)
                    }
                }
                return;
            }).catch((e) => e)
    }
}

async function setAssociationNumberUser(change){
    let userRef = change.ref
    let user = change.data()
    console.log('setAssociationNumber')
    if (!user.association_number) {
        console.log('Não tem')
        let associatedOpRef = admin.firestore().collection('operational').doc('associated')
        let numAss = (await associatedOpRef.get()).data().quantity
        userRef.update({
            association_number: numAss
        })
        associatedOpRef.update({
            quantity: admin.firestore.FieldValue.increment(1)
        })
    }
}

exports.UpdateUidOfUserWhenHeCreateLoginAndPassword = functions.firestore.document('users/{uid}').onUpdate(async (change, context) => {
    if (change.after.data().type === 'PATIENT') {
        UpdateUidOfUserPatientWhenHeCreateLoginAndPassword(change)
        setGeopointsFromUserAddress(change.after.data())
        setAssociationNumberUser(change.after)
    }
    else if(change.after.data().type === 'DOCTOR'){
        UpdateUidOfUserDoctorWhenHeCreateLoginAndPassword(change)
    }
});

exports.listenToUserAdded = functions.firestore.document('users/{id}').onCreate(async (change, context) => {
    let db = admin.firestore()
    let id = change.id;
    
    setAssociationNumberUser(change)
    setGeopointsFromUserAddress(change.data())

    let uid = change.data().uid
    let type = change.data().type
    if (type === 'PATIENT' && !uid) { db.collection('users').doc(id).update({ uid: id }) }
    if (type === 'DOCTOR' && !uid) { db.collection('users').doc(id).update({ uid: id }) }
    if (type === 'COLABORATOR' && id !== uid) {
        db.collection('users').doc(uid).set(doc.data())
        db.collection('users').doc(id).delete()
    }
    return;
});

async function updateGeopointMonthlyReport(ref) {
    ref.collection('monthly_report').doc(moment().format('YYYY-MM')).get()
        .then(doc => {
            if (doc.exists) {
                doc.ref.update({ created: admin.firestore.FieldValue.increment(1) })
            } else {
                doc.ref.set({ created: 1 })
            }
            return;
        }).catch((e) => e);
}

exports.listenChangeInSpecialtiesSubcollections = functions.firestore.document('specialties/{specialtyId}/{collectionId}/{docId}').onWrite(async (change, context) => {
    convertSpecialtySubcollectionInObject((await admin.firestore().collection('specialties').doc(context.params.specialtyId).get()))
})

exports.listenChangeInDoctorsSubcollections = functions.firestore.document('users/{userId}/{collectionId}/{docId}').onWrite(async (change, context) => {
    convertDoctorSubcollectionInObject((await admin.firestore().collection('users').doc(context.params.userId).get()))
})

exports.listenChangeInGeopointsSubcollections = functions.firestore.document('statistics/geopoints/users_by_neighborhood/{id}/monthly_report/{docId}').onWrite(async (change, context) => {
    convertGeopointCEPSubcollectionInObject((await admin.firestore().collection('statistics/geopoints/users_by_neighborhood').doc(context.params.id).get()))
    console.log('Escutou dentro da monthly_reports->')
    console.log(context.params.docId)
})

async function convertDoctorSubcollectionInObject(doctorDoc) {
    let doctor = doctorDoc.data()
    if (doctor.clinics) {
        cleanExamsAndSpecialtiesFromClinics(doctor.clinics)
    }
    let specialties = [];
    // eslint-disable-next-line no-await-in-loop
    let specialtiesCollection = await admin.firestore().collection('users/' + doctor.uid + '/specialties').get()
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
    if (price !== null && price !== undefined) {
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
    if (price !== null && price !== undefined) {
        //Updatando o price dos doctors da subCollection clinics presente dentro da collection /specialties
        firestore.collection('specialties').doc(specialtyUpdated.name).collection('doctors').get()
            .then((docs) => {
                if (!docs.empty) {
                    docs.forEach((doc) => {
                        doc.ref.update({ price: price })
                    })
                }
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

        var itens = stats.exists && stats.data().itens ? stats.data().itens : {};
        var itensMonth = statsMonth.exists && statsMonth.data().itens ? statsMonth.data().itens : {};

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


// ==================================== Resumo mensal outtakes =======================================================

var emptyOuttake = () => ({
    totalToPay: 0,
    totalLeftToPay: 0,
    numOfOuttakesToPay: 0,
    numOfOuttakes: 0,
})

function outtakeCategoryListDivider(outtake) {
    if ((typeof (outtake.category)) === "object") {
        const valueDivided = outtake.value / outtake.category.length;
        return outtake.category.map((category) => {
            //Tem que ser {...outtake}
            var outtakeDivided = { ...outtake };
            outtakeDivided.value = valueDivided;
            outtakeDivided.category = category;
            return outtakeDivided
        })
    } else {
        return [outtake]
    }
}

async function createStatisticOuttakeDoc(outtake, nameDoc) {

    const date = outtake.date.slice(0, 10);
    const dateMonth = outtake.date.slice(0, 7);
    const day = outtake.date.slice(8, 10);

    var statsMonth = await admin.firestore().collection('statistics').doc(nameDoc).collection('month').doc(dateMonth).get();

    var arrTotalToPay = statsMonth.exists && statsMonth.data().arrTotalToPay ?
        statsMonth.data().arrTotalToPay :
        Array.from(Array(moment(date).daysInMonth()).keys()).map(() => 0)
    arrTotalToPay[Number(day) - 1] += outtake.cost;

    var itensMonth = statsMonth.exists && statsMonth.data().itens ? statsMonth.data().itens : {};
    var itemStatMonth = itensMonth[outtake.name] ? itensMonth[outtake.name] : emptyOuttake();

    itemStatMonth.totalToPay = admin.firestore.FieldValue.increment(outtake.cost);
    itemStatMonth.totalLeftToPay = admin.firestore.FieldValue.increment(!outtake.paid ? outtake.cost : 0);
    itemStatMonth.numOfOuttakesToPay = admin.firestore.FieldValue.increment(!outtake.paid ? 1 : 0);
    itemStatMonth.numOfOuttakes = admin.firestore.FieldValue.increment(1);

    statsMonth.ref.set({
        date: dateMonth,
        totalRecurrent: admin.firestore.FieldValue.increment(outtake.recurrent ? outtake.cost : 0),
        totalToPay: admin.firestore.FieldValue.increment(outtake.cost),
        totalLeftToPay: admin.firestore.FieldValue.increment(!outtake.paid ? outtake.cost : 0),
        numOfOuttakesToPay: admin.firestore.FieldValue.increment(!outtake.paid ? 1 : 0),
        numOfOuttakes: admin.firestore.FieldValue.increment(1),
        itens: { [`${outtake.name}`]: itemStatMonth },
        arrTotalToPay: arrTotalToPay
    }, { merge: true });
}

async function updateStatisticOuttakeDoc(outtake, nameDoc) {
    const dateMonth = outtake.date.slice(0, 7);

    var statsMonth = await admin.firestore().collection('statistics').doc(nameDoc).collection('month').doc(dateMonth).get();

    var itensMonth = statsMonth.exists && statsMonth.data().itens ? statsMonth.data().itens : {};
    var itemStatMonth = itensMonth[outtake.name] ? itensMonth[outtake.name] : emptyOuttake();

    itemStatMonth.totalLeftToPay = admin.firestore.FieldValue.increment(-outtake.cost);
    itemStatMonth.numOfOuttakesToPay = admin.firestore.FieldValue.increment(-1);

    statsMonth.ref.set({
        date: dateMonth,
        totalLeftToPay: admin.firestore.FieldValue.increment(-outtake.cost),
        numOfOuttakesToPay: admin.firestore.FieldValue.increment(-1),
        itens: { [`${outtake.name}`]: itemStatMonth }
    }, { merge: true });
}

exports.onCreateStatisticsOuttakes = functions.firestore.document('outtakes/{id}')
    .onCreate(async (snap, context) => {
        const outtakeNew = snap.data();
        console.log("criado")
        if (outtakeNew.category) {
            outtakeCategoryListDivider(outtakeNew).map((outtake) => ({
                cost: Number(outtake.value),
                name: outtake.category,
                date: outtake.date_to_pay,
                paid: outtake.paid,
                recurrent: outtake.recurrent === "true"
            })).forEach((outtake) => createStatisticOuttakeDoc(outtake, 'outtakes-category'))


        } else {
            if (!outtakeNew.root) {
                if (outtakeNew.exams) outtakeNew.exams.forEach((outtakeObj) => {
                    var outtake = {
                        cost: Number(outtakeObj.cost),
                        name: outtakeObj.name,
                        date: moment(Number(outtakeNew.intake_id)).format("YYYY-MM-DD"),
                        paid: outtakeNew.paid,
                        recurrent: false
                    };
                    createStatisticOuttakeDoc(outtake, 'outtakes-clinic')
                })
                if (outtakeNew.specialties) outtakeNew.specialties.forEach((outtakeObj) => {
                    var outtake = {
                        cost: Number(outtakeObj.cost),
                        name: outtakeObj.name,
                        date: moment(Number(outtakeNew.intake_id)).format("YYYY-MM-DD"),
                        paid: outtakeNew.paid,
                        recurrent: false
                    };
                    createStatisticOuttakeDoc(outtake, 'outtakes-clinic')
                })
            }
        }
    });

exports.onUpdateStatisticsOuttakes = functions.firestore.document('outtakes/{id}').onUpdate(async (change, context) => {
    const outtakeOld = change.before.data();
    const outtakeUpdated = change.after.data();
    if (outtakeUpdated.paid && outtakeOld.paid !== outtakeUpdated.paid) {
        if (outtakeUpdated.category) {
            outtakeCategoryListDivider(outtakeUpdated).map((outtake) => ({
                cost: Number(outtake.value),
                name: outtake.category,
                date: outtake.date_to_pay,
                paid: true,
                recurrent: outtake.recurrent === "true"
            })).forEach((outtake) => updateStatisticOuttakeDoc(outtake, 'outtakes-category'))

        } else {
            if (!outtakeUpdated.root) {
                if (outtakeUpdated.exams) outtakeUpdated.exams.forEach((outtakeObj) => {
                    var outtake = {
                        cost: Number(outtakeObj.cost),
                        name: outtakeObj.name,
                        date: moment(Number(outtakeUpdated.intake_id)).format("YYYY-MM-DD"),
                        paid: true,
                        recurrent: false
                    }
                    updateStatisticOuttakeDoc(outtake, 'outtakes-clinic')
                })
                if (outtakeUpdated.specialties) outtakeUpdated.specialties.forEach((outtakeObj) => {
                    var outtake = {
                        cost: Number(outtakeObj.cost),
                        name: outtakeObj.name,
                        date: moment(Number(outtakeUpdated.intake_id)).format("YYYY-MM-DD"),
                        paid: true,
                        recurrent: false
                    }
                    updateStatisticOuttakeDoc(outtake, 'outtakes-clinic')
                })
            }
        }
    }
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

async function convertGeopointCEPSubcollectionInObject(ref) {
    let cepGeopoint = ref.data();
    let monthlyReports = [];
    // eslint-disable-next-line no-await-in-loop
    let docsCollection = await admin.firestore().collection('statistics').doc('geopoints').collection('users_by_neighborhood').doc(ref.id).collection('monthly_report').get()
    for (let reportDoc in docsCollection.docs) {
        let report = docsCollection.docs[reportDoc].data()
        monthlyReports.push({
            ...report,
            id: docsCollection.docs[reportDoc].id
        });
    }
    ref.ref.set(
        {
            ...cepGeopoint,
            monthly_report: monthlyReports,
        }
    )
    return {
        ...cepGeopoint,
        monthly_report: monthlyReports,
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
