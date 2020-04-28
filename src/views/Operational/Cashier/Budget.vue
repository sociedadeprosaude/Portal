<template>
    <v-container fluid class="ma-0 pa-0">
        <v-layout row wrap class="justify-center">
            <v-flex sm3 class="hidden-print-only hidden-xs-only">
                <intakes-history v-if="selectedPatient"></intakes-history>
            </v-flex>
            <v-flex xs12 sm6 class="hidden-print-only">
                <procedures-search></procedures-search>
            </v-flex>
            <v-flex sm3 class="hidden-print-only hidden-xs-only">
                <cart></cart>
            </v-flex>
            <v-flex class="hidden-screen-only">
                <receipt></receipt>
            </v-flex>

            <v-dialog transition="slide-x-reverse-transition" class="hidden-sm-and-up" v-model="cart">
                <cart v-on:closeCart="cart = !cart"></cart>
            </v-dialog>
            <v-dialog transition="slide-x-transition" class="hidden-sm-and-up" v-model="intakes">
                <intakes-history v-on:closeHistoric="intakes = !intakes"></intakes-history>
            </v-dialog>

            <v-btn @click="cart = !cart"
                   fixed
                   bottom
                   style="right: 0; height: 48px; width: 32px; border-radius: 32px 0 0 32px"
                   class="primary_light hidden-sm-and-up">
                <v-icon class="white--text">shopping_cart</v-icon>
            </v-btn>

            <v-slide-x-transition>
                <v-btn v-if="selectedPatient"
                       @click="intakes = !intakes"
                       fixed
                       bottom
                       style="left: 0; height: 48px; width: 32px; border-radius: 0 32px 32px 0"
                       class="primary_light hidden-sm-and-up">
                    <v-icon class="white--text">history</v-icon>
                </v-btn>
            </v-slide-x-transition>

        </v-layout>
    </v-container>
</template>

<script>

    import ProceduresSearch from "../../../components/cashier/ProceduresSearch";
    import Cart from "../../../components/cashier/Cart";
    import IntakesHistory from "../../../components/cashier/IntakesHistory";
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
            IntakesHistory
        },
        methods: {
            getTouches(evt) {
                return evt.touches ||             // browser API
                    evt.originalEvent.touches; // jQuery
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

                if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
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

            selectedPatient() {
                return this.$store.getters.selectedPatient
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
