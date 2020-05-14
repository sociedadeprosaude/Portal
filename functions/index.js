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

exports.removeUnnappointedConsultations = functions.runWith(heavyFunctionsRuntimeOpts).https.onRequest(async (request, response) => {
    let db = admin.firestore()
    var startDate = moment(request.query.date, 'YYYY-MM-DD HH:mm')
    var finalDate = moment(startDate).add(5, 'days')
    console.log(`Datas: ${startDate.format('DD/MM/YYYY HH:mm')} até ${finalDate.format('DD/MM/YYYY HH:mm')}`)
    let consCollection = await db.collection('consultations').where('date', '>', startDate.format('YYYY-MM-DD HH:mm')).where('date', '<', finalDate.format('YYYY-MM-DD HH:mm')).get()
    console.log('size: ', consCollection.docs.length)
    while (consCollection.docs.length > 0) {
        console.log(`Deletando: ${startDate.format('DD/MM/YYYY HH:mm')} até ${finalDate.format('DD/MM/YYYY HH:mm')}`)
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

//=================================== Tickets ====================================================


//schedule('min hour dayOfTheMonth month dayOfTheWeek')
//toda meia noite no caso ('0 0 * * *').
exports.saveTicketsHistory = functions.pubsub.schedule('0 0 * * *').onRun((context) => {
    const firestore = admin.firestore();
    // Buscando todas as salas (collectionGroup pega ate as rooms que estao em subcolecoes de colecoes,
    // recomendo nao criar mais collections com esse nome se nao elas vao ser pegas aqui)
    // eslint-disable-next-line promise/catch-or-return
    firestore.collectionGroup('rooms').get().then((rooms) => {
        rooms.forEach((room) => {
            // verificando se a sala teve fila de tickets
            if (room.data().tickets.length !== 0) {
                // Pegando a historia da sala (criei o campo clicnicDoc no metadata da room pra facilitar a query de salvar
                // eslint-disable-next-line promise/catch-or-return
                firestore.collection('tickets-history').doc(room.data().doc_clinic)
                    .collection('rooms-history').doc(room.id).get()
                    .then(async (roomHist) => {
                        if (roomHist.exists) {
                            const hist = roomHist.data().history;
                            hist.push(...room.data().tickets);
                            await roomHist.ref.update({
                                history: hist
                            });
                        } else {
                            await roomHist.ref.set({
                                history: room.data().tickets
                            })
                        }
                        // Esvaziando a fila de tickets depois de atualizado o history
                        room.ref.update({
                            tickets: []
                        });
                        return
                    });
            }
        });
        return
    });
    return null;
});

exports.resetTicketsCount = functions.pubsub.schedule('0 0 * * *').onRun((context) => {
    const firestore = admin.firestore();
    // eslint-disable-next-line promise/catch-or-return
    firestore.collectionGroup('tickets').get().then((docs) => {
        docs.forEach((doc) => doc.ref.update({
            ticket_number: 1
        }));
        return
    });
    return null;
});

exports.getSpecialtiesWithPrice = functions.runWith(heavyFunctionsRuntimeOpts).https.onRequest(async (request, response) => {
    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS');
    response.set('Access-Control-Allow-Headers', '*');
    let minParcel = 40
    let scheduleCollection = await admin.firestore().collection('schedules').get()
    let availableSpecialties = []
    for (let scheduleDoc of scheduleCollection.docs) {
        let schedule = scheduleDoc.data()
        if (availableSpecialties.indexOf(schedule.specialty.name) < 0) {
            availableSpecialties.push(schedule.specialty.name)
        }
    }
    let specialtiesSnap = await admin.firestore().collection('specialties').get()

    let allSpecialties = [];
    allSpecialties = specialtiesSnap.docs.map(doc => ({...doc.data(), id: doc.id}))

    let formattedSpecialties = allSpecialties.filter((spec) => {
        return spec.doctors && spec.doctors.length > 0 && availableSpecialties.indexOf(spec.name) > -1
    }).map((spec) => {
        let price = spec.doctors[0].price
        let specWithPrice = {
            ...spec,
            price: price,
            numOfParcels: Math.floor(price / minParcel),
            valueOfParcels: price / Math.floor(price / minParcel)
        }
        delete specWithPrice.doctors
        return specWithPrice
    })

    response.status(200).send(formattedSpecialties.slice(0, 5))
})

exports.deleteScheduleByDay = functions.runWith(heavyFunctionsRuntimeOpts).https.onCall(async (data, context) => {
    let payload = data.payload
    let schedule = await admin.firestore().collection('schedules')
        .where('specialty.name', "==", payload.specialty.name)
        .where('doctor.cpf', "==", payload.doctor.cpf)
        .where('clinic.cnpj', '==', payload.clinic.cnpj).get()
    schedule.forEach((doc) => {
        let data = doc.data()
        let cancelations_schedules = data.cancelations_schedules ? data.cancelations_schedules : []
        let obj = { start_date: payload.start_date, final_date: payload.final_date }
        if (payload.hour)
            obj.hour = payload.hour
        if (payload.weekDays)
            obj.week_days = payload.weekDays
        cancelations_schedules.push({ ...obj })
        admin.firestore().collection('schedules').doc(doc.id).update({ cancelations_schedules: cancelations_schedules })
    })
    removeConsultations(payload)
    return {Message:"Success"}
});

exports.deleteSchedule = functions.firestore
    .document('schedules/{scheduleID}')
    .onDelete(async (snap, context) => {
        const deletedSchedule = snap.data();
        await removeConsultations(deletedSchedule)
    });

async function removeConsultations(payload) {
    let start = moment().format('YYYY-MM-DD 00:00');
    try {
        let query = await admin.firestore().collection('consultations')
            .where('specialty.name', "==", payload.specialty.name)
            .where('doctor.cpf', "==", payload.doctor.cpf).where('clinic.cnpj', '==', payload.clinic.cnpj)
            .where('date', ">=", start)
        if (payload.final_date){
            let end = moment(payload.final_date, 'YYYY-MM-DD').format('YYYY-MM-DD 23:59');
            query.where('date', "<=", end)
        }


        let snapshot = await query.get()
        snapshot.forEach(async doc => {

            let dateConsultation = moment(doc.data().date);
            let filterHour = payload.hour ? doc.data().date.split(' ')[1] === payload.hour ? true : false : true
            let filterDayWeek = payload.weekDays ? payload.weekDays.indexOf(dateConsultation.weekday()) > -1 ? true : false : true

            if (filterHour && filterDayWeek) {
                admin.firestore().collection('consultations').doc(doc.id).delete();
            }
            if (filterHour && filterDayWeek && doc.data().user) {
                admin.firestore().collection('users').doc(doc.data().user.cpf).collection('consultations').doc(doc.id).delete();
                admin.firestore().collection('canceled').doc(doc.id).set(doc.data())
            }
        })
    } catch (e) {
        throw e
    }
    return
}

exports.thereIsPaymentNumber = functions.runWith(heavyFunctionsRuntimeOpts).https.onCall(async (data, context) => {
    let payload = data.payload
    let examesSpecialties = ['ULTRASSONOGRAFIA', 'ELETROCARDIOGRAMA', 'ELETROENCEFALOGRAMA', 'ECOCARDIOGRAMA', 'VIDEOLARIGONSCOPIA'];
    let procedures;
    let type = payload.exam ? 'Exam' : 'Consultation';
    let status = payload.exam ? 'Exame Pago' : 'Consulta Paga';
    let procedureRef;
    if (payload.status && payload.payment_number)
        procedureRef = admin.firestore().collection('users').doc(payload.user.cpf).collection('procedures').where('type', '==', 'Consultation')
            .where('specialty', '==', payload.specialty.name).where('status', 'array-contains-any', payload.status).where('payment_number', '==', payload.payment_number.toString());
    else {
        procedureRef = payload.exam ? procedureRef = admin.firestore().collection('users').doc(payload.user.cpf).collection('procedures').where('type', '==', type)
            .where('specialty', '==', payload.specialty.name).where('status', '==', [status]).where('exam.name', '==', payload.exam.name)
            : procedureRef = admin.firestore().collection('users').doc(payload.user.cpf).collection('procedures').where('type', '==', type)
                .where('specialty', '==', payload.specialty.name).where('status', '==', [status])
    }


    let procedureRefOr = admin.firestore().collection('users').doc(payload.user.cpf).collection('procedures').where('type', '==', 'Exam')
        .where('specialty', '==', payload.specialty.name).where('status', '==', ['Exame Pago'])

    procedures = await procedureRef.get();
    if (procedures.empty && type === 'Consultation' && examesSpecialties.indexOf(payload.specialty.name) !== -1)
        procedures = await procedureRefOr.get();

    if (!procedures.empty) {
        let payment_found
        procedures.forEach((procedure) => {
            payment_found = procedure
        })
        return {Found:{procedureId: payment_found.id, ...payment_found.data()}}
    } else {
        let cost = await specialtyCost(payload.specialty.name,payload.doctor.cpf)
        return {NotFound:cost};
    }
});

async function specialtyCost(specialtyName,doctorCPF){
    let specialties = await admin.firestore().collection('specialties').get()
    specialties = convertCollectionIntoArray(specialties)

    let cost = undefined;
    specialties.forEach(specialty => {
        if (specialty.name === specialtyName && specialty.doctors) {
            specialty.doctors.forEach(doctor => {
                if (doctor.cpf === doctorCPF) {
                    cost = {
                        cost: doctor.cost,
                        price: doctor.price,
                        doctorConsultation: doctor
                    };
                }
            });
        }
    });
    return cost
}
