import firebase, {storage} from "firebase";
import moment from "moment";
import Compress from "compress.js"
import image from "compress.js/src/core/image";
const compress = new Compress();

const state = {
};

const mutations = {

};

const actions = {

    async uploadFileToStorage({}, payload) {
        let storageRef = firebase.storage().ref().child(payload.path);
            //.child(moment().valueOf().toString())
        let filesUrl = [];
        let filesImage = [];
        let counter = 0;
        let now = moment().valueOf().toString();
        const files = payload.files;
        let images = await compress.compress(files, {
            size: 4,
            quality: .50,
            maxWidth: 1920, // the max width of the output image, defaults to 1920px
            maxHeight: 1920, // the max height of the output image, defaults to 1920px
            resize: true,
        });

        console.log(images);
        for (let file in images){
                filesImage.push(images[file]);

        }

        for (let file in filesImage){
            let storageFile = await storageRef.child(now + '+' + counter.toString()).put(filesImage[file]);
            let url = await storageFile.metadata.ref.getDownloadURL();
            filesUrl.push(url);
            counter = counter + 1;
        }
        console.log(filesUrl);
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
