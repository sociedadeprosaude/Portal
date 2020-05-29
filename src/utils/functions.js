
import moment from 'moment'
const regexToErase = [
    new RegExp(' da '),
    new RegExp(' do '),
    new RegExp(' de '),
    new RegExp(' a '),
    new RegExp(' o '),
    new RegExp(' e '),
]

export default {
    search: function (search, array) {
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
    removeAccent: function (str) {

        const accentRegex = "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝŔÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿŕ";

        const notAccetnRegex = "AAAAAAACEEEEIIIIDNOOOOOOUUUUYRsBaaaaaaaceeeeiiiionoooooouuuuybyr";
        let newString = "";
        for (let i = 0; i < str.length; i++) {
            let replace = false;
            for (let a = 0; a < accentRegex.length; a++) {
                if (str.substr(i, 1) == accentRegex.substr(a, 1)) {
                    newString += notAccetnRegex.substr(a, 1);
                    replace = true;
                    break;
                }
            }
            if (replace == false) {
                newString += str.substr(i, 1);
            }
        }
        return newString;
    },

    datesOfInterval(payload) {
        let dates = []
        payload.forEach((obj)=>{
            let startDate = moment(obj.start_date, 'YYYY-MM-DD');
            let finalDate = moment(obj.final_date, 'YYYY-MM-DD');
            let daysDiff = finalDate.diff(startDate, 'days');
            let day = moment(startDate, 'YYYY-MM-DD')
            for (let i = 0; i <= daysDiff; i++) {
                /* if (payload.weekDays.indexOf(day.weekday()) > -1) {
                    dates.push(day)
                } */
                day = moment(startDate, 'YYYY-MM-DD').add(i, 'days');
                if((obj.week_days && obj.week_days.indexOf(day.weekday()) != -1) || !obj.week_days){
                    if(obj.hour)
                        dates.push(day.format('YYYY-MM-DD') + ' ' + obj.hour)
                    else
                        dates.push(day.format('YYYY-MM-DD'))
                }

            }
        });

        return dates.filter((value, index, self) => self.indexOf(value) === index);
    },

    groupDateByWeek(payload) {
        let dates = this.datesOfInterval(payload);
        let weeks = {};
        for (const key in dates) {
            let week = dates[key].year().toString() + dates[key].week().toString()
            // check if the week number exists
            if (!weeks[week]) {
                weeks[week] = [];
            }

            weeks[week].push(dates[key].format('YYYY-MM-DD'));
        }

        return weeks
    },

    makeWeekSchedule(weekDays,vacancy,hour){
        let obj = {}
        weekDays.forEach(element => {
            obj[element] = {
                vacancy:Number(vacancy),
                hour:hour
            }
        });

        return obj
    },

    firebaseCollectionToArray(collection) {
        return collection.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data()
            }
        })
    }
}

