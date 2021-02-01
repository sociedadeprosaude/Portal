<template>
    <v-card v-if="data.Charge.length === 0" elevation="10" class="pa-4">Não há contas a serem pagas
        neste mês
    </v-card>
    <v-container fluid v-else-if="data.Charge">
        <v-row class="align-start justify-center" xs="8"
               v-for="(outtakesGroup, i) in outtakesByDate(data.Charge)"
               :key="i"
        >
            <v-col cols="12" xs="12" class="mx-3">
                <div v-bind:id="'group-' +  i">
                <span
                        style="color: #003B8F; font-weight: bold; font-size: small">{{ data.Charge.length }} conta(s)</span>
                    <v-flex xs12 class="primary" style="height: 2px;"/>
                </div>
            </v-col>
            <v-col md="8" xs="12">
                <v-card class="pa-2 pb-0 my-0 elevation-0 mb-5" v-for="(bill) in outtakesGroup"
                        :key="bill.id">
                    <v-layout row wrap>

                        <v-flex xs4 v-if="bill.with_unit.length !== 0">
                            <v-img :src="bill.with_unit[0].logo" width="175px"/>
                        </v-flex>
                        <v-flex xs4 v-else/>

                        <v-flex xs8 class="text-end">
                                        <span style="font-weight: bold; font-size: small"
                                              v-if="bill.categories.length !== 0">{{ bill.categories[0].name }}</span>
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
                            <strong style="font-size: large">R$ {{ -bill.value }}</strong>
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
                                <v-btn
                                       @click="deleteOuttake(bill)" v-show="user === 'admin' || user === 'caixa'"
                                       class="error mx-1" fab x-small>
                                    <v-icon>delete</v-icon>
                                </v-btn>
                                <v-btn
                                       @click="payTransaction(bill)" v-show="user === 'admin' || user === 'caixa'"
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
                                        {{ bill.colaborator.name }}</span>
                            <span v-else style="font-weight: bold; font-size: small">Não informado</span>
                        </v-flex>
                        <v-flex xs12 class="mt-3">
                            <v-layout row wrap>
                                <v-flex xs12 class="text-start">
                                    <span style="font-size: small">Método de pagamento: </span>
                                    <span style="font-weight: bold; font-size: small" v-if="bill.payment_methods">
                                                    {{ bill.payment_methods[0] }}
                                                </span>
                                    <span style="font-weight: bold; font-size: small" v-else>Não informado</span>
                                </v-flex>
                                <v-flex xs12 class="text-start">
                                    <span style="font-size: small">Data para pagamento: </span><span
                                        style="font-weight: bold; font-size: small">{{ bill.date_to_pay.formatted | dateFilter }}</span>
                                </v-flex>
                                <v-flex xs12 class="mt-2">
                                <span v-if="bill.description"
                                style="font-weight: bold; font-size: small; font-style: italic">{{ bill.description }}</span>
                                    <span v-else
                                          style="font-weight: bold; font-size: small; font-style: italic">Sem descrição</span>
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
<script>
    let moment = require('moment');
    import {uuid} from "vue-uuid";
    import MutationBuilder from "@/classes/MutationBuilder";

    export default {
        name: `BillsOuttakeOrder`,
        props: ['data'],

        data: () => ({
            today: moment().format("YYYY-MM-DD"),
            loading: false,
            loadingAnexo: false,
            outtakeSelect: [],
            isEditing: false,
        }),

        computed: {
            user() {
                return this.$store.getters.user.group;
            },
        },

        methods: {

            outtakesByDate(outtakes) {
                let res = {};
                for (let outtake in outtakes) {
                    let targetDate = outtakes[outtake].date_to_pay;
                    if (!res[targetDate]) {
                        res[targetDate] = [];
                    }
                    res[targetDate].push(outtakes[outtake]);
                }
                return res;
            },

            distanceToToday(date) {
                let now = moment();
                return moment(date, "YYYY-MM-DD").diff(now, "days");
            },

            async editBillValue(bill) {
                if (!this.isEditing) {
                    await this.$store.dispatch("editOuttakes", bill);
                    await this.$store.dispatch("getOuttakes");
                    this.loading = false;
                }

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

            async payTransaction(charge) {
                this.loading = true
                let transactionId = uuid.v4()
                let mutationBuilder = new MutationBuilder()
                mutationBuilder.addMutation({
                    mutation: require('@/graphql/transaction/CreateTransactionPayment.gql'),
                    variables: {
                        date: {formatted: `${moment().format("YYYY-MM-DDTHH:mm:ss")}`},
                        id: transactionId,
                        value: charge.value,
                        type: 'Bill',
                        description: charge.description,
                        payment_methods: charge.payment_methods,
                        payments: [charge.value],
                        parcels: [`${1}`],
                        discount: 0.0
                    }
                })
                for (let category of charge.categories) {
                    mutationBuilder.addMutation({
                        mutation: require('@/graphql/transaction/MergeTransactionCategories.gql'),
                        variables: {
                            transactionId,
                            categoryId: category.id
                        }
                    })
                }
                for (let unit of charge.with_unit) {
                    mutationBuilder.addMutation({
                        mutation: require('@/graphql/transaction/MergeTransactionWithUnit.gql'),
                        variables: {
                            transactionId,
                            unitId: unit.id
                        }
                    })
                }

                mutationBuilder.addMutation({
                    mutation: require('@/graphql/transaction/MergeTransactionColaborator.gql'),
                    variables: {
                        transactionId,
                        colaboratorId: charge.colaborator.id,
                    }
                })
                mutationBuilder.addMutation({
                    mutation: require('@/graphql/charge/DeleteCharge.gql'),
                    variables: {
                        id: charge.id,
                    }
                })
                await this.$apollo.mutate({
                    mutation: mutationBuilder.generateMutationRequest(),
                })
               this.$emit('reload', true)
                this.loading = false
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
    }
</script>