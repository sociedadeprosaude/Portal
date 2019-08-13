<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card class="white pa-3 card">
          <v-layout row wrap>
            <v-fade-transition mode="out-in">
              <v-flex xs12>
                <v-card-title>
                  <span class="ml-3 headline">{{selectedPatient.name}}</span>
                  <v-progress-circular
                  indeterminate
                  class="ml-3 primary--text"
                  v-if="$store.getters.prontuarioLoading"></v-progress-circular>
                  <v-spacer></v-spacer>
                  <span
                    class="ml-3">{{patientAge(selectedPatient) ? 'Idade: ' + patientAge(selectedPatient) : ''}}</span>
                </v-card-title>
              </v-flex>
            </v-fade-transition>

            <v-flex xs12>
              <v-fade-transition mode="out-in">
                <v-expansion-panel>
                  <v-expansion-panel-content
                    v-model="oldProntuarioPanel"
                  >
                    <div slot="header">Prontuários anteriores</div>
                    <v-layout row wrap>
                      <v-card :class="[prontuario === selectedProntuario ? 'primary' : 'white', 'ma-2', 'card']"
                              v-for="prontuario in prontuarios"
                              :key="prontuario.id"
                              ripple
                              @click.native="selectProntuario(prontuario)"
                              style="height: 20vh; width: 15vw;">
                        <v-card-title>{{prontuario.created_at | dateFilter}}
                        </v-card-title>
                        <v-card-text class="text-xs-center">
                          <img src="@/assets/icon.png" height="52px">
                        </v-card-text>
                      </v-card>
                      <v-card
                        :class="[Object.keys(selectedProntuario).length === 0 ? 'primary' : 'white', 'ma-2', 'card']"
                        ripple
                        @click.native="newProntuario()"
                        style="height: 20vh; width: 15vw;">
                        <v-card-title class="white--text">Novo Prontuario
                        </v-card-title>
                        <v-card-text class="text-xs-center">
                          <v-icon size="52" class="white--text">add</v-icon>
                        </v-card-text>
                      </v-card>
                    </v-layout>
                  </v-expansion-panel-content>
                  <v-expansion-panel-content
                    v-model="actualProntuarioPanel"
                  >
                    <div slot="header">Prontuario</div>
                    <v-card class="ma-3 pa-3">
                      <v-layout row wrap>
                        <v-flex xs2>
                          <v-switch
                            label="Agora"
                            v-model="todaySwitch"
                          ></v-switch>
                        </v-flex>
                        <v-dialog
                          ref="dialog"
                          v-model="dateDialog"
                          :return-value.sync="date"
                          persistent
                          lazy
                          :disabled="todaySwitch"
                          full-width
                          width="290px"
                        >
                          <v-text-field
                            slot="activator"
                            :disabled="todaySwitch"
                            v-model="dateFormatted"
                            label="Data do prontuario"
                            prepend-icon="event"
                            readonly
                          ></v-text-field>
                          <v-date-picker v-model="date"
                                         scrollable
                                         locale="pt-br"
                          >
                            <v-spacer></v-spacer>
                            <v-btn flat color="primary" @click="dateDialog = false">Cancel</v-btn>
                            <v-btn flat color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
                          </v-date-picker>
                        </v-dialog>
                      </v-layout>
                      <v-card>
                        <html-textarea
                          name="input-7-1"
                          box
                          :prontuario="selectedProntuario"
                          class="pa-3"
                          v-model="history"
                          label="Histórico Atual"
                          auto-grow
                        ></html-textarea>
                      </v-card>

                      <v-layout row wrap class="mt-3">
                        <v-card v-for="(image, index) in selectedProntuario.urls"
                                :key="index"
                                class="ma-3">
                          <v-btn round
                                 @click="deleteFile(image)"
                                 class="transparent" style="position: absolute; right: 0; z-index: 2; width: 32px; min-width: 0">
                            <v-icon>delete</v-icon>
                          </v-btn>
                          <img @click="selectImage(image.url)" v-if="image.type.match(/(jpeg|jpg|gif|png)/) != null"
                               height="160px" width="90px" :src="image.url">
                          <v-card flat class="white" width="90px" height="160px" v-if="image.type.match(/(pdf)/) != null">
                            <pdf @click.native="selectPDF(image.url)" v-if="image.type.match(/(pdf)/) != null"
                                 :src="image.url"></pdf>
                          </v-card>
                        </v-card>
                      </v-layout>

                      <file-uploader v-on:files-uploaded="filesUploaded" ref="fileUploader"></file-uploader>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-slide-x-transition>
                          <v-progress-circular
                            v-if="loading"
                            indeterminate
                            class="mr-2"
                            color="purple"
                          ></v-progress-circular>
                        </v-slide-x-transition>
                        <v-btn
                          @click="addProntuario()"
                          :disabled="loading"
                          class="primary">
                          Salvar
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                    <v-alert
                      :value="success"
                      color="success"
                      icon="check_circle"
                      outline
                      dismissible
                      class="mx-3"
                    >
                      Prontuario salvo com sucesso.
                    </v-alert>
                  </v-expansion-panel-content>
                </v-expansion-panel>
