<template>
  <v-card elevation="0">
    <v-card-text class="pa-0">
      <v-container class="pa-0">
        <v-row class="ma-0">
          <v-col class="ma-0 justify-center align-center">
            <!-- <v-icon size="56px" :color="color">{{ icon }}</v-icon> -->
          </v-col>
          <v-col class="text-sm-center py-3 white--text" :class="color">
            <div class="headline"> {{ title }}</div>
            <span class="caption">{{ subTitle }}</span>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    icon: String,
    title: String,
    subTitle: String,
    color: String
  }
};
</script>
