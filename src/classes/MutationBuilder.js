import gql from 'graphql-tag'
export default class MutationBuilder {
    constructor() {
        this.mutations = []
    }

    addMutation({mutation, variables}) {
        let mutationString = mutation.loc.source.body.replaceAll('\n', '').replace(/(.*?){/, '').slice(0, -1)
        for (let variable in variables) {
            mutationString = mutationString.replaceAll(`$${variable}`, typeof variables[variable] === 'string' ? `"${variables[variable]}"` : variables[variable])
        }
        this.mutations.push(mutationString)
        return mutationString
    }

    getMutationString () {
        let stringMutation = `mutation {`
        for (let mutation in this.mutations) {
            stringMutation += `mutation${mutation}:${this.mutations[mutation]},`
        }
        stringMutation += `}`
        return stringMutation
    }
    generateMutationRequest() {
        let stringMutation = `mutation {`
        for (let mutation in this.mutations) {
            stringMutation += `mutation${mutation}:${this.mutations[mutation]},`
        }
        stringMutation += `}`
        return gql`${stringMutation}`
    }
}
