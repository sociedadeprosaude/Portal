<template>
  <v-container fluid>
    <v-layout row wrap>
      <form enctype="multipart/form-data" novalidate v-if="isInitial || isSaving">
        <div class="dropbox">
          <input type="file" multiple :name="uploadFieldName" :disabled="isSaving"
                 @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
                 accept="*/*"
                 class="input-file">
          <p v-if="isInitial">
            Arraste os arquivos para esta area<br> ou clique para buscar
          </p>
          <p v-if="isSaving">
            Uploading {{ fileCount }} files...
          </p>
        </div>
      </form>
    </v-layout>
    <v-layout>
      <div v-if="isSuccess">
        <h2>Carregado {{ uploadedFiles.length }} arquivo(s) com sucesso.</h2>
        <p>
          <a href="javascript:void(0)" @click="reset()">Carregar novamemnte</a>
        </p>
        <ul class="list-unstyled">
          <li v-for="item in uploadedFiles">
            <img :src="item.url" height="100px" class="img-responsive img-thumbnail" :alt="item.originalName">
          </li>
        </ul>
      </div>
      <!--FAILED-->
      <div v-if="isFailed">
        <h2>Carregamento falhou</h2>
        <p>
          <a href="javascript:void(0)" @click="reset()">Tente Novamente</a>
        </p>
        <pre>{{ uploadError }}</pre>
      </div>
    </v-layout>
  </v-container>
</template>

<script>
  const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3;
  import {upload} from './upload.service';
  import * as firebase from 'firebase/app'
  import 'firebase/storage'

  export default {
    name: "FileUploader",
    data() {
      return {
        uploadFieldName: 'photos',
        uploadedFiles: [],
        uploadError: null,
        currentStatus: null,
        formData: null,
        downloadUrls: []
      }
    },
    computed: {
      isInitial() {
        return this.currentStatus === STATUS_INITIAL;
      },
      isSaving() {
        return this.currentStatus === STATUS_SAVING;
      },
      isSuccess() {
        return this.currentStatus === STATUS_SUCCESS;
      },
      isFailed() {
        return this.currentStatus === STATUS_FAILED;
      }
    },
    methods: {
      reset() {
        // reset form to initial state
        this.currentStatus = STATUS_INITIAL;
        this.uploadedFiles = [];
        this.uploadError = null;
        this.formData = null
      },
      save(formData) {
        // upload data to the server
        this.currentStatus = STATUS_SAVING;
        // setTimeout(function () {
        //
        // }, 2000)

        this.uploadFilesToWeb(formData)
        // upload(formData)
        //   .then(x => {
        //     this.uploadedFiles = [].concat(x);
        //     this.currentStatus = STATUS_SUCCESS;
        //   })
        //   .catch(err => {
        //     this.uploadError = err.response;
        //     this.currentStatus = STATUS_FAILED;
        //   });
      },
      filesChange(fieldName, fileList) {
        // handle file changes
        const formData = new FormData();

        if (!fileList.length) return;

        // append the files to FormData
        Array
          .from(Array(fileList.length).keys())
          .map(x => {
            formData.append(fieldName, fileList[x], fileList[x].name);
          });

        // save it
        this.save(formData);
      },
      uploadFilesToWeb(formData) {
        this.formData = formData
        const photos = formData.getAll('photos');
        // for (let photo in photos) {
        //   console.log(getImage(photos[photo]))
        //   // firebase.storage().ref('prontuarios/' + photos[photo].name).put(getImage(photos[photo]))
        // }
        var self = this
        self.uploadedFiles = []
        const promises = photos.map((x) => this.getImage(x)
          .then(img => {

            self.uploadedFiles = self.uploadedFiles.concat({
              id: img,
              originalName: x.name,
              fileName: x.name,
              url: img
            })
            self.currentStatus = STATUS_SUCCESS;
          }));
        return Promise.all(promises);
      },
      async uploadFilesToServer(formData) {
        if (!formData) formData = this.formData
        if (!formData) {
          this.$emit('files-uploaded')
          return
        }
        const photos = formData.getAll('photos');

        var self = this
        const promises = photos.map((x) => this.getImage(x)
          .then(img => {
            var uploadTask = firebase.storage().ref('prontuarios/' + x.name).put(x)

            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
              function (snapshot) {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                  case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused')
                    break
                  case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running')
                    break
                }
              }, function (error) {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                  case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break

                  case 'storage/canceled':
                    // User canceled the upload
                    break
                  case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    break
                }
              }, function () {
                self.currentStatus = STATUS_SUCCESS;
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                  console.log('File available at', downloadURL);
                  self.downloadUrls.push({
                    url: downloadURL,
                    type: x.type.split('/')[1]
                  })
                  self.$emit('files-uploaded', {
                    size: photos.length,
                    urls: self.downloadUrls
                  })
                });
              })
          }));
        return Promise.all(promises);
      },
      getImage(file) {
        return new Promise((resolve, reject) => {
          const fReader = new FileReader();
          const img = document.createElement('img');

          fReader.onload = () => {
            img.src = fReader.result;
            resolve(this.getBase64Image(img));
          }

          fReader.readAsDataURL(file);
        })
      },
      getBase64Image(img) {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const dataURL = canvas.toDataURL('image/png');

        return dataURL;
      },
    },
    mounted() {
      this.reset();
    }
  }
</script>

<style scoped lang="scss">
  .dropbox {
    outline: 2px dashed grey; /* the dash box */
    outline-offset: -10px;
    background: lightcyan;
    color: dimgray;
    padding: 10px 10px;
    min-height: 200px; /* minimum height */
    position: relative;
    cursor: pointer;
    width: 65vw;
  }

  .input-file {
    opacity: 0; /* invisible but it's there! */
    width: 100%;
    height: 200px;
    position: absolute;
    cursor: pointer;
  }

  .dropbox:hover {
    background: lightblue; /* when mouse over to the drop zone, change color */
  }

  .dropbox p {
    font-size: 1.2em;
    text-align: center;
    padding: 50px 0;
  }
</style>
