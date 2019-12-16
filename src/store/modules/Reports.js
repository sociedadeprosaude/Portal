import axios from 'axios'
import * as firebase from 'firebase';

const instance = axios.create({
  baseURL: 'http://caixa.instituicaoprosaude.com:82'
})

instance.defaults.headers.common['Accept'] = 'application/json'

const state = {
  infos: [],
  relatorio:[]

}

const mutations = {
  setRelatorio(state,payload){
    state.relatorio= payload;
  }
}

const actions = {
  resetInfo({commit}) {
    commit('resetInfo')
    return
  },
  async getInfos({commit}, payload) {
      instance.get('/api/profits', {
        params: {
          from: payload.start_date.format('YYYY-MM-DD'),
          to: payload.start_date.add(30, 'days').format('YYYY-MM-DD')
        }
      })
        .then(response => {
          commit('addInfo', {
            ...response.data,
            data: payload.start_date
          })
          // payload.start_date.add(30, 'days')
          if (payload.final_date.diff(payload.start_date, 'days') > 1) {
            this.dispatch('getInfos', {
              start_date: payload.start_date,
              final_date: payload.final_date
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
  },
  async searchReports(context, payload){
    payload.dataFinal = payload.dataFinal + ' 24:00:00';
    payload.dataInicio= payload.dataInicio + ' 00:00:00';
    console.log('data inicial: ',payload.dataInicio);
    console.log('data final: ',payload.dataFinal);
    let intakesSnap = await firebase.firestore().collection('intakes').where('date', '>=', payload.dataInicio)
        .where('date', '<=', payload.dataFinal).orderBy('date').get()
    let promises = []
    for (let doc in intakesSnap.docs) {
       promises.push(context.dispatch('getIntakeDetails', intakesSnap.docs[doc]))
    }
    let intakes = await Promise.all(promises)
    console.log('intakes', intakes);
    let exams = {}
    let specialties = {}
    for (let intake in intakes) {
      for (let exam in intakes[intake].exams) {
        if (!exams[intakes[intake].exams[exam].name]) {
          exams[intakes[intake].exams[exam].name] = {
            quantidade: 0,
            name: intakes[intake].exams[exam].name,
            cost: parseFloat(intakes[intake].exams[exam].cost),
            price: parseFloat(intakes[intake].exams[exam].price)
          }
        }
        exams[intakes[intake].exams[exam].name].quantidade++,
            exams[intakes[intake].exams[exam].name].cost += parseFloat(intakes[intake].exams[exam].cost),
            exams[intakes[intake].exams[exam].name].price += parseFloat(intakes[intake].exams[exam].price)


      }
    }
    console.log('exams ', exams);

    for (let intake in intakes) {
      for (let specialtie in intakes[intake].specialties) {
        if (!specialties[intakes[intake].specialties[specialtie].name]) {
          specialties[intakes[intake].specialties[specialtie].name] = {
            quantidade: 0
          }
        }
        specialties[intakes[intake].specialties[specialtie].name].quantidade++
      }
    }
    console.log('especialties', specialties);
    return new Promise( (resolve, reject) => {
          firebase.firestore().collection('intakes').where('date', '>=', payload.dataInicio)
              .where('date', '<=', payload.dataFinal).orderBy('date').get().then( function (doc) {
            console.log(doc);
            let specialties= [];
            let exams=[];
            let totalCaixa=0;
            let totalDebido=0;
            let totalBruto=0;
            let totalCusto=0;
            let totalCredito=0;
            let totalSaidas=0;
            let verificador=0;
            let saidas=[];
            let relatorio=[];
            let taxaCredito=0;
            let medicoDia=[];
            let taxaDebito=0;
            let cost= 0;
            let i=0, j=0, k=0;
            doc.forEach( (doc) => {

              //EXAMES
              console.log('exams');
              firebase.firestore().collection('intakes').doc(doc.data().id.toString()).collection('exams').get().then( function (dooc) {
                console.log('doooc',dooc.docs.length); //quantidade de documentos;]
                let tamanho = exams.length;
                j=0;
                dooc.forEach( (dooc) => {
                  console.log('entrando na quantidade de exames');
                  console.log('tamanho doooc: ', dooc);
                  for(i=0; i<exams.length; i++){
                    if(dooc.data().name === exams[i].name){
                      console.log('adicionando em exame existente')
                      exams[i].amount= parseFloat(exams[i].amount) + 1;
                      exams[i].price= parseFloat(exams[i].price) + dooc.data().price;
                      exams[i].cost= parseFloat(exams[i].cost) + dooc.data.cost;
                      verificador=1;
                      totalBruto+= parseFloat(doc.data().exams[j].price);
                      totalCusto+= parseFloat(doc.data().exams[j].cost);
                    }
                  }
                  if(verificador === 0 && exams.length !== 0){
                    console.log('adicionando exame que nao ta na lista')
                    exams.push({
                      name: dooc.data().name,
                      amount: 1,
                      price: dooc.data().price,
                      cost: dooc.data().cost
                    })
                    totalBruto+= parseFloat(doc.data().exams[j].price);
                    totalCusto+= parseFloat(doc.data().exams[j].cost);
                  }
                  verificador=0;
                  if(exams.length === 0){
                    console.log('adicionando o primeiro exame')
                    exams.push({
                      name: dooc.data().name,
                      amount: 1,
                      price: dooc.data().price,
                      cost: dooc.data().cost
                    })
                    totalBruto+= parseFloat(doc.data().exams[j].price);
                    totalCusto+= parseFloat(doc.data().exams[j].cost);
                  }
                  j++;
                })
              })
              console.log('exams', exams);

              /* for(j=0; j<doc.data().exams.length; j++){
                    for(i=0; i<exams.length; i++){
                    if(doc.data().exams[j].name === exams[i].name){
                      exams[i].quantidade = parseFloat(exams[i].quantidade) + 1;
                      exams[i].valor = parseFloat(exams[i].valor) + parseFloat(doc.data().exams[j].price);
                      exams[i].cost= parseFloat(exams[i].cost) + parseFloat(doc.data().exams[j].cost);
                      totalBruto+= parseFloat(doc.data().exams[j].price);
                      totalCusto += parseFloat(doc.data().exams[j].cost);
                      verificador=1;
                      i= exams.length;
                    }
                  }
                  if(verificador===0 && exams.length !== 0){
                    exams.push({
                      name: doc.data().exams[j].name,
                      quantidade:1,
                      valor: doc.data().exams[j].price,
                      cost: doc.data().exams[j].cost
                    });
                    totalBruto+= parseFloat(doc.data().exams[j].price);
                    totalCusto+= parseFloat(doc.data().exams[j].cost)
                  }
                  if(exams.length === 0){
                    exams.push({
                      name: doc.data().exams[j].name,
                      quantidade:1,
                      valor: doc.data().exams[j].price,
                      cost: doc.data().exams[j].cost
                    });
                    totalBruto+= parseFloat(doc.data().exams[j].price);
                    totalCusto+= parseFloat(doc.data().exams[j].cost);
                  }
                } */

              console.log('specialties: '); //CONSULTAS

              for(j=0; j<doc.data().specialties.length; j++){
                for(i=0; i<specialties.length; i++){
                  if(doc.data().specialties[j].name === specialties[i].name){
                    specialties[i].quantidade = parseFloat(specialties[i].quantidade) + 1;
                    specialties[i].valor = parseFloat(specialties[i].valor) + parseFloat(doc.data().specialties[j].price);
                    specialties[i].cost = parseFloat(specialties[i].valor) + parseFloat(doc.data().specialties[j].cost);
                    totalBruto += parseFloat(doc.data().specialties[j].price);
                    totalCusto += parseFloat(doc.data().specialties[j].cost);
                    verificador = 1;
                    i = specialties.length;
                  }
                }
                if(verificador===0 && specialties.length !== 0){
                  specialties.push({
                    name: doc.data().specialties[j].name,
                    quantidade:1,
                    valor: doc.data().specialties[j].price,
                    cost: doc.data().specialties[j].cost
                  });
                  totalBruto+= parseFloat(doc.data().specialties[j].price);
                  totalCusto+= parseFloat(doc.data().specialties[j].cost);
                }
                if(specialties.length === 0){
                  specialties.push({
                    name: doc.data().specialties[j].name,
                    quantidade:1,
                    valor: doc.data().specialties[j].price,
                    cost: doc.data().specialties[j].cost
                  });
                  totalBruto+= parseFloat(doc.data().specialties[j].price);
                  totalCusto+= parseFloat(doc.data().specialties[j].cost);
                }
              }

              if(doc.data().pagamento === 'dinheiro'){
                totalCaixa += parseFloat(doc.data().price)
              }
              if(doc.data().pagamento === 'credito'){
                totalCredito += parseFloat(doc.data().price);
                taxaCredito += parseFloat(doc.data().taxa)
              }
              if(doc.data().pagamento === 'debito'){
                totalDebido += parseFloat(doc.data().price);
                taxaDebito += parseFloat(doc.data().taxa)
              }
              console.log('cost: ', doc.data().cost);
              if( doc.data().cost !== undefined){
                cost += parseFloat(doc.data().cost)
              }
              console.log('cost salvo', cost)

            });
            console.log('specialties ok');


            firebase.firestore().collection('/caixa/saida/pagamentos').where('codigo', '>=', payload.dataInicio)
                .where('codigo', '<=', payload.dataFinal).orderBy('codigo').get().then(function (dooc) {
              dooc.forEach( (dooc)=>{
                totalCaixa = totalCaixa - parseFloat(dooc.data().valor);
                saidas.push({ categoria: dooc.data().categoria, valor: dooc.data().valor, data: dooc.data().codigo});
                totalSaidas += parseFloat(dooc.data().valor)
              });
              relatorio.push({
                saidas:saidas,
                specialties: specialties,
                exams: exams,
                credito: totalCredito,
                debito: totalDebido,
                dinheiro: totalCaixa,
                cost: cost,
                totalBruto:  totalBruto,
                totalCusto: totalCusto,
                totalSaidas: totalSaidas,
                taxaDebito: taxaDebito,
                taxaCredito: taxaCredito
              });
              console.log('saidas: ', saidas);
              console.log('specialties: ', specialties);
              console.log('exams: ', exams);
              console.log('Credito: ', totalCredito);
              console.log('Debito: ', totalDebido);
              console.log('Dinheiro: ', totalCaixa);
              console.log('=========================================');
              console.log('relatorio: ', relatorio);
              resolve();
              commit('setRelatorio',relatorio);
            });

          })
        }
    )}
}

const getters = {
  relatorio(state){
    return state.relatorio;
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