<!--                <v-card v-else>-->
<!--                  <v-card-title class="headline">-->
<!--                    Escolha um paciente-->
<!--                  </v-card-title>-->
<!--                </v-card>-->
              </v-fade-transition>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog
      fullscreen
      @keydown="changePage"
      @keyleft="pdfPage--"
      v-model="pdfDialog">
      <v-card class="white">
        <v-layout row wrap>
          <v-btn round flat @click="pdfDialog = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-btn
            round flat @click="changePage({which: 37})">
            <v-icon>arrow_backward</v-icon>
          </v-btn>
          <v-btn round flat @click="changePage({which: 39})">
            <v-icon>arrow_forward</v-icon>
          </v-btn>
        </v-layout>
        <pdf
          :page="pdfPage"
          @num-pages="setNumPages"
          :src="selectedPDF"></pdf>
      </v-card>
    </v-dialog>
    <v-dialog
      fullscreen
      v-model="imageDialog"
    >
      <v-card class="white">
        <v-btn round flat @click="imageDialog = false">
          <v-icon>close</v-icon>
        </v-btn>
        <img @click="selectImage(selectedImage)"
             :src="selectedImage">
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import FileUploader from './FileUploader'
  import Vue from "vue";
  import pdf from 'vue-pdf'

  Vue.component('html-textarea', {
    template: '<div contenteditable="true" @input="updateHTML"></div>',
    props: ['value', 'prontuario'],
    mounted: function () {
      this.$el.innerHTML = this.value;
    },
    watch: {
      prontuario: function (val) {
        this.$el.innerHTML = this.value;
      }
    },
    methods: {
      updateHTML: function (e) {
        this.$emit('input', e.target.innerHTML);
      }
    }
  });

  export default {
    name: "PatientProntuario",
    components: {
      FileUploader,
      pdf
    },
    data() {
      return {
        dateDialog: false,
        date: new Date().toISOString().substring(0, 10),
        history: '' +
          '<p class="title">Anamnese:</p><br><br>' +
          '<p class="title">Exames:</p><br><br>' +
          '<p class="title">Hipóteses Diagnosticas:</p><br><br>' +
          '<p class="title">Diagnósticos Definitivos:</p><br><br>' +
          '<p class="title">Tratamentos Efetuados:</p><br><br>' +
          '',
        todaySwitch: true,
        loading: false,
        success: false,
        selectedProntuario: {},
        actualProntuarioPanel: false,
        oldProntuarioPanel: false,
        selectedPDF: '',
        selectedImage: '',
        pdfDialog: false,
        imageDialog: false,
        pdfPage: 1,
        pdfNumPages: 0
      }
    },
    props: ['user'],
    watch: {
      date: function (val) {
        if (!Object.keys(this.selectedProntuario).length > 0) {
          let holder = this.newProntuarioInfo
          holder.date = val
          this.$store.dispatch('setNewProntuarioInfo', holder)
        }
      },
      history: function (val) {
        if (Object.keys(this.selectedProntuario).length > 0) {
          this.selectedProntuario.history = val
          this.$store.dispatch('setProntuario', this.selectedProntuario)
        } else {
          let holder = this.newProntuarioInfo
          holder.history = val
          this.$store.dispatch('setNewProntuarioInfo', holder)
        }
      }
    },
    methods: {
      patientAge(patient) {
        if (patient.birth_date === null) {
          return
        }
        let today = new Date()
        let birthDate = new Date(patient.birth_date)
        return today.getFullYear() - birthDate.getFullYear()
      },
      filesUploaded(downloadUrls) {
        if (this.selectedProntuario.id !== undefined) {
          let oldUrls = []
          for (let url in this.selectedProntuario.urls) {
            oldUrls.push(this.selectedProntuario.urls[url])
          }
          for (let oldUrl in oldUrls) {
            for (let downUrl in downloadUrls.urls) {
              if (oldUrls[oldUrl] === downloadUrls.urls[downUrl]) {
                downloadUrls.urls.splice(downUrl, 1)
              }
            }
          }
          this.selectedProntuario.urls = downloadUrls.urls.concat(oldUrls)
          this.selectedProntuario.history = this.history
          this.selectedProntuario.created_at = this.date
          this.$store.dispatch('updatePatientProntuario', this.selectedProntuario)
            .finally(() => {
              this.loading = false
              this.$refs.fileUploader.reset()
              this.success = true
            })
          return
        }
        if (downloadUrls) {
          if (downloadUrls.urls.length < downloadUrls.size) return
        }
        let today
        if (this.todaySwitch) {
          today = new Date().toISOString()
        } else {
          today = new Date(this.date).toISOString()
        }
        let payload = {
          user: this.selectedPatient,
          prontuario: {
            history: this.history,
            date: today,
            urls: downloadUrls ? downloadUrls.urls : null
          }
        }
        this.$store.dispatch('addPatientProntuario', payload)
          .finally(() => {
            this.loading = false
            this.$refs.fileUploader.reset()
            this.success = true
          })
      },
      addProntuario() {
        this.loading = true
        this.$refs.fileUploader.uploadFilesToServer()
        return
      },
      selectProntuario(prontuario) {
        this.selectedProntuario = prontuario
        this.history = prontuario.history
        this.date = prontuario.created_at.substring(0, 10)
        this.actualProntuarioPanel = true
        this.todaySwitch = false
      },
      newProntuario() {
        this.selectedProntuario = {}
        this.date = this.newProntuarioInfo.date
        this.actualProntuarioPanel = true
        this.history = this.newProntuarioInfo.history
      },
      selectImage(imageUrl) {
        this.selectedImage = imageUrl
        this.imageDialog = true
      },
      selectPDF(pdfUrl) {
        this.selectedPDF = pdfUrl
        this.pdfDialog = true
      },
      changePage(event) {
        switch (event.which) {
          case 39:
            if (this.pdfPage < this.pdfNumPages) {
              this.pdfPage++
            }
            break
          case 37:
            if (this.pdfPage > 1) {
              this.pdfPage--
            }
            break
        }
      },
      setNumPages(value) {
        console.log(value)
        this.pdfNumPages = value
      },
      deleteFile(file) {
        let payload = {
          prontuario: this.selectedProntuario,
          file: file
        }
        this.$store.dispatch('deleteFile', payload)
      }
    },
    computed: {
      selectedPatient() {
        return this.$store.getters.selectedPatient
      },
      prontuarios() {
        return this.$store.getters.prontuarios[this.$store.getters.selectedPatient.id]
      },
      dateFormatted() {
        const dateArray = this.date.split('-')
        return dateArray[2] + '/' + dateArray[1] + '/' + dateArray[0]
      },
      newProntuarioInfo() {
        return this.$store.getters.newProntuarioInfo
      }
    },
  }
</script>

<style scoped>
</style>
