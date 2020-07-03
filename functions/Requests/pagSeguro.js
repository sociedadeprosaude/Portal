const functions = require('firebase-functions');
const admin = require('firebase-admin');

var pagSeguroCredentials = require('./credentials').pagSeguroKey;

var axios = require("axios");
var xml2js = require('xml2js');
const cors = require('cors')({ origin: true });
var moment = require('moment');
const { Parser } = require('json2csv');


const heavyFunctionsRuntimeOpts = {
    timeoutSeconds: 540,
    memory: '2GB'
}
//================================== Funcs relacionadas ao pagamento pelo pagSeguro ============================================

async function verifyUnpaidConsultation(payload) {
    let consultationFound = undefined;
    let precoVendaZero = payload.isConsultation && payload.specialty.price === 0;
    if (!precoVendaZero) {
        let consultationRef = payload.userRef.collection('consultations').where('specialty.name', '==', payload.specialty.name).where('status', '==', 'Aguardando pagamento')
        //.get()

        if (!payload.isConsultation)
            consultationRef.where('exam.name', '==', payload.examObj.name);
        let consultations = await consultationRef.get();
        await Promise.all(consultations.docs.map(async (c) => {
            consultationFound = c;
            console.log("cpf", payload.user.cpf);
            await updatePaymentNumberConsultation({ user: payload.user, consultation: c, payment_number: payload.payment_number })
            return null
        }))
    }
    createOrUpdateProcedure({
        consultationFound: consultationFound,
        consultation: payload.consultation,
        precoVendaZero: precoVendaZero,
        userRef: payload.userRef,
        user: payload.user,
        isConsultation: payload.isConsultation,
        payment_number: payload.payment_number,
        specialty: payload.specialty,
        examObj: payload.examObj
    })

}


async function updatePaymentNumberConsultation(payload) {
    const firestore = admin.firestore();
    console.log("updatando", payload.consultation.id)
    await firestore.collection('users').doc(payload.user.cpf).collection('consultations').doc(payload.consultation.id).update({
        status: 'Pago',
        payment_number: payload.payment_number.toString()
    });
    await firestore.collection('consultations').doc(payload.consultation.id).update({
        status: 'Pago',
        payment_number: payload.payment_number.toString()
    })
}


async function createOrUpdateProcedure(payload) {
    const firestore = admin.firestore();
    let consultationFound = payload.consultationFound;
    let user = payload.user;
    let statusName = payload.isConsultation ? 'Consulta Paga' : 'Exame Pago';
    let type = payload.isConsultation ? 'Consultation' : 'Exam';

    if (consultationFound || (payload.precoVendaZero && payload.isConsultation)) {
        let consultation = payload.precoVendaZero && payload.isConsultation ? payload.consultation : consultationFound
        let procedures = await firestore.collection('users').doc(user.cpf).collection('procedures')
            .where('consultation', '==', consultation.id).get();
        if (!procedures.empty) {
            procedures.forEach((snap) => {
                let obj = {
                    status: admin.firestore.FieldValue.arrayUnion(statusName),
                    payment_number: payload.payment_number
                };
                if (!payload.isConsultation) Object.assign(obj, { exam: { ...payload.examObj } });
                firestore.collection('users').doc(user.cpf).collection('procedures').doc(snap.id).update(obj)
            })
        }
    } else {
        let obj = {
            status: [statusName],
            payment_number: payload.payment_number,
            startAt: moment().format('YYYY-MM-DD hh:ss'),
            type: type,
            specialty: payload.specialty.name
        };
        if (!payload.isConsultation) Object.assign(obj, { exam: { ...payload.examObj } });
        firestore.collection('users').doc(user.cpf).collection('procedures').add(obj)
    }
}
// exports.tstCreateIntake = functions.https.onRequest(async (request, response) => {
//     firestore.collection('budgets').doc("asd").get()

// });
async function createIntake(doc) {
    const firestore = admin.firestore();
    const budgetRef = firestore.collection('budgets').doc(doc.id)
    const intakeRef = firestore.collection('intakes').doc(doc.id)
    const userRef = firestore.collection('users').doc(doc.data().user.cpf);

    var specialties = await budgetRef.collection('specialties').get();
    var exams = await budgetRef.collection('exams').get();

    intakeRef.set(doc.data());
    userRef.collection('intakes').doc(doc.id).set(doc.data());

    if (!specialties.empty) {
        specialties.docs.forEach((specialty) => {
            intakeRef.collection('specialties').doc(specialty.data().name).set(specialty.data());
            userRef.collection('intakes').doc(doc.id).collection('specialties').doc(specialty.data().name).set(specialty.data());
            verifyUnpaidConsultation({
                userRef: userRef,
                user: doc.data().user,
                isConsultation: true,
                consultation: specialty.data(),
                payment_number: doc.id,
                specialty: specialty.data()
            });
        });
    }
    if (!exams.empty) {
        exams.docs.forEach((exam) => {
            intakeRef.collection('exams').doc(exam.data().name).set(exam.data());
            userRef.collection('intakes').doc(doc.id).collection('exams').doc(exam.data().name).set(exam.data());
            verifyUnpaidConsultation({
                userRef: userRef,
                user: doc.data().user,
                isConsultation: false,
                payment_number: doc.id,
                specialty: { name: exam.type },
                examObj: exam.data()
            })
        })
    }
    // Deletando o budget que ta em /users e em /budgets
    // const cpf = doc.data().user.cpf;
    // const budgetInUser = await firestore.collection('users').doc(cpf)
    //     .collection('budgets').where("pagSeguroCode", "==", code)
    //     .get()
    // budgetInUser.forEach((docBudget) => docBudget.ref.delete());
    //doc.ref.delete();
    return null

}

exports.pagSeguroCreditCallback = functions.https.onRequest(async (request, response) => {
    const firestore = admin.firestore();
    var url = "https://ws.sandbox.pagseguro.uol.com.br/v3/transactions/notifications/" + request.body.notificationCode
    return axios
        .get(url + pagSeguroCredentials)
        .then(async res =>
            xml2js.parseString(res.data, async function (err, result) {

                if (!err) {
                    const status = result.transaction.status[0];
                    const transactionCode = result.transaction.code[0];
                    if (status === "3") {
                        console.log("pago");
                        firestore.collection('budgets').where("pagSeguroCode", "==", transactionCode)
                            .get()
                            .then(async (querySnapshot) => querySnapshot.forEach(async (doc) => createIntake(doc)))
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

exports.pagSeguroBillCallback = functions.https.onRequest(async (request, response) => {
    const firestore = admin.firestore();
    var url = "https://ws.sandbox.pagseguro.uol.com.br/v3/transactions/notifications/" + request.body.notificationCode

    return axios
        .get(url + pagSeguroCredentials)
        .then(res =>
            xml2js.parseString(res.data, function (err, result) {
                if (!err) {
                    const status = result.transaction.status[0];
                    const transactionCode = result.transaction.code[0];
                    if (status === "3") {
                        firestore.collection('budgets').where("pagSeguroCode", "==", transactionCode)
                            .get()
                            .then((querySnapshot) => querySnapshot.forEach(async (doc) => createIntake(doc)))
                            .catch((e) => e);
                    }
                }
                response.send("Notificacao recebida");
            })
        )
        .catch(e => response.send(e))
});