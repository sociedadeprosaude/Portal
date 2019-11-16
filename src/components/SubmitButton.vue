<template>
    <v-container>
        <v-layout row wrap>
            <v-flex>
                <v-btn
                        :color="success ? 'green' : 'primary'"
                        :disabled="disabled"
                        @click="$emit('click')"
                        rounded v-if="!loading">
                    <v-icon v-if="icon" class="white--text">{{icon}}</v-icon>
                    <v-icon v-if="success" class="white--text">done</v-icon>
                    {{success ? '' : text}}</v-btn>
                <v-progress-circular indeterminate color="primary" v-else></v-progress-circular>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        name: "SubmitButton",
        props: {'text': {}, 'icon':{}, 'loading': {}, 'disabled': {
            default: false
            }, 'success': {}},
        watch: {
            success: function (val) {
                if (val) {
                    setTimeout(() => {
                        this.$emit('reset')
                        // this.success = false
                    }, 1000)
                }
            }
        }
    }
</script>

<style scoped>

</style>
