const functions = require('firebase-functions');
var admin = require('firebase-admin');
admin.initializeApp();

const cors = require('cors')({ origin: true });
var papa = require('papaparse');
var moment = require('moment');
var axios = require("axios");
var xml2js = require('xml2js');
const { parse } = require('json2csv');
const defaultRoute = '/analise-exames'
const heavyFunctionsRuntimeOpts = {
    timeoutSeconds: 540,
    memory: '2GB'
}

exports.cronjob = require('./Cronjob/Cronjob')
exports.listeners = require('./Listeners/listeners')
exports.requests = require('./Requests/requests')
exports.schedules = require('./Schedules/schedules')

async function getDocSubcollections(doc) {
    // eslint-disable-next-line no-await-in-loop
    let colections = await doc.ref.listCollections()
    let subCollections = []
    colections.forEach((col) => {
        subCollections.push(col.id)
    })
    return subCollections
}
