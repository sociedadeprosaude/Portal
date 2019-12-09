<template>
    <v-flex class="hidden-print-only" xs12>
        <v-card class="elevation-0">
            <v-flex xs12>
                <v-card-title>
                    <v-flex xs6>
                        <v-text-field
                                label="Pesquisa"
                                v-model="search"
                                :loading="loading"
                                id="search"
                                single-line
                                :disabled="!categorySelect"
                                prepend-icon="search"
                        ></v-text-field>
                    </v-flex>
                    <v-btn outlined class="botao"
                           :color="categorySelect === 'exam' ? 'primary' : 'primary_light'" rounded
                           @click="selectCategory('exam')">Exames
                    </v-btn>
                    <v-btn outlined class="botao"
                           :color="categorySelect === 'appointment' ? 'primary' : 'primary_light'" rounded
                           @click="selectCategory('appointment')">Consultas
                    </v-btn>
                    <v-btn outlined class="botao"
                           :color="categorySelect === 'package' ? 'primary' : 'primary_light'" rounded
                           @click="selectCategory('package')">Pacotes
                    </v-btn>
                </v-card-title>
            </v-flex>
            <v-fade-transition>
                <v-flex xs12>
                    <v-layout row wrap>
                        <v-flex class="ml-2" sm12>
                            <v-card v-for="item in items" class="my-3" :key="item.id">
                                <v-card-title class="pt-2 " v-text="item.name"></v-card-title>
                                <v-card-text v-if="categorySelect === 'exam'">
                                    <v-slide-group show-arrows>
                                        <v-slide-item v-for="n in item.clinics"
                                                      :key="n.name"
                                                      v-slot:default="{ active, toggle }">
                                            <v-btn class="mx-2"
                                                   :input-value="active"
                                                   active-class="blue white--text"
                                                   depressed
                                                   rounded

                                                   @click="addProduct(item, n, 'exam')"
                                            >
                                                R${{n.price}} | {{n.clinic}}
                                            </v-btn>
                                        </v-slide-item>
                                    </v-slide-group>
                                </v-card-text>
                                <v-card-text v-if="categorySelect === 'appointment'">
                                    <v-slide-group show-arrows>
                                        <v-slide-item v-for="n in item.doctors"
                                                      :key="n.crm"
                                                      v-slot:default="{ active, toggle }">
                                            <v-btn class="mx-2"
                                                   :input-value="active"
                                                   active-class="blue white--text"
                                                   depressed
                                                   rounded

                                                   @click="addProduct(item, n, 'appointment')"

                                            >
                                                {{n.name}} | {{n.price}}
                                            </v-btn>
                                        </v-slide-item>
                                    </v-slide-group>
                                </v-card-text>
                                <v-card-text v-if="categorySelect === 'package'">
                                    <v-card class="elevation-0 py-0" v-if="item.exames">
                                        <v-card-title class="py-0 subtitle-1 font-weight-regular">Exames
                                        </v-card-title>
                                        <v-card-text>
                                            <v-slide-group show-arrows>
                                                <v-slide-item v-for="n in item.exames"
                                                              v-slot:default="{ active, toggle }">
                                                    <v-btn class="mx-2 blue white--text"
                                                           depressed
                                                           rounded
                                                    >
                                                        {{ n.name }} | R${{n.preco}}
                                                    </v-btn>
                                                </v-slide-item>
                                            </v-slide-group>
                                        </v-card-text>
                                    </v-card>
                                    <v-card class="elevation-0 mt-0 py-0" v-if="item.consultas">
                                        <v-card-title class="py-0 subtitle-1 font-weight-regular">Consultas
                                        </v-card-title>
                                        <v-card-text>
                                            <v-slide-group show-arrows>
                                                <v-slide-item v-for="n in item.consultas"
                                                              :key="n.id"
                                                              v-slot:default="{ active, toggle }">
                                                    <v-btn class="mx-2 blue white--text"
                                                           depressed
                                                           rounded
                                                    >
                                                        {{ n.name }} | R${{n.preco}}
                                                    </v-btn>
                                                </v-slide-item>
                                            </v-slide-group>
                                        </v-card-text>
                                    </v-card>
                                    <div class="py-0 subtitle-1 font-weight-bold text-right">
                                        Total R${{item.total}}
                                        <v-btn class="ml-5" outlined rounded color="primary"
                                               @click="addProduct(item, item.total, item.custo)">Selecionar
                                        </v-btn>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-fade-transition>
        </v-card>
    </v-flex>
</template>

<script>
    export default {
        name: "ProceduresSearch",
        data() {
            return {
                categorySelect: undefined,
                search: '',
                loading: undefined
            }
        },
        computed: {
            specialties() {
                let specialties = this.$store.getters.specialties;
                for (let spec in specialties) {
                    specialties[spec].doctors = specialties[spec].doctors.filter((a) => {
                        return a.cost
                    })
                }
                specialties = this.$store.getters.specialties.filter((a) => {
                    return a.doctors.length > 0 && a.name.includes(this.search.toUpperCase())
                });
                return specialties
            },
            exams() {
                return this.$store.getters.examsSelected;
            },
            items() {
                switch (this.categorySelect) {
                    case 'exam':
                        return this.exams;
                    case 'appointment':
                        return this.specialties;
                    default:
                        return []
                }
            }
        },
        methods: {
            selectCategory(category) {
                this.categorySelect = category
            },
            addProduct(product, selection, type) {
                let holder = Object.assign({}, product);
                switch (type) {
                    case 'appointment':
                        delete holder.doctors;
                        holder.doctor = selection;
                        holder.cost = selection.cost;
                        holder.price = selection.price;
                        break;
                    case 'exam':
                        delete holder.clinics;
                        holder.clinic = selection;
                        holder.cost = selection.cost;
                        holder.price = selection.price;
                        break;
                    default:
                }
                this.$store.commit('addShoppingCartItem', holder)
            }
        },
        mounted() {
            let self = this;
            self.$store.dispatch("loadSpecialties");
            window.addEventListener('keyup', function (e) {
                if (e.target.id === 'search') {
                    clearTimeout(self.typingTimer);
                    self.typingTimer = setTimeout(() => {
                        // self.loading = true;
                        if (self.categorySelect === 'exam') {
                            self.$store.dispatch("loadSelectedExams", self.search).then(() => {
                            });
                        }
                        if (self.categorySelect === 'package') {
                            console.log('pacotes aqui')
                        }//funcao de pesquisar
                    }, 1000);
                }
            });
            window.addEventListener('keydown', function (e) {
                if (e.target.id === 'search') {
                    clearTimeout(self.typingTimer)
                }
            })
        }
    }
</script>

<style scoped>

</style>
