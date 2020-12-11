<template>
    <v-container class="ma-0 pa-0 align-start justify-center" fluid>
        <ApolloQuery :query="require('@/graphql/transaction/LoadBillsToPay.gql')"
                     :variables="{ date_start: formattedDate(dateStart), date_end: formattedDate(dateEnd)}"
        >
            <template v-slot="{result: {data}}">
                <v-row class="align-center justify-center">
                    <v-col cols="12" xs="12" class="primary mt-n5">
                        <v-card class="elevation-0 white--text mt-md-2 primary" style="border-radius: 0">
                            <v-card-title class="font-weight-bold align-lg-center justify-center" v-if="data">
                                {{data.Charge[0].balance | moneyFilter}}
                            </v-card-title>
                            <v-card-subtitle style="font-size: small" class="white--text font-italic" v-if="data">
                                Saldo
                            </v-card-subtitle>

                            <v-layout row wrap class="justify-center pt-5">
                                <v-flex xs3>
                                    <v-text-field rounded solo filled dense color="background"
                                                  placeholder="Data inicial"
                                                  v-model="dateStart" v-mask="mask.date" append-outer-icon="event"/>

                                </v-flex>
                                <v-flex xs3 class="ml-2">
                                    <v-text-field rounded solo filled dense color="background" class="mr-4"
                                                  v-model="dateEnd" v-mask="mask.date" placeholder="Data final"/>
                                </v-flex>
                            </v-layout>

                        </v-card>
                    </v-col>
                </v-row>
                <v-layout row wrap class="justify-center fill-height mt-4" v-if="!data">
                    <v-progress-circular indeterminate color="primary" large :size="200"/>
                </v-layout>
                <v-container fluid class="ma-0 " v-if="data">

                    <v-card v-if="data.Charge.length === 0" elevation="10" class="pa-4">Não há contas a serem pagas
                        neste mês
                    </v-card>
                    <v-row class="align-start justify-center" xs="8" v-else
                           v-for="(outtakesGroup, i) in outtakesByDate(data.Charge)"
                           :key="i"
                    >
                        <v-col cols="12" xs="12" class="mx-3">
                            <div v-bind:id="'group-' +  i">
                                <span style="color: #003B8F; font-weight: bold; font-size: small">{{data.Charge.length}} conta(s)</span>
                                <v-flex xs12 class="primary" style="height: 2px;"/>
                            </div>
                        </v-col>
                        <v-col md="8" xs="12">
                            <v-card class="pa-2 pb-0 my-0 elevation-0 mb-5" v-for="(bill) in BreakArray(outtakesGroup)"
                                    :key="bill.id">
                                <v-layout row wrap>

                                    <v-flex xs4 v-if="bill.with_unit.length !== 0">
                                        <v-img :src="bill.with_unit[0].logo" width="175px"/>
                                    </v-flex>
                                    <v-flex xs4 v-else/>

                                    <v-flex xs8 class="text-end">
                                        <span style="font-weight: bold; font-size: small"
                                              v-if="bill.categories.length !== 0">{{bill.categories[0].name}}</span>
                                        <span style="font-weight: bold; font-size: small" v-else>Sem categoria</span>
                                        <v-icon class="warning--text  "
                                                v-if="distanceToToday(bill.date_to_pay.formatted) < 3 && !(distanceToToday(bill.date_to_pay.formatted) <= 0)"
                                        >warning
                                        </v-icon>
                                        <v-icon class="error--text "
                                                v-if="today > bill.date_to_pay"
                                        >error
                                        </v-icon>
                                    </v-flex>

                                    <v-flex xs4 v-show="!isEditing" class="mt-4 text-start">
                                        <strong style="font-size: large">R$ {{-bill.value}}</strong>
                                    </v-flex>
                                    <v-flex xs8 class="text-end mt-3">
                                        <v-flex class="text-right" v-if="loading && outtakeSelect === bill">
                                            <v-progress-circular indeterminate class="primary--text"/>
                                        </v-flex>
                                        <v-flex v-else>
                                            <v-btn @click="$refs[bill.id][0].click()" class="primary mx-1" fab x-small>
                                                <v-icon>receipt</v-icon>
                                            </v-btn>
                                            <v-btn @click="isEditing = true, editBillValue(bill)" class="primary mx-1"
                                                   fab x-small>
                                                <v-icon>edit</v-icon>
                                            </v-btn>
                                            <v-btn v-show="user === 'admin' || user === 'caixa'"
                                                   @click="deleteOuttake(bill)"
                                                   class="error mx-1" fab x-small>
                                                <v-icon>delete</v-icon>
                                            </v-btn>
                                            <v-btn v-show="user === 'admin' || user === 'caixa'"
                                                   @click="payOuttake(bill)"
                                                   class="success mx-1" fab x-small placeholder="Complemento">
                                                <v-icon>attach_money</v-icon>
                                            </v-btn>
                                        </v-flex>
                                    </v-flex>
                                    <v-flex xs12 class="mt-2">
                                        <v-text-field v-show="isEditing" v-model="-bill.value"
                                                      dense
                                                      outlined
                                                      persistent-hint
                                                      :readonly="!isEditing"
                                                      prefix="R$"
                                                      class="font-weight-bold"
                                                      :hint="!isEditing ? 'Clique no icon para editar' : 'Clique no icon para salvar'"
                                        >
                                            <template v-slot:append-outer>
                                                <v-slide-x-reverse-transition
                                                        mode="out-in"
                                                >
                                                    <v-icon :key="`icon-${isEditing}`"
                                                            :color="isEditing ? 'success' : 'primary'"
                                                            @click="isEditing = !isEditing, editBillValue(bill)"
                                                            v-text="isEditing ? 'mdi-check-outline' : 'mdi-circle-edit-outline'">
                                                    </v-icon>
                                                </v-slide-x-reverse-transition>
                                            </template>
                                        </v-text-field>
                                    </v-flex>

                                    <v-flex xs12 class="mt-2">
                                        <v-divider color="grey"/>
                                    </v-flex>
                                    <v-flex xs12 class="text-start">
                                        <span style="font-size: small">Colaborador: </span>
                                        <span style="font-weight: bold; font-size: small" v-if="bill.colaborator">
                                        {{bill.colaborator.name}}</span>
                                        <span v-else style="font-weight: bold; font-size: small">Não informado</span>
                                    </v-flex>
                                    <v-flex xs12 class="mt-3">
                                        <v-layout row wrap>
                                            <v-flex xs12 class="text-start">
                                                <span style="font-size: small">Método de pagamento: </span>
                                                <span style="font-weight: bold; font-size: small" v-if="bill.payment_methods">
                                                    {{bill.payment_methods[0]}}
                                                </span>
                                                <span style="font-weight: bold; font-size: small" v-else>Não informado</span>
                                            </v-flex>
                                            <v-flex xs12 class="text-start">
                                                <span style="font-size: small">Data para pagamento: </span><span
                                                    style="font-weight: bold; font-size: small">{{bill.date_to_pay.formatted | dateFilter}}</span>
                                            </v-flex>
                                            <v-flex xs12 class="mt-2">
                                                <span style="font-weight: bold; font-size: small; font-style: italic">{{bill.description}}</span>
                                            </v-flex>

                                            <v-flex xs12 class="mt-1">
                                                <v-divider color="grey"/>
                                            </v-flex>

                                            <v-flex xs12 class="mt-0">
                                                <v-layout row wrap>
                                                    <v-flex xs6>
                                                        <v-layout column wrap class="mt-4">
                                                <span class="mb-4 font-weight-bold"
                                                      style="font-size: medium">Anexos</span>
                                                            <v-layout row wrap>
                                                                <v-flex v-for="(append, i) in bill.appends" :key="i">
                                                                    <v-card @click="openAppend(append)" flat>
                                                                        <v-avatar>
                                                                            <img :src="append"
                                                                                 style="max-width: 124px; max-width: 124px"/>
                                                                        </v-avatar>
                                                                    </v-card>
                                                                </v-flex>
                                                            </v-layout>
                                                        </v-layout>

                                                    </v-flex>
                                                    <v-divider vertical/>
                                                    <v-flex xs5>
                                                        <v-layout column wrap class="mt-4 justify-center text-center">
                                                            <span class="mb-4 font-weight-bold"
                                                                  style="font-size: medium">Comprovante</span>
                                                            <v-flex xs12 sm2 class="text-right"
                                                                    v-if="loadingAnexo && outtakeSelect === bill">
                                                                <v-progress-circular indeterminate
                                                                                     class="primary--text"/>
                                                            </v-flex>
                                                            <v-layout row wrap v-else>
                                                                <v-flex v-for="(append, i) in bill.receipts" :key="i">
                                                                    <v-card @click="openAppend(append)" flat>
                                                                        <v-avatar>
                                                                            <img :src="append"
                                                                                 style="max-width: 124px; max-width: 124px"/>
                                                                        </v-avatar>
                                                                    </v-card>
                                                                </v-flex>
                                                            </v-layout>
                                                        </v-layout>
                                                    </v-flex>
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
        </ApolloQuery>


    </v-container>
