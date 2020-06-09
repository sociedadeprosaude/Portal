const functions = require('firebase-functions');
const admin = require('firebase-admin');
try { admin.initializeApp(functions.config().firebase); } catch (e) { }


var moment = require('moment');
const heavyFunctionsRuntimeOpts = {
    timeoutSeconds: 540,
    memory: '2GB'
}

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

async function removeConsultations(payload) {
    let start = moment().format('YYYY-MM-DD 00:00');
    try {
        let query = await admin.firestore().collection('consultations')
            .where('specialty.name', "==", payload.specialty.name)
            .where('doctor.cpf', "==", payload.doctor.cpf).where('clinic.cnpj', '==', payload.clinic.cnpj)
            .where('date', ">=", start)
        if (payload.final_date) {
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