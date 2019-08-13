import * as firebase from 'firebase/app'
import 'firebase/storage'

function upload(formData) {
  const photos = formData.getAll('photos');
  // for (let photo in photos) {
  //   console.log(getImage(photos[photo]))
  //   // firebase.storage().ref('prontuarios/' + photos[photo].name).put(getImage(photos[photo]))
  // }
  const promises = photos.map((x) => getImage(x)
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
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            console.log('File available at', downloadURL);
          });
        })
      // .then(snapshot => {
      //   console.log('oi')
      //   console.log(fileRef.snapshot.ref.getDownloadURL())
      //   resolve(response)
      // })
      // .catch(error => {
      //   console.log(error)
      //   reject(error)
      // })
      // .finally(() => {
      //   console.log('fim')
      // })

      // id: img,
      // originalName: x.name,
      // fileName: x.name,
      // url: img
    }));
  return Promise.all(promises);
}

function getImage(file) {
  return new Promise((resolve, reject) => {
    const fReader = new FileReader();
    const img = document.createElement('img');

    fReader.onload = () => {
      img.src = fReader.result;
      resolve(getBase64Image(img));
    }

    fReader.readAsDataURL(file);
  })
}

function getBase64Image(img) {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const dataURL = canvas.toDataURL('image/png');

  return dataURL;
}

export {upload}
