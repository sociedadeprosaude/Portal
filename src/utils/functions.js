export default {
    removeUndefineds: function (object) {
        for (let field in object) {
            if (object[field] === undefined) {
                delete object[field]
            }
            // if (object[field].isArray) {
            // }
            if (typeof object[field] === 'object') {
                this.removeUndefineds(object[field])
            }
        }
        return object
    }
}
