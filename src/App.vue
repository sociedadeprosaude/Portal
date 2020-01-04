<template>
    <v-app id="app">
        <v-slide-y-transition>
            <agenda-toolbar></agenda-toolbar>
        </v-slide-y-transition>
        <v-content :class="['background','mt-12 pt-6']" v-if="infosLoaded">
            <router-view/>
        </v-content>
        <v-content v-else :class="['background','mt-12 pt-6']">
            <v-layout column wrap class="align-center">
                <span>Carregando informações iniciais</span>
                <v-progress-circular indeterminate class="primary_light--color"></v-progress-circular>
            </v-layout>
        </v-content>
    </v-app>
</template>
<script>
    import AgendaToolbar from "./components/doctorsAgenda/AgendaToolbar";

    export default {
        components: {
            AgendaToolbar
        },
        computed: {
            infosLoaded() {
                return this.$store.getters.examsLoaded
                    && this.$store.getters.doctorsLoaded
                    && this.$store.getters.specialtiesLoaded
                    && this.$store.getters.clinicsLoaded
            }
        },
        mounted() {
            // this.$store.dispatch('listenToOperationalValues')
            this.$store.dispatch('loadExams')
            this.$store.dispatch('getDoctors')
            this.$store.dispatch('loadSpecialties')
            this.$store.dispatch('getClinics')
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
