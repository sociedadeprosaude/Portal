<template>
  <div class="App"></div>
</template>

<script>
import gmapsInit from "../../utils/gmaps";

export default {
  name: "Gmaps",
  //props:['address'],
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
       
        /* let latlng = new google.maps.LatLng(-3.1190275, -60.02173140000002)
        let mapOptions = {
          zoom: 8,
          center: latlng,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        this.map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions) */
        //this.positionAddress('Manaus')

        this.markMap({lat:-3.0258876,lng:-59.9657626})
        /*  var marker = new google.maps.Marker({
          position: new google.maps.LatLng(-3.0258876, -59.9657626),
          map: this.map,
          title: "Hello World!"
        }); */
      } catch (error) {
        console.error(error);
      }
    },
    positionAddress(address) {
      //console.log('GMaps',address)

      this.geocoder.geocode(
        { address: address + " Manaus Amazonas" },
        (results, status) => {
          if (status !== "OK" || !results[0]) {
            throw new Error(status);
          }
          console.log(results[0].formatted_address);
          console.log("Latitude: ", results[0].geometry.location.lat());
          console.log("Longitude: ", results[0].geometry.location.lng());
          /* this.$emit("locationFound", {
            address: results[0].formatted_address,
            latitude: results[0].geometry.location.lat(),
            longitude: results[0].geometry.location.lng()
          }); */
          /* this.map.setCenter(results[0].geometry.location);
          this.map.fitBounds(results[0].geometry.viewport); */
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
