<template>
  <div class="wrapper" :class="{'nav-open': $sidebar.showSidebar}">
    <notifications></notifications>

    <side-bar>
      <mobile-menu slot="content"></mobile-menu>
      <sidebar-link to="/newgame">
        <md-icon>videogame_asset</md-icon>
        <p>Nueva partida</p>
      </sidebar-link>
      <sidebar-link to="/ranking">
        <md-icon>content_paste</md-icon>
        <p>Ranking</p>
      </sidebar-link>
      <sidebar-link to="/reglas">
        <md-icon>school</md-icon>
        <p>Reglas</p>
      </sidebar-link>
      <template v-if="authenticated">
        <sidebar-link to="/shop">
          <md-icon>shopping_cart</md-icon>
          <p>Tienda</p>
        </sidebar-link>
        <sidebar-link to="/user">
          <md-icon>person</md-icon>
          <p>Perfil</p>
        </sidebar-link>
        <sidebar-link to="/login">
          <md-icon>highlight_off</md-icon>
          <p>Logout</p>
        </sidebar-link>
       </template>
       <template v-else>
          <sidebar-link to="/login">
          <md-icon>person</md-icon>
          <p>Login</p>
        </sidebar-link>
       </template>
    </side-bar>

    <div class="main-panel">
      <top-navbar :actLogueado="act"></top-navbar>

      <dashboard-content v-on:logueado="actualizar">

      </dashboard-content>

      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>
<style lang="scss">

</style>
<script>
import TopNavbar from './TopNavbar.vue'
import ContentFooter from './ContentFooter.vue'
import DashboardContent from './Content.vue'
import MobileMenu from '@/pages/Layout/MobileMenu.vue'

export default {
  components: {
    TopNavbar,
    DashboardContent,
    ContentFooter,
    MobileMenu
  },
  data(){
    return{
      act: false,
    }

  },
  created () {
    this.authenticated = this.$session.exists()
    if (this.$session.exists()) {
      this.autorizacion = this.$session.get('tipo')
    }
  },
  methods: {
    actualizar(b) {
      this.authenticated = b
      this.act = b
    }
  }
  
}
</script>
