const functions = require('firebase-functions');
var admin = require('firebase-admin');
const cors = require('cors')({origin: true});

var papa = require('papaparse');
var moment = require('moment');
const { parse } = require('json2csv');
admin.initializeApp();
const defaultRoute = '/analise-exames'

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
    if(!user.association_number) {
        let associatedOpRef = db.collection('operational').doc('associated')
        let numAss = (await  associatedOpRef.get()).data().quantity
        userRef.update({
            association_number: numAss
        })
        associatedOpRef.update({
            quantity: admin.firestore.FieldValue.increment(1)
        })
    }
})

exports.exams_report = functions.https.onRequest((req, res) => {
    var db = admin.database();
    let startDate
    let finalDate
    if (req.query.start_date) {
        startDate = moment(req.query.start_date).format('YYYY/MM/DD HH:mm:SS')
    } else {
        startDate = ''
    }
    if (req.query.final_date) {
        finalDate = moment(req.query.final_date).format('YYYY/MM/DD HH:mm:SS')
    } else {
        finalDate = moment().format('YYYY/MM/DD HH:mm:SS')
    }
    db.ref(defaultRoute)
        .child('/budgets')
        .orderByChild('date')
        .startAt(startDate)
        .endAt(finalDate)
        .once('value')
        .then(budgetSnap => {
            let budgets = budgetSnap.val()
            // res.status(200).send(budgets);
            // return budgets
            let response = {}
            for (let budget in budgets) {
                if (!response[budgets[budget].doctor]) response[budgets[budget].doctor] = {}
                if (!response[budgets[budget].doctor]['No de exames']) response[budgets[budget].doctor]['No de exames'] = 0
                if (!response[budgets[budget].doctor]['No de pedidos']) response[budgets[budget].doctor]['No de pedidos'] = 0

                response[budgets[budget].doctor]['Médico'] = budgets[budget].doctor
                response[budgets[budget].doctor]['No de exames'] = response[budgets[budget].doctor]['No de exames'] + budgets[budget].exams.length
                response[budgets[budget].doctor]['No de pedidos'] = response[budgets[budget].doctor]['No de pedidos'] + 1
                // response[budgets[budget].doctor]['Medico'] = response[budgets[budget].doctor] + budgets[budget].exams.length
            }
            let arrayResp = []
            for(let obj in response) {
                arrayResp.push(response[obj])
            }
            const fields = ['Médico', 'No de pedidos', 'No de exames'];
            const opts = { fields };
            arrayResp.sort((a, b) => {
                return a['No de exames'] <= b['No de exames'] ? 1 : -1
            })

            // let csv = papa.unparse({
            //     fields: fields,
            //     data: arrayResp
            // })
            let csv = parse(arrayResp, opts);

            res.setHeader(
                "Content-disposition",
                "attachment; filename=exames_total.csv"
            );
            res.set("Content-Type", "text/csv");
            res.status(200).send(csv);
            return response;
        })
        .catch(error => {
            console.log(error);
            return res.status(400).send(error.toString());
        });
});
