// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import socketio from 'socket.io-client'
import VueSocketIO from 'vue-socket.io'
// conexion
import Axios from 'axios'

// router setup
import routes from './routes/routes'

// Plugins
import GlobalComponents from './globalComponents'
import GlobalDirectives from './globalDirectives'
import Notifications from './components/NotificationPlugin'
import VueSession from 'vue-session'
import VModal from 'vue-js-modal'

// MaterialDashboard plugin
import MaterialDashboard from './material-dashboard'

import Chartist from 'chartist'

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkExactActiveClass: 'nav-item active'
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('jwt') == null) {
      next({
        path: '/login',
        params: { nextUrl: to.fullPath }
      })
    } else {
      let user = JSON.parse(localStorage.getItem('user'))
      if (to.matched.some(record => record.meta.is_admin)) {
        if (user.is_admin === 1) {
          next()
        } else {
          next({ name: 'userboard' })
        }
      } else {
        next()
      }
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (localStorage.getItem('jwt') == null) {
      next()
    } else {
      next({ name: 'userboard' })
    }
  } else {
    next()
  }
})

Vue.use(VueRouter)
Vue.use(MaterialDashboard)
Vue.use(GlobalComponents)
Vue.use(GlobalDirectives)
Vue.use(Notifications)
Vue.use(VueSession)
Vue.use(VModal)
/*
export const SocketInstance = socketio('http://localhost:3000');

Vue.use(VueSocketIO, SocketInstance)*/
/*
export const socket = socketio('http://localhost:3000',{ 'forceNew': true});

                    //Creación de la partida con las fichas en las posiciones enviadas por el servidor
                    socket.on('start_pos', data => {

                        console.log("conetadooo")

                    });*/
Vue.use(new VueSocketIO({
    debug: true,
    connection: socketio('http://localhost:3000', { 'forceNew': true}), //options object is Optional
  })
);

Vue.prototype.$http = Axios
Vue.config.productionTip = false
// global library setup
Object.defineProperty(Vue.prototype, '$Chartist', {
  get () {
    return this.$root.Chartist
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  data: {
    Chartist: Chartist
  }
})
