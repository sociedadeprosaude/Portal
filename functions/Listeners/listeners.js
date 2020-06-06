import firebase from "firebase";

const functions = require('firebase-functions');
var admin = require('firebase-admin');

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

exports.ListenUpdateClinic = functions.firestore.document('clinics/{name}').onUpdate((change, context) => {
    const firestore = admin.firestore();
    const clinicUpdated = change.after.data();

    let examSnap = await firebase.firestore().collection('clinics').doc(clinicUpdated.name).collection('exams').get()
    let exams = [];
    examSnap.forEach((doc) => {
        exams.push(doc.data().name)
    });

    console.log('clinica ?:', clinicUpdated)
    console.log('exames da clinica ?:', exams)

    for (let i in exams) {
        //Updatando a clinica da subCollection clinics presente dentro da collection /exams
        firestore.collection('exams').doc(exams[i]).collection('clinics').doc(clinicUpdated.name).update(clinicUpdated);
    }
});
