const functions = require('firebase-functions');
const admin = require('firebase-admin');


var axios = require("axios");
var xml2js = require('xml2js');
const cors = require('cors')({ origin: true });
var moment = require('moment');
const { Parser } = require('json2csv');


const heavyFunctionsRuntimeOpts = {
    timeoutSeconds: 540,
    memory: '2GB'
}

exports.getLastAccessedPatients = functions.runWith(heavyFunctionsRuntimeOpts).https.onRequest(async (req, res) => {
    var quant = parseInt(req.query.quantity)
    let users = await admin.firestore().collection('users').orderBy("accessed_to", "desc").limit(quant).get()
    let editadUsers = []
    users.forEach((docRef) => {
        editadUsers.push({
            "name": docRef.data().name,
            "cpf": docRef.data().cpf,
        })
    })
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(editadUsers)
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

exports.updateSpecialties = functions.runWith(heavyFunctionsRuntimeOpts).https.onRequest(async (req, res) => {
    res.send(await convertSpecialtiesSubcollectionsInObjects())
});

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


exports.updateDoctors = functions.runWith(heavyFunctionsRuntimeOpts).https.onRequest(async (req, res) => {
    res.send(await convertDoctorsSubcollectionsInObjects())
});

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

exports.updateIntakes = functions.runWith(heavyFunctionsRuntimeOpts).https.onRequest(async (req, res) => {
    res.send(await convertIntakesSubcollectionsInObjects())
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


exports.fixIntakesBrokenSpecialties = functions.runWith(heavyFunctionsRuntimeOpts).https.onRequest(async (req, res) => {
    res.send(await fixIntakesBrokenSpecialties())
});

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


exports.thereIsPaymentNumber = functions.runWith(heavyFunctionsRuntimeOpts).https.onCall(async (data, context) => {
    let payload = data.payload
    let procedures;
    let type = payload.exam ? 'Exam' : 'Consultation';
    let status = payload.exam ? 'Exame Pago' : 'Consulta Paga';
    let procedureRef;
    let exam = undefined
    if (payload.status && payload.payment_number)
        procedureRef = admin.firestore().collection('users').doc(payload.user.cpf).collection('procedures').where('type', '==', 'Consultation')
            .where('specialty', '==', payload.specialty.name).where('status', 'array-contains-any', payload.status).where('payment_number', '==', payload.payment_number.toString());
    else if (payload.exam) {
        procedureRef = admin.firestore().collection('users').doc(payload.user.cpf).collection('procedures').where('type', '==', type)
            .where('exam.type', '==', payload.exam.type).where('status', '==', [status])
        if (payload.exam.name)
            procedureRef = procedureRef.where('exam.name', '==', payload.exam.name)
    }
    else {
        procedureRef = admin.firestore().collection('users').doc(payload.user.cpf).collection('procedures').where('type', '==', type)
            .where('specialty', '==', payload.specialty.name).where('status', '==', [status])
    }

    procedures = await procedureRef.get();

    if (!procedures.empty) {
        let payment_found
        procedures.forEach((procedure) => {
            payment_found = procedure
        })
        return { Found: { procedureId: payment_found.id, ...payment_found.data() } }
    } else {
        let cost = payload.specialty ? await specialtyCost(payload.specialty.name, payload.doctor.cpf) : undefined
        return { NotFound: cost };
    }
});

async function specialtyCost(specialtyName, doctorCPF) {
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

exports.getConsultationsAndIntakesByDayPeriodAndWeekDays = functions.runWith(heavyFunctionsRuntimeOpts).https.onRequest(async (request, response) => {
    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS');
    response.set('Access-Control-Allow-Headers', '*');
    let start_date = request.query.start_date
    let final_date = request.query.final_date
    let consultations = await getCollectionFromPeriod(start_date, final_date, 'consultations')
    let intakes = await getCollectionFromPeriod(start_date, final_date, 'intakes')
    let doneConsultations = consultations.filter((cons) => {
        return cons.consultationHour
    })
    let paidConsultations = consultations.filter((cons) => {
        return cons.status === 'Pago'
    })
    doneConsultations = splitCollectionByDayPeriod(doneConsultations)
    doneConsultations.morning = getCollectionByDayOfTheWeek(doneConsultations.morning)
    doneConsultations.afternoon = getCollectionByDayOfTheWeek(doneConsultations.afternoon)

    paidConsultations = splitCollectionByDayPeriod(paidConsultations)
    paidConsultations.morning = getCollectionByDayOfTheWeek(paidConsultations.morning)
    paidConsultations.afternoon = getCollectionByDayOfTheWeek(paidConsultations.afternoon)

    intakes = splitCollectionByDayPeriod(intakes)
    intakes.morning = getCollectionByDayOfTheWeek(intakes.morning)
    intakes.afternoon = getCollectionByDayOfTheWeek(intakes.afternoon)
    response.status(200).send({
        'Consultas Feitas': doneConsultations,
        'Consultas Pagas': paidConsultations,
        'Vendas realizadas': intakes
    })
});

async function getCollectionFromPeriod(start_date, final_date, collectionKey) {
    try {
        let query = admin.firestore().collection(collectionKey)
        if (start_date) {
            query = query.where('date', ">=", start_date)
        }
        if (final_date) {
            query = query.where('date', "<=", final_date)
        }

        let consultationsCollection = await query.get()

        let consultations = consultationsCollection.docs.map((doc) => {
            return doc.data()
        })
        return consultations
    } catch (e) {
        throw e
    }
}
function splitCollectionByDayPeriod(collection) {
    let morningConsultation = collection.filter((cons) => {
        let date = moment(cons.date, 'YYYY-MM-DD HH:mm:ss')
        return date.hours() <= 12
    })
    let afternoonConsultation = collection.filter((cons) => {
        let date = moment(cons.date, 'YYYY-MM-DD HH:mm:ss')
        return date.hours() >= 12
    })
    return {
        morning: morningConsultation,
        afternoon: afternoonConsultation
    }
}
function getCollectionByDayOfTheWeek(collection) {
    let daysOfWeek = {}
    for (let item of collection) {
        console.log(item)
        let date = moment(item.date, 'YYYY-MM-DD HH:mm:ss')
        let dayOfWeek = date.weekday()
        if (!daysOfWeek[dayOfWeek]) {
            daysOfWeek[dayOfWeek] = 0
        }
        daysOfWeek[dayOfWeek]++
    }
    return daysOfWeek
}

//Função pra ser chamada uma unica vez pra colocar o price dos /exams que nao tem price.
exports.setPricesExams = functions.https.onRequest(async (request, response) => {
    const firestore = admin.firestore();
    var num = 0;
    firestore.collection('exams').get()
        .then(async (exams) => {
            await Promise.all(exams.docs.map(async (examRef) => {
                return new Promise(async (resolve, reject) => {
                    let queryClinics = firestore.collection('exams').doc(examRef.id).collection('clinics');
                    let clinics = await queryClinics.get();
                    if (!clinics.empty) {
                        examRef.ref.update({ price: clinics.docs[0].data().price })
                        num++;
                    }
                    resolve();
                });

            }));
            response.send(num + ' preços de exames atualizados.');
            return null;
        }).catch((err) => response.send('erro ' + err));
});



exports.fixSpecialtiesPrices = functions.https.onRequest(async (req, res) => {
    const firestore = admin.firestore();
    let snapshot = await firestore.collection('specialties').get()
    snapshot.forEach((specialty) => {
        let data = specialty.data()
        if (!data.price) {
            firestore.collection('specialties').doc(data.name).collection('doctors').get()
                .then((docs) => {
                    if (!docs.empty) {
                        let firstPrice = undefined
                        docs.forEach((doc) => {
                            if (!firstPrice)
                                firstPrice = doc.data().price
                        })

                        specialty.ref.update({ price: firstPrice })
                    }
                    return
                })
                .catch(err => console.log(err));
        }
    })
    res.status(200).send('Sucesso! Executando function para concertar especialidades sem preço');
});

exports.cancelAppointment = functions.runWith(heavyFunctionsRuntimeOpts).https.onCall(async (data, context) => {
    let payload = data.payload

    let FieldValue = admin.firestore.FieldValue;
    await admin.firestore().collection('consultations').doc(payload.id).delete()
    await admin.firestore().collection('users').doc(payload.idPatient).collection('consultations').doc(payload.id).update({ status: 'Cancelado' })

    //Para consultas que são do tipo Retorno
    if (payload.type === 'Retorno') {

        await admin.firestore().collection('consultations').doc(payload.previousConsultation).update({
            regress: FieldValue.delete()
        });
        await admin.firestore().collection('users').doc(payload.idPatient).collection('consultations').doc(payload.previousConsultation).update({
            regress: FieldValue.delete()
        })
    }

    console.log('Consulta que será cancelada->', payload)

    admin.firestore().collection('users').doc(payload.idPatient).collection('procedures')
        .where('consultation', '==', payload.id).get()
        .then((procedure) => {
            procedure.forEach((doc) => {
                console.log('um procedure->', doc.data())
                let data = doc.data();

                if (payload.type === "Consulta" && payload.payment_number !== "") {
                    //let thereIsExam = payload.consultation.exam ? payload.consultation.exam : payload.consultation.user && payload.consultation.user.exam ? payload.consultation.user.exam : undefined
                    let thereIsExam = payload.exam ? payload.exam : undefined
                    let status = thereIsExam ? 'Exame Pago' : 'Consulta Paga';
                    let type = thereIsExam ? 'Exam' : 'Consultation';
                    let obj = {
                        status: [status],
                        payment_number: data.payment_number,
                        startAt: data.startAt,
                        type: type
                    };

                    if (thereIsExam)
                        obj = { ...obj, exam: thereIsExam };
                    else
                        obj.specialty = data.specialty
                    admin.firestore().collection('users').doc(payload.idPatient).collection('procedures').add(
                        { ...obj }
                    )
                }

                admin.firestore().collection('users').doc(payload.idPatient).collection('procedures').doc(doc.id).delete()
                data.status.push('Cancelado');
                admin.firestore().collection('users').doc(payload.idPatient).collection('proceduresFinished').doc(doc.id)
                    .set(data);
                return;
            })
            return
        }).catch(() => {

        })


    //Para consultas do tipo Consulta e possuem um retorno associado. É necessário remover o agendamento do retorno associado
    if (payload.regress !== undefined) {
        await admin.firestore().collection('consultations').doc(payload.regress).delete()
        await admin.firestore().collection('users').doc(payload.idPatient).collection('consultations').doc(payload.regress).update({ status: 'Cancelado' })
    }

    return 'Appointment Cancelled'
});

exports.addUserToConsultation = functions.runWith(heavyFunctionsRuntimeOpts).https.onCall(async (data, context) => {
    let payload = data.payload
    let obj = {
        ...payload.consultation,
        user: payload.user
    };
    console.log('Aqui no cloud', obj)
    let resp = await admin.firestore().collection('consultations').add(obj);
    if (payload.consultation.type === "Retorno") {
        await admin.firestore().collection('consultations').doc(payload.consultation.previousConsultation).update({ regress: resp.id })
    }
    payload.consultation.id = resp.id;
    await addConsultationAppointmentToUser({ ...payload })

    return { Message: "Success new consultation " + resp.id }
});

async function addConsultationAppointmentToUser(payload) {
    let copyPayload = Object.assign({}, payload);
    console.log('Aqui no adicionar consultation to appointment', copyPayload)
    await admin.firestore().collection('users').doc(copyPayload.user.cpf).collection('consultations').doc(copyPayload.consultation.id).set(copyPayload.consultation);
    if (copyPayload.consultation.type === "Retorno") {
        console.log('Vai criar retorno')
        await admin.firestore().collection('users').doc(copyPayload.user.cpf).collection('consultations').doc(copyPayload.consultation.previousConsultation).update({ regress: copyPayload.consultation.id })
        let procedure = await admin.firestore().collection('users').doc(copyPayload.user.cpf).collection('procedures').where('type', '==', 'Consultation')
            .where('consultation', '==', copyPayload.consultation.previousConsultation).get()
        procedure.forEach(doc => {

            admin.firestore().collection('users').doc(copyPayload.user.cpf).collection('procedures').doc(doc.id)
                .update({
                    status: admin.firestore.FieldValue.arrayUnion('Retorno agendado'),
                })
        })
    } else if (copyPayload.payment_numberFound) {
        admin.firestore().collection('users').doc(copyPayload.user.cpf).collection('procedures').doc(copyPayload.payment_numberFound.procedureId)
            .update({
                status: admin.firestore.FieldValue.arrayUnion('Agendado'),
                consultation: copyPayload.consultation.id,
            })
    } else {
        let obj = {
            status: ['Agendado'],
            startAt: moment().format('YYYY-MM-DD hh:ss'),
            consultation: copyPayload.consultation.id,
        };
        if (copyPayload.consultation.exam) {
            obj.type = 'Exam';
            obj.exam = copyPayload.consultation.exam
        } else {
            obj.specialty = copyPayload.consultation.specialty.name
            obj.type = 'Consultation';
        }
        admin.firestore().collection('users').doc(copyPayload.user.cpf).collection('procedures').add(obj)
    }
}

exports.registerUser = functions.https.onCall(async (data, context) => {
    const firestore = admin.firestore();
    return admin.auth()
        .createUser({
            email: data.email,
            password: data.password,
        })
        .then(async (user) =>
            firestore.collection('users').doc(data.email)
                .set({
                    email: data.email,
                    uid: user.uid,
                    name: data.name,
                    created_at: moment().format('YYYY-MM-DD HH:mm:ss')
                })
                .then((result) => result)
                .catch((e) => { throw new functions.https.HttpsError(e) })
        )
        .catch((error) => {
            throw new functions.https.HttpsError(error);
        });
});



//================================================================================================================
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
    allSpecialties = specialtiesSnap.docs.map(doc => ({ ...doc.data(), id: doc.id }))

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
    return { Message: "Success" }
});

exports.deleteSchedule = functions.firestore
    .document('schedules/{scheduleID}')
    .onDelete(async (snap, context) => {
        const deletedSchedule = snap.data();
        await removeConsultations(deletedSchedule)
    });

exports.updateSchedule = functions.firestore
    .document('schedules/{scheduleID}')
    .onUpdate(async (change, context) => {
        console.log('UpdateSchedulessss')
        let newValue = change.after.data();
        let previousValue = change.before.data();
        let cancelationsOld = previousValue.cancelations_schedules ? previousValue.cancelations_schedules : []
        let cancelationsNew = newValue.cancelations_schedules ? newValue.cancelations_schedules : []
        if (Object.keys(newValue.days).length < Object.keys(previousValue.days).length) {
            let keysOld = Object.keys(previousValue.days)
            let keyNew = Object.keys(newValue.days)
            let weekDays = []
            keysOld.forEach((day) => {
                if (keyNew.indexOf(day) === -1)
                    weekDays.push(day)
            })
            newValue.weekDays = weekDays
            await removeConsultations(newValue)
        }

        if (cancelationsNew.length > cancelationsOld.length) {
            cancelationsNew.forEach(async (cancelationObj) => {
                if (cancelationsOld.findIndex((value) => value.start_date === cancelationObj.start_date && value.final_date === cancelationObj.final_date) === -1) {
                    newValue.start_date = cancelationObj.start_date
                    newValue.final_date = cancelationObj.final_date
                    await removeConsultations(newValue)
                }
            })
        }
    });

async function removeConsultations(payload) {
    let start = moment().format('YYYY-MM-DD 00:00');
    let query = admin.firestore().collection('consultations')
        .where('doctor.cpf', "==", payload.doctor.cpf).where('clinic.name', '==', payload.clinic.name)
        .where('date', ">=", start)
    if (payload.final_date) {
        let end = moment(payload.final_date, 'YYYY-MM-DD').format('YYYY-MM-DD 23:59');
        query = query.where('date', "<=", end)
    }

    if (payload.specialty)
        query = query.where('specialty.name', "==", payload.specialty.name)
    else
        query = query.where('exam.type', "==", payload.exam_type.name)


    let snapshot = await query.get()
    snapshot.forEach(async doc => {
        let dateConsultation = moment(doc.data().date);
        let filterHour = payload.hour ? doc.data().date.split(' ')[1] === payload.hour ? true : false : true
        let filterDayWeek = payload.weekDays ? payload.weekDays.indexOf(dateConsultation.weekday().toString()) > -1 ? true : false : true

        if (filterHour && filterDayWeek) {
            admin.firestore().collection('consultations').doc(doc.id).delete();
        }
        if (filterHour && filterDayWeek && doc.data().user) {
            admin.firestore().collection('users').doc(doc.data().user.cpf).collection('consultations').doc(doc.id).delete();
            admin.firestore().collection('canceled').doc(doc.id).set(doc.data())
        }
    })
    return { Message: "Success" }
}


exports.fixSchedulesPrices = functions.https.onRequest(async (req, res) => {
    const firestore = admin.firestore();
    let snapshot = await firestore.collection('schedules').get()
    snapshot.forEach((schedule) => {
        let data = schedule.data()
        console.log('Specialty->', data)
        if (!data.specialty.price) {
            firestore.collection('specialties').doc(data.specialty.name).get()
                .then((specialty) => {
                    if (specialty.exists) {
                        let specialtyData = specialty.data()
                        schedule.ref.update({
                            specialty: { name: specialtyData.name, id: specialtyData.id, price: specialtyData.price }
                        })
                    }
                    return
                })
                .catch(err => console.log(err));
        }
    })
    res.status(200).send('Sucesso! Executando function para concertar especialidades de schedules sem preço');
});





//===================================== funcs ============================================

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
