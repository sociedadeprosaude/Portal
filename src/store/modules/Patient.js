import * as firebase from 'firebase'


const state = {
    patient: [],
    allPatient: [],
};

const mutations = {

    setPatient(state, payload) {
        state.patient = payload
    },

    setAllPatient (state, payload) {
        state.allPatient = payload;

    },
    clearPatient(state,payload){
        state.patient = []
    }

};

const actions = {

    createPatient({commit}, payload) {

        firebase.database().ref('/pacientes').push({...payload, consultas: ''}).then((snapshot)=>{
            commit('setPacienteSelecionado',{...payload, consultas: '',key:snapshot.key})
        });
    },

    createPatientDependent({commit},payload){
        firebase.database().ref('/pacientes').push({...payload, consultas: ''}).then((snapshot)=>{
            //commit('setPacienteSelecionado',{...payload, consultas: '',key:snapshot.key})
            firebase.database().ref('/pacientes').child(payload.keyResponsavel).child('dependentes').child(snapshot.key).set({...payload, consultas: ''})

        });
       
    },

    addDependent({commit}, payload) {

        let dependentesInfos = {
            nome: payload.nome,
            dataNascimento: payload.dataNascimento,

        };

        let pacienteInfos = {
            nome: payload.nomeResponsavel,
            dataNascimento: payload.dataNascimentoResponsavel,
        };

        let id = this.getters.idPatient({
            nome: pacienteInfos.nome, dataNascimento: pacienteInfos.dataNascimento});

        let dependente = this.getters.patientDependent({
            nome: dependentesInfos.nome, dataNascimento: dependentesInfos.dataNascimento});


        firebase.database().ref('/pacientes').child(id).child('dependentes').child(dependente.key).set(dependente)


    },

    updateDataPatients({commit}, payload) {

        let pacienteInfos = { nome: payload.nome, dataNascimento: payload.dataNascimento};

        let id = this.getters.idPatient({nome: pacienteInfos.nome, dataNascimento: pacienteInfos.dataNascimento});

        firebase.database().ref('/pacientes').child(id).set(payload);
    },

    async searchPatient({commit}, payload) {

        return new Promise((resolve, reject) => {

            if (!payload.search){
                return [];

            } else {
                firebase.database().ref('pacientes').orderByChild(payload.parametro)
                    .startAt(payload.search).endAt(payload.search + '\uf8ff')
                    .on('value',function (data) {
                    commit('clearPatient')
                    const paciente = [];
                    const obj = data.val();
                    for (let key in obj) {
                        paciente.push({
                            nome: obj[key].nome,
                            sexo: obj[key].sexo,
                            dataNascimento: obj[key].dataNascimento,
                            cpf: obj[key].cpf,
                            email: obj[key].email,
                            telefone: obj[key].telefone,
                            telefone1: obj[key].telefone1,
                            telefone2: obj[key].telefone2,
                            telefone3: obj[key].telefone3,
                            cep: obj[key].cep,
                            uf: obj[key].uf,
                            cidade: obj[key].cidade,
                            logradouro: obj[key].logradouro,
                            numero: obj[key].numero,
                            complemento: obj[key].complemento,
                            dependentes: obj[key].dependentes,
                            key: key,
                            id: obj[key].id,
                            consultas: obj[key].consultas,
                            grauResponsavel: obj[key].grauResponsavel,
                            nomeResponsavel: obj[key].nomeResponsavel,
                            dataNascimentoResponsavel: obj[key].dataNascimentoResponsavel,
                        })
                    }

                    commit('setPatient', paciente);

                    if (data){
                        resolve(data);
                    } else  {
                        reject(console.log('erro ao buscar paciente', data));
                    }
                });
            }
        })
    },

    loadPacientes({commit}) {
        return new Promise((resolve, reject) => {
            firebase.database().ref('/pacientes').on('value', function (data) {
                const paciente = [];
                const obj = data.val();
                for (let key in obj) {
                    paciente.push({
                        nome: obj[key].nome,
                        sexo: obj[key].sexo,
                        dataNascimento: obj[key].dataNascimento,
                        cpf: obj[key].cpf,
                        email: obj[key].email,
                        telefone: obj[key].telefone,
                        telefone1: obj[key].telefone1,
                        telefone2: obj[key].telefone2,
                        telefone3: obj[key].telefone3,
                        cep: obj[key].cep,
                        uf: obj[key].uf,
                        cidade: obj[key].cidade,
                        logradouro: obj[key].logradouro,
                        numero: obj[key].numero,
                        complemento: obj[key].complemento,
                        dependentes: obj[key].dependentes,
                        key: key,


                        id: obj[key].id,
                        consultas: obj[key].consultas,

                        grauResponsavel: obj[key].grauResponsavel,
                        nomeResponsavel: obj[key].nomeResponsavel,
                        dataNascimentoResponsavel: obj[key].dataNascimentoResponsavel,
                    })
                }

                commit('setAllPatient', paciente);

                if (data) {
                    resolve(data)
                } else {
                    reject(console.log('erro ao carregar dados dos pacientes', data))
                }

            })
        })
    },

};

const getters = {

    patient (state) {
        return state.patient
    },

    allPatient (state) {
        return state.allPatient
    },


    patientDependent: (state) => (args) =>{

        const paciente = {
            nome: '', sexo:'', dataNascimento: '',cpf: '', email: '', telefone: '', telefone1:'', telefone2: '',
            telefone3: '', cep: '', uf: '', cidade: '', logradouro: '', numero: '', complemento: '', grauResponsavel: '',
            nomeResponsavel: '',
        };

        for (let element in state.allPatient){
            if (state.allPatient[element].nome === args.nome && state.allPatient[element].dataNascimento === args.dataNascimento){
                paciente.nome = state.allPatient[element].nome;
                paciente.sexo = state.allPatient[element].sexo;
                paciente.dataNascimento = state.allPatient[element].dataNascimento;
                paciente.cpf = state.allPatient[element].cpf;
                paciente.email = state.allPatient[element].email;
                paciente.telefone = state.allPatient[element].telefone;
                paciente.telefone1 = state.allPatient[element].telefone1;
                paciente.telefone2 = state.allPatient[element].telefone2;
                paciente.telefone3 = state.allPatient[element].telefone3;
                paciente.cep = state.allPatient[element].cep;
                paciente.uf = state.allPatient[element].uf;
                paciente.cidade = state.allPatient[element].cidade;
                paciente.logradouro = state.allPatient[element].logradouro;
                paciente.numero = state.allPatient[element].numero;
                paciente.complemento = state.allPatient[element].complemento;
                paciente.nomeResponsavel = state.allPatient[element].nomeResponsavel;
                paciente.grauResponsavel = state.allPatient[element].grauResponsavel;
                paciente.key = state.allPatient[element].key;

                return paciente
            }
        }
    },

    idPatient: (state) => (args)=>{

        let id = '';

        for (let element in state.allPatient) {

            if (state.allPatient[element].nome === args.nome && state.allPatient[element].dataNascimento === args.dataNascimento){

                id = state.allPatient[element].key;
                return id;

            }
        }
    },

};

export default {
    state,
    mutations,
    actions,
    getters
}
