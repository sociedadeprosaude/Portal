<template>
  <div class="App"></div>
</template>

<script>
import gmapsInit from "../../utils/gmaps";

export default {
  name: "Gmaps",
  props:['addresses'],
  data: () => ({
    //google:undefined,
    geocoder: undefined,
    map: undefined,
    marker:undefined
    //address = 'Manaus'
  }),
  mounted() {
    if (!this.address) this.address = "Manaus Brazil";
    this.initConfig();
  },
  methods: {
    async initConfig() {
      try {
        const google = await gmapsInit();
        this.geocoder = new google.maps.Geocoder();
        let latlng = new google.maps.LatLng(-3.1190275, -60.0217314);
        let mapOptions = {
          zoom: 11,
          center: latlng,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(this.$el, mapOptions);

        this.marker = new google.maps.Marker({
          position: latlng,
          map: this.map,
          title: ""
        });

        //this.initMarkers()
      } catch (error) {
        console.error(error);
      }
    },
    initMarkers(){
      for(var address in this.addresses){
        this.positionAddress(address)
      }
    },

    positionAddress(address) {

      this.geocoder.geocode(
        { address: address + " Manaus Amazonas" },
        (results, status) => {
          if (status !== "OK" || !results[0]) {
            throw new Error(status);
          }
          this.markMap({lat:results[0].geometry.location.lat(),lng:results[0].geometry.location.lng()})
        }
      );

      return this.address;
    },

    markMap(latLng){

      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(latLng.lat, latLng.lng),
        map: this.map,
      });
    }
  },
  computed: {
    teste() {
      console.log(this.address);
      return this.address;
    },
    search() {
      let value = this.$store.getters.searchAddress;
      if (!value) value = "Manaus amazonas";
      return value;
    }
  },
  watch:{
    addresses(value){
      if(value){
        //this.initMarkers()
      }
    }
  }
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
}

.App {
  width: 100%;
  height: 70vh;
}
</style>
