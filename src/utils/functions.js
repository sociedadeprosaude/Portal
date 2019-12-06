export default {
    removeUndefineds: function (object) {
        for (let field in object) {
            if (!object[field]) {
                delete object[field]
            }
        }
    }
}
