<template>
  <div>
    <div id="tab" class="container">
      <ul>
        <li @click="activeTab = '1'" :class="[activeTab === '1' ? 'active' : '']"> Today's forecast
        </li>
        <li @click="activeTab = '2'" :class="[activeTab === '2' ? 'active' : '']"> Five days forecast
        </li>
      </ul>
      <div class="tabs-content">
        <div class="content-one" v-if="activeTab === '1'">
          <div 
            v-for="(city, index) in getFavWeather" 
            :key="index"
          > 
            <CardItem 
              :name="city.name"
              :country="city.country"
              :temp="Math.round(city.temp)"
              :feelsLike="Math.round(city.feelsLike)"
              :windSpeed="city.windSpeed"
              :humidity="city.humidity"
              :pressure="city.pressure"
              :weather="city.weather"
              :windDeg="`rotate(${city.windDeg}deg)`"
              :favourite="city.favourite"
              @deleteThisCity="deleteThisCity(index)"
              @addToFavourite="addToFavourite(city.id, city.name)"
              @removeFromFavourite="removeFromFavourite(city.id, city.name)"
            />
          </div> 
        </div>
        <div class="content-two" v-if="activeTab === '2'">
          <div 
            class="card"
            v-for="(one, index) in getForecastData" 
            :key="index"
            :class="{'favourite-item': one.favourite}"
          > 
            <div class="btn-block">
              <input class="regular-btn" type="button" value="Remove from favourite" @click="removeFromFavourite(one.id, one.name)" />
            </div>
            <div class="first-block">
              <p class="city">{{ one.name }}, {{ one.country }}</p>
            </div>
            <div v-for="(forecast, index) in one.forecastList" :key="index" class="forecast-temp"> 
              <p>
                {{ new Date(forecast.dt_txt).getDate() }}.{{ new Date(forecast.dt_txt).getMonth() + 1 }}:</p>
              <p>
                {{ Math.round(forecast.main.temp) }}, {{ forecast.weather[0].description }}
              </p>
            </div>
          </div>
          <p></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import CardItem from './CardItem.vue'

export default {
  name: 'FavouritePage',
  components: {
    CardItem
  },
  data: () => ({
    activeTab: '1',
    city: '',
    locationKey: '691a16990bb9a70332e47bcd8fedfcf6',
    weatherKey: 'b3159520889c26993eea38da6ac0ea9d',
    index: '',
  }),
  computed: {
    ...mapGetters(['getWeatherData', 'getForecastData', 'getFavWeather'])
  },
  methods: {
    ...mapActions(['fetchCities', 'fetchLat', 'fetchLon', 'getFavouriteForecast', 'getFiveForecast']),
    ...mapMutations(['updateFiveForecast', 'updateFavouriteWeather']),

    removeFromFavourite(id, name) {
      alert(`${name} was removed from favourite!`)
      localStorage.removeItem(id, name)
    },
  },
  async created() {
    
    let localStorageKeys = []
    for(let i = 0; i < localStorage.length; i++) {
      localStorageKeys.push(localStorage.getItem(localStorage.key(i)))
    }
    
    for(let i = 0; i < localStorageKeys.length; i++) {
      
      let city = localStorageKeys[i]
      await this.fetchLat(city)
      await this.fetchLon(city)
      this.latitude = this.$store.state.lat
      this.longitude = this.$store.state.lon
      await this.getFavouriteForecast({latitude: this.latitude, longitude: this.longitude})
      await this.getFiveForecast({latitude: this.latitude, longitude: this.longitude})
    }
  }
}
</script>

<style scoped>

  /* Tabs styles*/
  .container {
    margin: 20px auto;
    width: 1200px;
  }

  .tabs-choose {
    margin-bottom: 0;
  }

  li {
    display: inline-block;
    padding: 10px 20px;
    background-color: #eee;
    cursor: pointer;
    opacity: 0.3;
  }

  .active {
    opacity: 1;
    font-weight: bold;
    background-color: lightblue
  }

  .tabs-content {
    margin: 0 auto;
    padding: 20px;
  }


  .links-urls {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 10px;
  }

  .link {
    padding: 10px 20px;
    display: block;
    background-color: #EEE;
    margin-bottom: 10px;
    text-decoration: none;
    color: #777;
  }
 /* Tabs styles ends here*/
  .forecast-temp {
    display: flex;
    justify-content: space-between;
    font-size: 20px;
    font-weight: bold;
    border-bottom: 1px solid lightblue;
  }
  .btn-block {
    text-align: end;
  }

  .card {
    display: inline-block;
    padding: 10px 20px;
    width: 250px;
    margin: 40px;
    border: 1px solid lightblue;
    text-align: left;
    font-size: 14px;
  }

  .favourite-item {
    border: 4px solid gold;
    border-radius: 10px;
  }

  .regular-btn {
    background-color: transparent;
    border: 4px solid gold;
    border-radius: 10px;
    font-weight: bold;
    cursor: pointer;
  }

  .first-block {
    display: flex;
    height: 90px;
    justify-content: space-between;
    font-size: 24px;
    font-weight: bold;
  }

  .second-block {
    display: flex;
    height: 90px;
    justify-content: space-between;    
    text-align: start;
    font-style: italic;
    font-size: 20px;
  }

  .city {
    text-align: start;
  }

  .weather {
    margin-right: 5px;
  }

  .weather::first-letter {
    text-transform: uppercase;
  }

  .wind-arrow {
    transform: rotate(0deg);
    width: 20px;
    vertical-align: middle;
    padding: 0 10px;
  }

</style>