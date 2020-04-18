import firebase, {storage} from "firebase";
import moment from "moment";

const state = {
};

const mutations = {

};

const actions = {
    async uploadFileToStorage({}, payload) {
        let storageRef = firebase.storage().ref().child(payload.path);
            // .child(moment().valueOf().toString())
        let filesUrl = [];
        let counter = 0;
        let now = moment().valueOf().toString();
        for(let file in payload.files) {
            // let upTask = await storageRef.child(now + '+' + counter.toString()).put(payload.files[file])
            // filesUrl.push(await upTask.snapshot.ref.getDownloadURL())
            let storageFile = await storageRef.child(now + '+' + counter.toString()).put(payload.files[file]);
            let url = await storageFile.metadata.ref.getDownloadURL();
            filesUrl.push(url)
        }
        return filesUrl
    },
    async deleteFile({}, payload) {
        try {
            for (let path in payload.imagePaths) {
                let imagePath = payload.imagePaths[path];
                let name = imagePath.substr(imagePath.indexOf('%2F') + 3, (imagePath.indexOf('?')) - (imagePath.indexOf('%2F') + 3)).replace('%2B', '+');
                console.log(name);
                name = name.substr(name.indexOf('%2F') + 3, name.length);
                console.log(name);
                // name = name.replace('%20', ' ');
                let storagePath = firebase.storage().ref();
                await storagePath.child(`${payload.path}/${name}`).delete();
            }
        } catch (e) {
            console.log(e)
        }
        return
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
