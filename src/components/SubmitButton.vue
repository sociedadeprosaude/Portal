<template>
<!--    <v-container class="ma-0 pa-0">-->
<!--        <v-layout row wrap>-->
<!--            <v-flex>-->
                <v-btn
                        :color="success ? 'green' : color"
                        :disabled="disabled"
                        @click="$emit('click')"
                        rounded v-if="!loading">
                    <v-icon v-if="icon" class="white--text">{{icon}}</v-icon>
                    <v-icon v-if="success" class="white--text">done</v-icon>
                    {{success ? '' : text}}</v-btn>
                <v-progress-circular indeterminate color="primary" v-else></v-progress-circular>
<!--            </v-flex>-->
<!--        </v-layout>-->
<!--    </v-container>-->
</template>

<script>
    export default {
        name: "SubmitButton",
        props: {'text': {}, 'icon':{}, 'loading': {}, 'color': {
                default: 'primary'
            }, 'disabled': {
            default: false
            }, 'success': {}},
        watch: {
            success: function (val) {
                if (val) {
                    setTimeout(() => {
                        this.$emit('reset')
                        this.success = false
                    }, 1000)
                }
            }
        }
    }
</script>

<style scoped>

</style>
