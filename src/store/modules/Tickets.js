import firebase, { firestore } from "firebase";
import moment from "moment";
import functions from "../../utils/functions";

const state = {
    rooms: undefined,
    roomsLoaded: false,
    generalInfo: {},

    sectors: undefined
};

const mutations = {
    setRooms(state, payload) {
        state.rooms = payload;
        state.roomsLoaded = true
    },
    setGeneralInfo(state, payload) {
        state.generalInfo = payload
    },
    setSectors(state, payload) {
        state.sectors = payload;
    }
};

const getters = {
    rooms(state) {
        return state.rooms
    },
    roomsLoaded(state) {
        return state.roomsLoaded
    },
    ticketGeneralInfo(state) {
        return state.generalInfo
    },

    sectors(state) {
        return state.sectors
    }
};

var subscribeRooms = null;

function queryBuilder(clinicName, sectorName, roomName) {
    var query = firebase.firestore().collection('tickets').doc(clinicName);
    if (sectorName) query = query.collection('sectors').doc(sectorName);
    if (roomName) query = query.collection('rooms').doc(roomName);
    return query;
}

const actions = {

    // usados
    async saveTicketsHistory() {
        const firestore = firebase.firestore();
        // Buscando todas as salas (collectionGroup pega ate as rooms que estao em subcolecoes de colecoes,
        // recomendo nao criar mais collections com esse nome se nao elas vao ser pegas aqui)
        firestore.collectionGroup('rooms').get().then((rooms) => {
            rooms.forEach((room) => {
                // verificando se a sala teve fila de tickets
                // Pode tirar esse room.data().doc_clinic do if se aprovado minhas mundanças no sprint
                if (room.data().tickets.length != 0 && room.data().doc_clinic) {
                    // Pegando a historia da sala (criei o campo clicnicDoc no metadata da room pra facilitar a query de salvar
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
                        });
                }
            });

        });
    },

    async resetTickets() {
        const firestore = firebase.firestore();
        firestore.collectionGroup('tickets').get().then((docs) => {
            docs.forEach((doc) => doc.ref.update({
                ticket_number: 1
            }));
        });
    },

    async updateRoom(context, room) {
        let selectedClinic = context.getters.selectedUnit;
        await queryBuilder(selectedClinic.name, null, null).doc(room.name).update(room);
    },
    async createSectorRoom(context, payload) {
        let selectedClinic = context.getters.selectedUnit;
        payload.sector.rooms = {
            ...payload.sector.rooms,
            [payload.room.name]: {
                name: payload.room.name,
                tickets: [],
                doctor: null,
                doc_clinic: selectedClinic.name
            }
        }
        await queryBuilder(selectedClinic.name, payload.sector.name)
            .update({ rooms: payload.sector.rooms })
    },
    async listenRooms(context, payload) {
        let selectedClinic = context.getters.selectedUnit;
        if (subscribeRooms) subscribeRooms();
        subscribeRooms = queryBuilder(selectedClinic.name, payload.sectorName).collection('rooms').onSnapshot((docs) => {
            let rooms = [];
            for (let doc in docs.docs) rooms.push(docs.docs[doc].data())
            context.commit('setRooms', rooms);
        });
    },
    // Configurando os tickets pra atualizarem realTime.
    async getTicketsGeneralInfo(context) {
        let selectedClinic = context.getters.selectedUnit;
        let generalInfoDoc = await queryBuilder(selectedClinic.name, null).get()
        context.commit('setGeneralInfo', generalInfoDoc.data());

        let info = generalInfoDoc.data();
        if (!info || !info.ticket_number)
            context.dispatch('updateGeneralInfo', {
                ticket_number: 1,
                last_updated: moment().format('YYYY-MM-DD HH:mm:ss')
            });
    },

    listenTicketsSectors(context) {
        let selectedClinic = context.getters.selectedUnit;
        firebase.firestore().collection('tickets').doc(selectedClinic.name).collection('sectors')
            .onSnapshot((collection) => {
                let sectors = functions.firebaseCollectionToArray(collection)
                console.log('sectors', sectors)
                context.commit('setSectors', sectors)
            })
    },

    async createTicketsSector(context, sectorName) {
        let selectedClinic = context.getters.selectedUnit;
        let sectorInfo = {
            name: sectorName,
            created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            created_by: context.getters.user
        }
        await firebase.firestore().collection('tickets').doc(selectedClinic.name).collection('sectors').doc(sectorName).set(sectorInfo)
    },


    async deleteSector(context, sector) {
        let selectedClinic = context.getters.selectedUnit;
        await firebase.firestore().collection('tickets').doc(selectedClinic.name).collection('sectors').doc(sector.name).delete()
    },

    async updateGeneralInfo(context, info) {
        let selectedClinic = context.getters.selectedUnit;
        try {
            await queryBuilder(selectedClinic.name, null).update(info)
        } catch (e) {
            if (e.code === 'not-found') {
                await queryBuilder(selectedClinic.name, null).set(info)
            }
        }
    },
    async updateSector({getters}, sector) {
        let selectedClinic = getters.selectedUnit;
        await queryBuilder(selectedClinic.name, sector.name)
            .update(sector);
    },
    async updateSectorRoom({getters}, payload) {
        let selectedClinic = getters.selectedUnit;
        payload.sector.rooms = {
            ...payload.sector.rooms,
            [payload.room.name]: payload.room
        };
        await queryBuilder(selectedClinic.name, payload.sector.name)
            .update({
                rooms: payload.sector.rooms
            });
    },
    async deleteSectorRoom(context, payload) {
        let selectedClinic = context.getters.selectedUnit;
        delete payload.sector.rooms[payload.room.name]
        await queryBuilder(selectedClinic.name, payload.sector.name)
            .update({
                rooms: payload.sector.rooms
            });
    },

    // desusados

    async createRoom(context, room) {
        let selectedClinic = context.getters.selectedUnit;
        await queryBuilder(selectedClinic.name, null, null).doc(room.name).set(room);
    },
    async getRooms(context) {
        let selectedClinic = context.getters.selectedUnit;
        queryBuilder(selectedClinic.name, null).collection('rooms').onSnapshot((docs) => {
            let rooms = [];
            for (let doc in docs.docs) rooms.push(docs.docs[doc].data())
            context.commit('setRooms', rooms)
        })
    },


};

export default {
    state,
    mutations,
    actions,
    getters
}
