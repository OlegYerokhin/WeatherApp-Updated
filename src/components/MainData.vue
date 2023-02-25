<template>
  <div>
    <form @submit.prevent="submit">
      <div class="autocomplete">
        <input 
          type="text" 
          autocomplete="on" 
          v-model="city" 
          @input='filterCities' 
          placeholder="Enter city" 
          @focus="modal = true" 
          class="autocomplete-item"
        />
      </div>
      <div v-if='filteredCities && modal && this.city.length > 2'>
        <select size="5" class="variant-select">
          <option 
            v-for="(filteredCity, index) in filteredCities"
            :key="index"
            @click="setCity(filteredCity)"
            v-on:keyup.enter="onEnter(filteredCity)"
            class="variant"
          >
            {{ filteredCity }}
          </option>
        </select>
      </div>
      <input 
        type="button"
        value="OK"
        @click="getThisWeather()"
      />
      <input 
        type="button"
        value="Add city"
        @click="addThisCity()"
      />
    </form>
    <div v-for="(city, index) in getWeatherData" :key="index">
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
</template>

<script>
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex'
import CardItem from './CardItem.vue'

export default {
  name: 'MainData',
  components: {
    CardItem,
  },
  data: () => ({
    city: '',
    latitude: '',
    longitude: '',
    modal: false,
    filteredCities: [],
  }),
  methods: {
    ...mapActions(['fetchCities', 'fetchLat', 'fetchLon', 'getFirstItem', 'getWeather', 'addCity', 'deleteCity']),
    ...mapMutations(['removeCity']),
    submit() {
      this.getCityValue = this.city
    },

    deleteThisCity(index) {
      this.deleteCity(index)
    },

    getCity(city) {
      this.city = city
    },

    addToFavourite(id, name) {
      if(localStorage.length > 4) {
        alert('Oops, that\'s too much! 5 cities maximum. Remove another city!')
        return
      } 
      alert(`${name} was added to favourite!`)
      localStorage.setItem(id, name)
    },

    removeFromFavourite(id, name) {
      alert(`${name} was removed from favourite!`)
      localStorage.removeItem(id, name)
    },

    setCity(city) {
      this.city = city
      this.modal = false
    },

    filterCities() {
      this.filteredCities = this.$store.state.cities.filter(city => {
        return city.toLowerCase().startsWith(this.city.toLowerCase())
      })
    },

    async getThisWeather() {
      await this.fetchLat(this.city)
      await this.fetchLon(this.city)
      this.latitude = this.$store.state.lat
      this.longitude = this.$store.state.lon
      await this.getWeather({latitude: this.latitude, longitude: this.longitude})
      this.$forceUpdate()
    },

    async addThisCity() {
      await this.fetchLat(this.city)
      await this.fetchLon(this.city)
      this.latitude = this.$store.state.lat
      this.longitude = this.$store.state.lon
      await this.addCity({latitude: this.latitude, longitude: this.longitude, })
    }

  },
  computed: {
    ...mapState(['lat', 'lon']),
    ...mapGetters(['getCitiesList', 'getWeatherData']),

  },
  async created() {
    this.fetchCities()
    await(await fetch('http://ip-api.com/json/?fields=city')
      .then((response) => response.json())
        .then((result) => this.city = Object.values(result)))
    
    await this.fetchLat(this.city)
    await this.fetchLon(this.city)
    this.latitude = this.$store.state.lat
    this.longitude = this.$store.state.lon
    await this.getFirstItem({latitude: this.latitude, longitude: this.longitude})
  },
}
</script>

<style scoped>
  .autocomplete {
    display: block;
    margin: 17px;
  }  
  
  .variant-select {
    margin-top: -18px;
    margin-bottom: 18px;
    width: 208px;
  }

  .variant {
    list-style: none;
    padding: 5px;
    cursor: pointer;
    font-size: 14px;
  }

  .variant:hover {
    text-decoration: underline;
  }

  .autocomplete-item {
    width: 200px;
  }
</style>