<template>
    <v-container class="fill-height align-content-space-between" style="height: 90%">
        <BillsMobile class="fill-height"/>
    </v-container>
</template>

<script>
    import BillsMobile from "@/views/Financial/BillsMobile";

    import moment from "moment";

    export default {
        components: {
            BillsMobile
        },
    };
</script>
