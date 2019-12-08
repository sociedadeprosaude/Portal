import firebase from "firebase";
import functions from "../../utils/functions";

const state = {

};

const mutations = {


};

const actions = {
    async addBudget(context, payload) {
        let originalPayload = Object.assign({}, payload)
        functions.removeUndefineds(payload)
        // console.log(payload)
        // return
        let specialties = payload.specialties ? Object.assign({}, payload.specialties) : undefined
        let exams = payload.exams ? Object.assign({}, payload.exams) : undefined
        let user = payload.user ? Object.assign({}, payload.user) : undefined
        delete payload.specialties
        delete payload.exams
        delete payload.user

        functions.removeUndefineds(specialties)
        functions.removeUndefineds(exams)


        await firebase.firestore().collection('budgets').doc(payload.id.toString()).set(payload)
        if (specialties) {
            let spec = await firebase.firestore().collection('budgets').doc(payload.id.toString()).collection('specialties').get()
            spec.forEach( (s) => {
                firebase.firestore().collection('budgets').doc(payload.id.toString()).collection('specialties').doc(s.id).delete()
            })
            await firebase.firestore().collection('budgets').doc(payload.id.toString()).collection('specialties').add(specialties)
        }
        if (exams) {
            let spec = await firebase.firestore().collection('budgets').doc(payload.id.toString()).collection('exams').get()
            spec.forEach((s) => {
                firebase.firestore().collection('budgets').doc(payload.id.toString()).collection('exams').doc(s.id).delete()
            })
            await firebase.firestore().collection('budgets').doc(payload.id.toString()).collection('exams').add(exams)

        }
        if (user) {
            await firebase.firestore().collection('budgets').doc(payload.id.toString()).collection('user').doc(user.cpf).set(user)
            context.dispatch('addBudgetToUser', originalPayload)
        }
        payload = Object.assign({}, originalPayload)
    },

    async addBudgetToUser({}, payload) {
        functions.removeUndefineds(payload)
        // console.log(payload)
        // return
        let specialties = payload.specialties ? Object.assign({}, payload.specialties) : undefined
        let exams = payload.exams ? Object.assign({}, payload.exams) : undefined
        let user = payload.user ? Object.assign({}, payload.user) : undefined
        delete payload.specialties
        delete payload.exams
        delete payload.user

        functions.removeUndefineds(specialties)
        functions.removeUndefineds(exams)

        let userRef = firebase.firestore().collection('users').doc(user.cpf)
        await userRef.collection('budgets').doc(payload.id.toString()).set(payload)
        if (specialties) {
            await userRef.collection('budgets').doc(payload.id.toString()).collection('specialties').add(specialties)
        }
        if (exams) {
            await userRef.collection('budgets').doc(payload.id.toString()).collection('exams').add(exams)
        }
    },
    async addIntake(context, payload) {
        let originalPayload = Object.assign({}, payload)
        functions.removeUndefineds(payload)
        // console.log(payload)
        // return
        let specialties = payload.specialties ? Object.assign({}, payload.specialties) : undefined
        let exams = payload.exams ? Object.assign({}, payload.exams) : undefined
        let user = payload.user ? Object.assign({}, payload.user) : undefined
        delete payload.specialties
        delete payload.exams
        delete payload.user

        functions.removeUndefineds(specialties)
        functions.removeUndefineds(exams)

        console.log(payload)
        console.log(specialties)
        console.log(exams)
        await firebase.firestore().collection('intakes').doc(payload.id.toString()).set(payload)
        if (specialties) {
            await firebase.firestore().collection('intakes').doc(payload.id.toString()).collection('specialties').add(specialties)
        }
        if (exams) {
            await firebase.firestore().collection('intakes').doc(payload.id.toString()).collection('exams').add(exams)
        }
        if (user) {
            await firebase.firestore().collection('intakes').doc(payload.id.toString()).collection('user').add(user)
            context.dispatch('addIntakeToUser', originalPayload)
        }
        payload = Object.assign({}, originalPayload)
    },
    async addIntakeToUser({}, payload) {
        functions.removeUndefineds(payload)
        // console.log(payload)
        // return
        let specialties = payload.specialties ? Object.assign({}, payload.specialties) : undefined
        let exams = payload.exams ? Object.assign({}, payload.exams) : undefined
        let user = payload.user ? Object.assign({}, payload.user) : undefined
        delete payload.specialties
        delete payload.exams
        delete payload.user

        functions.removeUndefineds(specialties)
        functions.removeUndefineds(exams)

        let userRef = firebase.firestore().collection('users').doc(user.cpf)
        await userRef.collection('intakes').doc(payload.id.toString()).set(payload)
        if (specialties) {
            await userRef.collection('intakes').doc(payload.id.toString()).collection('specialties').add(specialties)
        }
        if (exams) {
            await userRef.collection('intakes').doc(payload.id.toString()).collection('exams').add(exams)
        }
    },
 //    async addSale({commit},payload){
 //
 //        firebase.firestore().collection('intakes').doc(payload.invoice).set({
 //            package_id: payload.package_id,
 //            invoice: payload.invoice,
 //            price: payload.price,
 //            form_payment: payload.form_payment,
 //            percentageDiscount: payload.percentageDiscount,
 //            moneyDiscount: payload.moneyDiscount,
 //            date: payload.date,
 //            cost: payload.cost,
 //            /* medicoDia: this.medicoDia */
 //            user:payload.user
 //        }).then(()=>{
 //            payload.consultations.forEach((obj)=>{
 //                firebase.firestore().collection('intakes').doc(payload.invoice).collection('specialties')
 //                .doc(obj.name).set(obj)
 //            })
 //        })
 //
 //        payload.consultations.forEach((obj)=>{
 //            firebase.firestore().collection('users').doc(payload.user.cpf).collection('intakes').add({
 //                type:"specialty",
 //                price:obj.price,
 //                doctor:obj.doctor,
 //                invoice:payload.invoice,
 //                used:false,
 //                name:obj.name,
 //                cost:obj.cost
 //            })
 //        })
 //
 //
 //        /* firebase.firestore().collection('users').doc(payload.user.cpf).collection('intakes').add({
 //            package_id: payload.package_id,
 //            invoice: payload.invoice,
 //            price: payload.price,
 //            form_payment: payload.form_payment,
 //            percentageDiscount: payload.percentageDiscount,
 //            moneyDiscount: payload.moneyDiscount,
 //            date: payload.date,
 //            cost: payload.cost,
 //            /* medicoDia: this.medicoDia
 //        }).then(()=>{
 //
 //        }) */
 //        /* firebase.firestore().collection('users/' + payload.cpf + '/consultations').set(payload.consultations);
 //        firebase.firestore().collection('users/' + payload.cpf + '/exams').set(payload.exams);
 // */
 //    },

    thereIsIntakes({commit},payload){
        console.log(payload.specialty.name)
        return new Promise((resolve,reject)=>{
            firebase.firestore().collection('users').doc(payload.user.cpf).collection('intakes')/* .
                where('type', '==','specialty').where('used','==',false).where('name','==',payload.specialty.name)
                .where('doctor.cpf','==',payload.doctor.cpf) */
                .get()
                .then((snap)=>{
                    /* if(!snap.empty){
                        snap.forEach((doc)=>{
                            resolve({id: doc.id,...doc.data()})
                        })
                    }else{
                        reject('Invoice not found!')
                    } */

                    snap.forEach((intake)=>{
                        let data = intake.data()
                        payment_number = intake.id

                    })

                }).catch(()=>{
                    reject('Error!')
                })
        })

    }

};

const getters = {


};

export default {
    state,
    mutations,
    actions,
    getters
}
