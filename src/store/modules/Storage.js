import firebase, {storage} from "firebase";
import moment from "moment";

const state = {
}

const mutations = {

}

const actions = {
    async uploadFileToStorage({}, payload) {
        let storageRef = firebase.storage().ref().child(payload.path)
            // .child(moment().valueOf().toString())
        let filesUrl = []
        let counter = 0
        let now = moment().valueOf().toString()
        for(let file in payload.files) {
            // let upTask = await storageRef.child(now + '+' + counter.toString()).put(payload.files[file])
            // filesUrl.push(await upTask.snapshot.ref.getDownloadURL())
            let storageFile = await storageRef.child(now + '+' + counter.toString()).put(payload.files[file])
            let url = await storageFile.metadata.ref.getDownloadURL()
            filesUrl.push(url)
        }
        return filesUrl
    },
}

const getters = {

}

export default {
    state,
    mutations,
    actions,
    getters
}
