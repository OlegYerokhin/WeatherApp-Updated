import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cities: [],
    city: '',
    lat: '',
    lon: '',
    weatherData: [{}],
    fiveForecast: [],
    favouriteForecast: []

  },
  getters: {
    getCitiesList(state) {
      return state.cities;
    },

    getWeatherData(state) {
      return state.weatherData
    },

    getForecastData(state) {
      return state.fiveForecast
    },
    
    getFavWeather(state) {
      return state.favouriteForecast
    }

  },
  mutations: {
    updateCities(state, cities) {
      state.cities = cities
    },

    updateLat(state, lat) {
      state.lat = lat
    },

    updateLon(state, lon) {
      state.lon = lon
    },

    updateFirstItem(state, weatherData) {
      state.weatherData = weatherData
    },

    updateWeather(state, weatherData) {
      state.weatherData = weatherData
    },

    updateCity(state, weatherData) {
      state.weatherData = weatherData
    },

    updateFiveForecast(state, fiveForecast) {
      if(state.fiveForecast.length >= localStorage.length){
        state.fiveForecast.splice(0, state.fiveForecast.length + 1)
      }
      state.fiveForecast.push(fiveForecast)
    },

    updateFavouriteWeather(state, favouriteForecast) {
      if(state.favouriteForecast.length >= localStorage.length) {
        state.favouriteForecast.splice(0, state.favouriteForecast.length + 1)
      }
      state.favouriteForecast.push(favouriteForecast)
    },

    removeCity(state, index) {
      state.weatherData.splice(index, 1)
    }
  },
  actions: {
    async fetchCities(ctx) {
      let countriesData = []
      let citiesArr = []
      let cities = []

      await(await fetch('https://countriesnow.space/api/v0.1/countries')
        .then(response => response.json())
          .then(response => countriesData.push(response.data))
            .catch(err => console.error(err)));
      
      (function(arr) {
        for(let i = 0; i < arr.length; i++) {
            for(let j = 0; j < arr[i].length; j++) {
              citiesArr.push(arr[i][j].cities)
            }
        }
        for(let i = 0; i < citiesArr.length; i++) {
          cities.push(...citiesArr[i])
        }
      
        cities = Array.from(new Set(cities)).sort()
        return cities
      })(countriesData)
      ctx.commit('updateCities', cities)
    },

    async fetchLat(ctx, city) {
      let searchedCity = city
      let result = await(await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchedCity}&appid=691a16990bb9a70332e47bcd8fedfcf6`)
        .then((response) => response.json())
          .then((data) => data));
      const lat = result[0].lat
      ctx.commit('updateLat', lat)
      return lat
    },

    async fetchLon(ctx, city) {
      let searchedCity = city
      let result = await(await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchedCity}&appid=691a16990bb9a70332e47bcd8fedfcf6`)
        .then((response) => response.json())
          .then((data) => data));
      const lon = result[0].lon
      ctx.commit('updateLon', lon)
      return lon
    },    

    async getFirstItem(ctx, payload) {
      let lat = payload.latitude
      let lon = payload.longitude
      
      let weather = await(await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly,daily,alerts&appid=691a16990bb9a70332e47bcd8fedfcf6`)
        .then((response) => response.json())
          .then((result) => result));
      this.weatherData = [{
        id: weather.id,
        name: weather.name,
        country: weather.sys.country,
        temp: weather.main.temp,
        tempMin: weather.main.temp_min,
        tempMax: weather.main.temp_max,
        weather: weather.weather[0].description,
        feelsLike: weather.main.feels_like,
        windSpeed: weather.wind.speed,
        windDeg: weather.wind.deg,
        humidity: weather.main.humidity,
        pressure: weather.main.pressure,
        favourite: (function(){
          if(localStorage.getItem(weather.id, weather.name)) {
            return true
          }
          return false
        })(),
        sunrise: (function(unixTimestamp){
          let a = new Date(unixTimestamp * 1000);
          let hour = a.getHours();
          let min = a.getMinutes();
          let time = hour + ':' + min ;
          return time;
        })(weather.sys.sunrise),
        sunset: (function(unixTimestamp){
          let a = new Date(unixTimestamp * 1000);
          let hour = a.getHours();
          let min = a.getMinutes();
          let time = hour + ':' + min  ;
          return time;
        })(weather.sys.sunset)
      }],
      ctx.commit('updateFirstItem', this.weatherData)
    },

    async getWeather(ctx, payload) {
      let lat = payload.latitude
      let lon = payload.longitude
      
      let weather = await(await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly,daily,alerts&appid=691a16990bb9a70332e47bcd8fedfcf6`)
        .then((response) => response.json())
          .then((result) => result));
      this.weatherData[0] = {
        id: weather.id,
        name: weather.name,
        country: weather.sys.country,
        temp: weather.main.temp,
        tempMin: weather.main.temp_min,
        tempMax: weather.main.temp_max,
        weather: weather.weather[0].description,
        feelsLike: weather.main.feels_like,
        windSpeed: weather.wind.speed,
        windDeg: weather.wind.deg,
        humidity: weather.main.humidity,
        pressure: weather.main.pressure,
        favourite: (function(){
          if(localStorage.getItem(weather.id, weather.name)) {
            return true
          }
          return false
        })(),
        sunrise: (function(unixTimestamp){
          let a = new Date(unixTimestamp * 1000);
          let hour = a.getHours();
          let min = a.getMinutes();
          let time = hour + ':' + min ;
          return time;
        })(weather.sys.sunrise),
        sunset: (function(unixTimestamp){
          let a = new Date(unixTimestamp * 1000);
          let hour = a.getHours();
          let min = a.getMinutes();
          let time = hour + ':' + min  ;
          return time;
        })(weather.sys.sunset)
      }
      ctx.commit('updateWeather', this.weatherData)
    },

    async addCity(ctx, payload) {
      let lat = payload.latitude
      let lon = payload.longitude 

      let weather = await(await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly,daily,alerts&appid=691a16990bb9a70332e47bcd8fedfcf6`)
        .then((response) => response.json())
          .then((result) => result))      

      this.weatherData.push({
        id: weather.id,
        name: weather.name,
        country: weather.sys.country,
        temp: weather.main.temp,
        weather: weather.weather[0].description,
        feelsLike: weather.main.feels_like,
        windSpeed: weather.wind.speed,
        windDeg: weather.wind.deg,
        humidity: weather.main.humidity,
        pressure: weather.main.pressure,
        favourite: (function(){
          if(localStorage.getItem(weather.id, weather.name)) {
            return true
          }
          return false
        })(),
        sunrise: (function(unixTimestamp){
          let a = new Date(unixTimestamp * 1000);
          let hour = a.getHours();
          let min = a.getMinutes();
          let time = hour + ':' + min ;
          return time;
        })(weather.sys.sunrise),
        sunset: (function(unixTimestamp){
          let a = new Date(unixTimestamp * 1000);
          let hour = a.getHours();
          let min = a.getMinutes();
          let time = hour + ':' + min  ;
          return time;
        })(weather.sys.sunset)
      })
      ctx.commit('updateCity', this.weatherData)
    },

    async getFiveForecast(ctx, payload) {
      let lat = payload.latitude
      let lon = payload.longitude

      let five = await(await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly,daily,alerts&appid=691a16990bb9a70332e47bcd8fedfcf6`)
        .then((response) => response.json())
          .then((result) => result))
      this.fiveForecast = ({
        id: five.city.id,
        name: five.city.name,
        country: five.city.country,
        forecastList: (function() {
          const result = []
          for(let i = 0; i < five.list.length; i+=8) {
            result.push(five.list[i])
          }
          return result
        })(),
        favourite: true
      })
      ctx.commit('updateFiveForecast', this.fiveForecast)
    },
    
    async getFavouriteForecast(ctx, payload) {
      let lat = payload.latitude
      let lon = payload.longitude

      let fav = await(await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly,daily,alerts&appid=691a16990bb9a70332e47bcd8fedfcf6`)
        .then((response) => response.json())
          .then((result) => result))
      this.favouriteForecast = ({
        id: fav.id,
        name: fav.name,
        country: fav.sys.country,
        temp: fav.main.temp,
        weather: fav.weather[0].description,
        feelsLike: fav.main.feels_like,
        windSpeed: fav.wind.speed,
        windDeg: fav.wind.deg,
        humidity: fav.main.humidity,
        pressure: fav.main.pressure,
        favourite: true,
        sunrise: (function(unixTimestamp){
          let a = new Date(unixTimestamp * 1000);
          let hour = a.getHours();
          let min = a.getMinutes();
          let time = hour + ':' + min ;
          return time;
        })(fav.sys.sunrise),
        sunset: (function(unixTimestamp){
          let a = new Date(unixTimestamp * 1000);
          let hour = a.getHours();
          let min = a.getMinutes();
          let time = hour + ':' + min  ;
          return time;
        })(fav.sys.sunset)
      })
      ctx.commit('updateFavouriteWeather', this.favouriteForecast)
    },

    deleteCity(ctx, index) {
      ctx.commit('removeCity', index)
    }
  },
  modules: {
  }
})
