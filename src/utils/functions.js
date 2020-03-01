
const regexToErase = [
    new RegExp(' da '),
    new RegExp(' do '),
    new RegExp(' de '),
    new RegExp(' a '),
    new RegExp(' o '),
    new RegExp(' e '),
]

export default {
    search: function(search, array) {
        let results = []
        let compare
        for (let el in array) {
            compare = this.compareStrings(search, array[el].name)
            if (compare.result) {
                results.push({
                    ...array[el],
                    points: compare.points
                })
            }
        }
        let searchResult = results.sort((a, b) => {
            return b.points - a.points
        })
        for (let res in searchResult) {
            delete searchResult[res].points
        }
        return searchResult
    },
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
    },
    compareStrings: function (stringA, stringB) {
        // if (stringB.length < stringA.length) {
        //     let holder = stringA
        //     stringA = stringB
        //     stringB = holder
        // }
        stringA = this.removeAccent(stringA.toLowerCase())
        stringB = this.removeAccent(stringB.toLowerCase())

        for (let reg in regexToErase) {
            stringA = stringA.replace(regexToErase[reg], ' ')
        }

        //Prepare StringA for comparison
        let stringAArray = []
        let holder
        for (let i = 0; i < stringA.length - 1; i++) {
            for (let j = i + 1; j < stringA.length; j++) {
                holder = stringA
                stringAArray.push(holder.slice(i, j + 1))
            }
        }
        let points = 0
        for (let aIndex in stringAArray) {
            if (stringB.includes(stringAArray[aIndex])) {
                points = points + stringAArray[aIndex].length
            }
        }
        let result = points > Math.ceil(stringA.length / 2)
        return {
            points: points,
            result: result
        }
    },
    removeAccent: function(str)
    {

        const accentRegex = "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝŔÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿŕ";

        const notAccetnRegex = "AAAAAAACEEEEIIIIDNOOOOOOUUUUYRsBaaaaaaaceeeeiiiionoooooouuuuybyr";
        let newString="";
        for(let i=0; i<str.length; i++) {
            let replace=false;
            for (let a=0; a<accentRegex.length; a++) {
                if (str.substr(i,1)==accentRegex.substr(a,1)) {
                    newString+=notAccetnRegex.substr(a,1);
                    replace=true;
                    break;
                }
            }
            if (replace==false) {
                newString+=str.substr(i,1);
            }
        }
        return newString;
    }
}

