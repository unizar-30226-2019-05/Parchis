<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card class="md-card-plain">
          <md-card-header data-background-color="blue">
            <h4 class="title">Tienda</h4>
          </md-card-header>
          <md-card-content>
            <template>
              <div>
                <md-button class="md-raised"  v-bind:class="{ 'md-danger': clicked1 , 'md': !clicked1  }" type="submit" @click="compras(0)" >
                
                  Desbloqueables
                </md-button>
                <md-button class="md-raised" v-bind:class="{ 'md-danger': clicked2 , 'md': !clicked2 }" type="submit" @click="compras(1)" >
                  Mis compras
                </md-button>
                <h3>{{tipolistado}}</h3>
                <md-table>
                  <md-table-row slot="md-table-row" v-for="item of listacompras" :key="item.id">
                    <md-table-cell md-label="Nombre">
                        <p>{{item.nombre}}</p><br>
                    </md-table-cell>
                    <md-table-cell md-label="Precio" v-if="!clicked2">
                      <p>
                        {{ item.puntosRequeridos }}
                      </p>
                    </md-table-cell>
                    <md-table-cell v-if="!clicked1" md-label="canjeado">
                      <p>
                        {{ item.Item_nombre }}
                      </p>
                    </md-table-cell>
                    <md-table-cell v-if="!clicked2" md-label="CANJEAR">
                      <md-button class="md-raised"  type="submit" @click="canjearItem(item.nombre)" data-background-color="blue" >
                        <i class="material-icons">monetization_on</i>
                         CANJEAR
                      </md-button>
                    </md-table-cell>
                  </md-table-row>
                </md-table>
              </div>
            </template>
          </md-card-content>
        </md-card>
      </div>
    </div>
    <modal name="Canjear" :draggable="true" :resizable="true">
     <h2>¿Está seguro de que quiere canjear este articulo?</h2>
     <md-button class="md-raised md-success" type="submit" @click="canjearItem(item.nombre)">Aceptar</md-button>
    </modal>
  </div>
</template>

<script>
import {
  OrderedTable,
  ChartCard
} from '@/components'

export default{
  props: {
    dataBackgroundColor: {
      type: String,
      default: 'blue'
    }
  },
  components: {
    OrderedTable,
    ChartCard
  },
  beforeMount () {
    if (this.$session.exists()) {
      if (this.$session.get('tipo' === 'usuario')) {
        this.$router.push('/')
      }
    } else {
      this.$router.push('/')
    }
    this.compras(this.tipo)
  },
  data () {
    return {
      listacompras: [],
      tipolistado: 'Desbloqueables',
      clicked1: true,
      clicked2: false,
      tipo: 0,
      idItem: null
    }
  },
  
  methods: {
    compras (tipo) {
      // tipo 0 = pendientes , tipo 1 = aceptados visibles 
      if (tipo === 0) {
        this.tipolistado = 'Desbloqueables'
        this.clicked1 = true
        this.clicked2 = false
        this.tipo = tipo 
      } else if (tipo === 1) {
        this.tipolistado = 'Mis compras'
        this.clicked1 = false
        this.clicked2 = true
        this.tipo = tipo
      }
      this.listacompras = null
      if (tipo === 1){
        let url = 'http://localhost:3000/api/usuario/listitems/' + this.$session.get('idusuario')
        this.$http.get(url)
          .then(response => {
            console.log('responde')
            if (response.status === 200) {
            this.listacompras = response.data
          } else if (response.status === 201) {
            this.listacompras = null
          }
          })
      }
      else if (tipo === 0){
        let url = 'http://localhost:3000/api/usuario/listcompras/'
      this.$http.get(url)
        .then(response => {
          if (response.status === 200) {
            this.listacompras = response.data
          } else if (response.status === 201) {
            this.listacompras = null
          }
        })
      }
    },
    canjearItem(articulo){
      console.log('Se dispone a canjear')
      let url = 'http://localhost:3000/api/usuario/canjearItem/' + this.$session.get('idusuario') +'/'+ articulo
      this.$http.get(url)
        .then(response => {
          console.log('Responde al canjear')
          if (response.status === 200) {
            this.compras(1)
          } else if (response.status === 204) {
          
          }
        })
    },
    showmodal (tipo) {
      this.$modal.show(tipo)
    }
  }
}
</script>
<style>
.routerlink{
  color:black !important;
}
</style>
