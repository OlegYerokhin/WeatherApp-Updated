<template>
  <div>
    <div class="card" v-for="city in getWeatherData" :key="city.id">
      <h2 class="city-name">{{ city.name }}, {{ city.country }}</h2>
      
      <div class="weather">
        <div class="main">
          <p class="weather-desc">{{ city.weather }}</p>
          <p class="now-is">{{ Math.round(city.temp) }}°</p>
        </div>
        <div class="degrees">
          <p>Feels Like: {{ Math.round(city.feelsLike) }}°</p>
          <p>Today's minimum: {{ Math.round(city.tempMin) }}°</p>
          <p>Today's maximum: {{ Math.round(city.tempMax) }}°</p>
        </div>
      </div>
      <div>
        <img src="../assets/sun.jpg" alt="sun">
        <div class="sun">
          <p>{{ city.sunrise }}</p>
          <p>{{ city.sunset }}</p>
        </div>
      </div>
      <div class="wind">
          <p>Wind: </p>
          <img :style="`transform:rotate(${city.windDeg}deg)`" class="wind-arrow" src="../assets/arrow.png" alt="arrow">
          <p>{{ city.windSpeed }} meters per second</p>
      </div>
      <div class="weather">
        <p>Humidity: {{ city.humidity }}%</p>
        <p>Pressure: {{ city.pressure }} hPa</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'CityItem',
  data: () => ({
    city: '',
    latitude: '',
    longitude: '',
  }),
  computed: {
    ...mapState(['lat', 'lon']),
    ...mapGetters(['getWeatherData',]),

  },
  methods: {
    ...mapActions(['fetchLat', 'fetchLon', 'getWeather'])
    
  },
  async created() {
    let city = this.$route.path
    city = city.replace(/[^a-zа-яё\s]/gi, ' ')
    city = city.replace(/\s+/g, ' ')
    this.city = city

    await this.fetchLat(this.city)
    await this.fetchLon(this.city)
    this.latitude = this.$store.state.lat
    this.longitude = this.$store.state.lon
    await this.getWeather({latitude: this.latitude, longitude: this.longitude, index: 0})
  }
}
</script>

<style scoped>
  .card {
    display: inline-block;
    padding: 30px;
    border: 4px solid lightblue;
    border-radius: 20px;
  }

  .weather {
    display: flex;
    justify-content: space-evenly;
  }

  .weather-desc {
    margin-top: 5px;
    margin-bottom: 20px;
    font-size: 25px;
  }

  .weather-desc::first-letter {
    text-transform: uppercase;
  }

  .now-is {
    font-size: 45px;
    font-weight: bold;
    margin: 0;
  }

  .degrees {
    text-align: end;
  }

  .wind-arrow {
    width: 20px;
    vertical-align: middle;
    padding: 0 10px;
  }

  .sun {
    display: flex;
    justify-content: space-around;
    font-size: 20px;
    font-weight: bold;
  }

  .wind {
    display: inline-flex;
  }

  .wind img {
    padding: 0 20px;
  }
</style>