export default class MutationBuilder {
    constructor() {
        this.mutations = []
    }

    addMutation(mutation) {
        this.mutations.push(mutation)
    }

    generateMutationRequest() {
        let stringMutation = `mutation {`
        for (let mutation in this.mutations) {
            stringMutation += `mutation${mutation}:${this.mutations[mutation]},`
        }
        stringMutation += `}`
        return stringMutation
    }
}
