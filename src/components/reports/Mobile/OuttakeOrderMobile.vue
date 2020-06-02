<template>
    <v-container class="ma-0 pa-0">
        <v-row class="align-center justify-center">
            <v-col cols="12" xs="12" class="primary">
                <v-card class="primary elevation-0 white--text mt-n5">
                    <v-card-title class="font-weight-bold align-lg-center justify-center">
                        R$ {{ totalPayable }}
                    </v-card-title>
                    <v-card-subtitle style="font-size: x-small" class="white--text">Débito Restante</v-card-subtitle>
                    <v-chip-group active-class="primary--text" class="mt-n5 mb-n3 mx-0 my-0">
                            <v-chip v-for="(day,i) in dates" :key="i" class="white" x-small @click="mappingDates(day)">
                                <span style="font-weight: bold;"> {{ day | dateFilter }} </span>
                            </v-chip>
                    </v-chip-group>
                </v-card>
            </v-col>
        </v-row>

        <v-row class="align-center justify-center"
               v-for="(outtakesGroup, i) in outtakesByDate(outtakes)"
               :key="i"
        >
            <v-col cols="11" xs="11" class="mx-3">
                <div v-bind:id="'group-' + i">
                    <span style="color: #003B8F; font-weight: bold; font-size: small"> {{i | dateFilter}} - {{daydate(i)}} - {{outtakesGroup.length}} conta(s)</span>
                    <v-flex xs12 class="primary" style="height: 2px;"></v-flex>
                </div>
            </v-col>
            <v-col cols="12" xs="12">
                <v-card class="pa-2 my-3 elevation-0" v-for="(bill) in outtakesGroup" :key="bill.id">
                    <v-layout row wrap>
                        <v-flex xs4>
                            <v-img :src="bill.unit.logo" width="175px"></v-img>
                        </v-flex>
                        <v-flex xs1><span style="color: transparent">.</span></v-flex>
                        <v-flex xs7>
                            <v-text-field v-model="bill.value"
                                          dense
                                          rounded
                                          outlined
                                          persistent-hint
                                          :readonly="!isEditing"
                                          prepend-inner-icon="monetization_on"
                                          class="font-weight-bold"
                                          :hint="!isEditing ? 'Clique no icon para editar' : 'Clique no icon para salvar'"
                            >
                                <template v-slot:append-outer>
                                    <v-slide-x-reverse-transition
                                            mode="out-in"
                                    >
                                        <v-icon  :key="`icon-${isEditing}`"
                                                 :color="isEditing ? 'success' : 'info'"
                                                 @click="isEditing = !isEditing, editBillValue(bill)"
                                                 v-text="isEditing ? 'mdi-check-outline' : 'mdi-circle-edit-outline'">
                                        </v-icon>
                                    </v-slide-x-reverse-transition>
                                </template>
                            </v-text-field>
                        </v-flex>
                        <v-flex xs5 class="text-start">
                            <span style="font-weight: bold; font-size: small">{{bill.category}}</span>
                            <br>
                            <span style="font-weight: bold; font-size: small">{{bill.subCategory}}</span>
                        </v-flex>
                        <v-flex xs7 class="text-right" v-if="loading && outtakeSelect === bill">
                            <v-progress-circular indeterminate class="primary--text"/>
                        </v-flex>
                        <v-flex xs7 class="text-right" v-else>
                            <v-btn @click="$refs[bill.id][0].click()" class="primary mx-2" fab x-small>
                                <v-icon>receipt</v-icon>
                            </v-btn>
                            <v-btn v-show="user === 'admin' || user === 'caixa'" @click="deleteOuttake(bill)" class="error mx-2" fab x-small>
                                <v-icon>delete</v-icon>
                            </v-btn>
                            <v-btn v-show="user === 'admin' || user === 'caixa'" @click="payOuttake(bill)" class="success mx-2" fab x-small placeholder="Complemento">
                                <v-icon>attach_money</v-icon>
                            </v-btn>
                        </v-flex>
                        <v-flex xs12><v-divider color="grey"></v-divider></v-flex>
                        <v-flex xs12 class="text-centert">
                            <span>Colaborador: </span><span style="font-weight: bold; font-size: small">{{bill.colaborator.name}}</span>
                        </v-flex>
                        <v-flex xs12><v-divider color="grey"></v-divider></v-flex>
                        <v-flex xs12 class="my-2">
                            <v-layout row wrap>
                                <v-flex xs12 md2 class="text-center">
                                    <span>Metodo de Pagamento: </span><span style="font-weight: bold; font-size: small">{{bill.payment_method}}</span>
                                </v-flex>
                                <v-flex xs12 md2 class="text-center">
                                    <span>Data para Pagamento: </span><span style="font-weight: bold; font-size: small">{{bill.date_to_pay | dateFilter}}</span>
                                    <v-icon class="warning--text align-start ml-2"
                                            v-if="distanceToToday(bill.date_to_pay) < 3 && !(distanceToToday(bill.date_to_pay) <= 0)"
                                    >warning</v-icon>
                                    <v-icon class="error--text align-start ml-2"
                                            v-if="today > bill.date_to_pay"
                                    >error</v-icon>
                                </v-flex>
                                <v-flex xs12>
                                    <span style="font-weight: bold; font-size: small; font-style: italic">{{bill.description}}</span>
                                </v-flex>

                                <v-flex xs12><v-divider color="grey"></v-divider></v-flex>

                                <v-flex xs12 class="mt-4">
                                    <v-layout row wrap>
                                        <v-layout column wrap>
                                            <span class="my-sub-headline mb-4">Anexos</span>
                                            <v-layout row wrap>
                                                <v-flex v-for="(append, i) in bill.appends" :key="i">
                                                    <v-card @click="openAppend(append)" flat>
                                                        <v-avatar>
                                                            <img :src="append" style="max-width: 124px; max-width: 124px" />
                                                        </v-avatar>
                                                    </v-card>
                                                </v-flex>
                                            </v-layout>
                                        </v-layout>

                                        <v-divider vertical/>

                                        <v-layout column wrap>
                                            <span class="my-sub-headline mb-4">Comprovante</span>
                                            <v-flex xs12 sm2 class="text-right" v-if="loadingAnexo && outtakeSelect === bill">
                                                <v-progress-circular indeterminate class="primary--text"/>
                                            </v-flex>
                                            <v-layout row wrap v-else>
                                                <v-flex v-for="(append, i) in bill.receipts" :key="i">
                                                    <v-card @click="openAppend(append)" flat>
                                                        <v-avatar>
                                                            <img :src="append" style="max-width: 124px; max-width: 124px" />
                                                        </v-avatar>
                                                    </v-card>
                                                </v-flex>
                                            </v-layout>
                                        </v-layout>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                            <input
                                    v-show="false"
                                    type="file"
                                    :id="bill.id"
                                    :ref="bill.id"
                                    multiple
                                    v-on:change="handleFileUpload(bill)"
                            />
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-col>

        </v-row>
    </v-container>
