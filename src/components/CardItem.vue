<template>
  <div 
    class="card" 
    :class="{'favourite-item': favourite}"
  >
    <div class="button-block">
      <input 
        class="remove-btn"
        :class="{'favourite-remove-btn': favourite}"
        type="button" 
        value="X" 
        @click="deleteThisCity" 
      />
      <input 
        class="regular-btn"
        :class="{'favourite-btn': favourite}"
        v-if="!favourite"
        type="button" 
        value="Add to favourite" 
        @click="addToFavourite"
      />
      <input 
        class="regular-btn"
        :class="{'favourite-btn': favourite}"
        v-if="favourite"
        type="button" 
        value="Remove from favourite" 
        @click="removeFromFavourite"
      />
    </div>
    <span class="first-block">
      <p 
        class="city"
        @click="$router.push(`/${name}`)"
      >
        {{ name }}, {{ country }}
      </p>
      <p>{{ temp }}°</p>
    </span>
    <span class="second-block">
      <p class="weather">{{ weather }}</p>
      <p>Feels like: {{ feelsLike }}°</p>
    </span>
    <p>Wind: 
      <span>
        <img class="wind-arrow" :style="[getStyle]" src="../assets/arrow.png" alt="arrow">
      </span> {{ windSpeed }} meters per second</p>
    <div>
      
    </div>
    <p>Humidity: {{ humidity }}%</p>
    <p>Pressure: {{ pressure }}hPa</p>
  </div>
</template>

<script>
export default {
  name: 'CardItem',
  props: ['name', 'country', 'temp', 'feelsLike', 'windSpeed', 'humidity', 'pressure', 'weather', 'windDeg', 'favourite'],
  computed: {
    getStyle: function() {
      return {
        'transform': this.windDeg
      }
    }
  },

  methods: {
    deleteThisCity() {
      this.$emit('deleteThisCity')
    },

    addToFavourite() {
      this.$emit('addToFavourite')
    },

    removeFromFavourite() {
      this.$emit('removeFromFavourite')
    }
  }
}
</script>

<style scoped>
  .card {
    display: inline-block;
    padding: 10px 20px;
    width: 250px;
    margin: 40px;
    border: 4px solid lightblue;
    border-radius: 10px;
    text-align: left;
    font-size: 14px;
  }
  
  .remove-btn {
    background-color: transparent;
    border: 4px solid lightblue;
    border-radius: 50%;
    font-family: cursive;
    font-weight: bold;
    cursor: pointer;
  }

  .favourite-remove-btn {
    border: 4px solid gold;
  }

  .regular-btn {
    background-color: transparent;
    border: 4px solid lightblue;
    border-radius: 10px;
    font-weight: bold;
    cursor: pointer;
  }
  .favourite-btn {
    border: 4px solid gold;
  }

  .favourite-item {
    border: 4px solid gold;
    border-radius: 10px;
  }

  .button-block {
    display: flex;
    justify-content: space-between;
  }

  .first-block {
    display: flex;
    justify-content: space-between;
    font-size: 24px;
    font-weight: bold;
  }

  .second-block {
    display: flex;
    justify-content: space-between;    
    text-align: start;
    font-style: italic;
    font-size: 20px;
  }

  .city {
    text-align: start;
    cursor: pointer;
  }
  
  .city:hover {
    text-decoration: underline;
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