const functions = require('firebase-functions');
const serviceAccount = require('./serviceAccountKey.json')

const cors = require('cors')({ origin: true });
var admin = require('firebase-admin');
var moment = require('moment');
const json2csv = require('json2csv');

//admin.initializeApp();
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://prosaudedev.firebaseio.com"
});
const defaultRoute = '/analise-exames'

const heavyFunctionsRuntimeOpts = {
    timeoutSeconds: 540,
    memory: '2GB'
}

exports.hello = functions.runWith(heavyFunctionsRuntimeOpts).https.onRequest((req, res) => {
    console.log(req.query.name);
    var name = req.query.name || "Sem Nome"
    res.send("hello ", name);
})

exports.getLastAccessedPatients = functions.runWith(heavyFunctionsRuntimeOpts).https.onRequest(async (req, res) => {
    var quant = req.query.quantity
    let users = await admin.firestore.document('users').limit(quant).orderBy("accessed_at", "desc").get()
    let editadUsers = []
    for (let doc of users.docs) {
        editadUsers.push({
            name: doc.name,
            cpf: doc.cpf
        })
    }
    const csv = json2csv(editadUsers)
    res.status(200).send(csv);
})

exports.removeUnnappointedConsultations = functions.runWith(heavyFunctionsRuntimeOpts).https.onRequest(async (request, response) => {
    let db = admin.firestore()
    var startDate = moment(request.query.date, 'YYYY-MM-DD HH:mm')
    var finalDate = moment(startDate).add(5, 'days')
    let consCollection = await db.collection('consultations').where('date', '>', startDate.format('YYYY-MM-DD HH:mm')).where('date', '<', finalDate.format('YYYY-MM-DD HH:mm')).get()
    while (consCollection.docs.length > 0) {
        consCollection.forEach((docRef) => {
            if (!docRef.data().user) {
                db.collection('consultations').doc(docRef.id).delete()
            }
        })
        startDate = moment(finalDate)
        finalDate = moment(startDate).add(5, 'days')
        // eslint-disable-next-line no-await-in-loop
        consCollection = await db.collection('consultations').where('date', '>', startDate.format('YYYY-MM-DD HH:mm')).where('date', '<', finalDate.format('YYYY-MM-DD HH:mm')).get()
    }
    response.status(200).send('Engage Destruction')
    return
})

exports.createConsultations = functions.https.onRequest((request, response) => {
    let consultation = request.body
    let startDate = moment(consultation.start_date, 'YYYY-MM-DD')
    let finalDate = moment(consultation.final_date, 'YYYY-MM-DD')
    let daysDiff = finalDate.diff(startDate, 'days')
    let routineId = moment().valueOf()
    for (let i = 0; i <= daysDiff; i++) {
        let day = moment(consultation.start_date, 'YYYY-MM-DD').add(i, 'days')
        if (consultation.weekDays.indexOf(day.weekday()) > -1) {
            for (let j = 0; j < consultation.vacancy; j++) {
                delete consultation.doctor.clinics
                delete consultation.doctor.specialties
                delete consultation.specialty.doctors
                let consultObject = {
                    specialty: consultation.specialty,
                    date: day.format('YYYY-MM-DD') + ' ' + consultation.hour,
                    routine_id: routineId,
                    clinic: consultation.clinic,
                    doctor: consultation.doctor,
                }
                admin.firestore().collection('consultations').add(consultObject)
            }
        }
    }
    cors(request, response, () => {
        response.status(200).send('success')
    });
    return
})

exports.addMessage = functions.https.onRequest(async (req, res) => {
    cors(request, response, () => {
        response.status(200).send('success aí cara. Foco!')
    });
});

exports.listenChangeInSpecialtiesSubcollections = functions.firestore.document('specialties/{specialtyId}/{collectionId}/{docId}').onWrite(async (change, context) => {
    convertSpecialtySubcollectionInObject((await admin.firestore().collection('specialties').doc(context.params.specialtyId).get()))
})

exports.listenChangeInDoctorsSubcollections = functions.firestore.document('users/{userId}/{collectionId}/{docId}').onWrite(async (change, context) => {
    convertDoctorSubcollectionInObject((await admin.firestore().collection('users').doc(context.params.userId).get()))
})

