<template>
    <v-app id="app">
        <v-content v-if="ready" :class="['background', 'fade-in-anim']">

            <toolbar class="mb-12 pb-6" v-if="user"/>
            <transition name="slide-fade" mode="out-in" appear>
            <router-view/>
            </transition>
            <v-dialog v-model="systemDialog.show">
                <v-card>
                    <v-card-title>{{systemDialog.header}}</v-card-title>
                    <v-card-text>{{systemDialog.body}}</v-card-text>
                    <v-card-actions>
                        <v-btn rounded text @click="systemDialog.show = false">Cancelar</v-btn>

                        <v-spacer/>

                        <v-btn class="primary" text rounded @click="systemDialog.functionToRun(); systemDialog.show = false;">Ok</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-content>
        <v-content v-else>
            <v-layout ref="loader" class="primary fill-height align-center justify-center">
                <img
                        ref="logo"
                        class="pulse-anim"
                        :src="require('./assets/pro_saude_logo.png')"
                        width="150px"
                        height="150px"
                >
            </v-layout>
        </v-content>
    </v-app>
</template>
<script>
    import Toolbar from "./components/Toolbar";
    import firebase from 'firebase'

    export default {
        components: {
            Toolbar
        },
        data() {
            return {
                patientDialog: false,
                ready: false
            }
        },
        computed: {
            user() {
                return this.$store.getters.user
            },
            systemDialog() {
              return this.$store.getters.systemDialog
            },
            loaded() {
                if (this.$route.path === '/login') {
                    return true
                }
                if (this.$store.getters.user) {
                    if (this.$store.getters.examsLoaded
                        && this.$store.getters.doctorsLoaded
                        && this.$store.getters.clinicsLoaded
                        && this.$store.getters.unitsLoaded) {
                        return true
                    }
                }
                return false
            }
        },
        watch: {
            loaded(val) {
                if (val) {

                    this.$refs['logo'].classList.add('fade-out-anim');
                    this.$refs['loader'].classList.add('fe-contract');
                    setTimeout(() => {
                        this.ready = true
                    }, 1500)
                }
            }
        },
        methods: {
            async getUser(user) {
                await this.$store.dispatch('getUser', user);
                await this.$store.dispatch('getProSaudeUnits')
            },
        },
        created() {

            this.$store.dispatch("loadSpecialties");
            this.$store.dispatch("getDoctors");
            this.$store.dispatch("getClinics");
            this.$store.dispatch("loadExam");

            this.$store.dispatch("startConnectionListener")
        },
        mounted() {
            firebase.auth().onAuthStateChanged((user) => {
                if (!user) {

                    this.$router.push('/login')

                    return
                } else if (this.$router.currentRoute.path.includes('login')) {
                    this.$router.push('/')
                }
                if (user) {
                    this.getUser(user)
                }
            })
        }
    }
</script>
<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    #nav {
        padding: 30px;
    }

    #nav a {
        font-weight: bold;
        color: #2c3e50;
    }

    #nav a.router-link-exact-active {
        color: #42b983;
    }
    .slide-fade-enter {
        transform: translateY(-10px);
        opacity: 0;
    }
    .slide-fade-enter-active,
    .slide-fade-leave-active {
        transition: all 0.5s ease;
    }
    .slide-fade-leave-to {
        transform: translateY(10px);
        opacity: 0;
    }
</style>
