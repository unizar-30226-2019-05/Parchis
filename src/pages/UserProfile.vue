<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-66">
        <edit-profile-form data-background-color="blue">

        </edit-profile-form>
      </div>
      <div class="md-layout-item md-medium-size-100 md-size-33">
        <user-card>
        </user-card>
      </div>
      <h2>Mis Amigos</h2>
      <carousel class="carousel">
       
      </carousel>
    </div>
  </div>
</template>

<script>
import {
  EditProfileForm,
  UserCard
} from '@/pages'

export default{
  components: {
    EditProfileForm,
    UserCard,
    
  },
  data () {
    return {
      listranking: []
    }
  },
  beforeMount () {
     let url = 'http://localhost:3000/api/usuario/listranking'
    this.$http.get(url)
      .then(response => {
        if (response.status === 200) {
          let datos = response.data
          console.log(datos)
          for (var i = 0; i < datos.length; i++) {
            this.listranking.push({ puesto: i + 1 + 'º', nombre: datos[i].nickname, puntuacion: datos[i].Puntuacion, id: datos[i].idUsuario })
          }
        }
      })
  },
}
</script>
