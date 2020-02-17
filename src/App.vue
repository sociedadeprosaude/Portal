<template>
    <v-app id="app">
        <v-slide-y-transition>
            <agenda-toolbar class="mb-12 pb-6" v-if="user"></agenda-toolbar>
        </v-slide-y-transition>
        <v-content v-if="loaded" :class="['background']">
            <router-view/>
        </v-content>
        <v-content v-else>
            <v-img
                    class="align-center"
                    :src="require('./assets/pro_saude_logo.png')"
                   aspect-radio="1"
                   width="150"
            ></v-img>
        </v-content>
    </v-app>
</template>
<script>
    import AgendaToolbar from "./components/doctorsAgenda/AgendaToolbar";
    import firebase from 'firebase'

    export default {
        components: {
            AgendaToolbar
        },
        data() {
            return {
                loaded: false,
                patientDialog: false
            }
        },
        computed: {
            user() {
                return this.$store.getters.user
            }
        },
        methods: {
            async getUser(user) {
                await this.$store.dispatch('getUser', user)
                await this.$store.dispatch('getProSaudeUnits')
                this.loaded = true
            },
        },
        created() {
            // this.$store.dispatch('listenToOperationalValues')
            this.$store.dispatch("loadSpecialties")
            this.$store.dispatch("getDoctors")
            this.$store.dispatch("getClinics")
            // this.$store.dispatch("updateUsers")
        },
        mounted() {
            firebase.auth().onAuthStateChanged((user) => {
                if (!user) {
                    this.$router.push('/login')
                    this.loaded = true
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
