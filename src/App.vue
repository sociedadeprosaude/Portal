<template>
    <v-app id="app">
        <v-slide-y-transition>
            <agenda-toolbar class="mb-12 pb-6" v-if="user"></agenda-toolbar>
        </v-slide-y-transition>
        <v-content v-if="loaded" :class="['background']">
            <router-view/>
        </v-content>
        <v-btn
                v-if="user"
                fab
                class="primary_light hidden-sm-and-up"
                fixed
                bottom
                @click="patientDialog = !patientDialog"
                right>
            <v-icon class="white--text">people</v-icon>
        </v-btn>
        <v-dialog v-model="patientDialog">
            <select-patient-card></select-patient-card>
        </v-dialog>
    </v-app>
</template>
<script>
    import AgendaToolbar from "./components/doctorsAgenda/AgendaToolbar";
    import firebase from 'firebase'
    import SelectPatientCard from "./components/SelectPatientCard";

    export default {
        components: {
            SelectPatientCard,
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
                } else if (this.$router.currentRoute.path.includes('login')) {
                    this.$router.push('/')
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
