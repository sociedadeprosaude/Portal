<template>
    <v-app id="app">
        <v-content v-if="ready" :class="['background', 'fade-in-anim']">
            <toolbar class="mb-12 pb-6" v-if="user"></toolbar>
            <router-view/>
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
            loaded() {
                if (this.$route.path === '/login') {
                    return true
                }
                if (this.$store.getters.user) {
                    if (this.$store.getters.examsLoaded
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
                  this.$refs['logo'].classList.add('fade-out-anim')
                  this.$refs['loader'].classList.add('fe-contract')
                  setTimeout(() => {
                      this.ready = true
                  }, 1500)
              }
          }
        },
        methods: {
            async getUser(user) {
                await this.$store.dispatch('getUser', user)
                await this.$store.dispatch('getProSaudeUnits')
            },
        },
        created() {
            // this.$store.dispatch('listenToOperationalValues')
            this.$store.dispatch("loadSpecialties")
            this.$store.dispatch("getDoctors")
            this.$store.dispatch("getClinics")
            this.$store.dispatch("loadExam")
            // this.$store.dispatch("updateUsers")
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
</style>
