import firebase from "firebase";

const state = {

};

const mutations = {


};

const actions = {
    async AddSale({commit},payload){
        
        firebase.firestore().collection('intakes').doc(payload.invoice).set({
            package_id: payload.package_id,
            invoice: payload.invoice,
            price: payload.price,
            form_payment: payload.form_payment,
            percentageDiscount: payload.percentageDiscount,
            moneyDiscount: payload.moneyDiscount,
            date: payload.date,
            cost: payload.cost,
            /* medicoDia: this.medicoDia */
            user:payload.user
        }).then(()=>{
            payload.consultations.forEach((obj)=>{
                firebase.firestore().collection('intakes').doc(payload.invoice).collection('specialties')
                .doc(obj.name).set(obj)
            })
        })

        payload.consultations.forEach((obj)=>{
            firebase.firestore().collection('users').doc(payload.user.cpf).collection('intakes').add({
                type:"specialty",
                price:obj.price,
                doctor:obj.doctor,
                invoice:payload.invoice,
                used:false,
                name:obj.name,
                cost:obj.cost
            })
        })

        
        /* firebase.firestore().collection('users').doc(payload.user.cpf).collection('intakes').add({
            package_id: payload.package_id,
            invoice: payload.invoice,
            price: payload.price,
            form_payment: payload.form_payment,
            percentageDiscount: payload.percentageDiscount,
            moneyDiscount: payload.moneyDiscount,
            date: payload.date,
            cost: payload.cost,
            /* medicoDia: this.medicoDia
        }).then(()=>{
            
        }) */
        /* firebase.firestore().collection('users/' + payload.cpf + '/consultations').set(payload.consultations);
        firebase.firestore().collection('users/' + payload.cpf + '/exams').set(payload.exams);
 */
    },

    thereIsIntakes({commit},payload){
        console.log(payload.specialty.name)
        return new Promise((resolve,reject)=>{
            firebase.firestore().collection('users').doc(payload.user.cpf).collection('intakes').
                where('type', '==','specialty').where('used','==',false).where('name','==',payload.specialty.name)
                .where('doctor.cpf','==',payload.doctor.cpf)
                .get()
                .then((snap)=>{
                    if(!snap.empty){
                        snap.forEach((doc)=>{
                            resolve({id: doc.id,...doc.data()})
                        })
                    }else{
                        reject('Invoice not found!')
                    }
                    
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
