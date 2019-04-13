<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-33">
          <img :src="image" />
          
      </div>
      <div class="md-layout-item md-medium-size-100 md-size-66">
        <signin-form data-background-color="blue">
        </signin-form>
      </div>
    </div>
  </div>
</template>

<script>
import image2 from '../assets/img/logo EG_nombre.png'
import image from '../assets/img/logo.png'

import {
  SigninForm
} from '@/pages'

export default{
  data: function () {
    return {
      image: image,
      image2: image2
    }
  },
  components: {
    SigninForm
  }
}
</script>
