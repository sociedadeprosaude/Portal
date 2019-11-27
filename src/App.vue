<template>
    <v-app id="app">
        <v-slide-y-transition>
            <agenda-toolbar v-if="doctorsAgendaToobar"></agenda-toolbar>
        </v-slide-y-transition>
        <v-content :class="['grey', doctorsAgendaToobar ? 'mt-12 pt-6' : '']">
            <router-view/>
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
            doctorsAgendaToobar() {
                return this.$store.getters.showDoctorsAgendaToolbar
            }
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
