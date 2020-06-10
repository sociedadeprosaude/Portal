const functions = require('firebase-functions');
var admin = require('firebase-admin');
admin.initializeApp();


exports.cronjob = require('./Cronjob/Cronjob')
exports.listeners = require('./Listeners/listeners')
exports.requests = require('./Requests/requests')


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
