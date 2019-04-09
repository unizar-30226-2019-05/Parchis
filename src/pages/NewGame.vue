<template>
<div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-33">
          <img :src="image" />
      </div>
    </div>
  </div>
</template>

<script>
import {
  StatsCard,
  ChartCard,
  NavTabsCard,
  OrderedTable,
  parchis
} from '@/components'
import image from '../assets/img/parchis.png'

export default{
  components: {
    StatsCard,
    ChartCard,
    NavTabsCard,
    OrderedTable
  },
  beforeMount () {
    
  },
  data () {
    return {
      nickname: null
    }
  },
  methods: {
    
  }
}
</script>
<style>

.fotopequeña{
  z-index: 1 !important;
  width: 200px !important;
  height: 200px !important;
  max-width: 700px !important;
  max-height: 700px !important;
}
.carousel{
  width: 100% !important;
}
</style>
