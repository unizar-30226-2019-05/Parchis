<template>
  <form>
    <md-dialog-confirm
      :md-active.sync="confirmacion.exist"
      :md-title= "confirmacion.title"
      :md-content= "confirmacion.msg"
      @md-confirm="actualizar" />
    <md-card>
      <md-card-header :data-background-color="dataBackgroundColor">
        <h4 class="title" >Editar Perfil </h4>
        <p class="category">Completa los datos de tu perfil</p>
      </md-card-header>
      <md-card-content>
        <div class="md-layout">
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Nombre</label>
              <md-input v-model="username" type="text"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Email</label>
              <md-input v-model="emailadress" type="email"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-size-100">
            <md-field maxlength="5" v-if="editarAvatar">
              <label>URL de la imagen de mi nuevo a avatar </label>
              <md-textarea v-model="url_avatar"></md-textarea>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label for="dados">Selección de dados</label>
              <md-select v-model="dados" name="dados" id="dados" md-dense>
                <md-option value="blanco">Dados blancos</md-option>
                <md-option value="amarilla" :disabled="!coloresDados[7]">Dados amarillos</md-option>
                <md-option value="roja" :disabled="!coloresDados[2]">Dados rojos</md-option>
                <md-option value="azul" :disabled="!coloresDados[1]">Dados azules</md-option>
                <md-option value="verde" :disabled="!coloresDados[4]">Dados verdes</md-option>
                <md-option value="cyan" :disabled="!coloresDados[6]">Dados cyan</md-option>
                <md-option value="naranja" :disabled="!coloresDados[5]">Dados naranjas</md-option>
                <md-option value="morada" :disabled="!coloresDados[0]">Dados morados</md-option>
                <md-option value="verdeOs" :disabled="!coloresDados[3]">Dados verdes oscuros</md-option>
              </md-select>
              <md-icon>border_outer</md-icon>
            </md-field>
          </div>  
          <div class="md-layout-item md-size-100 text-left">
            <md-button class="md-raised"  type="submit" :data-background-color="dataBackgroundColor" @click="showmodal" >Actualizar perfil</md-button>
          </div>
        </div>

      </md-card-content>
    </md-card>
  </form>
</template>
<script>
import { environment as env } from '@/environments/environment'
export default {
  name: 'edit-profile-form',
  props: {
    dataBackgroundColor: {
      type: String,
      default: 'blue'
    }
  },
  data () {
    return {
      username: null,
      emailadress: null,
      url_avatar: null,
      numVictorias: null,
      numPartidas: null,
      puntos: null,
      dados: null,
      confirmacion: {
        exist: false,
        title: '',
        msg: ''
      },
      coloresDados: [],
      editarAvatar: false
    }
  },
  beforeMount () {
    this.info()
  },
  methods: {
    showmodal () {
      this.confirmacion.title = 'Confirmación'
      this.confirmacion.msg = '¿Está seguro de que quiere actualizar su perfil?'
      this.confirmacion.exist = true
    },
    info () {
      let url = env.apiBaseUrl+'/usuario/info/' + this.$session.get('idusuario') + ''
      this.$http.post(url)
        .then(response => {
          if (response.status === 200) {
            this.username = response.data['nombreCompleto']
            this.emailadress = response.data['correo']
            this.url_avatar= response.data['url_avatar']
            this.numPartidas= response.data['numPartidas']
            this.numVictorias= response.data['numVictorias']
            this.puntos= response.data['puntos']
            this.dados= response.data['dados']
          }
        })
      
      url = env.apiBaseUrl+'/usuario/avatar/' + this.$session.get('idusuario') + ''
      this.$http.get(url)
        .then(response => {
          if (response.status === 200) {
            this.editarAvatar = true
          }
        })
      let colores = ['Dados morados','Dados azules','Dados rojos','Dados verdes oscuro','Dados verdes','Dados naranjas','Dados cyan','Dados amarillos']
      for(let i=0; i<8; i++){
        console.log(i)
        url = env.apiBaseUrl+'/usuario/coloresDados/' + this.$session.get('idusuario') + '/' + colores[i]
        this.$http.get(url)
          .then(response => {
            if (response.status === 200) {
              console.log("Dado " + i + " true")
              this.coloresDados[i] = true
           }
           else{
             console.log("Dado " + i + " false")
              this.coloresDados[i] = false
           }
          })
      }

      
    },
    actualizar () {
      let url = env.apiBaseUrl+'/usuario/actualizarPerfil/' + this.$session.get('idusuario') + ''
      this.$http.post(url, {
        name: this.username,
        emailadress: this.emailadress,
        url: this.url_avatar,
        dados: this.dados
      })
        .then(response => {
          if (response.status === 200) {
            this.username = response.data['name']
            this.emailadress = response.data['correo']
            this.url_avatar=response.data['url_avatar']
            this.dados=response.data['dados']
            this.$router.go('/user')
            
          }
        })
        
    }

  }
}

</script>
<style>

</style>
