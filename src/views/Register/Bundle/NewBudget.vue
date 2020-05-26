<template>
    <v-container fluid class="ma-0 pa-0">
        <v-layout row wrap class="justify-center">
            <v-flex xs12 sm8 class="hidden-print-only">
                <procedures-search></procedures-search>
            </v-flex>
            <v-flex sm4 class="hidden-print-only hidden-xs-only">
                <cart></cart>
            </v-flex>
            <v-flex class="hidden-screen-only">
                <receipt></receipt>
            </v-flex>

            <v-dialog transition="slide-x-reverse-transition" class="hidden-sm-and-up" v-model="cart">
                <cart v-on:closeCart="cart = !cart"></cart>
            </v-dialog>

            <v-btn @click="cart = !cart"
                   fixed
                   bottom
                   style="right: 0; height: 48px; width: 32px; border-radius: 32px 0 0 32px"
                   class="primary_light hidden-sm-and-up">
                <v-icon class="white--text">shopping_cart</v-icon>
            </v-btn>

        </v-layout>
    </v-container>
</template>

<script>

    import ProceduresSearch from "../../../components/Bundles/ProceduresSearchPackege";
    import Cart from "../../../components/Bundles/CartPackage";
    import Receipt from "../../../components/cashier/Receipt";

    export default {
        data: () => ({
            intakes: false,
            cart: false,
        }),
        components: {
            Receipt,
            ProceduresSearch,
            Cart,
        },
        methods: {
            getTouches(evt) {
                return evt.touches ||
                    evt.originalEvent.touches;
            },
            handleTouchStart(evt) {
                const firstTouch = this.getTouches(evt)[0];
                this.xDown = firstTouch.clientX;
                this.yDown = firstTouch.clientY;
            },
            handleTouchMove(evt) {
                if ( ! this.xDown || ! this.yDown ) {
                    return;
                }

                let xUp = evt.touches[0].clientX;
                let yUp = evt.touches[0].clientY;

                let xDiff = this.xDown - xUp;
                let yDiff = this.yDown - yUp;

                if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
                    if ( xDiff > 0 ) {
                        this.intakes = false

                    } else {
                        this.cart = false

                    }
                }

                this.xDown = null;
                this.yDown = null;
            }
        },
        beforeDestroy() {
            document.removeEventListener('touchstart', this.handleTouchStart);
            document.removeEventListener('touchstart', this.handleTouchStart);
        },
        mounted() {
            if (this.isMobile) {
                document.addEventListener('touchstart', this.handleTouchStart, false);
                document.addEventListener('touchmove', this.handleTouchMove, false);
            }
        },
        computed: {

            isMobile() {
              return this.$store.getters.isMobile
            },
        },
    }
</script>

<style scoped>
    @page {
        size: auto;
        margin: 0
    }
</style>
