<template>
    <v-app id="app">
        <v-slide-y-transition>
            <agenda-toolbar></agenda-toolbar>
        </v-slide-y-transition>
        <v-content v-if="loaded" :class="['background','mt-12 pt-6']">
            <router-view/>
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
                loaded: false
            }
        },
        mounted() {
            // this.$store.dispatch('listenToOperationalValues')
            this.$store.dispatch("loadSpecialties")
            this.$store.dispatch("getDoctors")
            this.$store.dispatch("getClinics")
            // this.$store.dispatch("updateUsers")
            firebase.auth().onAuthStateChanged((user) => {
                this.loaded = true
                if (!user) {
                    this.$router.push('/login')
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
