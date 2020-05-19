<template>
    <v-container fluid class="ma-0 pa-0">
        <v-layout row nowrap style="width: 100%">
            <v-card v-for="(item, i) in Items" :key="i" class="my-2 grey_light" width="100%">
                <h4 class="text-left ml-2">{{item.name}}</h4>
                <v-divider/>
                <v-card-text v-if="categorySelect === 'exam'" class="ma-0 pa-0 my-1">
                    <v-layout row v-for="n in item.clinics" :key="n.name" class="my-2" style="width: 100%">
                        <v-btn rounded dense x-small block class="blue_grey">{{n.name}}</v-btn>
                    </v-layout>
                </v-card-text>
                <v-card-text v-if="categorySelect === 'appointment'" class="ma-0 pa-0 my-1">
                    <v-layout row v-for="(n, index) in item.doctors" :key="n.crm + index" class="my-2">
                        <v-flex xs12 class="align-center justify-center text-center">
                            <span class="font-weight-bold">{{n.name}}</span>
                        </v-flex>
                        <v-flex xs12>
                            <v-divider/>
                        </v-flex>
                        <v-layout row no-wrap v-for="(n, index) in n.clinics" :key="n.cnpj + index" class="align-center justify-center text-center my-1">
                            <v-btn rounded dense x-small class="blue_grey" block width="100%">{{n.name}}</v-btn>
                        </v-layout>
                    </v-layout>
                </v-card-text>
                <v-card-text v-if="categorySelect === 'package'" >
                   <v-layout row v-for="n in item.clinics" :key="n.name" class="my-2" style="width: 100%">
                       <v-btn rounded dense x-small block class="blue_grey">{{n.name}}</v-btn>
                   </v-layout>
                </v-card-text>
            </v-card>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        props: ['Items', 'categorySelect']
    }
</script>