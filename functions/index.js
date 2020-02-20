const functions = require('firebase-functions');
var admin = require('firebase-admin');
const cors = require('cors')({origin: true});

var papa = require('papaparse');
var moment = require('moment');
const {parse} = require('json2csv');
admin.initializeApp();
const defaultRoute = '/analise-exames'

const heavyFunctionsRuntimeOpts = {
    timeoutSeconds: 540,
    memory: '2GB'
}

exports.createConsultations = functions.https.onRequest((request, response) => {
    let consultation = request.body
    console.log('cons', consultation.start_date, consultation)
    let startDate = moment(consultation.start_date, 'YYYY-MM-DD')
    let finalDate = moment(consultation.final_date, 'YYYY-MM-DD')
    let daysDiff = finalDate.diff(startDate, 'days')
    console.log('daysdiff', daysDiff)
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

exports.updateSpecialties = functions.runWith(heavyFunctionsRuntimeOpts).https.onRequest(async (req, res) => {
    res.send(await convertSpecialtiesSubcollectionsInObjects())
});

exports.updateDoctors = functions.runWith(heavyFunctionsRuntimeOpts).https.onRequest(async (req, res) => {
    res.send(await convertDoctorsSubcollectionsInObjects())
});

async function convertSpecialtiesSubcollectionsInObjects() {
    let db = admin.firestore()
    let specRef = db.collection('specialties')
    let specSnap = await specRef.get()
    let allSpecialties = [];
    for (let docIndex in specSnap.docs) {
        let converted = convertSpecialtySubcollectionInObject(specSnap.docs[docIndex])
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

async function getDocSubcollections(doc) {
    // eslint-disable-next-line no-await-in-loop
    let colections = await doc.ref.listCollections()
    let subCollections = []
    colections.forEach((col) => {
        subCollections.push(col.id)
    })
    return subCollections
}
