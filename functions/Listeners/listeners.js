const functions = require('firebase-functions');
const admin = require('firebase-admin');
try { admin.initializeApp(functions.config().firebase); } catch (e) { console.log(e) }

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
});

exports.ListenUpdateCpf = functions.firestore.document('users/{cpf}').onUpdate( async (change, context) => {
    let firestore = admin.firestore();
    let cpfNew = change.after.data().cpf;
    let cpfOld = change.before.data().cpf;
    if( cpfNew !== cpfOld ){
        firestore.collectionGroup('users').doc(cpfOld).update({cpf: cpfNew});
    }
});

exports.ListenCreatedUser = functions.firestore.document('users/{id}').onCreate((doc, context) => {
    let firestore = admin.firestore();
    console.log('doc:',doc)
    console.log('id:', doc.id)
    console.log('data:',doc.data())
    let id = doc.id;
    firestore.collection('users').doc(id).update({uid: id})
});

exports.ListenUpdateUid = functions.firestore.document('users/{uid}').onUpdate( async (change, context) => {
    let firestore = admin.firestore();
    let uidNew = change.after.data().uid;
    let uidOld = change.before.data().uid;
    if( uidNew !== uidOld ){
        firestore.collectionGroup('users').doc(uidOld).update({uid: uidNew});
    }
});
/*    .onCreate( async (change, context) => {
    const firestore = admin.firestore();
    const userCreated = change.after.data();
    let query = firestore.collection('users');
    let usersSnap = [];
    query = query.where('name', '==', userCreated.name)
    query = query.where('uid', '==', undefined)
    usersSnap = await query.get();
    usersSnap.forEach(doc => {
        doc.ref.update({uid: doc.id})
    });*/
/*});*/
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

exports.ListenUpdateClinic = functions.firestore.document('clinics/{name}').onUpdate( async (change, context) => {
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