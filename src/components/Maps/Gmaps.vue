<template>
  <div class="App"></div>
</template>

<script>
import gmapsInit from "../../utils/gmaps";

export default {
  name: "Gmaps",
  props:['addresses','geopoints','period_report'],
  data: () => ({
    google:undefined,
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
        this.google = await gmapsInit();
        this.geocoder = new google.maps.Geocoder();
        let latlng = new this.google.maps.LatLng(-3.1190275, -60.0217314);
        let mapOptions = {
          zoom: 11,
          center: latlng,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new this.google.maps.Map(this.$el, mapOptions);

        this.marker = new this.google.maps.Marker({
          position: latlng,
          map: this.map,
          title: ""
        });

        this.initMarkers()
      } catch (error) {
        console.error(error);
      }
    },
    async initMarkers(){
      console.log(this.period_report)
      for(var key in this.geopoints){
        //this.positionAddress(address)
        //await this.sleep(5000);
        if(this.geopoints[key].latitude && this.geopoints[key].longitude && this.geopoints[key].count)
          this.markMap({lat:this.geopoints[key].latitude,lng:this.geopoints[key].longitude,count:this.geopoints[key].count,monthly_report:this.geopoints[key].monthly_report})
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
      var title = "Total de clientes: " + latLng.count

      if(this.period_report && latLng.monthly_report){
        var report = latLng.monthly_report.find((value)=>value.id === this.period_report)
        if(report){
          title = report.created ? title + `\nTotal de pacientes criados: ${report.created}` : ""
          title = report.accessed ? title + `\nTotal de pacientes atendidos: ${report.accessed}` : ""
        }else{
          title = title + "\n\nNão há relatório definido para o período escolhido"
        }
    
      }

      var marker = new this.google.maps.Marker({
        position: new this.google.maps.LatLng(latLng.lat, latLng.lng),
        map: this.map,
        title: title
      });
    },
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  },
  computed: {
    teste() {
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
        this.initMarkers()
      }
    },
    geopoints(value){
      if(value){
        this.initMarkers()
      }
    },
    period_report(value){
      this.initMarkers()
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