</template>

<script>
    import moment from "moment";
    import {mask} from 'vue-the-mask'

    export default {
        directives: {
            mask,
        },
        data() {
            return {
                mask: {
                    date: '##/##/####',
                },
                dateStart: moment().subtract(1, 'month').format('DD/MM/YYYY'),
                dateEnd: moment().format('DD/MM/YYYY'),
                monthSelected: 'Outubro',
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
                ],
                monsthsName: [
                    "Janeiro",
                    "Fevereiro",
                    "Março",
                    "Abril",
                    "Maio",
                    "Junho",
                    "Julho",
                    "Agosto",
                    "Setembro",
                    "Outubro",
                    "Novembro",
                    "Dezembro"
                ],
                lastYear: '',
                lastMonth: '',
                month: null,
            };
        },
        computed: {
            years() {
                let years = [];
                let year = moment().format('YYYY');
                for (let i = parseInt(this.lastYear); i <= parseInt(year); i++) {

                    years.push(i.toString())
                }
                return years
            },
            monthsNew() {
                let months = [];
                let month = moment().format('MM');

                if (this.lastYear === moment().format('YYYY')) {
                    for (let i = parseInt(this.lastMonth); i <= parseInt(month); i++) {

                        months.push(i.toString())
                    }
                } else {
                    for (let i = parseInt(this.lastMonth); i <= 12; i++) {

                        months.push(i.toString())
                    }
                }
                return months
            },
            pendingOuttakes() {
                return this.$store.getters.outtakesPending.sort((a, b) => {
                    return b.date_to_pay < a.date_to_pay ? 1 : -1;
                });
            },
            user() {
                return this.$store.getters.user.group;
            },
            dates() {
                let holder = this.outtakesByDate(this.pendingOuttakes);
                let dates = [];
                for (let item in holder) {
                    dates.push(holder[item][0].date_to_pay)
                }
                return dates
            },
            totalPayable() {

                let total = 0.00;
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
            BreakArray(items){
              console.log('items: ', items.splice(0,50))
            return items.splice(0,50)
            },
            Total(data) {
                console.log('data', data)
            },
            formattedDate (date) {
                return moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD')
            },

            daydate(date) {

                let dateMoment = moment(date);
                return this.semanaOptions[dateMoment.day()];
            },
            outtakesByDate(outtakes) {
                let res = {};
              console.log('outtakes; ', outtakes)
              for (let outtake in outtakes) {
                    let targetDate = outtakes[outtake].date_to_pay;
                    if (!res[targetDate]) {
                        res[targetDate] = [];
                    }
                    res[targetDate].push(outtakes[outtake]);
                }
                return res;
            },
            async editBillValue(bill) {
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
                this.outtakeSelect = outtake;
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
                        unit: outtake.unit,
                        recurrent: 'true',
                    };

                    await this.$store.dispatch("addOuttakes", bill);
                }
                this.outtakeSelect = [];
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
                this.outtakeSelect = outtake;
                // await this.$store.dispatch("deleteFile", {
                //     imagePaths: outtake.receipts,
                //     path: "outtakes/receipts"
                // });
                // let uploadedFiles = this.$refs[outtake.id][0].files;
                //
                //
                // for (let i = 0; i < uploadedFiles.length; i++) {
                //
                //     if (this.files.indexOf(uploadedFiles[i]) < 0) {
                //         this.files.push(uploadedFiles[i]);
                //     }
                // }
                //
                // let urls = await this.submitFiles(this.files);
                // await this.$store.dispatch("updateOuttake", {
                //     outtake: outtake,
                //     field: "receipts",
                //     value: urls
                // });
                //
                // await this.$store.dispatch("getOuttakes");
                // await this.$store.dispatch("getOuttakesPending", {
                //     finalDate: moment()
                //         .add(5, "days")
                //         .format("YYYY-MM-DD 23:59:59")
                // });
                // this.files = [];
                // this.loadingAnexo = false;
                // this.outtakeSelect = [];

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