</template>

<script>
    import moment from "moment";
    export default {
        props: ["outtakes"],
        data() {
            return {
                isEditing: false,
                loading: false,
                loadingAnexo: false,
                outtakeSelect: [],
                today: moment().format("YYYY-MM-DD"),
                date: moment().format("YYYY-MM-DD"),
                files: [],
                options: {
                    duration: 500,
                    offset: 15,
                    easing: "easeInQuint"
                },
                semanaOptions: [
                    "Domingo",
                    "Segunda-feira",
                    "Terça-feira",
                    "Quarta-feira",
                    "Quinta-feira",
                    "Sexta-feira",
                    "Sábado"
                ]
            };
        },
        computed: {
            user() {
                return this.$store.getters.user.group;
            },
            dates () {
                let holder = this.outtakesByDate(this.outtakes)
                let dates = []
                for(let item in holder){
                    dates.push(holder[item][0].date_to_pay)
                }
                return dates
            },
            totalPayable(){
                let holder = this.outtakesByDate(this.outtakes)
                let total = 0.00
                for(let item in holder){
                    total = total + holder[item][0].value
                }
                //total = Math.round(total)
                total = total.toFixed(2)
                return total
            }
        },
        watch: {
            date(val) {
                this.$vuetify.goTo("#group-" + val, this.options);
            }
        },
        methods: {
            mappingDates(val){
                this.date = val;
            },
            allowedDates(val) {
                return (
                    Object.keys(this.outtakesByDate(this.outtakes)).indexOf(val) !== -1
                );
            },
            daydate(date) {

                var dateMoment = moment(date);
                return this.semanaOptions[dateMoment.day()];
            },
            outtakesByDate(outtakes) {
                let res = {};
                for (let outtake in outtakes) {
                    let targetDate = outtakes[outtake].date_to_pay.split(" ")[0];
                    if (!res[targetDate]) {
                        res[targetDate] = [];
                    }
                    res[targetDate].push(outtakes[outtake]);
                }
                return res;
            },
            async editBillValue (bill) {
                if (!this.isEditing) {
                    await this.$store.dispatch("editOuttakes", bill);
                    await this.$store.dispatch("getOuttakes");
                    this.loading = false;
                }

            },
            distanceToToday(date) {
                let now = moment();
                return moment(date, "YYYY-MM-DD").diff(now, "days");
            },
            async payOuttake(outtake) {
                this.loading = true;
                this.outtakeSelect= outtake;
                await this.$store.dispatch("updateOuttake", {
                    outtake: outtake,
                    field: "paid",
                    value: moment().format("YYYY-MM-DD HH:mm:ss")
                });

                if (outtake.recurrent === 'true') {
                    let bill = {
                        category: outtake.category,
                        subCategory: outtake.subCategoria,
                        payment_method: outtake.payment_method,
                        description: outtake.description,
                        value: outtake.value,
                        date_to_pay: moment(outtake.date_to_pay).add(1, 'months').format('YYYY-MM-DD'),
                        created_at: outtake.created_at,
                        colaborator: outtake.colaborator,
                        unit:outtake.unit,
                        recurrent: 'true',
                    };

                    await this.$store.dispatch("addOuttakes", bill);
                }
                this.outtakeSelect= [];
                await this.$store.dispatch("getOuttakes");
                await this.$store.dispatch("getOuttakesPending", {
                    finalDate: moment()
                        .add(5, "days")
                        .format("YYYY-MM-DD 23:59:59")
                });
                await this.$store.dispatch("getOuttakesPaidToday");
                this.loading = false;
            },
            async deleteOuttake(outtake) {
                this.loading = true;
                await this.$store.dispatch("deleteOuttake", outtake);
                await this.$store.dispatch("getOuttakes");
                await this.$store.dispatch("getOuttakesPending", {
                    finalDate: moment()
                        .add(5, "days")
                        .format("YYYY-MM-DD 23:59:59")
                });
                await this.$store.dispatch("getOuttakesPaidToday");
                this.loading = false;
            },
            async handleFileUpload(outtake) {

                this.loadingAnexo = true;
                this.outtakeSelect= outtake;
                await this.$store.dispatch("deleteFile", {
                    imagePaths: outtake.receipts,
                    path: "outtakes/receipts"
                });
                let uploadedFiles = this.$refs[outtake.id][0].files;


                for (let i = 0; i < uploadedFiles.length; i++) {

                    if (this.files.indexOf(uploadedFiles[i]) < 0) {
                        this.files.push(uploadedFiles[i]);
                    }
                }

                let urls = await this.submitFiles(this.files);
                await this.$store.dispatch("updateOuttake", {
                    outtake: outtake,
                    field: "receipts",
                    value: urls
                });

                await this.$store.dispatch("getOuttakes");
                await this.$store.dispatch("getOuttakesPending", {
                    finalDate: moment()
                        .add(5, "days")
                        .format("YYYY-MM-DD 23:59:59")
                });
                this.files = [];
                this.loadingAnexo = false;
                this.outtakeSelect= [];

            },
            removeFile(index) {
                this.files.splice(index, 1);
                this.filesPreviews.splice(index, 1);
            },
            async submitFiles(files) {
                return await this.$store.dispatch("uploadFileToStorage", {
                    files: files,
                    path: "/outtakes/receipts"
                });
            },
            openAppend(append) {
                window.open(append);
            }
        }
    };
</script>

<style scoped>
</style>
