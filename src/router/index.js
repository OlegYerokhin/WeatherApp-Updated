import Vue from 'vue'
import VueRouter from 'vue-router'
import MainData from '../components/MainData.vue'
import FavouritePage from '../components/FavouritePage.vue'
import PageNotFound from '../components/PageNotFound.vue'
import CityItem from '../components/CityItem.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: MainData
  },
  {
    path: '/favourite',
    name: 'favourite',
    component: FavouritePage
  },
  {
    path: '/:name',
    name: 'cityitem',
    component: CityItem
  },
  {
    path: '/*',
    name: 'PageNotFound',
    component: PageNotFound
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
