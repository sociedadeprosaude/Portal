<template>
    <v-container class="ma-0 pa-0">
        <v-card class="pa-4">
            <v-layout row wrap>
                <v-flex xs12 class="my-2" v-for="bill in outtakes" :key="bill.id">
                    <v-layout row wrap>
                        <span>{{bill.category}}</span>
                        <v-divider vertical class="mx-4"></v-divider>
                        <span>{{bill.payment_method}}</span>
                        <v-divider vertical class="mx-4"></v-divider>
                        <span class="font-weight-bold">{{bill.date_to_pay | dateFilter}}</span>
                        <v-divider vertical class="mx-4"></v-divider>
                        <v-icon class="warning--text" v-if="distanceToToday(bill.date_to_pay) < 3">warning
                        </v-icon>
                        <v-spacer></v-spacer>
                        <span class="font-weight-bold">R$ {{bill.value}}</span>
                        <v-flex xs12>
                            <span>{{bill.description}}</span>
                        </v-flex>
                        <v-flex xs12 sm10 class="mt-4">
                            <v-layout row wrap>
                                <v-layout column wrap>
                                    <span class="my-sub-headline mb-4">Anexos</span>
                                    <v-layout row wrap>
                                        <v-flex v-for="(append, i) in bill.appends" :key="i">
                                            <v-card @click="openAppend(append)" flat>
                                                <img :src="append" style="max-width: 124px; max-width: 124px">
                                            </v-card>                                        </v-flex>
                                    </v-layout>
                                </v-layout>
                                <v-divider vertical></v-divider>
                                <v-layout column wrap>
                                    <span class="my-sub-headline mb-4">Comprovante</span>
                                    <v-layout row wrap v-if="!loading">
                                        <v-flex v-for="(append, i) in bill.receipts" :key="i">
                                            <v-card @click="openAppend(append)" flat>
                                                <img :src="append" style="max-width: 124px; max-width: 124px">
                                            </v-card>                                        </v-flex>
                                    </v-layout>
                                    <v-flex xs12 sm2 class="text-right" v-else>
                                        <v-progress-circular indeterminate class="primary--text"></v-progress-circular>
                                    </v-flex>
                                </v-layout>
                            </v-layout>
                        </v-flex>
                        <v-flex xs12 sm2 class="text-right" v-if="!loading">
                            <v-btn @click="$refs[bill.id][0].click()" class="primary mx-2" fab small>
                                <v-icon>receipt</v-icon>
                            </v-btn>
                            <v-btn @click="deleteOuttake(bill)" class="error mx-2" fab small>
                                <v-icon>delete</v-icon>
                            </v-btn>
                            <v-btn @click="payOuttake(bill)" class="success mx-2" fab small>
                                <v-icon>attach_money</v-icon>
                            </v-btn>
                        </v-flex>
                        <v-flex xs12 sm2 class="text-right" v-else>
                            <v-progress-circular indeterminate class="primary--text"></v-progress-circular>
                        </v-flex>
                    </v-layout>
                    <input v-show="false" type="file" :id="bill.id" :ref="bill.id" multiple
                           v-on:change="handleFileUpload(bill)"/>
                </v-flex>
            </v-layout>
        </v-card>
    </v-container>
</template>

<script>
    export default {
        name: "OuttakeOrder",
        props: ['outtakes'],
        data() {
            return {
                loading: false,
                files: []
            }
        },
        methods: {
            distanceToToday(date) {
                let now = moment()
                return moment(date, 'YYYY-MM-DD').diff(now, 'days')
            },
            async payOuttake(outtake) {
                this.loading = true
                await this.$store.dispatch('updateOuttake', {
                    outtake: outtake,
                    field: 'paid',
                    value: moment().format('YYYY-MM-DD HH:mm:ss')
                })
                await this.$store.dispatch('getOuttakes')
                this.loading = false
            },
            async deleteOuttake(outtake) {
                this.loading = true
                await this.$store.dispatch('deleteOuttake', outtake)
                await this.$store.dispatch('getOuttakes')
                this.loading = false
            },
            async handleFileUpload(outtake) {
                this.loading = true
                await this.$store.dispatch('deleteFile', {imagePaths: outtake.receipts,
                path: 'outtakes/receipts'})
                let uploadedFiles = this.$refs[outtake.id][0].files;

                for (var i = 0; i < uploadedFiles.length; i++) {
                    if (this.files.indexOf(uploadedFiles[i]) < 0) {
                        this.files.push(uploadedFiles[i])
                        // this.readFileUrl(uploadedFiles[i], index - 1)
                    }
                }
                let urls = await this.submitFiles(this.files)
                await this.$store.dispatch('updateOuttake', {
                    outtake: outtake,
                    field: 'receipts',
                    value: urls
                })
                await this.$store.dispatch('getOuttakes')
                this.loading = false
            },
            // readFileUrl(file, index) {
            //     let self = this
            //     let reader = new FileReader();
            //     reader.onload = function (e) {
            //         self.filesPreviews[index] = e.target.result
            //         self.$forceUpdate()
            //     }
            //     reader.readAsDataURL(file);
            // },
            removeFile(index) {
                this.files.splice(index, 1)
                this.filesPreviews.splice(index, 1)
            },
            async submitFiles(files) {
                return await this.$store.dispatch('uploadFileToStorage', {
                    files: files,
                    path: '/outtakes/receipts',
                })
            },
            openAppend(append) {
                window.open(append)
            }
        }
    }
</script>

<style scoped>

</style>
