<template>
  <div>
    <div class="autocomplete">
      <input 
        type="text" 
        autocomplete="on" 
        v-model="city" 
        @input='filterCities' 
        placeholder="Enter city" 
        @focus="modal = true" 
        class="autocomplete-item"
        @sendCity="onCitySend" 
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
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'AutocompleteItem',
  data: () => ({
    city: '',
    modal: false,
    filteredCities: [],
  }),
  computed: {
    ...mapGetters(['getCitiesList'])
  },
  methods: {
    ...mapActions(['fetchCities']),

    setCity(city) {
      this.city = city
      this.modal = false
    },

    filterCities() {
      this.filteredCities = this.$store.state.cities.filter(city => {
        return city.toLowerCase().startsWith(this.city.toLowerCase())
      })
    },

    onCitySend() {
      this.$emit('onCitySend', {
        city: this.city
      })
    }
  },

  created() {
    this.fetchCities()
  }
}
</script>

<style scoped>

</style>