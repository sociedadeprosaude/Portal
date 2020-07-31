const functions = require('firebase-functions');
const admin = require('firebase-admin');


//schedule('min hour dayOfTheMonth month dayOfTheWeek')
//toda meia noite no caso ('0 0 * * *').
// exports.saveTicketsHistory = functions.pubsub.schedule('0 0 * * *').onRun((context) => {
//     const firestore = admin.firestore();
//     // Buscando todas as salas (collectionGroup pega ate as rooms que estao em subcolecoes de colecoes,
//     // recomendo nao criar mais collections com esse nome se nao elas vao ser pegas aqui)
//     // eslint-disable-next-line promise/catch-or-return
//     firestore.collectionGroup('rooms').get().then((rooms) => {
//         rooms.forEach((room) => {
//             // verificando se a sala teve fila de tickets
//             if (room.data().tickets.length !== 0) {
//                 // Pegando a historia da sala (criei o campo clicnicDoc no metadata da room pra facilitar a query de salvar
//                 // eslint-disable-next-line promise/catch-or-return
//                 firestore.collection('tickets-history').doc(room.data().doc_clinic)
//                     .collection('rooms-history').doc(room.id).get()
//                     .then(async (roomHist) => {
//                         if (roomHist.exists) {
//                             const hist = roomHist.data().history;
//                             hist.push(...room.data().tickets);
//                             await roomHist.ref.update({
//                                 history: hist
//                             });
//                         } else {
//                             await roomHist.ref.set({
//                                 history: room.data().tickets
//                             })
//                         }
//                         // Esvaziando a fila de tickets depois de atualizado o history
//                         room.ref.update({
//                             tickets: []
//                         });
//                         return
//                     });
//             }
//         });
//         return
//     });
//     return null;
// });

// exports.resetTicketsCount = functions.pubsub.schedule('0 0 * * *').onRun(async (context) => {
//     try {
//         const firestore = admin.firestore();
//         let sectorsUpdatesPromises = []
//         // eslint-disable-next-line promise/catch-or-return
//         firestore.collectionGroup('tickets').get().then((docs) => {
//             docs.forEach((doc) => {
//                 doc.ref.update({
//                     ticket_number: 1
//                 })
//                 sectorsUpdatesPromises.push(updateTicketSector(doc.ref.collection('sectors')))
//             });
//             return
//         });
//         await Promise.all(sectorsUpdatesPromises)
//         return null;
//     } catch (e) {
//         console.error(e)
//     }
// });

async function updateTicketSector(sectorsCollectionRef) {
    const firestore = admin.firestore();
    let sectorsCol = await sectorsCollectionRef.get()
    for (let sectorDoc of sectorsCol.docs) {
        let sector = sectorDoc.data()
        sector.tickets = []
        let tickets = []
        for (let roomName in sector.rooms) {
            let room = sector.rooms[roomName]
            let ticketsRoomHolder = room.tickets.map((ticket) => {
                return {
                    ...ticket,
                    clinic: room.doc_clinic,
                    room_name: room.name,
                    doctor: room.doctor ? room.doctor : null
                }
            })
            tickets = tickets.concat(ticketsRoomHolder)
            sector.rooms[roomName].tickets = []
        }
        sectorDoc.ref.update(sector)
        for (let ticket of tickets) {
            firestore.collection('statistics').doc('tickets').collection('rooms').add(ticket)
        }
    }
}
