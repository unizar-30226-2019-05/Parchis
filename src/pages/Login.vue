<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-33">
          <img :src="image" />
          
      </div>
      <div class="md-layout-item md-medium-size-100 md-size-66">
        <template v-if="authenticated">
          <md-card>
            <md-card-header :data-background-color="dataBackgroundColor">
              <h4 class="title" >Logout</h4>
            </md-card-header>
            <md-card-content>
              <div class="md-layout">
                <h3>Si ha terminado la actividad por favor cierre sesión</h3>
                <div class="md-layout-item md-size-100 text-left">
                  <md-button class="md-raised" type="submit" @click="handleSubmit" :data-background-color="dataBackgroundColor">Logout</md-button>
                </div>
              </div>
            </md-card-content>
          </md-card>
        </template>
        <template v-else>
          <login-form data-background-color="blue">

          </login-form>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import image2 from '../assets/img/logo EG_nombre.png'
import image from '../assets/img/logo.png'

import {
  LoginForm
} from '@/pages'

export default{
  props: {
    dataBackgroundColor: {
      type: String,
      default: 'blue'
    }
  },
  data: function () {
    return {
      image: image,
      image2: image2
    }
  },
  components: {
    LoginForm
  },
  created () {
    this.authenticated = this.$session.exists()
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.$session.destroy()
      localStorage.removeItem('idSala')
      this.authenticated = false
      location.reload()
    }
  }
}
</script>
