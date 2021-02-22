<template>
    <v-container class="ma-0 pa-0">
        <v-flex xs12 class=" justify-start text-left">
            <v-tooltip right color="white">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" icon fab small color="background" dark
                           @click="$router.push('/agenda/TabelaSemanal')">
                        <v-icon>fad fa-calendar</v-icon>
                    </v-btn>
                </template>
                <span style="color: #003B8F; font-weight: bold">Tabela Semanal</span>
            </v-tooltip>
        </v-flex>
        <v-flex xs12 class=" justify-start text-left">
            <v-tooltip right color="white">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" icon fab small @click="showFilter = !showFilter" color="background"
                           dark>
                        <v-icon v-if="showFilter">close</v-icon>
                        <v-icon v-else>filter_alt</v-icon>
                    </v-btn>
                </template>
                <span style="color: #003B8F; font-weight: bold">Filtros</span>
            </v-tooltip>
        </v-flex>
        <v-layout column v-if="showFilter">
            <v-flex xs12 class="mt-2 pa-0 ">
                <v-checkbox
                        class="pl-3 py-0 my-0"
                        v-model="examTypeCheck"
                        color="white"
                >
                    <template v-slot:label>
                        <div class="white--text">Listar agendas de exames</div>
                    </template>
                </v-checkbox>
            </v-flex>
            <v-flex xs12 class="ma-0 pa-0">
                <template v-if="!examTypeCheck">
                    <ApolloQuery
                            :query="require('@/graphql/products/LoadProducts.gql')"
                            :variables="{ type:'SPECIALTY', schedulable:false}"
                    >
                        <template v-slot="{ result: { data, loading } }">
                            <v-combobox
                                    class="pa-0 ma-0"
                                    :items="data ? data.Product : []"
                                    return-object
                                    v-model="specialty"
                                    item-text="name"
                                    chips
                                    placeholder="Especialidades"
                                    dense solo
                                    :loading="loading"
                                    color="blue"
                                    clearable>
                                <template v-slot:selection="data">
                                    <v-chip
                                            :key="JSON.stringify(data.item)"
                                            :input-value="data.selected"
                                            :disabled="data.disabled"
                                            class="v-chip--select-multi"
                                            @click.stop="data.parent.selectedIndex = data.index"
                                            @input="data.parent.selectItem(data.item)"
                                            text-color="white"
                                            color="primary"
                                    >{{ data.item.name }}
                                    </v-chip>
                                </template>
                            </v-combobox>
                        </template>
                    </ApolloQuery>
                </template>

                <template v-else>
                    <ApolloQuery
                            :query="require('@/graphql/products/LoadProducts.gql')"
                            :variables="{ type:'EXAM', schedulable:true}"
                    >
                        <template v-slot="{ result: { data,loading } }">
                            <v-progress-circular v-if="loading" indeterminate/>
                            <v-select
                                    v-else
                                    class="pa-0 ma-0"
                                    :items="data ? data.Product : []"
                                    v-model="examType"
                                    item-text="name"
                                    return-object
                                    placeholder="Exames agendáveis"
                                    dense solo
                                    color="blue"
                                    clearable>
                                <template v-slot:selection="data">
                                    <v-chip
                                            :key="JSON.stringify(data.item)"
                                            :input-value="data.selected"
                                            :disabled="data.disabled"
                                            class="v-chip--select-multi"
                                            @click.stop="data.parent.selectedIndex = data.index"
                                            @input="data.parent.selectItem(data.item)"
                                            text-color="white"
                                            color="primary"
                                    >{{ data.item.name }}
                                    </v-chip>
                                </template>
                            </v-select>
                        </template>
                    </ApolloQuery>
                </template>
            </v-flex>
            <v-flex xs12 class="mt-n4 pa-0">
                <v-combobox class="pa-0 pa"
                            v-model="doctor"
                            :items="doctors"
                            return-object
                            item-text="name"
                            label="Médico"
                            outlined
                            dense
                            chips
                            solo
                            color="blue"
                            clearable
                >
                    <template v-slot:selection="data">
                        <v-chip
                                :key="JSON.stringify(data.item)"
                                :input-value="data.selected"
                                :disabled="data.disabled"
                                class="v-chip--select-multi"
                                @click.stop="data.parent.selectedIndex = data.index"
                                @input="data.parent.selectItem(data.item)"
                                text-color="white"
                                color="primary"
                        >{{ data.item.name }}
                        </v-chip>
                    </template>
                </v-combobox>
            </v-flex>
            <v-flex xs12 class="mt-n4 pa-0">
                <v-select
                        v-model="clinic"
                        :items="clinics"
                        item-text="name"
                        return-object
                        label="Clínica"
                        solo dense
                        clearable
                >
                    <template v-slot:selection="data">
                        <v-chip
                                :key="JSON.stringify(data.item)"
                                :input-value="data.selected"
                                :disabled="data.disabled"
                                class="v-chip--select-multi"
                                @click.stop="data.parent.selectedIndex = data.index"
                                @input="data.parent.selectItem(data.item)"
                                text-color="white"
                                color="primary"
                        >{{ data.item.name }}
                        </v-chip>
                    </template>
                </v-select>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>

    export default {

        data: () => ({
            showFilter: false,
            specialty: undefined,
            clinic: undefined,
            doctor: undefined,
            examTypeCheck: false,
            examType: undefined,
            clinics: [],
            doctors: []
        }),

        computed: {},
        mounted() {
            this.query = this.$route.params.q;
            if (this.query) {
                this.specialty = this.query.product;
                this.clinic = this.query.clinic;
                this.doctor = this.query.doctor
            }
        },

        created() {
            window.addEventListener("scroll", this.handleScroll);
        },

        watch: {
            clinic(clinic) {
                this.$emit('selectClinic', clinic)
            },
            examType(value) {
                this.$emit('selectExamType', value)
            },

            specialty(value) {
                if (value) {
                    this.clinics = value.clinics;
                    this.doctors = value.doctors
                }
                this.$emit('selectSpecialty', value)
            },
            examTypeCheck(value) {
                this.clinic = undefined;
                this.doctor = undefined;
                this.specialty = undefined;
                if (value) {
                    this.$apollo.queries.loadClinics.refresh();
                    this.$apollo.queries.loadDoctors.refresh()
                }
                this.$emit('selectExamTypeCheck', value)
            }
        },

        methods: {
            handleScroll() {
                this.scrollPos = window.scrollY;
                let winHeight = window.innerHeight;
                let docHeight = document.documentElement.scrollHeight;
                this.offsetTop = (100 * this.scrollPos) / (docHeight - winHeight);
            },
        },
        apollo: {
            loadClinics: {
                query: require("@/graphql/clinics/LoadClinics.gql"),
                variables: {
                    property: true
                },
                update(data) {
                    this.clinics = data.Clinic
                },
            },
            loadDoctors: {
                query: require("@/graphql/doctors/LoadDoctors.gql"),
                update(data) {
                    this.doctors = data.Doctor
                },
            }
        }
    }
</script>