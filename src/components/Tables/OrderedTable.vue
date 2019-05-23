<template>
  <div>
    <md-table v-model="listranking" :table-header-color="tableHeaderColor">
      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Puesto">{{ item.puesto }}</md-table-cell>
        <md-table-cell md-label="Nombre de Usuario" ><router-link class="routerlink" :to="{path:`/perfil?perfil=${item.nombre}`}">{{ item.nombre }}</router-link></md-table-cell>
        <md-table-cell md-label="Nº Partidas">{{ item.partidas }}</md-table-cell>
        <md-table-cell md-label="Nº Victorias">{{item.victorias}}</md-table-cell>
        <md-table-cell md-label="Puntos">{{item.puntos}}</md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import { environment as env } from '@/environments/environment'

export default {
  name: 'ordered-table',
  props: {
    tableHeaderColor: {
      type: String,
      default: ''
    }
  },
  beforeMount () {
    let url = env.apiBaseUrl + '/usuario/listranking'
    this.$http.get(url)
      .then(response => {
        if (response.status === 200) {
          let datos = response.data
          console.log(datos)
          for (var i = 0; i < datos.length; i++) {
            this.listranking.push({ puesto: i + 1 + 'º', nombre: datos[i].nombreUsuario, partidas: datos[i].numPartidas, victorias: datos[i].numVictorias, puntos: datos[i].puntos })
          }
        }
      })
  },
  data () {
    return {
      listranking: []
    }
  },
  methods: {
    verperfil (id) {
      console.log('entro en ir a perfil con id = ' + id)
    }
  }
}
</script>
<style>
.routerlink{
  color:black !important;
}
</style>