exports.updateSpecialties = functions.runWith(heavyFunctionsRuntimeOpts).https.onRequest(async (req, res) => {
    res.send(await convertSpecialtiesSubcollectionsInObjects())
});

exports.updateDoctors = functions.runWith(heavyFunctionsRuntimeOpts).https.onRequest(async (req, res) => {
    res.send(await convertDoctorsSubcollectionsInObjects())
});

exports.updateIntakes = functions.runWith(heavyFunctionsRuntimeOpts).https.onRequest(async (req, res) => {
    res.send(await convertIntakesSubcollectionsInObjects())
});

exports.fixIntakesBrokenSpecialties = functions.runWith(heavyFunctionsRuntimeOpts).https.onRequest(async (req, res) => {
    res.send(await fixIntakesBrokenSpecialties())
});

async function convertIntakesSubcollectionsInObjects() {
    let db = admin.firestore()
    let intakesRef = db.collection('intakes')
    let intakesSnap = await intakesRef.get()
    let allIntakes = [];
    for (let doc of intakesSnap.docs) {
        // eslint-disable-next-line no-await-in-loop
        let exams = await doc.ref.collection('exams').get()
        exams = convertCollectionIntoArray(exams)
        // eslint-disable-next-line no-await-in-loop
        let specialties = await doc.ref.collection('specialties').get()
        specialties = convertCollectionIntoArray(specialties)
        // eslint-disable-next-line no-await-in-loop
        let converted = {
            ...doc.data(),
            exams: exams,
            specialties: specialties
        }
        doc.ref.update(converted)
        // allIntakes.push(converted)
    }
    return allIntakes
}

function convertCollectionIntoArray(collection) {
    let collectionArray = []
    for (let doc of collection.docs) {
        collectionArray.push(
            doc.data()
        )
    }
    return collectionArray
}

async function fixIntakesBrokenSpecialties() {
    let db = admin.firestore()
    let intakesRef = await db.collection('intakes').get()
    for (let doc of intakesRef.docs) {
        // eslint-disable-next-line no-await-in-loop
        let specialties = await doc.ref.collection('specialties').get()
        for (let doc of specialties.docs) {
            let update = doc.data()
            if (update.doctor.clinics) {
                delete update.doctor.clinics
            }
            if (update.doctor.clinic.exams) {
                delete update.doctor.clinic.exams
            }
            if (update.doctor.clinic.specialties) {
                delete update.doctor.clinic.specialties
            }
            doc.ref.update(update)
        }
    }
    return 'Sucesso, consertado ' + intakesRef.docs.length + ' intakes'
}

async function convertSpecialtiesSubcollectionsInObjects() {
    let db = admin.firestore()
    let specRef = db.collection('specialties')
    let specSnap = await specRef.get()
    let allSpecialties = [];
    for (let docIndex in specSnap.docs) {
        // eslint-disable-next-line no-await-in-loop
        let converted = await convertSpecialtySubcollectionInObject(specSnap.docs[docIndex])
        allSpecialties.push(converted)
    }
    return allSpecialties
}

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

async function convertDoctorsSubcollectionsInObjects() {
    let db = admin.firestore()
    let doctorRef = db.collection('users')
    let doctorSnap = await doctorRef.where('type', '==', 'DOCTOR').get()
    let allDoctors = [];
    for (let docIndex in doctorSnap.docs) {
        // eslint-disable-next-line no-await-in-loop
        let doctor = await convertDoctorSubcollectionInObject(doctorSnap.docs[docIndex])
        allDoctors.push(doctor)
    }
    return allDoctors
}


exports.cronjob = require('./Cronjob/Cronjob')
exports.listeners = require('./Listeners/listeners')
exports.requests = {
    ...require('./Requests/requests'),
    ...require('./Requests/statistics.js')
}



//Func nao usada em nenhum canto
async function getDocSubcollections(doc) {
    // eslint-disable-next-line no-await-in-loop
    let colections = await doc.ref.listCollections()
    let subCollections = []
    colections.forEach((col) => {
        subCollections.push(col.id)
    })
    return subCollections
}
