<template>
    <v-container fluid class=" fill-height">
        <v-layout row wrap class="justify-center">
            <v-flex>
                <searchPackage>
                </searchPackage>
            </v-flex>
            <v-flex sm3>
                <listPackage>
                </listPackage>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import listPackage from "../../../components/cashier/listPackage";
    import searchPackage from "../../../components/cashier/searchPackage";

    export default {

        data: () => ({

            defaultPackage: {
                id: '', name: '', exams: [], specialties: [],
            },

        }),

        components: {
            listPackage,
            searchPackage,
        },

        computed: {

            selectedPackage () {
                return this.$store.getters.selectedBundle;
            },

        },
        
        mounted () {
            this.$store.commit('setSelectedBundle', this.defaultPackage);
        },

    }
</script>

