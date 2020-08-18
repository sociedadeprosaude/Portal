import firebase from "firebase";
import moment from "moment"
import gmapsInit from "../../utils/gmaps"
import functions from "../../utils/functions";

const state = {
    statistics: null,
    clientsServed:{},
    newClients:{},
    ageClientsServed:{},
    genderClientsServed:{},
    geopoints:[],
    statisticsOuttakes: null,
    statisticsOuttakesClinics: null,
  
};

const mutations = {
    /* setUsersServed: (state, payload) => state.usersServed = payload, */
    setGeopoints: (state, payload) => state.geopoints = payload,
    setStatistics: (state, payload) => state.statistics = payload,
    setStatisticsOuttakes: (state, payload) => state.statisticsOuttakes = payload,
    setStatisticsOuttakesClinics: (state, payload) => state.statisticsOuttakesClinics = payload,
    setClientsServed: (state, payload) => state.clientsServed = payload,
    setNewClients: (state, payload) => state.newClients = payload,
    setAgeClientsServed: (state, payload) => state.ageClientsServed = payload,
    setGenderClientsServed: (state, payload) => state.genderClientsServed = payload
};

const actions = {
    async getStatistics({ commit }, payload) {
        var statistics = await firebase.firestore().collection('statistics').doc('caixa').collection('days').get();
        var statsYearMonth = {}

        statistics = statistics.docs.map((doc) => {
            const statDay = doc.data();
            let [year, month, day] = statDay.date.match(/\d+/g);
            if (!statsYearMonth[year]) statsYearMonth[year] = {};
            if (!statsYearMonth[year][month]) statsYearMonth[year][month] = {
                numOfSales: 0,
                totalRaw: 0,
                totalCost: 0,
                totalProfit: 0,
                itens: {},
                arrTotalRaw: Array.from(Array(moment(statDay.date).daysInMonth()).keys()).map(() => 0)
            };
            statsYearMonth[year][month].arrTotalRaw[Number(day) - 1] = statDay.totalRaw;
            statsYearMonth[year][month].totalRaw += statDay.totalRaw;
            statsYearMonth[year][month].totalCost += statDay.totalCost;
            statsYearMonth[year][month].totalProfit += statDay.totalProfit;
            statsYearMonth[year][month].numOfSales += statDay.numOfSales;
            Object.keys(statDay.itens).forEach((obj) => {
                if (!statsYearMonth[year][month].itens[obj]) statsYearMonth[year][month].itens[obj] = {
                    numOfSales: 0,
                    totalRaw: 0,
                    totalCost: 0,
                    totalProfit: 0,
                };
                statsYearMonth[year][month].itens[obj].totalRaw += statDay.itens[obj].totalRaw;
                statsYearMonth[year][month].itens[obj].totalCost += statDay.itens[obj].totalCost;
                statsYearMonth[year][month].itens[obj].totalProfit += statDay.itens[obj].totalProfit;
                statsYearMonth[year][month].itens[obj].numOfSales += statDay.itens[obj].numOfSales;

            })
            return statDay
        })
        // console.log(statistics);
        // console.log(statsYearMonth);
        commit('setStatistics', statsYearMonth)
    },
    async getStatisticsByMonth({ commit }, payload) {
        var statistics = await firebase.firestore().collection('statistics').doc('caixa').collection('month').get();
        var statsYearMonth = {}

        statistics = statistics.docs.map((doc) => {
            const statDay = doc.data();
            let [year, month] = doc.id.match(/\d+/g);
            if (!statsYearMonth[year]) statsYearMonth[year] = {};
            statsYearMonth[year][month] = {};
            statsYearMonth[year][month].arrTotalRaw = statDay.arrTotalRaw;
            statsYearMonth[year][month].totalRaw = statDay.totalRaw;
            statsYearMonth[year][month].totalCost = statDay.totalCost;
            statsYearMonth[year][month].totalProfit = statDay.totalProfit;
            statsYearMonth[year][month].numOfSales = statDay.numOfSales;
            statsYearMonth[year][month].itens = statDay.itens;
            return statDay
        })
        // console.log(statistics);
        // console.log(statsYearMonth);
        commit('setStatistics', statsYearMonth)
    },
    //================================Outtakes======================================================


    async getStatisticsOuttakesByMonth({ commit }, payload) {
        var statistics = await firebase.firestore().collection('statistics').doc('outtakes-category').collection('month').get();
        var statsYearMonth = {}

        // var outtakes = await firebase.firestore().collection('outtakes').get();
        // outtakes = outtakes.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        statistics = statistics.docs.map((doc) => {
            const statDay = doc.data();
            let [year, month] = doc.id.match(/\d+/g);
            if (!statsYearMonth[year]) statsYearMonth[year] = {};
            statsYearMonth[year][month] = {};
            statsYearMonth[year][month].arrTotalToPay = statDay.arrTotalToPay;
            statsYearMonth[year][month].numOfOuttakesToPay = statDay.numOfOuttakesToPay;
            statsYearMonth[year][month].totalLeftToPay = statDay.totalLeftToPay;
            statsYearMonth[year][month].totalToPay = statDay.totalToPay;
            statsYearMonth[year][month].totalRecurrent = statDay.totalRecurrent;
            statsYearMonth[year][month].itens = statDay.itens;
            return statDay
        })
        // console.log(statistics);
        // console.log(statsYearMonth);
        commit('setStatisticsOuttakes', statsYearMonth)
    },

    async getStatisticsOuttakesClinicsByMonth({ commit }, payload) {
        var statistics = await firebase.firestore().collection('statistics').doc('outtakes-clinic').collection('month').get();
        var statsYearMonth = {}

        // var outtakes = await firebase.firestore().collection('outtakes').get();
        // outtakes = outtakes.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        statistics = statistics.docs.map((doc) => {
            const statDay = doc.data();
            let [year, month] = doc.id.match(/\d+/g);
            if (!statsYearMonth[year]) statsYearMonth[year] = {};
            statsYearMonth[year][month] = {};
            statsYearMonth[year][month].arrTotalToPay = statDay.arrTotalToPay;
            statsYearMonth[year][month].numOfOuttakesToPay = statDay.numOfOuttakesToPay;
            statsYearMonth[year][month].totalLeftToPay = statDay.totalLeftToPay;
            statsYearMonth[year][month].totalToPay = statDay.totalToPay;
            statsYearMonth[year][month].totalRecurrent = statDay.totalRecurrent;
            statsYearMonth[year][month].itens = statDay.itens;
            return statDay
        })
        // console.log(statistics);
        // console.log(statsYearMonth);
        commit('setStatisticsOuttakesClinics', statsYearMonth)
    },

    //============================================= Maps ====================================================================


    loadClientsServed({ commit }, payload) {
        return new Promise((resolve,reject)=>{
            let attended = {}
            let ageTotalAttended = {}
            let ageAttended = {}
            let genderTotalClients = {}
            let genderClients = {}
            console.log(payload)
            /* let usersServed = [] */
            firebase.firestore().collection('users').where('accessed_to','>=',payload.initialDate)
            .where('accessed_to','<=',payload.finalDate)
            .get().then((users)=>{
                users.forEach((user)=>{
                    let data = user.data()
                    let date = moment(data.accessed_to,'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY')
                    let age = moment().diff(moment(data.birth_date),'years')
                    if(!attended[date]) attended[date] = 0
                    attended[date] += 1

                    if(data.birth_date && age >= 0 && age < 120){
                        if(!ageTotalAttended[age]) ageTotalAttended[age] = 0
                        ageTotalAttended[age] += 1
                        ageAttended[age] = (ageTotalAttended[age]/users.size)*100
                    }

                    if(data.sex){
                        if(!genderTotalClients[data.sex]) genderTotalClients[data.sex] = 0
                        genderTotalClients[data.sex] += 1
                        genderClients[data.sex] =  (genderTotalClients[data.sex]/users.size)*100
                    }else{
                        if(!genderTotalClients['others']) genderTotalClients['others'] = 0
                        genderTotalClients['others'] += 1
                        genderClients['others'] =  (genderTotalClients['others']/users.size)*100
                    }

                    /* if(data.addresses && data.addresses[0])
                        usersServed.push(data) */
                })
                commit('setClientsServed',attended)
                commit('setAgeClientsServed',ageAttended)
                commit('setGenderClientsServed',genderClients)

                resolve()
            })
        })
    },

    loadUsersGeopoints({commit}){
        let geopoints = []
        firebase.firestore().collection('statistics').doc('geopoints').collection('users_by_neighborhood')
        .get().then((snapshot)=>{
            snapshot.forEach((geopoint)=>{
                let data = geopoint.data()
                geopoints.push({
                    latitude:data.geopoint ? data.geopoint.latitude:undefined,
                    longitude:data.geopoint? data.geopoint.longitude:undefined,
                    count: data.count,
                    monthly_report:data.monthly_report
                })
            })
            commit('setGeopoints',geopoints)
        })
    },

    loadNewClients({commit},payload){
        return new Promise((resolve,reject)=>{
            let newClients = {}
            firebase.firestore().collection('users').where('created_at', '>=', payload.initialDate)
                .where('created_at', '<=', payload.finalDate)
                .get().then((users) => {
                    users.forEach((user) => {
                        let data = user.data()
                        let date = moment(data.created_at, 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY')
                        if (!newClients[date]) newClients[date] = 0
                        newClients[date] += 1
                    })
                    commit('setNewClients', newClients)
                    resolve()
            })
        })
    },

    async setGeopointsClients({commit},payload){
        const google = await gmapsInit();
        let geocoder = new google.maps.Geocoder();
        let count = 0
        firebase.firestore().collection('users')
        .get().then((users)=>{
            users.forEach((user)=>{
                let data = user.data()
                if(count <= 2000 && data.addresses && data.addresses[0] && data.addresses[0].cep){
                    let newCEP = functions.clearCEP(data.addresses[0].cep).substring(0,5)
                    firebase.firestore().collection('statistics').doc('geopoints').collection('users_by_neighborhood').doc(newCEP)
                    .get().then(async(userGeopoint)=>{
                        if(!userGeopoint.exists){
                            count += 1
                            geocoder.geocode(
                                { address: [data.addresses[0].street,data.addresses[0].complement].join(" ") + " Manaus Amazonas" },
                                (results, status) => {
                                  if (status !== "OK" || !results[0]) {
                                   throw new Error(status);
                                   //console.log('aquele problema')
                                  }
                                  else{
                                    console.log('New Geopoint',count)
                                    firebase.firestore().collection('statistics').doc('geopoints').collection('users_by_neighborhood').doc(newCEP).set({count:1,geopoint: new firebase.firestore.GeoPoint(results[0].geometry.location.lat(), results[0].geometry.location.lng())})
                                  }
                                }
                            );

                            await functions.sleep(3000)
                        }else{
                            firebase.firestore().collection('statistics').doc('geopoints').collection('users_by_neighborhood').doc(newCEP).update({count:firebase.firestore.FieldValue.increment(1)})
                        }
                    })
                }
            })
        })
    }
};

const getters = {
    getStatistics: (state) => state.statistics,
    getClientsServed:(state) => state.clientsServed,
    getNewClients:(state) => state.newClients,
    getAgeClientsServed:(state) => state.ageClientsServed,
    getGenderClientsServed:(state) => state.genderClientsServed,
    getGeopoints:(state) => state.geopoints,
    getStatisticsOuttakes: (state) => state.statisticsOuttakes,
    getStatisticsOuttakesClinics: (state) => state.statisticsOuttakesClinics,
  
};

export default {
    state,
    mutations,
    actions,
    getters
}